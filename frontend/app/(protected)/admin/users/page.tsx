"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/lib/http-client";
import { createUser, deleteUser, listUsers, updateUser, ResourceWithId, UserPayload } from "@/lib/admin";

export default function UsersPage() {
  //1.- Wire session-aware permission checks and data state for the users section.
  const { hasPermission } = useSession();
  const canView = hasPermission("admin.users.view");
  const canManage = hasPermission("admin.users.manage");

  const [users, setUsers] = useState<ResourceWithId<UserPayload>[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, per_page: 20, total: 0 });
  const [form, setForm] = useState({ email: "", roles: "", teams: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  async function loadUsers(nextPage = page) {
    //1.- Pull a page of users if the viewer holds the view permission.
    if (!canView) return;
    try {
      setLoading(true);
      const data = await listUsers(nextPage, meta.per_page);
      setUsers(data.items);
      setPage(nextPage);
      setMeta({ ...data.meta, total: data.meta.total ?? data.items.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    //1.- Clear form state so subsequent edits start fresh.
    setForm({ email: "", roles: "", teams: "" });
    setEditingId(null);
    setValidationErrors(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //1.- Protect mutations behind the manage permission.
    if (!canManage) {
      setError("You do not have permission to manage users.");
      return;
    }
    setError(undefined);
    setValidationErrors(undefined);
    const payload: UserPayload = {
      email: form.email.trim(),
      roles: form.roles.split(",").map((r) => r.trim()).filter(Boolean),
      teams: form.teams.split(",").map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (editingId) {
        await updateUser(editingId, payload);
      } else {
        await createUser(payload);
      }
      resetForm();
      loadUsers(page);
    } catch (err) {
      if (err instanceof ApiClientError && err.envelope?.errors) {
        setValidationErrors(err.envelope.errors);
      }
      setError(err instanceof Error ? err.message : "Unable to save user");
    }
  }

  async function handleEdit(user: ResourceWithId<UserPayload>) {
    //1.- Populate the form with the selected user for editing.
    setEditingId(user.id);
    setForm({
      email: user.email,
      roles: user.roles.join(", "),
      teams: user.teams.join(", "),
    });
  }

  async function handleDelete(id: string) {
    //1.- Remove a user and refresh listings when permitted.
    if (!canManage) return;
    await deleteUser(id);
    loadUsers(page);
  }

  useEffect(() => {
    //1.- Fetch initial data when permissions allow viewing.
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  if (!canView) {
    return <p className="text-gray-600">You do not have permission to view users.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold">Users</h1>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => loadUsers()}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
            disabled={!canManage}
          />
          <Input
            placeholder="Roles (comma separated)"
            value={form.roles}
            onChange={(e) => setForm((prev) => ({ ...prev, roles: e.target.value }))}
            disabled={!canManage}
          />
          <Input
            placeholder="Teams (comma separated)"
            value={form.teams}
            onChange={(e) => setForm((prev) => ({ ...prev, teams: e.target.value }))}
            disabled={!canManage}
          />
        </div>
        {validationErrors && (
          <p className="text-sm text-destructive">
            {Object.entries(validationErrors)
              .map(([field, messages]) => `${field}: ${messages.join("; ")}`)
              .join(" | ")}
          </p>
        )}
        <div className="flex gap-2">
          <Button type="submit" disabled={!canManage}>
            {editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Current users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-gray-500">Roles: {user.roles.join(", ") || "None"}</p>
                <p className="text-xs text-gray-500">Teams: {user.teams.join(", ") || "None"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={!canManage} onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled={!canManage} onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <Button variant="ghost" disabled={page <= 1 || loading} onClick={() => loadUsers(page - 1)}>
              Previous
            </Button>
            <p>
              Page {meta.page} / {Math.max(1, Math.ceil((meta.total ?? users.length) / meta.per_page))}
            </p>
            <Button variant="ghost" disabled={loading || (meta.total ?? users.length) <= page * meta.per_page} onClick={() => loadUsers(page + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
