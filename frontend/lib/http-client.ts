import { appConfig } from "./config";

export type SuccessEnvelope<T> = {
  status: "success";
  data: T;
};

export type ErrorEnvelope = {
  status: "error";
  message?: string;
  errors?: Record<string, string[]>;
};

export type ApiEnvelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

export class ApiClientError extends Error {
  //1.- Preserve the HTTP status and envelope for better error reporting.
  constructor(
    message: string,
    public readonly status: number,
    public readonly envelope?: ErrorEnvelope,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

export type ApiRequestInit = RequestInit & {
  auth?: "required" | "optional";
};

export async function apiFetch<T>(path: string, init: ApiRequestInit = {}) {
  //1.- Build the absolute URL relative to the configured backend origin.
  const url = new URL(path.startsWith("/") ? path : `/${path}`, appConfig.backendOrigin);

  //2.- Merge caller options with defaults that preserve cookie-based authentication.
  const requestInit: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  };

  //3.- Execute the request and parse the ADR-003 style envelope.
  const response = await fetch(url, requestInit);
  const envelope = (await response.json().catch(() => ({}))) as ApiEnvelope<T>;

  //4.- Surface API errors with structured context for UI layers.
  const errorEnvelope = envelope.status === "error" ? envelope : undefined;
  if (!response.ok || errorEnvelope) {
    throw new ApiClientError(
      errorEnvelope?.message ?? response.statusText,
      response.status,
      errorEnvelope,
    );
  }

  //5.- Safeguard against malformed envelopes before returning data.
  if (envelope.status !== "success") {
    throw new ApiClientError(response.statusText, response.status);
  }

  //6.- Return the typed data payload to the caller when successful.
  return envelope.data;
}
