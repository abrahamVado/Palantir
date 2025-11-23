import { apiFetch } from "./http-client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type NextAuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type Principal = {
  id: string;
  email: string;
  roles: string[];
  permissions: string[];
};

export async function login(payload: LoginPayload) {
  //1.- Forward the login form to the Next.js-friendly endpoint so it can set HttpOnly cookies.
  const tokens = await apiFetch<NextAuthTokens>("/v1/next-auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  //2.- Return the rotated pair so callers can hydrate client auth state alongside the cookies.
  return tokens;
}

export async function refreshSession(refreshToken?: string) {
  //1.- Request a rotation of the refresh token using the cookie fallback when no override is provided.
  return apiFetch<NextAuthTokens>("/v1/next-auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

export async function logout(refreshToken?: string, accessToken?: string) {
  //1.- Call the logout endpoint so the backend clears cookies and revokes both tokens.
  await apiFetch("/v1/next-auth/logout", {
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
