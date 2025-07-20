# 🔱 DIVINE DOCKER CONFIGURATION v3.0
# Multi-stage production build with security and performance optimization

# ===== BUILD STAGE =====
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies with exact versions for reproducible builds
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY index.html ./

# Build the application
ENV NODE_ENV=production
ENV VITE_APP_VERSION=2.0.0
RUN npm run build

# ===== NGINX STAGE =====
FROM nginx:1.25-alpine AS production

# Install security updates
RUN apk add --no-cache \
    dumb-init \
    && apk upgrade

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx-default.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist /usr/share/nginx/html

# Copy security headers and cache configuration
COPY nginx-security.conf /etc/nginx/conf.d/security.conf

# Create necessary directories
RUN mkdir -p /var/cache/nginx /var/log/nginx && \
    chown -R nextjs:nodejs /var/cache/nginx /var/log/nginx /usr/share/nginx/html

# Remove default nginx user and switch to non-root
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:80/ || exit 1

# Expose port
EXPOSE 80

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# ===== LABELS =====
LABEL \
    org.opencontainers.image.title="Galatea Empire Pro" \
    org.opencontainers.image.description="Divine AI Chat Platform" \
    org.opencontainers.image.version="2.0.0" \
    org.opencontainers.image.vendor="Galatea Empire" \
    org.opencontainers.image.licenses="MIT" \
    org.opencontainers.image.source="https://github.com/galatea-empire/app" \
    maintainer="Galatea Development Team"