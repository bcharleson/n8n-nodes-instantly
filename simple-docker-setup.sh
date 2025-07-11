#!/bin/bash

# Simple Docker setup for n8n-nodes-instantly testing
# This script provides an alternative to docker-compose

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to start n8n with local package
start_n8n() {
    print_status "Starting n8n development environment..."
    
    # Stop any existing container
    docker stop n8n-dev 2>/dev/null || true
    docker rm n8n-dev 2>/dev/null || true
    
    # Create a volume for n8n data
    docker volume create n8n_dev_data 2>/dev/null || true
    
    # Start n8n container
    print_status "Starting n8n container..."
    docker run -d \
        --name n8n-dev \
        -p 5678:5678 \
        -e N8N_BASIC_AUTH_ACTIVE=false \
        -e N8N_HOST=localhost \
        -e N8N_PORT=5678 \
        -e N8N_PROTOCOL=http \
        -e NODE_ENV=development \
        -e N8N_LOG_LEVEL=debug \
        -e N8N_LOG_OUTPUT=console \
        -e N8N_COMMUNITY_PACKAGES_ENABLED=true \
        -e N8N_SECURE_COOKIE=false \
        -e N8N_DISABLE_UI=false \
        -e WEBHOOK_URL=http://localhost:5678/ \
        -e DB_TYPE=sqlite \
        -e DB_SQLITE_DATABASE=/home/node/.n8n/database.sqlite \
        -e GENERIC_TIMEZONE=America/New_York \
        -v n8n_dev_data:/home/node/.n8n \
        n8nio/n8n:latest
    
    # Wait for container to start
    print_status "Waiting for n8n container to start..."
    sleep 10
    
    # Install the local package
    install_package
    
    # Wait for n8n to be ready
    print_status "Waiting for n8n to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
            print_status "✅ n8n is ready!"
            print_status "🌐 Access n8n at: http://localhost:5678"
            print_status "📦 The n8n-nodes-instantly package should be available"
            return 0
        fi
        
        print_status "Waiting for n8n... (attempt $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    print_error "n8n failed to start properly. Check logs with: docker logs n8n-dev"
    return 1
}

# Function to install the local package
install_package() {
    print_status "Installing local n8n-nodes-instantly package..."
    
    # Create package tarball
    npm pack > /dev/null
    
    # Copy package to container
    print_status "Copying package to container..."
    docker cp n8n-nodes-instantly-*.tgz n8n-dev:/tmp/package.tgz
    
    # Install package in container
    print_status "Installing package in container..."
    docker exec n8n-dev npm install -g /tmp/package.tgz
    
    # Restart n8n to pick up the new package
    print_status "Restarting n8n to load the package..."
    docker restart n8n-dev
    
    # Clean up local tarball
    rm -f n8n-nodes-instantly-*.tgz
    
    print_status "✅ Package installed successfully"
}

# Function to stop n8n
stop_n8n() {
    print_status "Stopping n8n development environment..."
    docker stop n8n-dev 2>/dev/null || true
    docker rm n8n-dev 2>/dev/null || true
    print_status "✅ Environment stopped"
}

# Function to show logs
show_logs() {
    if [ "$1" = "-f" ]; then
        print_status "Following logs (Ctrl+C to stop)..."
        docker logs -f n8n-dev
    else
        print_status "Showing recent logs..."
        docker logs --tail=50 n8n-dev
    fi
}

# Function to update package
update_package() {
    print_status "Updating local package..."
    
    # Build if needed
    if [ -f "tsconfig.json" ]; then
        print_status "Building TypeScript..."
        npm run build 2>/dev/null || true
    fi
    
    # Reinstall package
    install_package
    
    print_status "✅ Package updated"
}

# Function to show status
show_status() {
    if docker ps | grep -q "n8n-dev"; then
        print_status "✅ n8n container is running"
        
        if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
            print_status "✅ n8n is healthy and accessible at http://localhost:5678"
        else
            print_warning "⚠️  n8n container is running but not responding"
        fi
    else
        print_warning "❌ n8n container is not running"
    fi
}

# Function to clean up
clean_up() {
    print_warning "This will remove all containers and data. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker stop n8n-dev 2>/dev/null || true
        docker rm n8n-dev 2>/dev/null || true
        docker volume rm n8n_dev_data 2>/dev/null || true
        print_status "✅ Cleanup complete"
    else
        print_status "Cleanup cancelled"
    fi
}

# Show help
show_help() {
    echo "Simple n8n Development Environment"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start n8n with local package"
    echo "  stop      Stop n8n"
    echo "  logs      Show recent logs"
    echo "  logs -f   Follow logs"
    echo "  update    Update local package"
    echo "  status    Show status"
    echo "  clean     Clean up everything"
    echo "  help      Show this help"
}

# Main script logic
case "${1:-help}" in
    start)
        start_n8n
        ;;
    stop)
        stop_n8n
        ;;
    logs)
        show_logs "$2"
        ;;
    update)
        update_package
        ;;
    status)
        show_status
        ;;
    clean)
        clean_up
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
