"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchNotificationsPage, markNotificationRead, NotificationItem } from "@/lib/notifications";

export default function NotificationsPage() {
  //1.- Manage local state for notifications, pagination, and errors.
  const { refreshSession } = useSession();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, per_page: 10, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  async function loadNotifications(nextPage = page) {
    //1.- Fetch notifications for the requested page and update state.
    try {
      setLoading(true);
      setError(undefined);
      const data = await fetchNotificationsPage({ page: nextPage, perPage: meta.per_page });
      setItems(data.items);
      setPage(nextPage);
      setMeta({ ...data.meta, total: data.meta.total ?? data.items.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id: string) {
    //1.- Mark a notification as read then refresh lists and session counters.
    await markNotificationRead(id);
    await Promise.all([loadNotifications(page), refreshSession()]);
  }

  useEffect(() => {
    //1.- Load notifications on mount to populate the view.
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Stay current</p>
          <h1 className="text-2xl font-semibold">Notifications</h1>
        </div>
        <Button variant="outline" onClick={() => loadNotifications()}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {items.map((notification) => (
          <Card key={notification.id} className={notification.read_at ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{notification.title ?? "Notification"}</CardTitle>
                {!notification.read_at && (
                  <Button size="sm" onClick={() => handleMarkRead(notification.id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <p>{notification.body ?? "No details provided."}</p>
              {notification.created_at && (
                <p className="text-xs text-gray-500">Created at: {new Date(notification.created_at).toLocaleString()}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 text-sm text-gray-600">
        <Button variant="ghost" disabled={page <= 1 || loading} onClick={() => loadNotifications(page - 1)}>
          Previous
        </Button>
        <p>
          Page {meta.page} / {Math.max(1, Math.ceil((meta.total ?? items.length) / meta.per_page))}
        </p>
        <Button variant="ghost" disabled={loading || (meta.total ?? items.length) <= page * meta.per_page} onClick={() => loadNotifications(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
