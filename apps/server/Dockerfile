# Backend Dockerfile for NestJS application
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=deps /app/packages ./packages

# Copy source code
COPY . .

# Generate Prisma client first (required for database package)
RUN pnpm -C packages/database db:generate

# Build shared packages
RUN pnpm -C packages/shared-types build
RUN pnpm -C packages/database build

# Build the server application
RUN pnpm -C apps/server build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install pnpm for production
RUN npm install -g pnpm

# Create app user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy package files for production install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application and dependencies
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/node_modules/.prisma ./packages/database/node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist

# Copy scripts
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/scripts ./apps/server/scripts

USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "apps/server/dist/main.js"]
