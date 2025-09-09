#!/bin/bash

# Copy compiled node files to n8n custom directory
echo "Copying n8n-nodes-instantly to custom directory..."

# Create directories
mkdir -p ~/.n8n/custom/nodes/InstantlyApi
mkdir -p ~/.n8n/custom/credentials

# Copy main node file
cp dist/src/nodes/InstantlyApi/InstantlyApi.node.js ~/.n8n/custom/nodes/InstantlyApi/
cp dist/src/nodes/InstantlyApi/InstantlyApi.node.d.ts ~/.n8n/custom/nodes/InstantlyApi/
cp dist/src/nodes/InstantlyApi/instantly.svg ~/.n8n/custom/nodes/InstantlyApi/

# Copy all operation files
cp -r dist/src/nodes/InstantlyApi/operations ~/.n8n/custom/nodes/InstantlyApi/
cp -r dist/src/nodes/InstantlyApi/parameters ~/.n8n/custom/nodes/InstantlyApi/
cp -r dist/src/nodes/InstantlyApi/functions ~/.n8n/custom/nodes/InstantlyApi/
cp -r dist/src/nodes/InstantlyApi/types ~/.n8n/custom/nodes/InstantlyApi/

# Copy credentials
cp dist/src/credentials/InstantlyApi.credentials.js ~/.n8n/custom/credentials/
cp dist/src/credentials/InstantlyApi.credentials.d.ts ~/.n8n/custom/credentials/

# Copy generic functions
cp dist/src/nodes/generic.functions.js ~/.n8n/custom/nodes/
cp dist/src/nodes/generic.functions.d.ts ~/.n8n/custom/nodes/

echo "✅ Files copied successfully!"
echo "🚀 n8n should now have the Instantly API node available"
echo "📍 Access n8n at: http://localhost:5678"
