.PHONY: help dev prod staging build clean logs ps restart seed

# Colors for output
RED=\033[0;31m
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo '${YELLOW}Stock Management Application - Docker Commands${NC}'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "${GREEN}%-20s${NC} %s\n", $$1, $$2}'

# Development
dev: ## Start development environment
	@echo "${GREEN}Starting development environment...${NC}"
	docker-compose -f docker/docker-compose.dev.yml up -d
	@echo "${GREEN}Development environment started!${NC}"
	@echo "${YELLOW}Backend:  http://localhost:3001${NC}"
	@echo "${YELLOW}Frontend: http://localhost:5173${NC}"
	@echo "${YELLOW}MongoDB:  mongodb://localhost:27017${NC}"

dev-build: ## Build and start development environment
	@echo "${GREEN}Building development environment...${NC}"
	docker-compose -f docker/docker-compose.dev.yml up -d --build

dev-logs: ## Show development logs
	docker-compose -f docker/docker-compose.dev.yml logs -f

dev-down: ## Stop development environment
	@echo "${RED}Stopping development environment...${NC}"
	docker-compose -f docker/docker-compose.dev.yml down

# Production
prod: ## Start production environment
	@echo "${GREEN}Starting production environment...${NC}"
	docker-compose -f docker/docker-compose.prod.yml up -d
	@echo "${GREEN}Production environment started!${NC}"
	@echo "${YELLOW}Application: http://localhost${NC}"

prod-build: ## Build and start production environment
	@echo "${GREEN}Building production environment...${NC}"
	docker-compose -f docker/docker-compose.prod.yml up -d --build

prod-logs: ## Show production logs
	docker-compose -f docker/docker-compose.prod.yml logs -f

prod-down: ## Stop production environment
	@echo "${RED}Stopping production environment...${NC}"
	docker-compose -f docker/docker-compose.prod.yml down

# Staging
staging: ## Start staging environment
	@echo "${GREEN}Starting staging environment...${NC}"
	docker-compose -f docker/docker-compose.staging.yml up -d
	@echo "${GREEN}Staging environment started!${NC}"
	@echo "${YELLOW}Application: http://localhost:8080${NC}"

staging-build: ## Build and start staging environment
	@echo "${GREEN}Building staging environment...${NC}"
	docker-compose -f docker/docker-compose.staging.yml up -d --build

staging-logs: ## Show staging logs
	docker-compose -f docker/docker-compose.staging.yml logs -f

staging-down: ## Stop staging environment
	@echo "${RED}Stopping staging environment...${NC}"
	docker-compose -f docker/docker-compose.staging.yml down

# Database
seed: ## Seed development database with sample data
	@echo "${GREEN}Seeding database...${NC}"
	docker-compose -f docker/docker-compose.dev.yml exec backend pnpm seed

db-clear: ## Clear development database
	@echo "${RED}Clearing database...${NC}"
	docker-compose -f docker/docker-compose.dev.yml exec backend pnpm db:clear

db-backup: ## Backup development database
	@echo "${GREEN}Backing up database...${NC}"
	docker-compose -f docker/docker-compose.dev.yml exec mongodb mongodump --db stock-management --out /data/backup
	@echo "${GREEN}Backup completed!${NC}"

db-restore: ## Restore development database
	@echo "${GREEN}Restoring database...${NC}"
	docker-compose -f docker/docker-compose.dev.yml exec mongodb mongorestore --db stock-management /data/backup/stock-management
	@echo "${GREEN}Restore completed!${NC}"

# Monitoring
logs: ## Show logs for all services
	docker-compose -f docker/docker-compose.dev.yml logs -f

ps: ## Show running containers
	docker-compose -f docker/docker-compose.dev.yml ps

stats: ## Show container stats
	docker stats

# Cleanup
clean: ## Remove all containers, volumes, and images
	@echo "${RED}Cleaning up all Docker resources...${NC}"
	docker-compose -f docker/docker-compose.dev.yml down -v
	docker-compose -f docker/docker-compose.prod.yml down -v
	docker-compose -f docker/docker-compose.staging.yml down -v
	@echo "${GREEN}Cleanup completed!${NC}"

clean-images: ## Remove all built images
	@echo "${RED}Removing all images...${NC}"
	docker-compose -f docker/docker-compose.dev.yml down --rmi all
	docker-compose -f docker/docker-compose.prod.yml down --rmi all
	docker-compose -f docker/docker-compose.staging.yml down --rmi all

# Shell access
shell-backend: ## Access backend container shell
	docker-compose -f docker/docker-compose.dev.yml exec backend sh

shell-frontend: ## Access frontend container shell
	docker-compose -f docker/docker-compose.dev.yml exec frontend sh

shell-db: ## Access MongoDB shell
	docker-compose -f docker/docker-compose.dev.yml exec mongodb mongosh stock-management

# Health checks
health: ## Check health of all services
	@echo "${GREEN}Checking service health...${NC}"
	@echo "Backend:"
	@curl -s http://localhost:3001/api/health || echo "${RED}Backend not healthy${NC}"
	@echo "\nFrontend:"
	@curl -s http://localhost:5173 > /dev/null && echo "${GREEN}Frontend healthy${NC}" || echo "${RED}Frontend not healthy${NC}"
	@echo "\nMongoDB:"
	@docker-compose -f docker/docker-compose.dev.yml exec mongodb mongosh --eval "db.runCommand('ping')" stock-management --quiet && echo "${GREEN}MongoDB healthy${NC}" || echo "${RED}MongoDB not healthy${NC}"

# Build only
build: ## Build all images
	@echo "${GREEN}Building all images...${NC}"
	docker-compose -f docker/docker-compose.dev.yml build

# Restart services
restart: ## Restart all services
	@echo "${YELLOW}Restarting services...${NC}"
	docker-compose -f docker/docker-compose.dev.yml restart

restart-backend: ## Restart backend only
	docker-compose -f docker/docker-compose.dev.yml restart backend

restart-frontend: ## Restart frontend only
	docker-compose -f docker/docker-compose.dev.yml restart frontend

# Prune
prune: ## Prune unused Docker resources
	@echo "${YELLOW}Pruning unused Docker resources...${NC}"
	docker system prune -f
	@echo "${GREEN}Prune completed!${NC}"
