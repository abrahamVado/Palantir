"use client";

import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/auth";
import { ApiClientError } from "@/lib/http-client";

export default function LoginPage() {
  const [status, setStatus] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //1.- Collect credentials from the form so they can be forwarded to the backend.
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();

    startTransition(() => {
      //2.- Reset any prior messages before issuing the login request.
      setStatus("");
      setFieldErrors({});

      login({ email, password })
        .then(() => {
          //3.- Confirm success so the caller can redirect to the dashboard shell.
          setStatus("Login successful. HttpOnly cookies updated for web sessions.");
        })
        .catch((error) => {
          if (error instanceof ApiClientError && error.envelope?.errors) {
            //4.- Surface field-level validation issues from the ADR-003 envelope.
            setFieldErrors(error.envelope.errors);
          }
          setStatus(error instanceof Error ? error.message : "Login failed");
        });
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-3">
          <Button asChild variant="ghost" className="w-fit px-0">
            <Link href="/" className="inline-flex items-center gap-2 text-sm">
              <ArrowLeft className="h-4 w-4" /> Back to landing
            </Link>
          </Button>
          <div>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription>
              Use your provisioned credentials to request HttpOnly tokens from /v1/next-auth/login.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              {fieldErrors.email && (
                <p className="text-sm text-destructive">{fieldErrors.email.join(" ")}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password.join(" ")}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                </span>
              ) : (
                "Request access"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          {status && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="mt-0.5 h-4 w-4 text-primary" />
              <p>{status}</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            The backend rotates refresh tokens on every successful refresh call. Keep registration hidden for now; enable it
            later by wiring /v1/auth/register into this flow when standards permit.
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
