# //1.- Start from a compact Node 20 image with pnpm enabled via Corepack.
FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# //2.- Install dependencies using the locked versions to ensure reproducible builds.
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# //3.- Build the Next.js application while allowing the backend origin to be injected at build time.
FROM base AS builder
ARG BACKEND_ORIGIN=https://api.softwaremia.com
ENV NEXT_PUBLIC_API_BASE_URL=${BACKEND_ORIGIN}
ENV API_BASE_URL=${BACKEND_ORIGIN}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# //3.1.- Ensure a public directory exists so downstream stages can copy static assets.
RUN mkdir -p public
RUN pnpm run build

# //4.- Produce a lean runtime image with the compiled assets and configurable backend origin.
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate
ARG BACKEND_ORIGIN=https://api.softwaremia.com
ENV NEXT_PUBLIC_API_BASE_URL=${BACKEND_ORIGIN}
ENV API_BASE_URL=${BACKEND_ORIGIN}
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]
