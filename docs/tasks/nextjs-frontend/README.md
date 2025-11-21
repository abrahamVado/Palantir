# Next.js Frontend Delivery Plan

This plan defines the tasks to build a React/Next.js frontend that consumes the Larago Go Gin backend endpoints documented in the repository README.

## Objectives
- Provide public pages for the landing experience and login aligned with the `/` and `/v1/auth/login` endpoints.
- Deliver authenticated workflows for dashboard, users, teams, permissions, and roles backed by the `/v1/user`, `/v1/notifications`, and `/admin/*` endpoints.
- Use [shadcn/ui](https://github.com/shadcn-ui/ui) and [shadcn/ui blocks](https://ui.shadcn.com/blocks) for all UI primitives and page sections.

> Standards references: align all items below with [Frontend Standards Decisions](../../decisions/frontend-standards/README.md) to avoid re-opening settled choices.

## Task Breakdown
1. **Project Scaffolding**
   - Create a Next.js 14.2.x TypeScript project configured for SSR/ISR with **pnpm v9+** on **Node.js 20**, following the scaffold in the standards decision.
   - Add Tailwind CSS and integrate shadcn/ui setup scripts; document the generated component directory and alias structure.
   - Establish environment variable handling for the shared backend origin `https://api.softwaremia.com` and public path configuration without hard-coding values.

2. **API Client Foundation**
   - Build a typed HTTP client for the documented endpoints (auth, notifications, admin resources) with shared request/response envelope parsing based on ADR-003 conventions described in the backend README.
   - Implement the cookie-based token model (Secure, HttpOnly, SameSite=Strict) covering `/v1/auth/login`, `/v1/auth/refresh`, `/v1/auth/logout`, and `/v1/user`; assume access token ~15 minutes and refresh token ~7 days with rotation on refresh.
   - Add request guards for endpoints requiring `Authorization: Bearer <access token>` and allow opt-in inclusion for public routes, always sending `credentials: 'include'` to honor cookie-based auth.

3. **Authentication & Session Flow**
   - Implement login form using shadcn form components and actions wired to `/v1/auth/login`; capture errors using the backend envelope format.
   - Keep registration UI suppressed per current standards but leave a clearly documented placeholder/toggle for future enablement of `/v1/auth/register`; implement logout with `/v1/auth/logout` and keep refresh aligned with `/v1/auth/refresh`.
   - Gate private routes (dashboard, users, teams, permissions, roles) via middleware or server-side guards that validate the session through `/v1/user`.

4. **Public Pages**
   - Compose a marketing landing page using shadcn blocks; pull any dynamic content from configuration rather than hard-coded copy and keep the color palette aligned with the default black/white shadcn theming plus the overridable `--accent-color`.
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
   - Document expectations for integration coverage and API contract checks without prescribing tools; defer generating automated tests until the team requests them.
   - Include accessibility and visual regression considerations where feasible; note any required tooling approvals before adding them later.

## Dependencies & Sequencing
- Validate which admin endpoints require specific permission slugs before wiring role-based UI gating (see permissions map reference).
- Capture any remaining deployment-specific environment variable details for the Dockerized `next start` target if they differ by environment.

## Definition of Done
- All public and private routes render using shadcn/ui blocks without custom design systems.
- Authenticated experiences only load data when a valid Bearer token is available, deferring to `/v1/user` for principal context.
- CRUD operations for users, teams, permissions, and roles respect backend validation rules and surface errors to the user.
