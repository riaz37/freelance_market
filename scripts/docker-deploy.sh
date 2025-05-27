#!/bin/bash

# Docker Deployment Script
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_status "Deploying with Docker..."

# Check if .env exists
if [ ! -f .env ]; then
    print_warning "Creating .env from .env.example"
    cp .env.example .env
    print_warning "Please update .env with your configuration!"
fi

# Build and deploy
docker-compose -f docker-compose.yml up -d --build

print_status "Waiting for services to be ready..."
sleep 30

# Run database migrations
print_status "Running database migrations..."
docker-compose -f docker-compose.yml exec server pnpm -C packages/database db:migrate

# Seed admin user if needed
print_status "Seeding admin user..."
docker-compose -f docker-compose.yml exec server pnpm -C apps/server seed:admin

print_success "Docker deployment completed!"
print_status "Application is running at:"
echo "  - Web: http://localhost:3000"
echo "  - API: http://localhost:4000"
echo "  - GraphQL: http://localhost:4000/graphql"
echo "  - Kafka UI: http://localhost:8080"
