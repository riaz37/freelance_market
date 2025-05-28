#!/bin/bash

# Development Docker Setup Script
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_status "Starting development environment..."

# Start only infrastructure services
docker-compose -f docker-compose.dev.yml up -d

print_success "Development infrastructure started!"
print_status "Services running:"
echo "  - Kafka: localhost:9092"
echo "  - Kafka UI: http://localhost:8080"
echo "  - Database: Neon PostgreSQL (cloud)"
echo ""
print_status "Now you can run your applications locally:"
echo "  - Server: pnpm -C apps/server dev"
echo "  - Web: pnpm -C apps/web dev"
echo ""
print_status "To stop infrastructure: docker-compose -f docker-compose.dev.yml down"
