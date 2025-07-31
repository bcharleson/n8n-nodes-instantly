#!/bin/bash

# Manual test package creation without npm install
# This creates the test package structure for manual testing

set -e

echo "🧪 Creating Manual Test Package Structure"
echo "========================================"

# Create test package directory
TEST_DIR="test-package-build"
echo "📁 Creating test package directory: $TEST_DIR"
rm -rf $TEST_DIR
mkdir -p $TEST_DIR

# Copy source files
echo "📋 Copying source files..."
cp -r nodes $TEST_DIR/
cp -r credentials $TEST_DIR/
cp gulpfile.js $TEST_DIR/
cp tsconfig.json $TEST_DIR/
cp package-test.json $TEST_DIR/package.json

# Create dist directory structure
echo "🏗️ Creating dist directory structure..."
mkdir -p $TEST_DIR/dist/nodes/InstantlyApi
mkdir -p $TEST_DIR/dist/credentials

# Copy TypeScript files to dist (for manual testing)
echo "📦 Preparing files for distribution..."
cp -r $TEST_DIR/nodes/* $TEST_DIR/dist/nodes/
cp -r $TEST_DIR/credentials/* $TEST_DIR/dist/credentials/

# Create a simple package info
echo "📄 Creating package information..."
cat > $TEST_DIR/README.md << 'EOF'
# n8n-nodes-instantly-test

TEST VERSION of Instantly API v2 integration with Email Management operations.

## Installation for Testing

1. Copy this entire directory to your n8n custom nodes folder
2. Restart n8n
3. The "Instantly API" node should appear with Email operations

## New Email Operations Available

1. Get Many Emails - Retrieve emails with filtering
2. Get Email - Get single email by ID  
3. Reply to Email - Send email replies
4. Update Email - Modify email properties
5. Delete Email - Remove emails
6. Get Unread Count - Count unread emails
7. Mark Thread as Read - Mark threads as read

## Testing Instructions

See TEST_PACKAGE_README.md for detailed testing instructions.

**This is a TEST PACKAGE - Use for validation only!**
EOF

# Copy test documentation
cp TEST_PACKAGE_README.md $TEST_DIR/

# Create installation instructions
cat > $TEST_DIR/INSTALL_INSTRUCTIONS.md << 'EOF'
# Manual Installation Instructions

## Option 1: n8n Custom Nodes Directory
1. Copy this entire folder to: `~/.n8n/custom/`
2. Restart n8n
3. The node should appear in the nodes panel

## Option 2: n8n Docker Custom Nodes
1. Copy this folder to your n8n custom nodes volume
2. Restart the n8n container
3. The node should be available

## Option 3: Development Environment
1. Copy this folder to your n8n development environment
2. Run `npm run build` in the n8n root
3. Restart n8n in development mode

## Verification
- Look for "Instantly API" in the nodes panel
- Select it and verify "Email" appears as a resource option
- Test the email operations with your Instantly API credentials
EOF

# Create a simple package.json for the test
cat > $TEST_DIR/package.json << 'EOF'
{
  "name": "n8n-nodes-instantly-test",
  "version": "0.2.0-alpha.1",
  "description": "TEST: n8n community node for Instantly API v2 with Email Management",
  "main": "dist/nodes/InstantlyApi/InstantlyApi.node.js",
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": [
      "dist/credentials/InstantlyApi.credentials.js"
    ],
    "nodes": [
      "dist/nodes/InstantlyApi/InstantlyApi.node.js"
    ]
  }
}
EOF

# Show what was created
echo ""
echo "✅ Test package created successfully!"
echo ""
echo "📁 Test package location: $TEST_DIR/"
echo ""
echo "📋 Package contents:"
ls -la $TEST_DIR/
echo ""
echo "🧪 Ready for Manual Testing!"
echo ""
echo "📖 Next Steps:"
echo "1. Copy the '$TEST_DIR' folder to your n8n custom nodes directory"
echo "2. Restart n8n"
echo "3. Look for 'Instantly API' node with Email operations"
echo "4. Follow the testing instructions in TEST_PACKAGE_README.md"
echo ""
echo "📍 Installation Instructions: $TEST_DIR/INSTALL_INSTRUCTIONS.md"
echo "📚 Testing Guide: $TEST_DIR/TEST_PACKAGE_README.md"
