# Codex Task: Project Scaffolding

## Objective
Set up the baseline Next.js 14.2.x TypeScript project using pnpm on Node.js 20 with Tailwind CSS and shadcn/ui so the frontend aligns with the established standards.

## Scope
- Generate the app with `pnpm dlx create-next-app@14.2.11` configured for SSR/ISR.
- Configure Tailwind CSS and run shadcn/ui setup scripts; document component paths and aliases.
- Establish environment variable handling for the backend origin `https://api.softwaremia.com` and public path defaults without hard-coding values.

## Acceptance Criteria
- Repository contains the scaffolded Next.js project locked to 14.2.x with pnpm lockfile.
- Tailwind and shadcn/ui are installed and documented with generated directories/aliases.
- Runtime configuration reads backend origin from environment variables and avoids hard-coded URLs.

## References
- [Next.js Frontend Delivery Plan](../README.md)
- [Frontend Standards Decisions](../../../decisions/frontend-standards/README.md)
