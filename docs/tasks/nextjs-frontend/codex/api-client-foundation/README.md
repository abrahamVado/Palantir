# Codex Task: API Client Foundation

## Objective
Build a typed HTTP client that consumes the documented auth, notifications, and admin endpoints using the envelope conventions from the backend.

## Scope
- Implement request/response typing for `/v1/auth/*`, `/v1/user`, `/v1/notifications`, and `/admin/*` endpoints.
- Honor cookie-based auth with `credentials: 'include'` and bearer headers where required; enforce access/refresh handling per ADR-003.
- Provide guards for protected endpoints and allow opt-in inclusion for public routes.

## Acceptance Criteria
- Shared client utilities parse the backend envelope format and expose typed methods for each endpoint.
- Auth flows support login, refresh, and logout with cookie handling and token rotation expectations.
- Request guards prevent unauthorized calls while keeping public routes accessible.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
