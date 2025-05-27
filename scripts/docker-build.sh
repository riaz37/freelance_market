#!/bin/bash

# Docker Build Script for Freelance Marketplace
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

print_status "Starting Docker build process for Freelance Marketplace..."

# Parse command line arguments
BUILD_TYPE=${1:-"production"}
REBUILD=${2:-"false"}

if [ "$BUILD_TYPE" = "dev" ] || [ "$BUILD_TYPE" = "development" ]; then
    COMPOSE_FILE="docker-compose.dev.yml"
    print_status "Building for DEVELOPMENT environment"
else
    COMPOSE_FILE="docker-compose.yml"
    print_status "Building for PRODUCTION environment"
fi

# Clean up if rebuild is requested
if [ "$REBUILD" = "true" ] || [ "$REBUILD" = "--rebuild" ]; then
    print_warning "Cleaning up existing containers and images..."
    docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans
    docker system prune -f
    print_success "Cleanup completed"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please update .env file with your configuration before running the application"
fi

# Build and start services
print_status "Building Docker images..."
docker-compose -f $COMPOSE_FILE build --parallel

print_status "Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
sleep 10

# Check service health
print_status "Checking service health..."

# Check PostgreSQL
if docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
    print_success "PostgreSQL is ready"
else
    print_error "PostgreSQL is not ready"
fi

# Check if server is running (for production)
if [ "$BUILD_TYPE" != "dev" ] && [ "$BUILD_TYPE" != "development" ]; then
    sleep 20  # Give server more time to start
    if curl -f http://localhost:4000/health > /dev/null 2>&1; then
        print_success "Server is ready"
    else
        print_warning "Server health check failed, but it might still be starting..."
    fi

    # Check if web is running
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        print_success "Web application is ready"
    else
        print_warning "Web application health check failed, but it might still be starting..."
    fi
fi

print_success "Docker build and deployment completed!"
print_status "Services are running:"

if [ "$BUILD_TYPE" = "dev" ] || [ "$BUILD_TYPE" = "development" ]; then
    echo "  - PostgreSQL: localhost:5432"
    echo "  - Kafka: localhost:9092"
    echo "  - Kafka UI: http://localhost:8080"
    echo ""
    echo "To run the applications in development mode:"
    echo "  - Server: pnpm -C apps/server dev"
    echo "  - Web: pnpm -C apps/web dev"
else
    echo "  - Web Application: http://localhost:3000"
    echo "  - API Server: http://localhost:4000"
    echo "  - GraphQL Playground: http://localhost:4000/graphql"
    echo "  - Kafka UI: http://localhost:8080"
    echo "  - PostgreSQL: localhost:5432"
fi

echo ""
print_status "To view logs: docker-compose -f $COMPOSE_FILE logs -f"
print_status "To stop services: docker-compose -f $COMPOSE_FILE down"
