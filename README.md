# Stock Management Application

> Enterprise-grade full-stack application for managing stock portfolios with real-time market data integration.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://www.docker.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Native Development](#native-development)
  - [Docker Development](#docker-development)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Performance & Optimization](#performance--optimization)
- [Security](#security)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Production-ready stock portfolio management system featuring:

- **Real-time Market Data**: Integration with Financial Modeling Prep API for live stock quotes
- **Portfolio Management**: CRUD operations with transaction history and performance tracking
- **Responsive UI**: Modern interface built with Ant Design
- **Multi-Environment**: Docker-based deployment supporting dev, staging, and production
- **Enterprise Patterns**: Follows SOLID principles, clean architecture, and industry best practices

## 🏗 Architecture

### System Design

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Client   │◄───────►│   NestJS API     │◄───────►│    MongoDB      │
│  (Port 5173)    │         │   (Port 3001)    │         │  (Port 27017)   │
│                 │         │                  │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        │                            │
        └────────────────┬───────────┘
                         │
                         ▼
              ┌─────────────────────┐
              │  Financial Modeling │
              │   Prep API (FMP)    │
              └─────────────────────┘
```

### Project Structure

```
stock-management/
├── apps/
│   ├── backend/                    # NestJS Application
│   │   ├── src/
│   │   │   ├── database/          # DB utilities & seeders
│   │   │   ├── portfolio/         # Portfolio domain module
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── schemas/      # Mongoose schemas
│   │   │   │   ├── portfolio.controller.ts
│   │   │   │   ├── portfolio.service.ts
│   │   │   │   └── portfolio.module.ts
│   │   │   ├── stocks/           # Stock API integration
│   │   │   │   ├── stocks.controller.ts
│   │   │   │   ├── stocks.service.ts
│   │   │   │   └── stocks.module.ts
│   │   │   ├── app.module.ts     # Root module
│   │   │   └── main.ts           # Entry point
│   │   ├── Dockerfile            # Multi-stage Docker build
│   │   ├── .env.example
│   │   ├── .env.production
│   │   └── package.json
│   │
│   └── frontend/                  # React Application
│       ├── src/
│       │   ├── components/       # Reusable UI components
│       │   ├── pages/           # Route-level components
│       │   ├── stores/          # MobX state stores
│       │   ├── services/        # API client services
│       │   ├── types/          # TypeScript definitions
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── Dockerfile          # Multi-stage Docker build
│       └── package.json
│
├── docker/                     # Docker & DevOps configurations
│   ├── docker-compose.dev.yml     # Development environment
│   ├── docker-compose.staging.yml # Staging environment
│   ├── docker-compose.prod.yml    # Production environment
│   ├── nginx.conf                 # Nginx configuration
│   ├── scripts/
│   │   └── mongo-init.sh         # MongoDB initialization
│   ├── .dockerignore
│   └── README.md
│
├── .vscode/                   # Editor configuration
├── Makefile                   # Command shortcuts
├── pnpm-workspace.yaml       # Monorepo configuration
├── biome.json                # Code quality rules
└── README.md
```

## 🛠 Tech Stack

### Backend
- **Framework**: NestJS 10 (Node.js + TypeScript)
- **Database**: MongoDB 7 with Mongoose ODM
- **Validation**: class-validator, class-transformer
- **API Integration**: Axios for HTTP requests
- **Architecture**: Modular design with dependency injection

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: MobX 6 (reactive programming)
- **UI Library**: Ant Design 5 (enterprise-grade components)
- **Routing**: React Router 6
- **Build Tool**: Vite 5 (fast bundling)
- **HTTP Client**: Axios with interceptors

### DevOps & Tooling
- **Package Manager**: pnpm (fast, disk-efficient)
- **Code Quality**: Biome (linting + formatting)
- **Containerization**: Docker + Docker Compose
- **Process Manager**: PM2 (production)
- **Reverse Proxy**: Nginx (production frontend)

### External Services
- **Financial Modeling Prep**: Real-time stock data API

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (or Docker for containerized setup)
- **MongoDB** >= 7.0 (not required for Docker setup)
- **FMP API Key**: Get from [Financial Modeling Prep](https://site.financialmodelingprep.com/developer/docs)

### Native Development

#### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd stock-management

# Install dependencies (automatically handles workspace)
pnpm install
```

#### 2. Configuration

```bash
# Create root environment file
cp .env.example .env

# Create backend environment file
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/stock-management
FMP_API_KEY=your_fmp_api_key_here
CORS_ORIGIN=http://localhost:5173
```

#### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS (Homebrew)
brew services start mongodb-community@7.0

# Linux (systemd)
sudo systemctl start mongod

# Manual
mongod --dbpath /path/to/data
```

**Option B: Docker MongoDB Only**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7-jammy
```

#### 4. Seed Database (Optional)

```bash
pnpm --filter backend seed
```

#### 5. Run Development Servers

```bash
# Start both backend and frontend
pnpm dev

# Or separately
pnpm backend:dev    # Backend: http://localhost:3001
pnpm frontend:dev   # Frontend: http://localhost:5173
```

### Docker Development

All Docker configurations are organized in the `docker/` directory for clean separation of DevOps from source code.

#### Quick Start

```bash
# Using Makefile (recommended)
make dev

# Or using docker-compose directly
docker-compose -f docker/docker-compose.dev.yml up -d

# View logs
make dev-logs
# or
docker-compose -f docker/docker-compose.dev.yml logs -f
```

#### Docker Directory Structure

```
docker/
├── docker-compose.dev.yml      # Development environment
├── docker-compose.staging.yml  # Staging environment
├── docker-compose.prod.yml     # Production environment
├── nginx.conf                  # Nginx configuration for production
├── scripts/
│   └── mongo-init.sh          # MongoDB initialization script
├── .dockerignore              # Docker ignore rules
└── README.md                  # Detailed Docker documentation
```

#### Makefile Commands

```bash
make help              # Show all available commands

# Development
make dev               # Start dev environment
make dev-build         # Rebuild and start dev
make dev-logs          # Show dev logs
make dev-down          # Stop dev environment

# Production
make prod              # Start production
make prod-build        # Rebuild production
make prod-logs         # Show production logs
make prod-down         # Stop production

# Staging
make staging           # Start staging
make staging-build     # Rebuild staging
make staging-logs      # Show staging logs
make staging-down      # Stop staging

# Database
make seed              # Seed sample data (6 stocks)
make db-clear          # Clear database
make db-backup         # Backup database
make db-restore        # Restore database

# Monitoring
make logs              # Show all logs
make ps                # Show containers
make stats             # Show resource usage
make health            # Health check all services

# Shell Access
make shell-backend     # Access backend container
make shell-frontend    # Access frontend container
make shell-db          # Access MongoDB shell

# Maintenance
make clean             # Remove containers & volumes
make clean-images      # Remove images too
make prune             # Clean unused resources
make restart           # Restart all services
```

#### Access Services

- **Development**
  - Frontend: http://localhost:5173
  - Backend: http://localhost:3001
  - API: http://localhost:3001/api
  - MongoDB: mongodb://localhost:27017

- **Production**
  - Application: http://localhost (or https://yourdomain.com)
  - Backend: http://localhost:3001
  - API: http://localhost:3001/api

- **Staging**
  - Application: http://localhost:8080
  - Backend: http://localhost:3001

#### Multi-Stage Dockerfiles

Both backend and frontend use optimized multi-stage builds:

**Backend (apps/backend/Dockerfile):**
- `base`: Node.js + pnpm
- `development`: Dev dependencies + hot reload + debug port
- `builder`: Compile TypeScript
- `production`: Production deps only + compiled code + non-root user

**Frontend (apps/frontend/Dockerfile):**
- `base`: Node.js + pnpm
- `development`: Dev dependencies + Vite dev server
- `builder`: Build static assets
- `production`: Nginx + built assets + compression + security headers

## 🌍 Deployment

### Docker-Based Multi-Environment Setup

All Docker configurations are in the `docker/` directory with separate compose files for each environment.

#### Environment Comparison

| Feature | Development | Staging | Production |
|---------|------------|---------|------------|
| **Compose File** | `docker/docker-compose.dev.yml` | `docker/docker-compose.staging.yml` | `docker/docker-compose.prod.yml` |
| **MongoDB Auth** | Disabled | Enabled | Enabled |
| **Hot Reload** | Yes | No | No |
| **Debug Port** | 9229 | No | No |
| **Frontend** | Vite dev (5173) | Nginx (8080) | Nginx (80/443) |
| **Optimization** | Fast rebuild | Production build | Production build |
| **Source Mounting** | Yes | No | No |

#### Development Environment
```bash
# Configuration in root .env
NODE_ENV=development
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=dev_password_here

# Start
make dev
# or
docker-compose -f docker/docker-compose.dev.yml up -d

# Features:
# - Hot reload for backend and frontend
# - Source code mounted as volumes
# - Debug port 9229 exposed
# - No MongoDB authentication
```

#### Staging Environment
```bash
# Configuration in root .env + apps/backend/.env.staging
NODE_ENV=staging
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=staging_password_here

# Start
make staging
# or
docker-compose -f docker/docker-compose.staging.yml up -d

# Features:
# - Production builds
# - MongoDB authentication
# - Runs on port 8080
# - Health checks enabled
```

#### Production Environment
```bash
# Configuration in root .env + apps/backend/.env.production
NODE_ENV=production
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=secure_production_password
VITE_API_URL=https://api.yourdomain.com/api

# Start
make prod
# or
docker-compose -f docker/docker-compose.prod.yml up -d

# Features:
# - Optimized production builds
# - Non-root containers
# - Nginx with compression & security headers
# - MongoDB authentication
# - Health checks with proper intervals
# - SSL/HTTPS ready
```

### Production Checklist

- [ ] Update environment variables with production values
- [ ] Change MongoDB credentials
- [ ] Configure FMP API key for production tier
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper CORS origins
- [ ] Enable MongoDB authentication
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting
- [ ] Review security headers

### Container Health Checks

All services include health checks for reliability:

- **MongoDB**: Database ping response (10s interval in dev, 30s in prod)
- **Backend**: HTTP health endpoint `/api/health` (30s interval)
- **Frontend**: Nginx/Vite status check (30s interval)

```bash
# Check all services health
make health

# Check container status
make ps

# Or manually with docker-compose
docker-compose -f docker/docker-compose.dev.yml ps

# Test health endpoints directly
curl http://localhost:3001/api/health    # Backend
curl http://localhost:5173               # Frontend (dev)
curl http://localhost/health             # Frontend (prod)
```

### Docker Features

#### Multi-Stage Builds
- **Small Images**: Production images exclude dev dependencies and source code
- **Fast Builds**: Layer caching optimizes rebuild time
- **Security**: Separate build and runtime stages minimize attack surface

#### Volume Strategy
- **Development**: Source code mounted for hot reload
- **Production**: Only persistent data (MongoDB)
- **Node Modules**: Named volumes for better performance

#### Networking
- Custom bridge network for service discovery
- Services communicate via service names (e.g., `http://backend:3001`)
- Only necessary ports exposed to host

#### Security
- Non-root users in all containers
- MongoDB authentication in staging/production
- Security headers in Nginx (XSS, CSRF, clickjacking protection)
- No debug ports in production
- Environment variables for secrets

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3001/api
Production:  https://api.yourdomain.com/api
```

### Portfolio Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/portfolio` | List all portfolio entries | - | `Portfolio[]` |
| GET | `/portfolio/:id` | Get specific entry | - | `Portfolio` |
| POST | `/portfolio` | Create new entry | `CreatePortfolioDto` | `Portfolio` |
| PUT | `/portfolio/:id` | Update entry | `UpdatePortfolioDto` | `Portfolio` |
| DELETE | `/portfolio/:id` | Delete entry | - | `204 No Content` |

### Stock Endpoints

| Method | Endpoint | Description | Query Params | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/stocks/:symbol/quote` | Get real-time quote | - | `StockQuote` |
| GET | `/stocks/search` | Search stocks | `q` (query string) | `SearchResult[]` |

### Data Models

#### Portfolio
```typescript
{
  _id: string;
  symbol: string;           // Stock ticker (e.g., "AAPL")
  companyName: string;      // Company name
  shares: number;           // Number of shares owned
  purchasePrice: number;    // Price per share at purchase
  purchaseDate?: string;    // ISO date string
  notes?: string;           // Optional notes
  createdAt: string;        // ISO date string
  updatedAt: string;        // ISO date string
}
```

#### StockQuote
```typescript
{
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  timestamp: number;
}
```

## 💻 Development Workflow

### Code Quality

```bash
# Lint code
pnpm lint

# Auto-fix issues
pnpm lint:fix

# Format code
pnpm format
```

### Database Management

```bash
# Seed sample data (6 stocks)
pnpm --filter backend seed

# Clear database
pnpm --filter backend db:clear

# Backup (Docker)
make db-backup

# Restore (Docker)
make db-restore
```

### VS Code Integration

Included configurations:
- Auto-format on save with Biome
- Automatic import organization
- Debug configuration for backend
- Recommended extensions

### Development Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start both services |
| `pnpm build` | Build for production |
| `pnpm lint` | Check code quality |
| `pnpm lint:fix` | Fix linting issues |
| `pnpm format` | Format all code |

### Module Development Pattern

#### Backend Module

1. Create schema: `apps/backend/src/module/schemas/entity.schema.ts`
2. Create DTOs: `apps/backend/src/module/dto/*.dto.ts`
3. Create service: `apps/backend/src/module/module.service.ts`
4. Create controller: `apps/backend/src/module/module.controller.ts`
5. Create module: `apps/backend/src/module/module.module.ts`
6. Register in `app.module.ts`

#### Frontend Component

1. Create types: `apps/frontend/src/types/index.ts`
2. Create store: `apps/frontend/src/stores/EntityStore.ts`
3. Create service: `apps/frontend/src/services/api.ts`
4. Create component: `apps/frontend/src/components/Entity.tsx`
5. Add route in `App.tsx`

## ⚡ Performance & Optimization

### Backend Optimizations

- **Database Indexing**: Indexed fields for faster queries
- **Connection Pooling**: MongoDB connection pool configuration
- **DTOs**: Request/response transformation and validation
- **Caching Strategy**: In-memory caching for frequently accessed data

### Frontend Optimizations

- **Code Splitting**: Route-based lazy loading
- **Bundle Optimization**: Vite's automatic chunking
- **MobX Reactions**: Efficient reactive state updates
- **Asset Optimization**: Compression and caching headers in Nginx

### Docker Optimizations

- **Multi-stage Builds**: Minimal production images (base + development + builder + production)
- **Layer Caching**: Package files copied before source code for optimal caching
- **Named Volumes**: node_modules in named volumes for better performance
- **Health Checks**: All services monitored with appropriate intervals
- **Gzip Compression**: Enabled in Nginx for production
- **Asset Caching**: Aggressive caching for static files
- **.dockerignore**: Reduces build context size
- **Non-root Users**: Security and performance optimization

## 🔒 Security

### Implemented Measures

- ✅ **Input Validation**: DTOs with class-validator
- ✅ **CORS Configuration**: Restricted origins
- ✅ **Environment Variables**: No hardcoded secrets
- ✅ **Security Headers**: XSS, CSRF protection in Nginx
- ✅ **Non-root Containers**: Docker security best practices
- ✅ **MongoDB Authentication**: User/password in production

### Security Checklist

- [ ] Enable HTTPS/TLS in production
- [ ] Implement rate limiting
- [ ] Add authentication middleware
- [ ] Set up API key rotation
- [ ] Configure firewall rules
- [ ] Enable MongoDB encryption at rest
- [ ] Implement audit logging
- [ ] Set up intrusion detection

## 🧪 Testing

### Structure (To be implemented)

```
apps/backend/src/
├── module/
│   ├── module.service.spec.ts
│   └── module.controller.spec.ts

apps/frontend/src/
├── components/
│   └── Component.test.tsx
```

### Commands (Planned)

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:cov
```

## 🐛 Troubleshooting

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose -f docker/docker-compose.dev.yml logs [service-name]

# Restart specific service
make restart-backend  # or restart-frontend

# Rebuild containers
make dev-build

# Remove and recreate
make dev-down
make dev
```

**Port conflicts:**
```bash
# Check what's using the port
lsof -ti:3001  # Backend
lsof -ti:5173  # Frontend dev
lsof -ti:27017 # MongoDB

# Kill the process
lsof -ti:3001 | xargs kill -9
```

**Build cache issues:**
```bash
# Clear Docker build cache
docker builder prune

# Rebuild without cache
docker-compose -f docker/docker-compose.dev.yml build --no-cache

# Or use Makefile
make clean
make dev-build
```

### MongoDB Issues

**Connection refused:**
```bash
# Check MongoDB is running
make ps

# Check MongoDB logs
docker-compose -f docker/docker-compose.dev.yml logs mongodb

# Restart MongoDB
docker-compose -f docker/docker-compose.dev.yml restart mongodb

# Access MongoDB shell
make shell-db
```

**Authentication failed (staging/prod):**
- Verify credentials in root `.env` match compose file
- Check `MONGODB_URI` format includes credentials and `authSource=admin`
- Ensure MongoDB initialization script completed:
  ```bash
  docker-compose -f docker/docker-compose.prod.yml logs mongodb | grep "initialization"
  ```

**Database not persisting:**
- Check named volumes exist: `docker volume ls`
- Verify volume mounts in docker-compose file
- Don't use `make clean` unless you want to delete data

### API Issues

**Rate limit exceeded:**
- FMP free tier: 250 requests/day
- Solution: Upgrade API tier or implement caching

**CORS errors:**
- Check `CORS_ORIGIN` in backend `.env`
- Verify frontend URL matches configured origin

### Build Failures

**pnpm install fails:**
```bash
# Clear cache
pnpm store prune

# Remove node_modules
rm -rf node_modules apps/*/node_modules

# Reinstall
pnpm install
```

**Docker build fails:**
```bash
# Clear build cache
docker builder prune -af

# Rebuild from scratch
docker-compose -f docker/docker-compose.dev.yml build --no-cache

# Or
make clean
make dev-build

# Check Docker disk space
docker system df
```

**Volume permission issues:**
```bash
# On Linux, fix permissions
sudo chown -R $USER:$USER apps/

# Or rebuild with correct user
docker-compose -f docker/docker-compose.dev.yml down -v
docker-compose -f docker/docker-compose.dev.yml up -d
```

## 📊 Monitoring & Logging

### Container Logs

```bash
# All services
make logs

# Specific service with Makefile shortcuts
make dev-logs      # Development logs
make prod-logs     # Production logs
make staging-logs  # Staging logs

# Or docker-compose directly
docker-compose -f docker/docker-compose.dev.yml logs -f backend
docker-compose -f docker/docker-compose.dev.yml logs -f frontend
docker-compose -f docker/docker-compose.dev.yml logs -f mongodb

# Last N lines
docker-compose -f docker/docker-compose.dev.yml logs --tail=100 backend

# Follow logs for specific service
docker-compose -f docker/docker-compose.dev.yml logs -f --tail=50 backend
```

### Resource Usage

```bash
# Real-time stats
make stats
# or
docker stats

# Container status
make ps
# or
docker-compose -f docker/docker-compose.dev.yml ps

# Disk usage
docker system df

# Detailed container info
docker inspect stock-mgmt-backend-dev
```

### Health Monitoring

```bash
# Check all services health
make health

# Individual health checks
curl http://localhost:3001/api/health    # Backend
curl http://localhost:5173               # Frontend (dev)
curl http://localhost/health             # Frontend (prod)

# MongoDB health
docker-compose -f docker/docker-compose.dev.yml exec mongodb mongosh --eval "db.runCommand('ping')"

# Container health status
docker ps --format "table {{.Names}}\t{{.Status}}"
```

### Database Operations in Docker

```bash
# Seed sample data
make seed

# Clear database
make db-clear

# Backup database
make db-backup

# Restore database
make db-restore

# Access MongoDB shell
make shell-db

# Or manually
docker-compose -f docker/docker-compose.dev.yml exec mongodb mongosh stock-management

# Run MongoDB commands
docker-compose -f docker/docker-compose.dev.yml exec mongodb mongosh stock-management --eval "db.portfolios.find()"
```

## 🎯 Best Practices Implemented

### Code Quality
- TypeScript strict mode throughout
- Biome for consistent formatting
- DTOs for data validation
- Comprehensive error handling
- Clear separation of concerns

### Architecture
- SOLID principles
- Dependency injection (NestJS)
- Repository pattern
- Service layer abstraction
- Clean architecture

### DevOps
- Multi-stage Docker builds
- Environment-specific configurations
- Health checks for all services
- Automated database initialization
- Container orchestration

### Performance
- Database indexing strategy
- Efficient state management
- Lazy loading patterns
- Asset optimization
- Compression enabled

## 📖 Additional Documentation

- [Docker Documentation](./docker/README.md) - Comprehensive Docker guide
- [Development Guide](./DEVELOPMENT.md) - Detailed development workflows
- [Database Seeding](./apps/backend/src/database/) - Sample data scripts

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [React](https://react.dev/) - UI library
- [Ant Design](https://ant.design/) - Enterprise UI components
- [Financial Modeling Prep](https://site.financialmodelingprep.com/) - Stock data API

---

**Built with ❤️ for modern full-stack development**
