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

export async function handler(request: Request, context: { params: { path: string[] } }) {
  //1.- Assemble the backend URL by merging the configured origin with the requested path segments.
  const backendUrl = new URL(`/${context.params.path.join("/")}`, appConfig.backendOrigin);

  //2.- Prepare a forwardable body only for methods that support payloads.
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();

  //3.- Clone headers so we can override host-sensitive values for the upstream target.
  const headers = new Headers(request.headers);
  headers.set("host", backendUrl.host);

  //4.- Execute the proxied request while preserving credentials and redirection behavior.
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
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
