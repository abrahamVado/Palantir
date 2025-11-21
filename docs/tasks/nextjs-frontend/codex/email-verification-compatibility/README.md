# Codex Task: Email Verification Compatibility

## Objective
Support email verification flows so users can handle verification links and resend requests within the frontend.

## Scope
- Handle verification links for `/email/verify/{id}/{hash}` with appropriate success and error states.
- Implement resend flow for `/email/verification-notification`, including throttling feedback for HTTP 429 responses.
- Keep UI states in sync with backend envelope responses.

## Acceptance Criteria
- Verification link handling shows clear success or failure messaging and respects backend status codes.
- Resend flow surfaces throttling errors and confirms successful requests.
- UI states remain consistent after verification or resend actions.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
