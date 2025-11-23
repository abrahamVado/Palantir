# Larago Frontend Shell

A Next.js 14.2 TypeScript app scaffolded with pnpm, Tailwind CSS, and shadcn/ui to deliver the Larago landing, login, and admin shell experiences. The UI leans on cookie-based authentication against the shared backend origin.

## Quickstart
1. Install dependencies with pnpm 9+: `pnpm install`
2. Run the dev server on Node.js 20: `pnpm dev`
3. Visit http://localhost:3000 to view the landing page and `/login` for the auth form.

## Docker
- Build the production image from the `frontend` directory: `docker build -t larago-frontend .`
- Run the container while pointing at your backend origin: `docker run -p 3000:3000 -e BACKEND_ORIGIN=https://api.softwaremia.com larago-frontend`
- Override the backend at deploy time by setting `BACKEND_ORIGIN` (applies to both build and runtime); it flows into `NEXT_PUBLIC_API_BASE_URL` and `API_BASE_URL` inside the container.

## Docker Compose
- From the repository root, run `docker compose up --build` to build and start the frontend container defined in `docker-compose.yml`.
- Override the backend origin with `BACKEND_ORIGIN=<your-backend>` and change the host port with `PORT=<host-port>` when invoking `docker compose`.
- The compose file reuses the frontend Dockerfile and exposes port 3000 in the container for `next start`.

## Configuration
- `NEXT_PUBLIC_API_BASE_URL` (client + server): overrides the backend origin. Defaults to `https://api.softwaremia.com` when unset.
- `API_BASE_URL` (server-only fallback): optional alternate origin for server components.

Both values are normalized to avoid trailing slashes and are reused by the shared API client.

## Included Foundations
- shadcn/ui base styles with button, card, input, and label primitives ready for page builds.
- `app/page.tsx` provides a landing view summarizing required workflows and linking to login.
- `app/login/page.tsx` posts credentials to `/v1/next-auth/login` with `credentials: "include"` via the shared client.
- `lib/http-client.ts` reads ADR-003 envelopes and raises structured errors for form handling.
- `lib/auth.ts` centralizes login/logout/user fetch helpers for upcoming protected routes.

## Next.js-friendly authentication endpoints

The frontend is wired to the backend at `https://api.softwaremia.com` and consumes the Next.js-compatible authentication routes that issue secure cookies while also returning tokens for hydration:

- `POST /v1/next-auth/login` sets `next_access_token` and `next_refresh_token` HttpOnly cookies and returns the pair in the JSON body.
- `POST /v1/next-auth/refresh` rotates the refresh token via the cookie fallback or a `refresh_token` body override and returns the updated pair.
- `POST /v1/next-auth/logout` clears both cookies and revokes the provided tokens when supplied.

When calling these endpoints from the browser, use `fetch` with `credentials: "include"` so cookies are preserved, then hydrate any client state using the token pair returned in the response body.

## Next Steps
- Add dashboard and admin CRUD routes that load the principal via `/v1/user` before rendering protected layouts.
- Wire notifications listing and mark-as-read controls to `/v1/notifications` using the existing client.
- Layer permission-aware UI states around the `/admin` resources using the returned permission slugs.
