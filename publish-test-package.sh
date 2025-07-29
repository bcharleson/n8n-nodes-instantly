#!/bin/bash

# Publish Test Package to npm
# Publishes n8n-nodes-instantly-testing for cloud testing

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_banner() {
    echo -e "${PURPLE}"
    echo "================================================================"
    echo "📦 Publishing n8n-nodes-instantly-testing to npm"
    echo "================================================================"
    echo -e "${NC}"
}

print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if we're in the correct directory
    if [ ! -f "package.json" ]; then
        print_error "Not in the correct project directory (no package.json found)"
        return 1
    fi
    
    # Check if test-package directory exists
    if [ ! -d "test-package" ]; then
        print_error "test-package directory not found"
        return 1
    fi
    
    # Check if npm is logged in
    if ! npm whoami >/dev/null 2>&1; then
        print_error "Not logged in to npm. Please run: npm login"
        return 1
    fi
    
    print_success "Prerequisites check passed"
    return 0
}

# Function to validate test package
validate_test_package() {
    print_step "Validating test package..."
    
    cd test-package
    
    # Check required files
    local required_files=("package.json" "README.md" "nodes/InstantlyTrigger/InstantlyTrigger.node.js" "nodes/InstantlyTrigger/instantly.svg")
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            print_error "Required file missing: $file"
            cd ..
            return 1
        fi
    done
    
    # Validate package.json
    if ! node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
        print_error "Invalid package.json"
        cd ..
        return 1
    fi
    
    # Check package name
    local package_name=$(node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).name)")
    if [ "$package_name" != "n8n-nodes-instantly-testing" ]; then
        print_error "Incorrect package name: $package_name (expected: n8n-nodes-instantly-testing)"
        cd ..
        return 1
    fi
    
    cd ..
    print_success "Test package validation passed"
    return 0
}

# Function to check if package already exists
check_package_exists() {
    print_step "Checking if package exists on npm..."
    
    local package_name="n8n-nodes-instantly-testing"
    local current_version=$(cd test-package && node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version)")
    
    if npm view "$package_name@$current_version" version >/dev/null 2>&1; then
        print_warning "Package $package_name@$current_version already exists on npm"
        echo "You need to bump the version in test-package/package.json"
        echo "Current version: $current_version"
        echo "Suggested next version: $(echo $current_version | awk -F. '{$NF = $NF + 1;} 1' | sed 's/ /./g')"
        return 1
    fi
    
    print_success "Version $current_version is available for publishing"
    return 0
}

# Function to publish package
publish_package() {
    print_step "Publishing package to npm..."
    
    cd test-package
    
    # Run npm publish
    if npm publish --access public; then
        print_success "Package published successfully!"
    else
        print_error "Failed to publish package"
        cd ..
        return 1
    fi
    
    cd ..
    return 0
}

# Function to verify publication
verify_publication() {
    print_step "Verifying publication..."
    
    local package_name="n8n-nodes-instantly-testing"
    local version=$(cd test-package && node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version)")
    
    # Wait a moment for npm to update
    sleep 3
    
    if npm view "$package_name@$version" version >/dev/null 2>&1; then
        print_success "Package successfully published and available on npm"
        
        # Get package info
        local npm_url="https://www.npmjs.com/package/$package_name"
        local install_command="npm install $package_name"
        
        echo ""
        echo "📦 Package Information:"
        echo "   Name: $package_name"
        echo "   Version: $version"
        echo "   npm URL: $npm_url"
        echo ""
        echo "📋 Installation Command:"
        echo "   $install_command"
        
        return 0
    else
        print_error "Package publication verification failed"
        return 1
    fi
}

