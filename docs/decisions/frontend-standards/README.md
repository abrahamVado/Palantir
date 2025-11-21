# Frontend Standards Decisions

## 1. Next.js version and package manager
- **Next.js:** Standardize on the current stable 14.2 release line for long-term support and compatibility with the App Router. Install with `pnpm dlx create-next-app@14.2.11` to lock the scaffolded project to this version.
- **Package manager:** Use **pnpm** (v9+) for deterministic installs, workspace support, and faster CI. Check `pnpm-lock.yaml` into source control.
- **Node runtime:** Target Node.js 20 LTS to align with Next.js 14 support and Docker base images.

## 2. Backend base URL
- Use a single backend origin for all environments: `https://api.softwaremia.com`.
- Local development calls the same URL; no separate staging/production hosts are currently defined.

## 3. Token handling strategy
- **Storage:** Issue both access and refresh tokens as `Secure`, `HttpOnly`, `SameSite=Strict` cookies from the backend. Avoid `localStorage` to reduce XSS risk; keep access token out of JavaScript-readable storage. Client-side API calls rely on `fetch`/`axios` with `credentials: 'include'`.
- **Lifetimes:** Access token ~15 minutes; refresh token ~7 days.
- **Rotation:** Rotate the refresh token on every refresh, invalidating prior refresh tokens, and also rotate the access token on refresh to preserve short-lived access.
- **Logout:** On logout, clear both cookies server-side and client-side (by setting expired cookies) to prevent reuse.

## 4. Authentication surface
- UI should expose **login only** for existing users. Registration is suppressed because users will be provisioned externally for now.

## 5. Permission gating
- Admin screens check permission slugs returned by `/v1/user` and hide or disable controls the user lacks. See the dedicated permission map in `docs/permissions/admin-access/README.md`.

## 6. Brand and theming
- Base UI on shadcn/ui with an overridable CSS custom property `--accent-color` applied to primary components (buttons, links, focus rings). Default to a neutral blue, but allow runtime overrides (e.g., via theme provider or global stylesheet) to match brand needs.

## 7. Internationalization
- i18n is **out of scope** for the initial release; no Next.js `i18n` or localization setup is required now.

## 8. Notifications behavior
- Manual refresh is sufficient; do not implement polling or WebSocket subscriptions. Provide a visible refresh control or rely on page reloads.

## 9. Hosting and deployment constraints
- Target Dockerized deployment of the Next.js app using the `next build` + `next start` production server with `output: 'standalone'`. Avoid Vercel-specific features and ensure environment variables are supplied via container runtime.
