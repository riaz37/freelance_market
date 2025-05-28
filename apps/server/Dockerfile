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
# Use the correct path for Prisma output
RUN cd packages/database && npx prisma generate

# Build shared packages
RUN pnpm -C packages/shared-types build
RUN pnpm -C packages/database build

# Build the server application
RUN pnpm -C apps/server build

# Compile the seed script
RUN cd apps/server && npx tsc scripts/seed-admin.ts --outDir dist/scripts --moduleResolution node --esModuleInterop --target es2020 --lib es2020

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
# Use --unsafe-perm to avoid permission issues with Prisma
RUN pnpm install --frozen-lockfile --prod --unsafe-perm

# Ensure Prisma directory has correct permissions
RUN mkdir -p /app/node_modules/.pnpm/prisma@6.8.2_typescript@5.8.2/node_modules/prisma && \
    chown -R nestjs:nodejs /app/node_modules

# Copy built application and dependencies
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/dist ./apps/server/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/dist ./packages/database/dist
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/prisma ./packages/database/prisma
# Copy the generated Prisma client to the correct location
COPY --from=builder --chown=nestjs:nodejs /app/packages/database/src/generated ./packages/database/src/generated
COPY --from=builder --chown=nestjs:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist

# Copy compiled seed script
COPY --from=builder --chown=nestjs:nodejs /app/apps/server/dist/scripts ./apps/server/dist/scripts

# Create src directory for GraphQL schema generation with proper permissions
RUN mkdir -p /app/src && chown -R nestjs:nodejs /app/src

USER nestjs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start the application
CMD ["node", "apps/server/dist/main.js"]
