# Backend — NestJS API (bun-first, pinned runtimes)
# Build context: apps/backend

# --- deps: install with bun ---
FROM oven/bun:1.4.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# --- development: hot reload ---
FROM oven/bun:1.4.2-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001 9229
CMD ["bun", "run", "start:dev"]

# --- builder: compile TypeScript ---
FROM oven/bun:1.4.2-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# --- production: minimal node runtime, non-root ---
FROM node:26.10-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json bun.lock* ./
RUN npm install -g bun@1.4.2 && \
    bun install --production --frozen-lockfile 2>/dev/null || bun install --production
COPY --from=builder /app/dist ./dist
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app
USER nestjs
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
CMD ["node", "dist/main.js"]
