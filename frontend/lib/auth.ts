import { apiFetch } from "./http-client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type Principal = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};

export async function login(payload: LoginPayload) {
  //1.- Forward the login form to the backend using the shared API client.
  await apiFetch<Principal>("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  //2.- The backend sets HttpOnly cookies; return a friendly message for UI use.
  return { message: "Login successful" };
}

export async function logout(refreshToken?: string, accessToken?: string) {
  //1.- Call the logout endpoint so the backend clears both cookies.
  await apiFetch("/v1/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken, access_token: accessToken }),
  });
  //2.- Confirm the client action for the caller without exposing tokens.
  return { message: "Logged out" };
}

export async function fetchPrincipal() {
  //1.- Request the authenticated principal to gate protected routes.
  return apiFetch<Principal>("/v1/user", { method: "GET" });
}
