"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { fetchPrincipal, Principal } from "@/lib/auth";
import { fetchNotificationsPage } from "@/lib/notifications";

export type SessionContextValue = {
  principal?: Principal;
  unreadCount: number;
  loading: boolean;
  error?: string;
  refreshSession: () => Promise<void>;
  hasPermission: (slug: string) => boolean;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  //1.- Track principal, unread count, and lifecycle states for authenticated areas.
  const [principal, setPrincipal] = useState<Principal | undefined>();
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();
  const pathname = usePathname();

  const hasPermission = useMemo(
    () =>
      //2.- Expose a memoized permission checker to gate navigation and actions.
      (slug: string) => principal?.permissions.includes(slug) ?? false,
    [principal?.permissions],
  );

  const loadSession = useCallback(async () => {
    //1.- Fetch the principal and unread notification count together.
    try {
      setLoading(true);
      setError(undefined);
      const [nextPrincipal, notifications] = await Promise.all([
        fetchPrincipal(),
        fetchNotificationsPage({ page: 1, perPage: 10 }),
      ]);
      setPrincipal(nextPrincipal);
      setUnreadCount(notifications.unreadCount ?? 0);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication required";
      setError(message);
      setPrincipal(undefined);
      //2.- Redirect unauthenticated users to login while preserving the path.
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } finally {
      setLoading(false);
    }
  }, [pathname, router]);

  useEffect(() => {
    //1.- Initialize the session on mount so protected layouts can render.
    loadSession();
  }, [loadSession]);

  const value = useMemo(
    () => ({
      principal,
      unreadCount,
      loading,
      error,
      refreshSession: loadSession,
      hasPermission,
    }),
    [principal, unreadCount, loading, error, hasPermission, loadSession],
  );

  //2.- Render the provider so children can consume session state.
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  //1.- Enforce access to the session context and surface a consistent hook.
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
