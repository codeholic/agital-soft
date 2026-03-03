# agital.soft GmbH — Online Shop

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- [nvm](https://github.com/nvm-sh/nvm)
- [pnpm](https://pnpm.io/installation)

## Setup

```bash
nvm use 20
pnpm install
```

## Start infrastructure

```bash
docker-compose up -d
```

This starts:
- **MongoDB** on `localhost:27017`
- **MinIO** (S3-compatible storage) on `localhost:9000` (API) and `localhost:9001` (web UI)

## Start applications

In two separate terminals:

```bash
# Terminal 1 — API
nvm use 20
pnpm run dev:api
```

```bash
# Terminal 2 — Web
nvm use 20
pnpm run dev:web
```

## URLs

| Service       | URL                            |
|---------------|-------------------------------|
| Web           | http://localhost:5173          |
| GraphQL       | http://localhost:3000/graphql  |
| MinIO console | http://localhost:9001          |

MinIO credentials: `minioadmin` / `minioadmin`

## Stop infrastructure

```bash
docker-compose down
```
