# Codex Task: Notifications Experience

## Objective
Provide notification list and mark-as-read functionality that respects backend pagination and envelope responses.

## Scope
- Build a notifications list view using `/v1/notifications` with pagination controls.
- Implement mark-as-read via `/v1/notifications/{id}` and update unread counts in the UI.
- Keep refresh manual; no polling or websockets.

## Acceptance Criteria
- Users can paginate through notifications and see accurate read/unread states.
- Marking a notification as read updates counts and list state without requiring a full page reload.
- API errors surface clearly while respecting manual refresh expectations.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
