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
- **MongoDB** on `localhost:27017` (single-node replica set, required for multi-document transactions)

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

## Stop infrastructure

```bash
docker-compose down
```

## URLs

| Service | URL                           |
|---------|-------------------------------|
| Web     | http://localhost:5173         |
| GraphQL | http://localhost:3000/graphql |

## Seed data

Load 100 sample products into the database (requires infrastructure to be running):

```bash
cd apps/api
pnpm run seed
```

### Test users

| Name            | Email                    | Password |
|-----------------|--------------------------|----------|
| Max Mustermann  | max@agital.online        | pass1    |
| Anna Schmidt    | anna@agital.online       | pass2    |
| Klaus Weber     | klaus@agital.online      | pass3    |
| Maria Müller    | maria@agital.online      | pass4    |
| Thomas Fischer  | thomas@agital.online     | pass5    |

## Deployment (Railway + MongoDB Atlas)

1. Create a free MongoDB cluster at [mongodb.com/atlas](https://mongodb.com/atlas) and copy the connection string.
2. Create a new project at [railway.app](https://railway.app) → **Deploy from GitHub repo**.
3. Set environment variables in Railway:

   | Variable      | Value                                      |
   |---------------|--------------------------------------------|
   | `MONGODB_URL` | connection string from Atlas               |
   | `JWT_SECRET`  | any random string                          |

4. Railway will build and deploy using the `Dockerfile` automatically.
5. After the first deploy, run the seed script once via the [Railway CLI](https://docs.railway.com/guides/cli):
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   railway run node apps/api/dist/seed
   ```
