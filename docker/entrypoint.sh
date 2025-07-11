#!/bin/bash
set -e

echo "🚀 Starting n8n Development Environment with Local Package Installation"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Wait for n8n directory to be ready
log "Setting up n8n environment..."
mkdir -p /home/node/.n8n

# Install the local n8n-nodes-instantly package
log "Installing local n8n-nodes-instantly package..."

# Navigate to n8n's node_modules directory
N8N_MODULES_DIR="/usr/local/lib/node_modules/n8n/node_modules"
PACKAGE_DIR="$N8N_MODULES_DIR/n8n-nodes-instantly"

# Remove existing package if it exists
if [ -d "$PACKAGE_DIR" ]; then
    log "Removing existing n8n-nodes-instantly package..."
    rm -rf "$PACKAGE_DIR"
fi

# Copy the local package directly to node_modules
log "Copying local package to n8n node_modules..."
cp -r /usr/local/lib/node_modules/n8n-nodes-instantly "$PACKAGE_DIR"

# Verify the installation
if [ -d "$PACKAGE_DIR" ]; then
    log "✅ n8n-nodes-instantly package successfully installed"
    log "Package contents:"
    ls -la "$PACKAGE_DIR/"
else
    log "❌ Failed to install n8n-nodes-instantly package"
    exit 1
fi

# Check if package.json exists and has the right structure
if [ -f "$PACKAGE_DIR/package.json" ]; then
    log "✅ Package.json found"
    log "Package info:"
    cat "$PACKAGE_DIR/package.json" | grep -E '"name"|"version"|"n8n"' || true
else
    log "❌ Package.json not found in installed package"
    exit 1
fi

# Set proper permissions
log "Setting permissions..."
chown -R node:node /home/node/.n8n
chown -R node:node "$PACKAGE_DIR"

# Log environment info
log "Environment Information:"
log "Node.js version: $(node --version)"
log "NPM version: $(npm --version)"
log "n8n version: $(npm list n8n --depth=0 2>/dev/null | grep n8n || echo 'n8n version not found')"

# Start n8n
log "🎯 Starting n8n server..."
log "n8n will be available at: http://localhost:5678"
log "Community package n8n-nodes-instantly should be available in the node palette"

# Execute the original n8n entrypoint
exec tini -- su-exec node n8n start
