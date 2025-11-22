"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/lib/http-client";
import { createPermission, deletePermission, listPermissions, updatePermission, PermissionPayload, ResourceWithId } from "@/lib/admin";

export default function PermissionsPage() {
  //1.- Initialize permission-aware state for the permissions catalog.
  const { hasPermission } = useSession();
  const canView = hasPermission("admin.permissions.view");
  const canManage = hasPermission("admin.permissions.manage");

  const [permissions, setPermissions] = useState<ResourceWithId<PermissionPayload>[]>([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, per_page: 20, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  async function loadPermissions(nextPage = page) {
    //1.- Fetch permissions when the viewer can access the catalog.
    if (!canView) return;
    try {
      setLoading(true);
      const data = await listPermissions(nextPage, meta.per_page);
      setPermissions(data.items);
      setPage(nextPage);
      setMeta({ ...data.meta, total: data.meta.total ?? data.items.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load permissions");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    //1.- Reset the permission form state.
    setForm({ name: "" });
    setEditingId(null);
    setValidationErrors(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //1.- Prevent mutations when manage permission is absent.
    if (!canManage) {
      setError("You do not have permission to manage permissions.");
      return;
    }
    setError(undefined);
    setValidationErrors(undefined);
    const payload: PermissionPayload = { name: form.name.trim() };
    try {
      if (editingId) {
        await updatePermission(editingId, payload);
      } else {
        await createPermission(payload);
      }
      resetForm();
      loadPermissions(page);
    } catch (err) {
      if (err instanceof ApiClientError && err.envelope?.errors) {
        setValidationErrors(err.envelope.errors);
      }
      setError(err instanceof Error ? err.message : "Unable to save permission");
    }
  }

  async function handleEdit(permission: ResourceWithId<PermissionPayload>) {
    //1.- Load the selected permission into the form for editing.
    setEditingId(permission.id);
    setForm({ name: permission.name });
  }

  async function handleDelete(id: string) {
    //1.- Delete the selected permission when allowed.
    if (!canManage) return;
    await deletePermission(id);
    loadPermissions(page);
  }

  useEffect(() => {
    //1.- Kick off initial fetch when permitted.
    loadPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  if (!canView) {
    return <p className="text-gray-600">You do not have permission to view permissions.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold">Permissions</h1>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => loadPermissions()}>
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-4 text-destructive">{error}</CardContent>
        </Card>
      )}

      <form className="space-y-3" onSubmit={handleSubmit}>
        <Input
          placeholder="Permission name"
          value={form.name}
          onChange={(e) => setForm({ name: e.target.value })}
          required
          disabled={!canManage}
        />
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
          <CardTitle>Current permissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between rounded border p-3">
              <p className="font-medium">{permission.name}</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={!canManage} onClick={() => handleEdit(permission)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled={!canManage} onClick={() => handleDelete(permission.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <Button variant="ghost" disabled={page <= 1 || loading} onClick={() => loadPermissions(page - 1)}>
              Previous
            </Button>
            <p>
              Page {meta.page} / {Math.max(1, Math.ceil((meta.total ?? permissions.length) / meta.per_page))}
            </p>
            <Button variant="ghost" disabled={loading || (meta.total ?? permissions.length) <= page * meta.per_page} onClick={() => loadPermissions(page + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
