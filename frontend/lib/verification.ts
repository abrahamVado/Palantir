import { apiFetch } from "./http-client";

export type VerificationResponse = {
  message?: string;
};

export async function verifyEmailLink(id: string, hash: string) {
  //1.- Confirm the verification link by calling the public compatibility endpoint.
  return apiFetch<VerificationResponse>(`/email/verify/${id}/${hash}`, {
    method: "GET",
  });
}

export async function requestVerificationResend() {
  //1.- Ask the backend to resend the verification email for the current principal.
  return apiFetch<VerificationResponse>("/email/verification-notification", {
    method: "POST",
  });
}
