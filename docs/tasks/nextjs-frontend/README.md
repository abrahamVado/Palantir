# Next.js Frontend Delivery Plan

This plan defines the tasks to build a React/Next.js frontend that consumes the Larago Go Gin backend endpoints documented in the repository README.

## Objectives
- Provide public pages for the landing experience and login aligned with the `/` and `/v1/auth/login` endpoints.
- Deliver authenticated workflows for dashboard, users, teams, permissions, and roles backed by the `/v1/user`, `/v1/notifications`, and `/admin/*` endpoints.
- Use [shadcn/ui](https://github.com/shadcn-ui/ui) and [shadcn/ui blocks](https://ui.shadcn.com/blocks) for all UI primitives and page sections.

## Task Breakdown
1. **Project Scaffolding**
   - Create a Next.js project (TypeScript) configured for SSR/ISR as needed; confirm required Next.js version and package manager with the team before scaffolding.
   - Add Tailwind CSS and integrate shadcn/ui setup scripts; document the generated component directory and alias structure.
   - Establish environment variable contract for the backend base URL and public path configuration without hard-coding values.

2. **API Client Foundation**
   - Build a typed HTTP client for the documented endpoints (auth, notifications, admin resources) with shared request/response envelope parsing based on ADR-003 conventions described in the backend README.
   - Implement token storage/refresh behavior mapping to `/v1/auth/login`, `/v1/auth/refresh`, `/v1/auth/logout`, and `/v1/user`; keep refresh behavior configurable pending confirmation of token lifetimes.
   - Add request guards for endpoints requiring `Authorization: Bearer <access token>` and allow opt-in inclusion for public routes.

3. **Authentication & Session Flow**
   - Implement login form using shadcn form components and actions wired to `/v1/auth/login`; capture errors using the backend envelope format.
   - Add registration and logout flows using `/v1/auth/register` and `/v1/auth/logout` when approved; keep refresh sequence aligned with `/v1/auth/refresh`.
   - Gate private routes (dashboard, users, teams, permissions, roles) via middleware or server-side guards that validate the session through `/v1/user`.

4. **Public Pages**
   - Compose a marketing landing page using shadcn blocks; pull any dynamic content from configuration rather than hard-coded copy.
   - Build the login page (public) that routes authenticated users to the dashboard after successful token issuance.

5. **Dashboard Shell & Navigation**
   - Create a protected dashboard layout with navigation to Users, Teams, Permissions, and Roles sections; use shadcn/ui navigation components.
   - Display current principal details from `/v1/user` and surface unread notification counts fetched from `/v1/notifications`.

6. **Resource Management Screens**
   - Users: list, create, update, and delete via `/admin/users` endpoints; include pagination controls for `page`/`per_page` query params.
   - Roles: CRUD via `/admin/roles`; manage permission assignments and handle pagination.
   - Permissions: CRUD via `/admin/permissions` with pagination support.
   - Teams: CRUD via `/admin/teams` with pagination support.
   - Ensure forms use shadcn form primitives and handle validation errors returned by the backend envelopes.

7. **Notifications Experience**
   - Build a notification list view using `/v1/notifications` with pagination.
   - Add the ability to mark notifications as read via `/v1/notifications/{id}`.

8. **Email Verification Compatibility**
   - Support verification link handling for `/email/verify/{id}/{hash}` and resend flow for `/email/verification-notification`, ensuring UI states reflect success and throttling (HTTP 429) responses.

9. **Testing & Quality Gates**
   - Define integration tests or API contract checks for each endpoint used by the frontend (e.g., MSW mocks or contract tests) without assuming backend availability.
   - Include accessibility and visual regression coverage where feasible; document any required tooling approvals.

## Dependencies & Sequencing
- Confirm the backend base URL, token lifetime expectations, and whether refresh tokens are http-only cookies or stored in memory/localStorage.
- Validate which admin endpoints require specific permission slugs before wiring role-based UI gating.
- Align on deployment target (Vercel, self-hosted, etc.) to set Next.js output configuration.

## Definition of Done
- All public and private routes render using shadcn/ui blocks without custom design systems.
- Authenticated experiences only load data when a valid Bearer token is available, deferring to `/v1/user` for principal context.
- CRUD operations for users, teams, permissions, and roles respect backend validation rules and surface errors to the user.
