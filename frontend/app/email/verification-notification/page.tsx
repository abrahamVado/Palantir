"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/lib/http-client";
import { requestVerificationResend } from "@/lib/verification";

export default function VerificationNotificationPage() {
  //1.- Manage the resend request lifecycle and any backend feedback.
  const [status, setStatus] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //1.- Clear prior messages so the new attempt shows cleanly.
    setStatus("");

    startTransition(() => {
      requestVerificationResend()
        .then((res) => {
          setStatus(res.message ?? "Verification email sent. Check your inbox.");
        })
        .catch((error) => {
          const apiError = error as ApiClientError;
          if (apiError?.status === 429) {
            setStatus(apiError.message ?? "Too many requests. Please try again later.");
            return;
          }
          setStatus(apiError?.message ?? "Unable to send verification email.");
        });
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-2">
          <Button asChild variant="ghost" className="w-fit px-0 text-sm">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to landing
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            <CardTitle>Resend verification</CardTitle>
          </div>
          <CardDescription>
            Request a new email verification link for your authenticated session. Throttling is respected.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p className="text-foreground">
              Stay signed in, then trigger a resend using the compatibility endpoint
              <span className="font-mono"> /email/verification-notification</span>.
            </p>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </span>
              ) : (
                "Send verification email"
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
            {status && (
              <div className="inline-flex items-start gap-2 text-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 text-primary" />
                <p>{status}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              This flow honors backend throttling (HTTP 429). For a new verification link, ensure your current session is valid
              via /v1/user.
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
