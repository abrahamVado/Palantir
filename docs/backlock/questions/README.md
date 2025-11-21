# Open Questions for Frontend Scope

Reference: settled answers live in [Frontend Standards Decisions](../../decisions/frontend-standards/README.md). Use this list to track any remaining items that truly need product/engineering input.

## Resolved items
1. **Framework and tooling:** Next.js 14.2.x scaffolded with **pnpm v9+** on **Node.js 20**; lock the scaffold using `pnpm dlx create-next-app@14.2.11`.
2. **Backend origin:** Always call `https://api.softwaremia.com` for all environments; no separate staging/production hosts defined yet.
3. **Token storage and lifetimes:** Access and refresh tokens arrive as Secure, HttpOnly, SameSite=Strict cookies. Access token ~15 minutes; refresh ~7 days with rotation on refresh; send `credentials: 'include'` for API calls.
4. **Authentication surface:** UI exposes login only for now. Registration stays hidden, but leave a documented toggle/placeholder so `/v1/auth/register` can be enabled later without redesign.
5. **Permission gating:** Admin screens should check permission slugs from `/v1/user` and hide/disable controls accordingly (see permissions map in `docs/permissions/admin-access/README.md`).
6. **Branding:** Use shadcn defaults with a black/white base palette; no extra assets beyond the existing overridable `--accent-color` token.
7. **Internationalization:** Out of scope; no Next.js `i18n` setup required initially.
8. **Notifications:** Manual refresh is sufficient; do not add polling or websockets yet.
9. **Hosting/deployment:** Target Dockerized `next build` + `next start` with `output: 'standalone'`; avoid Vercel-specific features.

## Pending items
- None at this time. Reopen this section if new requirements emerge (e.g., additional branding assets or future i18n needs).
