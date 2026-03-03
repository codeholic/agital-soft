FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build:web && pnpm build:api

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "apps/api/dist/main"]
