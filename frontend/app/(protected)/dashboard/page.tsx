"use client";

import Link from "next/link";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  //1.- Pull principal and notification data to summarize the account state.
  const { principal, unreadCount } = useSession();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">Welcome back</p>
          <h1 className="text-2xl font-semibold">{principal?.email}</h1>
          <p className="text-sm text-gray-500">Roles: {principal?.roles.join(", ") || "None"}</p>
        </div>
        <Button asChild>
          <Link href="/notifications">View notifications</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{unreadCount}</p>
            <p className="text-sm text-gray-500">Unread items waiting for review.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Admin shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>Manage users, roles, permissions, and teams from the navigation above.</p>
            <p className="text-gray-500">Access is permission-aware based on your assigned slugs.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
