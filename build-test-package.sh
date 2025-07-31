#!/bin/bash

# Build and publish test package for Email Management validation
# This creates n8n-nodes-instantly-test package without affecting production

set -e

echo "🧪 Building Test Package: n8n-nodes-instantly-test"
echo "=================================================="

# Backup original package.json
echo "📦 Backing up original package.json..."
cp package.json package-original.json

# Use test package configuration
echo "🔄 Switching to test package configuration..."
cp package-test.json package.json

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/

# Install dependencies
echo "📥 Installing dependencies..."
npm install --legacy-peer-deps

# Build the package
echo "🔨 Building package..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Show what will be published
echo "📋 Package contents:"
npm pack --dry-run

# Ask for confirmation before publishing
echo ""
echo "🚀 Ready to publish n8n-nodes-instantly-test@0.2.0-alpha.1"
echo "This will include:"
echo "  ✅ All existing stable functionality"
echo "  ✅ New Email Management operations (7 endpoints)"
echo "  ✅ Updated to test version 0.2.0-alpha.1"
echo ""
read -p "Proceed with publishing? (y/N): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Publishing test package..."
    npm publish --access public
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully published n8n-nodes-instantly-test@0.2.0-alpha.1"
        echo ""
        echo "🧪 Test Package Ready!"
        echo "Install with: npm install n8n-nodes-instantly-test"
        echo ""
        echo "📋 Test Checklist:"
        echo "  □ Test Email getMany operation"
        echo "  □ Test Email get operation"
        echo "  □ Test Email reply operation"
        echo "  □ Test Email update operation"
        echo "  □ Test Email delete operation"
        echo "  □ Test Email getUnreadCount operation"
        echo "  □ Test Email markThreadAsRead operation"
        echo "  □ Verify existing operations still work"
        echo ""
    else
        echo "❌ Failed to publish test package"
        exit 1
    fi
else
    echo "❌ Publishing cancelled"
fi

# Restore original package.json
echo "🔄 Restoring original package.json..."
cp package-original.json package.json
rm package-original.json

echo "✅ Test package build process complete!"
