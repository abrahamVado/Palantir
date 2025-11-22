"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function ShellFrame({ children }: { children: React.ReactNode }) {
  //1.- Consume session state to gate access and render navigation metadata.
  const { principal, unreadCount, loading, error, hasPermission } = useSession();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/notifications", label: `Notifications (${unreadCount})` },
    hasPermission("admin.users.view") && { href: "/admin/users", label: "Users" },
    hasPermission("admin.roles.view") && { href: "/admin/roles", label: "Roles" },
    hasPermission("admin.permissions.view") && { href: "/admin/permissions", label: "Permissions" },
    hasPermission("admin.teams.view") && { href: "/admin/teams", label: "Teams" },
  ].filter(Boolean) as { href: string; label: string }[];

  if (loading) {
    //2.- Block rendering while the session loads to avoid flicker.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Loading session…</CardTitle>
          </CardHeader>
          <CardContent>Please wait while we confirm your access.</CardContent>
        </Card>
      </div>
    );
  }

  if (error || !principal) {
    //3.- Surface errors in a friendly format to help users recover.
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Access needed</CardTitle>
          </CardHeader>
          <CardContent>{error ?? "You need to log in to continue."}</CardContent>
        </Card>
      </div>
    );
  }

  //4.- Render the shared navigation shell with contextual information.
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">Signed in as</p>
            <p className="font-semibold">{principal.email}</p>
          </div>
          <nav className="flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${pathname.startsWith(link.href) ? "text-black" : "text-gray-500"}`}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="outline" size="sm">
              <Link href="/login?redirect=/">Sign out</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Card>
          <CardContent className="py-6">{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}

export function ProtectedShell({ children }: { children: React.ReactNode }) {
  //1.- Encapsulate session state in a provider to support all protected pages.
  return (
    <SessionProvider>
      <ShellFrame>{children}</ShellFrame>
    </SessionProvider>
  );
}
