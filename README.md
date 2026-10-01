# Stock Portfolio Management App

![CI](https://github.com/mortogo321/thailand-vibes-demo/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Bun](https://img.shields.io/badge/runtime-bun%201.4.2-black)
![Node](https://img.shields.io/badge/node-26.10-blue)

Full-stack stock portfolio tracker with live market data, built as a bun monorepo with a NestJS API and a React dashboard.

## What's inside

- **Backend** (`apps/backend`): NestJS 12 + MongoDB (Mongoose 9) API with `Portfolio` and `Stocks` modules — CRUD for portfolio holdings plus live quote/search lookups against the Financial Modeling Prep API. Helmet, rate-limiting, strict validation, `GET /api/health`.
- **Frontend** (`apps/frontend`): React 19 + Ant Design 6 dashboard with MobX 7 stores for portfolio and stock state, a portfolio detail page, and modals for adding holdings/searching stocks. Vitest-covered stores/services.
- Database seed/clear scripts for sample portfolio data
- Multi-environment Docker setup (dev/staging/prod) with Nginx for the production frontend and Mongo init scripts

## Tech stack

- **Backend**: NestJS 12, MongoDB + Mongoose 9, class-validator, Helmet, Throttler, Axios (10s timeout)
- **Frontend**: React 19, MobX 7, Ant Design 6, Vite 8, Vitest 5, Axios
- **Tooling**: bun 1.4.2 workspaces, Biome 2.5, Docker Compose, Make

### Pinned runtimes

| Component | Pin |
|-----------|-----|
| bun | 1.4.2 |
| node (backend runtime) | 26.10-alpine |
| nginx (frontend runtime) | 1.29.8-alpine |
| mongo | 8.2.11-noble |
| TypeScript | ~5.9.3 (pinned: v7 has no verified build story with this toolchain) |
| @vitejs/plugin-react | 5.x (pinned: v6 breaks vitest 5 via vite `./internal`) |

## Quickstart

### Docker (recommended)

```bash
git clone https://github.com/mortogo321/thailand-vibes-demo.git
cd thailand-vibes-demo
cp .env.example .env
make dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health: http://localhost:3001/api/health

### Native development

```bash
bun install
cp .env.example .env
cp apps/backend/.env.example apps/backend/.env
# set FMP_API_KEY in apps/backend/.env (https://site.financialmodelingprep.com/developer/docs)

bun run dev   # runs backend + frontend concurrently
```

## Structure

```
apps/
├── backend/
│   └── src/
│       ├── health/        # GET /api/health
│       ├── portfolio/     # Portfolio CRUD (schemas, DTOs, controller/service)
│       ├── stocks/        # Stock quote/search via Financial Modeling Prep
│       └── database/      # Seed and clear scripts
└── frontend/
    └── src/
        ├── pages/        # Portfolio and stock detail pages
        ├── components/   # Modals (add holding, search stock)
        ├── stores/       # MobX stores
        └── services/     # API client (VITE_API_URL-aware, 10s timeout)
docker/                   # Per-environment Docker Compose files, Nginx config
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
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

## Quality gates

```bash
bun run lint        # biome check
bun run typecheck   # strict tsc (backend + frontend)
bun run test        # jest (backend) + vitest (frontend)
bun run build       # nest build + vite build
```

## License

MIT — see [LICENSE](./LICENSE).
