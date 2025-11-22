import { apiFetch } from "./http-client";

export type NotificationItem = {
  id: string;
  title?: string;
  body?: string;
  read_at?: string | null;
  created_at?: string;
};

export type NotificationsPage = {
  items: NotificationItem[];
  meta: { page: number; per_page: number; total?: number };
  unreadCount?: number;
};

type PageParams = {
  page: number;
  perPage: number;
};

export async function fetchNotificationsPage({ page, perPage }: PageParams): Promise<NotificationsPage> {
  //1.- Request a page of notifications using shared pagination defaults.
  const data = await apiFetch<{
    notifications: NotificationItem[];
    meta: NotificationsPage["meta"];
    unread_count?: number;
  }>(`/v1/notifications?page=${page}&per_page=${perPage}`, { method: "GET" });

  //2.- Normalize the payload into the shape used by UI components.
  return {
    items: data.notifications,
    meta: data.meta,
    unreadCount:
      data.unread_count ?? data.notifications.filter((item) => !item.read_at).length,
  };
}

export async function markNotificationRead(id: string) {
  //1.- Mark a notification as read to update server state.
  await apiFetch(`/v1/notifications/${id}`, { method: "PATCH" });
  //2.- Return a simple acknowledgement so callers can refresh UI state.
  return { message: "Notification updated" };
}
