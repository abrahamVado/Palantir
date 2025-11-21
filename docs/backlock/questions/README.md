# Open Questions for Frontend Scope

The following items need confirmation to avoid assumptions while planning the Next.js + shadcn/ui implementation against the Larago backend:

1. What Next.js version and package manager should we standardize on (e.g., `create-next-app` version, npm vs pnpm vs yarn)?
2. What is the backend base URL for local and deployed environments, and are there distinct staging/production instances?
3. How should access and refresh tokens be stored on the client (http-only cookies, memory, or localStorage), and what are the token lifetime/rotation expectations?
4. Should registration be exposed in the UI, or is authentication limited to login for existing users only?
5. Which permission slugs gate each admin screen (users, roles, permissions, teams), and should the UI hide or disable controls based on the principal’s permissions from `/v1/user`?
6. Are there brand guidelines, typography, or color tokens to apply on top of shadcn/ui blocks for the landing and dashboard pages?
7. Do we need internationalization/localization support from the outset (e.g., Next.js `app` router `i18n` configuration)?
8. Should the dashboard surface notifications in real time (polling or websockets), or is manual refresh sufficient?
9. Are there constraints on hosting/deployment (e.g., Vercel, containerized Next.js server) that affect routing mode or output configuration?
