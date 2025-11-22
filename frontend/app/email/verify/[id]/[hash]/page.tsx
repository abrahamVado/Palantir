"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/lib/http-client";
import { verifyEmailLink } from "@/lib/verification";

type PageProps = {
  params: { id: string; hash: string };
};

export default function VerifyEmailPage({ params }: PageProps) {
  //1.- Track the verification lifecycle and any backend-supplied messaging.
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState<string>("Confirming your verification link…");

  useEffect(() => {
    //1.- Attempt verification as soon as the page loads using the path params.
    verifyEmailLink(params.id, params.hash)
      .then((res) => {
        setStatus("success");
        setMessage(res.message ?? "Email verified successfully.");
      })
      .catch((err) => {
        const apiError = err as ApiClientError;
        setStatus("error");
        setMessage(
          apiError?.message ??
            "We could not verify this link. It may be expired or already used."
        );
      });
  }, [params.hash, params.id]);

  const isLoading = status === "pending";

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
            {status === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            {status === "error" && <AlertCircle className="h-5 w-5 text-destructive" />}
            {status === "pending" && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            <CardTitle>Email verification</CardTitle>
          </div>
          <CardDescription>
            We mirror the Laravel-compatible verification endpoints so legacy links keep working.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground">
          <p className="text-base text-foreground">{message}</p>
          <div className="flex items-center gap-3">
            <Button asChild variant="default" disabled={isLoading}>
              <Link href="/login">Return to login</Link>
            </Button>
            <Button asChild variant="outline" disabled={isLoading}>
              <Link href="/email/verification-notification">Resend verification email</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
