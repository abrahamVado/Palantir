# Codex Task: Dashboard Shell & Navigation

## Objective
Create the protected dashboard layout with navigation and user context that powers admin workflows.

## Scope
- Build a layout with shadcn/ui navigation components linking to Users, Teams, Permissions, and Roles sections.
- Display the authenticated principal details from `/v1/user` and show unread notification counts from `/v1/notifications`.
- Ensure the shell is protected by session guards and usable across admin screens.

## Acceptance Criteria
- Dashboard routes are inaccessible without authentication and reuse a consistent shell layout.
- Navigation reflects permission-aware visibility for admin sections.
- User info and notification counts render from live API responses.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
- [Admin Permission Slugs](../../../permissions/admin-access/README.md)
