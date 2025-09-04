# Best Practices for n8n Node CLI Development

> **Proven approaches for effective community node development using the @n8n/node-cli tool**

## 🏗️ Project Setup Best Practices

### 1. Environment Preparation

```bash
# Always set up optimal Node.js environment
export NODE_OPTIONS="--max-old-space-size=8192"
export UV_THREADPOOL_SIZE=8

# Verify system requirements before starting
free -h  # Check available RAM
df -h    # Check disk space
node --version  # Ensure Node.js 18.10+
```

### 2. Project Structure Compliance

**✅ Correct Structure (CLI Expected):**
```
my-node/
├── src/                    # ← Required by CLI
│   ├── nodes/
│   │   └── MyNode/
│   │       ├── MyNode.node.ts
│   │       └── MyNode.node.json
│   └── credentials/
│       └── MyNodeAuth.credentials.ts
├── package.json
└── tsconfig.json
```

**❌ Common Mistakes:**
```
my-node/
├── nodes/                  # ← CLI won't find this
├── credentials/            # ← CLI won't find this
```

### 3. Package.json Configuration

**Essential Configuration:**
```json
{
  "name": "n8n-nodes-my-awesome-node",
  "scripts": {
    "build": "n8n-node build",
    "dev": "n8n-node dev",
    "dev:external": "n8n-node dev --external-n8n",
    "dev:manual": "./scripts/manual-dev.sh",
    "lint": "n8n-node lint",
    "lint:fix": "n8n-node lint --fix",
    "release": "n8n-node release"
  },
  "n8n": {
    "n8nNodesApiVersion": 1,
    "nodes": [
      "dist/nodes/MyNode/MyNode.node.js"
    ],
    "credentials": [
      "dist/credentials/MyNodeAuth.credentials.js"
    ]
  },
  "devDependencies": {
    "@n8n/node-cli": "*"
  }
}
```

## 🚀 Development Workflow Best Practices

### 1. Tiered Development Strategy

**Tier 1: Try CLI First (High-End Systems)**
```bash
# For systems with 8GB+ RAM, SSD, multi-core
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm dev

# If successful, continue with CLI
# If hangs, immediately move to Tier 2
```

**Tier 2: External n8n (Most Reliable)**
```bash
# For most development scenarios
pnpm dev --external-n8n

# Separate terminal:
npm install -g n8n  # One-time setup
n8n start
```

**Tier 3: Manual Workflow (Guaranteed)**
```bash
# When all else fails
npx tsc
cp -r dist/* ~/.n8n/custom/
n8n start
```

### 2. Development Environment Setup

**Create Development Scripts:**

`scripts/dev-setup.sh`:
```bash
#!/bin/bash
# One-time development environment setup

echo "🔧 Setting up n8n development environment..."

# Install n8n globally
npm install -g n8n

# Create custom nodes directory
mkdir -p ~/.n8n/custom

# Set up environment variables
echo 'export NODE_OPTIONS="--max-old-space-size=8192"' >> ~/.bashrc
echo 'export UV_THREADPOOL_SIZE=8' >> ~/.bashrc

echo "✅ Development environment ready!"
```

`scripts/quick-dev.sh`:
```bash
#!/bin/bash
# Quick development starter with fallbacks

echo "🚀 Starting development..."

# Try external n8n first (most reliable)
pnpm dev --external-n8n &
CLI_PID=$!

# Give CLI 30 seconds to start
sleep 30

# Start n8n in background
n8n start &
N8N_PID=$!

echo "🌐 n8n available at http://localhost:5678"
echo "📝 CLI PID: $CLI_PID, n8n PID: $N8N_PID"
echo "🛑 To stop: kill $CLI_PID $N8N_PID"
```

### 3. Hot Reload Best Practices

**Optimize for Fast Iteration:**
```bash
# Keep n8n running continuously
n8n start  # Don't restart unless necessary

# Use external n8n for hot reload
pnpm dev --external-n8n

# Make small, incremental changes
# Test each change before moving to next
```

**File Watching Strategy:**
```bash
# Monitor your changes
watch -n 2 'ls -la ~/.n8n/custom/'

# Verify compilation
watch -n 2 'ls -la dist/'
```

## 🔧 Code Development Best Practices

### 1. TypeScript Configuration

**Optimized `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### 2. Node Development Patterns

**Consistent Error Handling:**
```typescript
// Always use n8n's error handling patterns
import { NodeOperationError } from 'n8n-workflow';

try {
  // Your operation
} catch (error) {
  throw new NodeOperationError(this.getNode(), error);
}
```

**Resource Management:**
```typescript
// Always clean up resources
export class MyNode implements INodeType {
  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const results: INodeExecutionData[] = [];
    
