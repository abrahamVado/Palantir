# Codex Task: Resource Management Screens

## Objective
Implement CRUD experiences for Users, Roles, Permissions, and Teams aligned with backend pagination and validation behaviors.

## Scope
- Build list/create/update/delete flows for Users, Roles, Permissions, and Teams using their `/admin/*` endpoints with pagination controls for `page` and `per_page`.
- Use shadcn form primitives and surface backend envelope validation errors within forms.
- Apply permission gating per section using the slugs from `/v1/user`.

## Acceptance Criteria
- Each admin section supports paginated lists and gated CRUD operations respecting view/manage slugs.
- Forms handle validation errors gracefully and reflect backend responses.
- API interactions avoid unauthorized calls for sections the user cannot view or manage.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
- [Admin Permission Slugs](../../../permissions/admin-access/README.md)
