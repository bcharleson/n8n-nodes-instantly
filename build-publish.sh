#!/bin/bash
set -e

# Clean previous build
rm -rf dist
rm -f *.tgz

# Build the project
npm run build

# Pack it
npm pack

# Show what was created
ls -la *.tgz

echo "To publish, run: npm publish"
echo "To publish with a tag: npm publish --tag beta"