    try {
      // Process items
      for (const item of items) {
        // Process each item
      }
    } finally {
      // Clean up any resources
    }
    
    return [results];
  }
}
```

### 3. Testing Strategy

**Local Testing Workflow:**
```bash
# 1. Unit test your functions
npm test

# 2. Test in n8n interface
# - Create test workflow
# - Test each operation
# - Verify error handling

# 3. Test with real API
# - Use test API keys
# - Test rate limiting
# - Test error scenarios
```

## 📊 Performance Best Practices

### 1. System Optimization

**Before Starting Development:**
```bash
# Check system resources
free -h && df -h

# Close unnecessary applications
# Ensure 4GB+ RAM available

# Use SSD if possible
# Close browser tabs, IDEs, etc.
```

### 2. CLI Performance Optimization

**Memory Management:**
```bash
# Set appropriate memory limits
export NODE_OPTIONS="--max-old-space-size=8192"

# For large projects
export NODE_OPTIONS="--max-old-space-size=12288"

# Monitor memory usage
watch -n 5 'free -h'
```

**Cache Management:**
```bash
# Regular cache cleanup
rm -rf ~/.n8n-node-cli/.n8n/custom
rm -rf node_modules/.cache

# Before major changes
pnpm store prune
```

### 3. Build Optimization

**Incremental Builds:**
```bash
# Use TypeScript incremental compilation
# Keep tsBuildInfoFile in tsconfig.json

# Only rebuild changed files
npx tsc --incremental
```

## 🛡️ Reliability Best Practices

### 1. Always Have Fallbacks

**Multi-Tier Approach:**
```json
{
  "scripts": {
    "dev": "npm run dev:cli || npm run dev:external || npm run dev:manual",
    "dev:cli": "n8n-node dev",
    "dev:external": "n8n-node dev --external-n8n",
    "dev:manual": "./scripts/manual-dev.sh"
  }
}
```

### 2. Error Recovery

**Automatic Recovery Script:**
```bash
#!/bin/bash
# auto-recover.sh

echo "🔄 Attempting automatic recovery..."

# Kill hanging processes
pkill -f "n8n-node"
pkill -f "n8n"

# Clear caches
rm -rf ~/.n8n-node-cli/.n8n/custom
rm -rf node_modules/.cache

# Restart with external n8n
echo "🚀 Restarting with external n8n..."
pnpm dev --external-n8n &

sleep 10
n8n start
```

### 3. Monitoring and Alerts

**Resource Monitoring:**
```bash
# Create monitoring alias
alias check-dev='echo "Memory: $(free -h | grep Mem | awk "{print \$3\"/\"\$2}") | Processes: $(pgrep -c n8n)"'

# Use before and during development
check-dev
```

## 📝 Documentation Best Practices

### 1. Project Documentation

**Essential README Sections:**
```markdown
# Your Node

## Quick Start
- Standard: `pnpm dev`
- If issues: `pnpm dev --external-n8n`
- Manual: See [Alternative Workflows](docs/alternative-workflows.md)

## System Requirements
- RAM: 8GB+ recommended
- Storage: SSD preferred
- Node.js: 18.10+

## Troubleshooting
- [Common Issues](docs/troubleshooting.md)
- [Performance Guide](docs/performance.md)
```

### 2. Development Notes

**Keep Development Log:**
```markdown
# Development Log

## 2025-01-XX
- CLI hangs on startup: Using external n8n approach
- Memory usage: 6GB peak during compilation
- Workaround: Increased NODE_OPTIONS to 8192MB

## Performance Notes
- Startup time: 45 seconds with external n8n
- Build time: 2 minutes for full compilation
```

## 🎯 Team Collaboration Best Practices

### 1. Standardized Setup

**Team Setup Script:**
```bash
#!/bin/bash
# team-setup.sh

echo "🏗️ Setting up team development environment..."

# Install required tools
npm install -g n8n pnpm

# Set up environment
export NODE_OPTIONS="--max-old-space-size=8192"

# Create shared configuration
cp .env.example .env.local

echo "✅ Team setup complete!"
```

### 2. Shared Workflows

**Document Multiple Approaches:**
```markdown
# Team Development Guide

## Primary Workflow (Try First)
`pnpm dev --external-n8n`

## Fallback Workflow
Manual compilation + n8n start

## System Requirements
- Document minimum specs
- Share performance benchmarks
- Provide optimization tips
```

---

**💡 Key Takeaway:** The CLI tool is powerful but new. Always have backup strategies, optimize your environment, and document what works for your team!
