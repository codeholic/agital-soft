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

## Stop infrastructure

```bash
docker-compose down
```
