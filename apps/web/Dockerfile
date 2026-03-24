FROM node:24-bookworm AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY apps/web ./apps/web
COPY packages ./packages
RUN pnpm install --frozen-lockfile=false && pnpm --filter @economy/web build

FROM node:24-bookworm
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web .
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
