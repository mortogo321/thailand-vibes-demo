# Stock Portfolio Management App

Full-stack stock portfolio tracker with live market data, built as a pnpm monorepo with a NestJS API and a React dashboard.

## What's inside

- **Backend** (`apps/backend`): NestJS + MongoDB (Mongoose) API with `Portfolio` and `Stocks` modules — CRUD for portfolio holdings plus live quote/search lookups against the Financial Modeling Prep API
- **Frontend** (`apps/frontend`): React + Ant Design dashboard with MobX stores for portfolio and stock state, a portfolio detail page, and modals for adding holdings/searching stocks
- Database seed/clear scripts for sample portfolio data
- Multi-environment Docker setup (dev/staging/prod) with Nginx for the production frontend and Mongo init scripts

## Tech stack

- **Backend**: NestJS, MongoDB + Mongoose, class-validator
- **Frontend**: React, MobX, Ant Design, Vite
- **Tooling**: pnpm workspaces, Biome, Docker Compose, Make

## Quickstart

### Docker (recommended)

```bash
git clone git@github.com:mortogo321/thailand-vibes-demo.git
cd thailand-vibes-demo
cp .env.example .env
make dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

### Native development

```bash
pnpm install
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
# set FMP_API_KEY in apps/backend/.env (https://site.financialmodelingprep.com/developer/docs)

pnpm dev   # runs backend + frontend concurrently
```

## Structure

```
apps/
├── backend/
│   └── src/
│       ├── portfolio/   # Portfolio CRUD (schemas, DTOs, controller/service)
│       ├── stocks/      # Stock quote/search via Financial Modeling Prep
│       └── database/    # Seed and clear scripts
└── frontend/
    └── src/
        ├── pages/        # Portfolio and stock detail pages
        ├── components/   # Modals (add holding, search stock)
        ├── stores/       # MobX stores
        └── services/     # API client
docker/                   # Per-environment Docker Compose files, Nginx config
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio` | List portfolio entries |
| GET | `/portfolio/:id` | Get a portfolio entry |
| POST | `/portfolio` | Create a portfolio entry |
| PUT | `/portfolio/:id` | Update a portfolio entry |
| DELETE | `/portfolio/:id` | Delete a portfolio entry |
| GET | `/stocks/:symbol/quote` | Real-time stock quote |
| GET | `/stocks/search?q=` | Search stocks |

## Make commands

```bash
make dev / make staging / make prod   # start an environment
make seed                             # seed sample portfolio data
make logs / make ps / make health     # observability
make clean                            # remove containers and volumes
```
