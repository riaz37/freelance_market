#!/bin/bash

# Test Docker Build Script
set -e

echo "🔧 Testing Docker build for server..."

# Create test environment file
if [ ! -f .env ]; then
    echo "📝 Creating test .env file..."
    cp .env.example .env
fi

# Test building the server Docker image
echo "🐳 Building server Docker image..."
docker build -f apps/server/Dockerfile -t freelance-server-test .

echo "✅ Server Docker build completed successfully!"

# Clean up test image
echo "🧹 Cleaning up test image..."
docker rmi freelance-server-test

echo "🎉 Docker build test completed!"
