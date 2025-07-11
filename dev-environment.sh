#!/bin/bash

# n8n-nodes-instantly Development Environment Manager
# This script helps manage the local n8n development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Start the development environment
start_env() {
    print_header "Starting n8n Development Environment"
    check_docker
    
    print_status "Building and starting n8n container..."
    docker-compose up -d
    
    print_status "Waiting for n8n to be ready..."
    sleep 10
    
    # Wait for n8n to be healthy
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:5678/healthz > /dev/null 2>&1; then
            print_status "✅ n8n is ready!"
            print_status "🌐 Access n8n at: http://localhost:5678"
            print_status "📦 The n8n-nodes-instantly package should be available in the node palette"
            return 0
        fi
        
        print_status "Waiting for n8n... (attempt $attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    print_error "n8n failed to start properly. Check logs with: $0 logs"
    return 1
}

# Stop the development environment
stop_env() {
    print_header "Stopping n8n Development Environment"
    check_docker
    
    print_status "Stopping n8n container..."
    docker-compose down
    print_status "✅ Environment stopped"
}

# Restart the development environment
restart_env() {
    print_header "Restarting n8n Development Environment"
    stop_env
    sleep 2
    start_env
}

# Show logs
show_logs() {
    print_header "n8n Development Environment Logs"
    check_docker
    
    if [ "$1" = "-f" ] || [ "$1" = "--follow" ]; then
        print_status "Following logs (Ctrl+C to stop)..."
        docker-compose logs -f n8n
    else
        print_status "Showing recent logs..."
        docker-compose logs --tail=50 n8n
    fi
}

# Update the local package in the container
update_package() {
    print_header "Updating Local Package in Container"
    check_docker
    
    print_status "Rebuilding local package..."
    npm run build
    
    print_status "Restarting container to pick up changes..."
    docker-compose restart n8n
    
    print_status "✅ Package updated. Check logs to verify installation."
}

# Show status
show_status() {
    print_header "n8n Development Environment Status"
    check_docker
    
    if docker-compose ps | grep -q "Up"; then
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

# Clean up everything
clean_env() {
    print_header "Cleaning n8n Development Environment"
    check_docker
    
    print_warning "This will remove all containers, volumes, and data. Are you sure? (y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        print_status "Stopping and removing containers..."
        docker-compose down -v
        
        print_status "Removing Docker images..."
        docker-compose down --rmi all
        
        print_status "✅ Environment cleaned"
    else
        print_status "Clean operation cancelled"
    fi
}

# Show help
show_help() {
    echo "n8n-nodes-instantly Development Environment Manager"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Start the n8n development environment"
    echo "  stop      Stop the n8n development environment"
    echo "  restart   Restart the n8n development environment"
    echo "  logs      Show recent logs"
    echo "  logs -f   Follow logs in real-time"
    echo "  update    Update the local package in the container"
    echo "  status    Show environment status"
    echo "  clean     Clean up all containers and data"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start          # Start the environment"
    echo "  $0 logs -f        # Follow logs"
    echo "  $0 update         # Update package after making changes"
}

# Main script logic
case "${1:-help}" in
    start)
        start_env
        ;;
    stop)
        stop_env
        ;;
    restart)
        restart_env
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
        clean_env
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
