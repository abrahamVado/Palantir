# Admin Permission Slugs and UI Gating

Use permission slugs from `/v1/user` to decide which admin routes and controls are visible. Hide entire screens if the user lacks the view slug; disable action buttons when the view slug is present but the manage slug is absent.

## Permission Map
- **Users**
  - `admin.users.view` — View/list users and inspect details.
  - `admin.users.manage` — Create, edit, delete users, and assign roles/teams.
- **Roles**
  - `admin.roles.view` — View/list roles and their permissions.
  - `admin.roles.manage` — Create, edit, delete roles, and assign permissions.
- **Permissions**
  - `admin.permissions.view` — View/list permission catalog.
  - `admin.permissions.manage` — Create, edit, delete permissions.
- **Teams**
  - `admin.teams.view` — View/list teams and memberships.
  - `admin.teams.manage` — Create, edit, delete teams.

## UI Behavior Rules
- **Navigation:** Only render the navigation link for a section if the user has the corresponding `*.view` slug.
- **Data fetching:** Block API calls for sections the user cannot view to avoid unauthorized requests.
- **Actions:** Disable or hide create/update/delete buttons when the user lacks the `*.manage` slug but can view the section.
- **Empty states:** If a user can view a section but not manage it, show read-only empty-state messaging without action CTAs.
- **Error handling:** If the backend returns 403 due to stale permissions, show a permissions error and clear interactive controls.
