# Codex Task: Authentication & Session Flow

## Objective
Implement login and session management that leverage the backend envelope format, enabling gated routes and refresh-safe sessions.

## Scope
- Build the login form using shadcn form primitives wired to `/v1/auth/login` with error capture.
- Keep registration disabled while documenting a toggle for future `/v1/auth/register` enablement; wire logout to `/v1/auth/logout` and refresh to `/v1/auth/refresh`.
- Gate private routes (dashboard and admin sections) via middleware or server-side checks that validate `/v1/user`.

## Acceptance Criteria
- Login UI submits to the backend and surfaces envelope errors clearly.
- Session guard redirects unauthenticated users from protected routes and supports token refresh without exposing cookies to JS.
- Logout and refresh flows clear sessions correctly and keep the registration path hidden but documented.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
