"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/lib/http-client";
import { createRole, deleteRole, listRoles, updateRole, ResourceWithId, RolePayload } from "@/lib/admin";

export default function RolesPage() {
  //1.- Set up permission-aware state for the roles section.
  const { hasPermission } = useSession();
  const canView = hasPermission("admin.roles.view");
  const canManage = hasPermission("admin.roles.manage");

  const [roles, setRoles] = useState<ResourceWithId<RolePayload>[]>([]);
  const [form, setForm] = useState({ name: "", permissions: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, per_page: 20, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  async function loadRoles(nextPage = page) {
    //1.- Request roles when view permission exists.
    if (!canView) return;
    try {
      setLoading(true);
      const data = await listRoles(nextPage, meta.per_page);
      setRoles(data.items);
      setPage(nextPage);
      setMeta({ ...data.meta, total: data.meta.total ?? data.items.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load roles");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    //1.- Clear the role form and editing state.
    setForm({ name: "", permissions: "" });
    setEditingId(null);
    setValidationErrors(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //1.- Block mutations when manage permission is missing.
    if (!canManage) {
      setError("You do not have permission to manage roles.");
      return;
    }
    setError(undefined);
    setValidationErrors(undefined);
    const payload: RolePayload = {
      name: form.name.trim(),
      permissions: form.permissions.split(",").map((p) => p.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await updateRole(editingId, payload);
      } else {
        await createRole(payload);
      }
      resetForm();
      loadRoles(page);
    } catch (err) {
      if (err instanceof ApiClientError && err.envelope?.errors) {
        setValidationErrors(err.envelope.errors);
      }
      setError(err instanceof Error ? err.message : "Unable to save role");
    }
  }

  async function handleEdit(role: ResourceWithId<RolePayload>) {
    //1.- Load the chosen role into the form for editing.
    setEditingId(role.id);
    setForm({ name: role.name, permissions: role.permissions.join(", ") });
  }

  async function handleDelete(id: string) {
    //1.- Delete the selected role when allowed.
    if (!canManage) return;
    await deleteRole(id);
    loadRoles(page);
  }

  useEffect(() => {
    //1.- Kick off the initial fetch when permitted.
    loadRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  if (!canView) {
    return <p className="text-gray-600">You do not have permission to view roles.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold">Roles</h1>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => loadRoles()}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Role name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
            disabled={!canManage}
          />
          <Input
            placeholder="Permissions (comma separated)"
            value={form.permissions}
            onChange={(e) => setForm((prev) => ({ ...prev, permissions: e.target.value }))}
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
          <CardTitle>Current roles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between rounded border p-3">
              <div>
                <p className="font-medium">{role.name}</p>
                <p className="text-xs text-gray-500">
                  Permissions: {role.permissions.join(", ") || "None"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={!canManage} onClick={() => handleEdit(role)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled={!canManage} onClick={() => handleDelete(role.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <Button variant="ghost" disabled={page <= 1 || loading} onClick={() => loadRoles(page - 1)}>
              Previous
            </Button>
            <p>
              Page {meta.page} / {Math.max(1, Math.ceil((meta.total ?? roles.length) / meta.per_page))}
            </p>
            <Button variant="ghost" disabled={loading || (meta.total ?? roles.length) <= page * meta.per_page} onClick={() => loadRoles(page + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
