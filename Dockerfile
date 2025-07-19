# 🚀 BONNIE AI PRODUCTION DOCKERFILE v24.0
# Ultra-optimized multi-stage build for production deployment

# ═══════════════════════════════════════════════════════════════════
# 📦 BUILD STAGE - Optimized for fast builds
# ═══════════════════════════════════════════════════════════════════
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package files first (for layer caching)
COPY backend/package*.json ./
COPY backend/package-production.json ./package.json

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# ═══════════════════════════════════════════════════════════════════
# 🚀 PRODUCTION STAGE - Minimal runtime image
# ═══════════════════════════════════════════════════════════════════
FROM node:18-alpine AS production

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bonnieai -u 1001

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apk add --no-cache dumb-init curl && \
    rm -rf /var/cache/apk/*

# Copy node_modules from builder stage
COPY --from=builder --chown=bonnieai:nodejs /app/node_modules ./node_modules

# Copy application code
COPY --chown=bonnieai:nodejs backend/server-production.js ./server.js
COPY --chown=bonnieai:nodejs backend/package-production.json ./package.json

# Create necessary directories
RUN mkdir -p logs temp && \
    chown -R bonnieai:nodejs logs temp

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    NODE_OPTIONS="--max-old-space-size=512" \
    UV_THREADPOOL_SIZE=4

# Health check configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# Expose port
EXPOSE 3001

# Switch to non-root user
USER bonnieai

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "server.js"]

# ═══════════════════════════════════════════════════════════════════
# 📊 METADATA
# ═══════════════════════════════════════════════════════════════════
LABEL name="bonnie-ai-production" \
      version="24.0" \
      description="Ultra-optimized AI girlfriend system with WebSockets and advanced features" \
      maintainer="TrainMyGirl.com" \
      org.opencontainers.image.source="https://github.com/trainmygirl/bonnie-ai"