import { apiFetch } from "./http-client";

export type Pagination = {
  page: number;
  per_page: number;
  total?: number;
};

export type PagedResponse<T> = {
  items: T[];
  meta: Pagination;
};

export type UserPayload = { email: string; roles: string[]; teams: string[] };
export type RolePayload = { name: string; permissions: string[] };
export type PermissionPayload = { name: string };
export type TeamPayload = { name: string };

export type ResourceWithId<T> = T & { id: string };

export async function listUsers(page = 1, perPage = 20): Promise<PagedResponse<ResourceWithId<UserPayload>>> {
  //1.- Fetch a paginated set of users for admin views.
  const data = await apiFetch<{ users: ResourceWithId<UserPayload>[]; meta: Pagination }>(
    `/admin/users?page=${page}&per_page=${perPage}`,
    { method: "GET" },
  );
  //2.- Normalize the envelope into a consistent shape for UI components.
  return { items: data.users, meta: data.meta };
}

export async function createUser(payload: UserPayload) {
  //1.- Submit a user payload to the admin create endpoint.
  return apiFetch<ResourceWithId<UserPayload>>("/admin/users", { method: "POST", body: JSON.stringify(payload) });
}

export async function updateUser(id: string, payload: UserPayload) {
  //1.- Apply updates to an existing user record.
  return apiFetch<ResourceWithId<UserPayload>>(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string) {
  //1.- Remove a user from the system.
  await apiFetch(`/admin/users/${id}`, { method: "DELETE" });
  //2.- Return a friendly acknowledgement for UI messaging.
  return { message: "User deleted" };
}

export async function listRoles(page = 1, perPage = 20): Promise<PagedResponse<ResourceWithId<RolePayload>>> {
  //1.- Retrieve roles with pagination for admin tables.
  const data = await apiFetch<{ roles: ResourceWithId<RolePayload>[]; meta: Pagination }>(
    `/admin/roles?page=${page}&per_page=${perPage}`,
    { method: "GET" },
  );
  //2.- Provide the normalized response.
  return { items: data.roles, meta: data.meta };
}

export async function createRole(payload: RolePayload) {
  //1.- Create a new role entry via the admin API.
  return apiFetch<ResourceWithId<RolePayload>>("/admin/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRole(id: string, payload: RolePayload) {
  //1.- Update a role and its permissions.
  return apiFetch<ResourceWithId<RolePayload>>(`/admin/roles/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRole(id: string) {
  //1.- Delete a role by identifier.
  await apiFetch(`/admin/roles/${id}`, { method: "DELETE" });
  //2.- Return a confirmation for calling components.
  return { message: "Role deleted" };
}

export async function listPermissions(
  page = 1,
  perPage = 20,
): Promise<PagedResponse<ResourceWithId<PermissionPayload>>> {
  //1.- Fetch the permissions catalog.
  const data = await apiFetch<{ permissions: ResourceWithId<PermissionPayload>[]; meta: Pagination }>(
    `/admin/permissions?page=${page}&per_page=${perPage}`,
    { method: "GET" },
  );
  //2.- Normalize for UI consumers.
  return { items: data.permissions, meta: data.meta };
}

export async function createPermission(payload: PermissionPayload) {
  //1.- Add a new permission entry.
  return apiFetch<ResourceWithId<PermissionPayload>>("/admin/permissions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePermission(id: string, payload: PermissionPayload) {
  //1.- Update a permission name.
  return apiFetch<ResourceWithId<PermissionPayload>>(`/admin/permissions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deletePermission(id: string) {
  //1.- Remove a permission entry.
  await apiFetch(`/admin/permissions/${id}`, { method: "DELETE" });
  //2.- Confirm removal.
  return { message: "Permission deleted" };
}

export async function listTeams(page = 1, perPage = 20): Promise<PagedResponse<ResourceWithId<TeamPayload>>> {
  //1.- Retrieve teams with pagination.
  const data = await apiFetch<{ teams: ResourceWithId<TeamPayload>[]; meta: Pagination }>(
    `/admin/teams?page=${page}&per_page=${perPage}`,
    { method: "GET" },
  );
  //2.- Return normalized content.
  return { items: data.teams, meta: data.meta };
}

export async function createTeam(payload: TeamPayload) {
  //1.- Create a new team entry.
  return apiFetch<ResourceWithId<TeamPayload>>("/admin/teams", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTeam(id: string, payload: TeamPayload) {
  //1.- Update the team name.
  return apiFetch<ResourceWithId<TeamPayload>>(`/admin/teams/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteTeam(id: string) {
  //1.- Delete a team by id.
  await apiFetch(`/admin/teams/${id}`, { method: "DELETE" });
  //2.- Acknowledge completion for UI messaging.
  return { message: "Team deleted" };
}
