import Link from "next/link";
import { BellRing, Fingerprint, LayoutDashboard, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { appConfig } from "@/lib/config";

const featureCards = [
  {
    title: "Cookie-based auth",
    description:
      "Login, refresh, and logout rely on secure HttpOnly cookies with SameSite=Strict to mirror backend behavior.",
    icon: <ShieldCheck className="h-5 w-5" aria-hidden />,
  },
  {
    title: "Admin workflows",
    description:
      "Dashboard navigation covers users, teams, permissions, and roles aligned to the /admin endpoints.",
    icon: <LayoutDashboard className="h-5 w-5" aria-hidden />,
  },
  {
    title: "Notification center",
    description:
      "Unread counts and mark-as-read actions connect to /v1/notifications without polling requirements.",
    icon: <BellRing className="h-5 w-5" aria-hidden />,
  },
  {
    title: "Email verification",
    description:
      "Public compatibility screens handle /email/verify and resend flows to keep legacy links working.",
    icon: <Fingerprint className="h-5 w-5" aria-hidden />,
  },
];

export default function Home() {
  //1.- Highlight the shared backend origin so deployments avoid hard-coded URLs.
  const backendOrigin = appConfig.backendOrigin;
  //2.- Render a shadcn-powered landing page summarizing the delivery plan tasks.
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex-1 space-y-6">
          <p className="text-sm font-semibold tracking-tight text-primary">Connected to {backendOrigin}</p>
          <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Larago frontend shell with shadcn/ui foundations
          </h1>
          <p className="text-lg text-muted-foreground">
            Ship the marketing landing page, login, dashboard shell, and admin CRUD screens against the documented
            Gin backend. Token handling stays on HttpOnly cookies so every request automatically opts into credentials.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/login">Login now</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="https://ui.shadcn.com/blocks" target="_blank" rel="noreferrer">
                Explore shadcn blocks
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featureCards.map((item) => (
              <Card key={item.title} className="h-full border-border/70">
                <CardHeader className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    {item.icon}
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                  </div>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-card/40 py-12">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard shell</CardTitle>
              <CardDescription>Navigation, principal banner, and unread counts sourced from /v1/user.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Server components fetch the principal first so protected routes render only after the session is
                validated.
              </p>
              <p className="leading-relaxed">
                The shell provides quick links into users, teams, permissions, and roles with permission-gated controls.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public compatibility</CardTitle>
              <CardDescription>
                Landing, login, and email verification flows remain reachable without authentication.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Forms post with credentials included, enabling the backend to set and rotate Secure cookies during login
                and refresh.
              </p>
              <p className="leading-relaxed">
                Verification pages surface success, expired link, and throttling states based on backend responses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API client baseline</CardTitle>
              <CardDescription>Fetch helpers honor ADR-003 envelopes and always send cookies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p className="leading-relaxed">
                Requests default to <span className="font-mono">credentials: &quot;include&quot;</span> so access tokens never
                leave HttpOnly storage.
              </p>
              <p className="leading-relaxed">
                Error envelopes bubble up with field-level errors ready for shadcn forms.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
