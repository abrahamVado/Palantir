import { NextResponse } from "next/server";

import { appConfig } from "@/lib/config";

export async function OPTIONS() {
  //1.- Explicitly allow preflight requests to short-circuit CORS failures at the edge.
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": appConfig.backendOrigin,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

async function proxyRequest(request: Request, context: { params: { path: string[] } }) {
  //1.- Preserve any query string parameters so GET requests remain cacheable and traceable upstream.
  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(`/${context.params.path.join("/")}${incomingUrl.search}`, appConfig.backendOrigin);

  //2.- Prepare a forwardable body only for methods that support payloads.
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();

  //3.- Rebuild headers for the upstream call while removing hop-by-hop entries that can break proxies.
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    if (["connection", "content-length", "transfer-encoding", "accept-encoding"].includes(key.toLowerCase())) {
      return;
    }
    headers.set(key, value);
  });
  headers.set("host", backendUrl.host);

  //4.- Execute the proxied request while preserving credentials and redirection behavior.
  try {
    const upstreamResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      credentials: "include",
      redirect: "manual",
    });

    //5.- Stream the upstream response back to the caller, including any Set-Cookie headers.
    const responseHeaders = new Headers(upstreamResponse.headers);
    return new NextResponse(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    //6.- Surface connectivity issues as a 502 with a JSON payload that mirrors ADR-003 failures.
    const message = error instanceof Error ? error.message : "Upstream proxy error";
    return NextResponse.json({ status: "error", message }, { status: 502 });
  }
}

export { proxyRequest as GET, proxyRequest as POST, proxyRequest as PUT, proxyRequest as PATCH, proxyRequest as DELETE };
