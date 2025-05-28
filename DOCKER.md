# Docker Deployment Guide

This guide explains how to deploy the Freelance Marketplace application using Docker with separate containers for frontend and backend services.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  Infrastructure │
│   (Next.js)     │    │   (NestJS)      │    │                 │
│   Port: 3000    │    │   Port: 4000    │    │  PostgreSQL     │
│                 │    │                 │    │  Kafka          │
│                 │    │                 │    │  Zookeeper      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Development Environment

1. **Start infrastructure only** (recommended for development):
```bash
pnpm docker:dev
```

Then run applications locally:
```bash
# Terminal 1 - Backend
pnpm -C apps/server dev

# Terminal 2 - Frontend
pnpm -C apps/web dev
```

### Production Environment

1. **Full production deployment**:
```bash
pnpm docker:prod
```

## Available Commands

| Command | Description |
|---------|-------------|
| `pnpm docker:dev` | Start development infrastructure |
| `pnpm docker:prod` | Deploy to production |
| `pnpm docker:build` | Build production images |
| `pnpm docker:build:dev` | Build development setup |
| `pnpm docker:build:rebuild` | Clean rebuild |
| `pnpm docker:down` | Stop production services |
| `pnpm docker:down:dev` | Stop development services |
| `pnpm docker:logs` | View production logs |
| `pnpm docker:logs:dev` | View development logs |

## Environment Configuration

1. **Copy environment template**:
```bash
cp .env.example .env
```

2. **Update configuration**:
```env
# Database
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/freelance_market

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (for production)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## Service Details

### Frontend (Next.js)
- **Container**: `freelance-web`
- **Port**: 3000
- **Build**: Multi-stage with standalone output
- **Health**: HTTP check on port 3000

### Backend (NestJS)
- **Container**: `freelance-server`
- **Port**: 4000
- **Build**: Multi-stage with production optimization
- **Health**: `/health` endpoint
- **Dependencies**: PostgreSQL, Kafka

### Infrastructure Services

#### PostgreSQL
- **Container**: `freelance-postgres`
- **Port**: 5432
- **Data**: Persistent volume
- **Health**: `pg_isready` check

#### Kafka + Zookeeper
- **Containers**: `freelance-kafka`, `freelance-zookeeper`
- **Ports**: 9092 (Kafka), 2181 (Zookeeper)
- **UI**: Kafka UI on port 8080

## Development Workflow

### 1. Infrastructure-Only Development
```bash
# Start infrastructure
pnpm docker:dev

# Run apps locally
pnpm dev:server  # Backend
pnpm -C apps/web dev  # Frontend
```

### 2. Full Docker Development
```bash
# Build and start everything
pnpm docker:build:dev

# View logs
pnpm docker:logs:dev
```

### 3. Production Testing
```bash
# Build production images
pnpm docker:build

# Deploy
pnpm docker:prod
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
```bash
# Check what's using ports
lsof -i :3000
lsof -i :4000
lsof -i :9092
```

2. **Database connection issues**:
```bash
# Check server logs for database connection errors
docker logs freelance-server

# Verify Neon database connection string in environment
```

3. **Build failures**:
```bash
# Clean rebuild
pnpm docker:build:rebuild

# Check build logs
docker-compose logs server
docker-compose logs web
```

### Health Checks

- **Server**: http://localhost:4000/health
- **Web**: http://localhost:3000
- **GraphQL**: http://localhost:4000/graphql
- **Kafka UI**: http://localhost:8080

### Logs and Monitoring

```bash
# All services
pnpm docker:logs

# Specific service
docker logs freelance-server
docker logs freelance-web
docker logs freelance-kafka

# Follow logs
docker logs -f freelance-server
```

## Production Deployment

### Prerequisites
- Docker & Docker Compose installed
- Environment variables configured
- SSL certificates (for HTTPS)

### Deployment Steps

1. **Prepare environment**:
```bash
cp .env.example .env
# Update .env with production values
```

2. **Deploy**:
```bash
pnpm docker:prod
```

3. **Verify deployment**:
```bash
curl http://localhost:4000/health
curl http://localhost:3000
```

### Security Considerations

- Change default passwords
- Use strong JWT secrets
- Configure proper firewall rules
- Use HTTPS in production
- Regular security updates

## Scaling

### Horizontal Scaling
```bash
# Scale web frontend
docker-compose up -d --scale web=3

# Scale backend
docker-compose up -d --scale server=2
```

### Load Balancing
Add nginx or traefik for load balancing multiple instances.

## Backup and Recovery

### Database Backup
Database is managed by Neon PostgreSQL cloud service. Use Neon's built-in backup features:
- Automatic daily backups
- Point-in-time recovery
- Manual backup exports via Neon dashboard

### Volume Backup
```bash
# Backup Kafka data (if needed)
docker run --rm -v freelance_market_kafka_data:/data -v $(pwd):/backup alpine tar czf /backup/kafka-backup.tar.gz /data
```