# Function to generate testing instructions
generate_testing_instructions() {
    print_step "Generating testing instructions..."
    
    local package_name="n8n-nodes-instantly-testing"
    local version=$(cd test-package && node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')).version)")
    
    cat > CLOUD_TESTING_INSTRUCTIONS.md << EOF
# 🌐 Cloud Testing Instructions for InstantlyTrigger

## 📦 Package Information

- **Package Name**: \`$package_name\`
- **Version**: \`$version\`
- **npm URL**: https://www.npmjs.com/package/$package_name

## 🚀 Installation on Cloud n8n

### Method 1: Community Nodes Interface (Recommended)

1. **Access your cloud n8n instance**
2. **Go to Settings → Community Nodes**
3. **Enter package name**: \`$package_name\`
4. **Click Install**
5. **Wait for installation to complete**
6. **Restart n8n if prompted**

### Method 2: Manual Installation (Advanced)

If you have shell access to your n8n instance:

\`\`\`bash
# Install the testing package
npm install $package_name

# Restart n8n
# (method depends on your deployment)
\`\`\`

## 🧪 Testing the InstantlyTrigger Node

### Step 1: Create Test Workflow

1. **Create a new workflow** in your n8n instance
2. **Look for "Instantly Trigger (Testing)"** in the node palette under "Trigger" section
3. **Add the node** to your workflow
4. **Configure the trigger**:
   - Select events to monitor (start with "All Events")
   - Optionally add campaign or lead email filters
   - Enable debug mode for detailed logging

### Step 2: Configure Instantly Webhook

1. **Copy the webhook URL** from the InstantlyTrigger node
2. **In your Instantly account**:
   - Go to **Settings → Integrations**
   - Click **Add Webhook**
   - Enter the webhook URL from n8n
   - Select campaign and events to monitor
   - Click **Add Webhook**

### Step 3: Test Webhook Functionality

#### Manual Testing with curl:

\`\`\`bash
curl -X POST "YOUR_WEBHOOK_URL" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type": "reply_received",
    "timestamp": "2025-01-25T17:30:00.000Z",
    "workspace": "test-workspace",
    "campaign_id": "test-campaign-123",
    "campaign_name": "Test Campaign",
    "lead_email": "test@example.com",
    "email_account": "sender@company.com",
    "reply_text": "Thanks for reaching out!"
  }'
\`\`\`

#### Real-world Testing:

1. **Send test emails** from your Instantly campaign
2. **Trigger events** (replies, opens, clicks, etc.)
3. **Monitor n8n workflow executions**
4. **Check execution logs** for webhook data

### Step 4: Verify Functionality

#### ✅ Node Integration Checklist:
- [ ] InstantlyTrigger (Testing) appears in node palette
- [ ] Node can be added to workflows
- [ ] Configuration UI displays correctly
- [ ] All 18 event types available in dropdown
- [ ] Additional fields (filters, debug mode) work
- [ ] Webhook URL generates correctly

#### ✅ Webhook Processing Checklist:
- [ ] Webhook receives POST requests
- [ ] Valid JSON payloads are processed
- [ ] Invalid payloads are handled gracefully
- [ ] Event filtering works as expected
- [ ] Campaign filtering works when configured
- [ ] Lead email filtering works when configured
- [ ] Debug mode shows detailed logs

#### ✅ Workflow Integration Checklist:
- [ ] Webhook triggers workflow execution
- [ ] Webhook data passes to subsequent nodes
- [ ] Multiple trigger nodes can coexist
- [ ] Execution history shows webhook data
- [ ] Error handling doesn't crash workflows

## 🔍 Troubleshooting

### Package Installation Issues

- **Check n8n version compatibility** (requires n8n 1.0+)
- **Verify npm registry access** from your n8n instance
- **Check installation logs** for error messages
- **Try manual installation** if community nodes interface fails

### Webhook Not Triggering

1. **Verify webhook URL** is correctly configured in Instantly
2. **Check event type selection** in the trigger node
3. **Enable debug mode** to see detailed logging
4. **Test with manual curl** to isolate issues
5. **Check n8n execution logs** for errors

### Debug Mode

Enable debug mode in the node configuration to see:
- Webhook payloads received
- Event filtering decisions
- Campaign and lead email filtering
- Workflow trigger decisions

## 📊 Test Scenarios

### Basic Functionality Tests

1. **All Events Test**: Configure trigger for all events, send test webhook
2. **Specific Event Test**: Configure for "reply_received" only, test with different events
3. **Campaign Filter Test**: Set campaign filter, test with matching/non-matching campaigns
4. **Lead Email Filter Test**: Set email filter, test with matching/non-matching emails

### Error Handling Tests

1. **Invalid JSON Test**: Send malformed JSON to webhook
2. **Missing event_type Test**: Send payload without event_type field
3. **Unknown Event Test**: Send payload with unknown event_type

### Integration Tests

1. **Multi-node Workflow**: Add subsequent nodes to process webhook data
2. **Multiple Triggers**: Create workflow with multiple InstantlyTrigger nodes
3. **Real Instantly Integration**: Connect to actual Instantly campaign

## 📝 Feedback and Issues

If you encounter any issues during testing:

1. **Enable debug mode** and capture logs
2. **Document the issue** with steps to reproduce
3. **Include webhook payload** examples if relevant
4. **Report issues** at: https://github.com/bcharleson/n8n-nodes-instantly/issues

## ⚠️ Important Notes

- **Testing Package**: This is for testing purposes only
- **Not Production Ready**: Do not use in production workflows
- **Temporary Package**: May be removed after testing is complete
- **Data Privacy**: Be cautious with real customer data during testing

---

**Package**: \`$package_name@$version\`  
**Published**: $(date)  
**Testing Environment**: Cloud n8n instances
EOF

    print_success "Testing instructions generated: CLOUD_TESTING_INSTRUCTIONS.md"
}

# Main function
main() {
    print_banner
    
    echo "This script will publish the n8n-nodes-instantly-testing package to npm"
    echo "for cloud-based testing of the InstantlyTrigger webhook node."
    echo ""
    echo "⚠️  Make sure you are logged in to npm with the correct account!"
    echo ""
    echo "Current npm user: $(npm whoami 2>/dev/null || echo 'Not logged in')"
    echo ""
    echo "Continue with publication? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Publication cancelled."
        exit 0
    fi
    
    # Check prerequisites
    if ! check_prerequisites; then
        exit 1
    fi
    
    # Validate test package
    if ! validate_test_package; then
        exit 1
    fi
    
    # Check if package version already exists
    if ! check_package_exists; then
        exit 1
    fi
    
    # Publish package
    if ! publish_package; then
        exit 1
    fi
    
    # Verify publication
    if ! verify_publication; then
        exit 1
    fi
    
    # Generate testing instructions
    generate_testing_instructions
    
    # Success message
    print_banner
    print_success "Test Package Published Successfully!"
    echo ""
    echo "📦 Package: n8n-nodes-instantly-testing"
    echo "🌐 npm URL: https://www.npmjs.com/package/n8n-nodes-instantly-testing"
    echo "📋 Installation: npm install n8n-nodes-instantly-testing"
    echo "📖 Testing Guide: CLOUD_TESTING_INSTRUCTIONS.md"
    echo ""
    echo "🎯 Ready for cloud n8n testing!"
}

# Run main function
main "$@"
