# Frontend — React + Vite dashboard (bun-first, pinned runtimes)
# Build context: apps/frontend

# --- deps: install with bun ---
FROM oven/bun:1.4.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# --- development: vite dev server ---
FROM oven/bun:1.4.2-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0"]

# --- builder: static bundle ---
FROM oven/bun:1.4.2-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

# --- production: nginx, non-root ---
FROM nginx:1.29.8-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
RUN addgroup -g 1001 -S appgroup 2>/dev/null || true && \
    adduser -S appuser -u 1001 -G appgroup 2>/dev/null || adduser -S -u 1001 -G nginx appuser || true && \
    chown -R 1001:1001 /usr/share/nginx/html && \
    chown -R 1001:1001 /var/cache/nginx && \
    chown -R 1001:1001 /var/log/nginx && \
    chown -R 1001:1001 /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown 1001:1001 /var/run/nginx.pid
USER 1001
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
