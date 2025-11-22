"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/components/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiClientError } from "@/lib/http-client";
import { createTeam, deleteTeam, listTeams, updateTeam, ResourceWithId, TeamPayload } from "@/lib/admin";

export default function TeamsPage() {
  //1.- Prepare permission-aware state for the teams section.
  const { hasPermission } = useSession();
  const canView = hasPermission("admin.teams.view");
  const canManage = hasPermission("admin.teams.manage");

  const [teams, setTeams] = useState<ResourceWithId<TeamPayload>[]>([]);
  const [form, setForm] = useState({ name: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [meta, setMeta] = useState({ page: 1, per_page: 20, total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | undefined>();

  async function loadTeams(nextPage = page) {
    //1.- Fetch teams when view access is granted.
    if (!canView) return;
    try {
      setLoading(true);
      const data = await listTeams(nextPage, meta.per_page);
      setTeams(data.items);
      setPage(nextPage);
      setMeta({ ...data.meta, total: data.meta.total ?? data.items.length });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load teams");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    //1.- Reset form state to the defaults.
    setForm({ name: "" });
    setEditingId(null);
    setValidationErrors(undefined);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    //1.- Enforce manage permission before sending mutations.
    if (!canManage) {
      setError("You do not have permission to manage teams.");
      return;
    }
    setError(undefined);
    setValidationErrors(undefined);
    const payload: TeamPayload = { name: form.name.trim() };
    try {
      if (editingId) {
        await updateTeam(editingId, payload);
      } else {
        await createTeam(payload);
      }
      resetForm();
      loadTeams(page);
    } catch (err) {
      if (err instanceof ApiClientError && err.envelope?.errors) {
        setValidationErrors(err.envelope.errors);
      }
      setError(err instanceof Error ? err.message : "Unable to save team");
    }
  }

  async function handleEdit(team: ResourceWithId<TeamPayload>) {
    //1.- Load the selected team into the form for editing.
    setEditingId(team.id);
    setForm({ name: team.name });
  }

  async function handleDelete(id: string) {
    //1.- Delete the team and refresh listings when allowed.
    if (!canManage) return;
    await deleteTeam(id);
    loadTeams(page);
  }

  useEffect(() => {
    //1.- Perform initial fetch if the user can view teams.
    loadTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canView]);

  if (!canView) {
    return <p className="text-gray-600">You do not have permission to view teams.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Admin</p>
          <h1 className="text-2xl font-semibold">Teams</h1>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => loadTeams()}>
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
          placeholder="Team name"
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
          <CardTitle>Current teams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between rounded border p-3">
              <p className="font-medium">{team.name}</p>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" disabled={!canManage} onClick={() => handleEdit(team)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" disabled={!canManage} onClick={() => handleDelete(team.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <Button variant="ghost" disabled={page <= 1 || loading} onClick={() => loadTeams(page - 1)}>
              Previous
            </Button>
            <p>
              Page {meta.page} / {Math.max(1, Math.ceil((meta.total ?? teams.length) / meta.per_page))}
            </p>
            <Button variant="ghost" disabled={loading || (meta.total ?? teams.length) <= page * meta.per_page} onClick={() => loadTeams(page + 1)}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
