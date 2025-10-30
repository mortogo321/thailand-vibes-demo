# Docker Configuration

This directory contains all Docker and DevOps-related configurations for the Stock Management Application.

## Directory Structure

```
docker/
├── docker-compose.dev.yml      # Development environment
├── docker-compose.staging.yml  # Staging environment
├── docker-compose.prod.yml     # Production environment
├── nginx.conf                  # Nginx configuration for production frontend
├── scripts/
│   └── mongo-init.sh          # MongoDB initialization script
├── .dockerignore              # Docker ignore rules
└── README.md                  # This file
```

## Quick Start

### Development
```bash
# From project root
make dev

# Or directly with docker-compose
docker-compose -f docker/docker-compose.dev.yml up -d
```

### Production
```bash
# From project root
make prod

# Or directly with docker-compose
docker-compose -f docker/docker-compose.prod.yml up -d
```

### Staging
```bash
# From project root
make staging

# Or directly with docker-compose
docker-compose -f docker/docker-compose.staging.yml up -d
```

## Environment-Specific Configurations

### Development (docker-compose.dev.yml)
- **MongoDB**: No authentication, exposed on 27017
- **Backend**: Hot reload enabled, debug port 9229
- **Frontend**: Vite dev server with HMR on port 5173
- **Volumes**: Source code mounted for live updates

### Staging (docker-compose.staging.yml)
- **MongoDB**: Authentication enabled
- **Backend**: Production build with staging config
- **Frontend**: Nginx serving production build on port 8080
- **Purpose**: Pre-production testing

### Production (docker-compose.prod.yml)
- **MongoDB**: Full authentication and security
- **Backend**: Optimized production build with health checks
- **Frontend**: Nginx with caching, compression, and security headers
- **SSL**: Ready for HTTPS configuration

## Services

### MongoDB
- **Image**: mongo:7-jammy
- **Ports**: 27017 (dev), internal only (prod/staging)
- **Health Check**: Database ping
- **Volumes**: Persistent data storage

### Backend (NestJS)
- **Build**: Multi-stage Dockerfile in `apps/backend/`
- **Ports**: 3001 (all environments)
- **Health Check**: `/api/health` endpoint
- **Environment**: Loaded from `.env` files

### Frontend (React + Vite)
- **Build**: Multi-stage Dockerfile in `apps/frontend/`
- **Ports**: 5173 (dev), 80 (prod), 8080 (staging)
- **Server**: Vite dev server (dev), Nginx (prod/staging)
- **Health Check**: HTTP status check

## Nginx Configuration

Production frontend uses Nginx with:
- **Gzip Compression**: Text and asset compression
- **Security Headers**: XSS, CSRF, clickjacking protection
- **Caching**: Aggressive caching for static assets
- **SPA Routing**: Client-side routing support
- **API Proxy**: Proxies `/api` requests to backend

## MongoDB Initialization

Production and staging environments run `scripts/mongo-init.sh`:
- Creates application database
- Creates application user with limited privileges
- Sets up indexes for performance

## Health Checks

All services include health checks:

```bash
# Check all services
make health

# Or manually
curl http://localhost:3001/api/health  # Backend
curl http://localhost:5173             # Frontend (dev)
curl http://localhost/health           # Frontend (prod)
```

## Volumes

### Development
- Source code mounted for hot reload
- Node modules in named volumes for performance
- MongoDB data persisted

### Production
- MongoDB data only
- No source code mounting
- Minimal attack surface

## Networking

All services communicate over a custom bridge network:
- Service discovery via service names
- Isolated from host network (except exposed ports)
- Backend accessible to frontend via `http://backend:3001`

## Best Practices

1. **Multi-stage Builds**: Separate build and runtime stages
2. **Non-root Users**: Containers run as non-root for security
3. **Health Checks**: All services have health checks
4. **Environment Variables**: Sensitive data via env files
5. **Layer Caching**: Optimized layer order for faster builds
6. **Named Volumes**: Persistent data management

## Makefile Commands

All commands available via Makefile (see root `Makefile`):

```bash
make help          # Show all commands
make dev           # Start dev environment
make prod          # Start production
make staging       # Start staging
make logs          # View logs
make ps            # Show containers
make health        # Health check
make clean         # Remove all containers/volumes
```

## Troubleshooting

### Port Conflicts
```bash
# Check what's using a port
lsof -ti:3001

# Kill the process
lsof -ti:3001 | xargs kill -9
```

### Container Issues
```bash
# View logs
docker-compose -f docker/docker-compose.dev.yml logs backend

# Restart service
docker-compose -f docker/docker-compose.dev.yml restart backend

# Rebuild from scratch
docker-compose -f docker/docker-compose.dev.yml up -d --build --force-recreate
```

### MongoDB Issues
```bash
# Access MongoDB shell
make shell-db

# Check MongoDB logs
docker-compose -f docker/docker-compose.dev.yml logs mongodb
```

## Security Considerations

### Development
- No authentication (for ease of development)
- Debug ports exposed
- Source code mounted

### Production
- MongoDB authentication required
- No debug ports
- Non-root containers
- Security headers in Nginx
- No source code in containers
- Environment variables for secrets

## Performance Tuning

### Build Performance
- `.dockerignore` reduces build context
- Layer caching optimizes rebuilds
- Multi-stage builds reduce image size

### Runtime Performance
- Node modules in named volumes (dev)
- Gzip compression enabled
- Asset caching configured
- Connection pooling for MongoDB

## Maintenance

### Backup Database
```bash
make db-backup
```

### Restore Database
```bash
make db-restore
```

### Clean Up
```bash
# Remove containers and volumes
make clean

# Remove images too
make clean-images

# Prune unused resources
make prune
```

## CI/CD Integration

These Docker configurations are CI/CD-ready:

```yaml
# Example GitHub Actions
- name: Build and test
  run: |
    docker-compose -f docker/docker-compose.dev.yml up -d
    docker-compose -f docker/docker-compose.dev.yml exec -T backend pnpm test

- name: Build production images
  run: |
    docker-compose -f docker/docker-compose.prod.yml build
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
