# Alternative Development Workflows

> **Backup strategies when the @n8n/node-cli tool has limitations**

## 🎯 When to Use Alternative Workflows

- CLI hangs during `pnpm dev` initialization
- TypeScript compilation takes >10 minutes
- System has <8GB RAM or uses HDD storage
- Need faster iteration cycles during development
- CLI tool has breaking changes or bugs

## 🚀 Workflow 1: External n8n Approach

**Best for:** Most situations where CLI subprocess fails

### Setup Process

```bash
# 1. Install n8n globally (one-time setup)
npm install -g n8n

# 2. Use CLI for linking only
pnpm dev --external-n8n

# 3. Start n8n separately (in new terminal)
n8n start
```

### Development Cycle

```bash
# Terminal 1: CLI for hot reload compilation
pnpm dev --external-n8n
# Keeps TypeScript compilation running

# Terminal 2: n8n server
n8n start
# Access at http://localhost:5678

# Make changes to src/ files
# CLI automatically recompiles and updates linked node
```

### Pros & Cons

✅ **Pros:**
- Faster startup (30 sec vs 10+ min)
- More reliable than subprocess approach
- Still gets hot reload benefits
- Better resource management

❌ **Cons:**
- Requires two terminal windows
- Manual n8n installation needed
- Slightly more complex setup

## 🛠️ Workflow 2: Manual Development Setup

**Best for:** Systems with severe performance constraints or when CLI completely fails

### Initial Setup

```bash
# 1. Install n8n globally
npm install -g n8n

# 2. Create custom nodes directory
mkdir -p ~/.n8n/custom

# 3. Set up your project structure
mkdir -p src/nodes src/credentials
# Move your files to src/ if needed
```

### Development Cycle

```bash
# 1. Make changes to TypeScript files in src/

# 2. Compile manually
npx tsc
# OR use your existing build system
npm run build

# 3. Copy compiled files to n8n
cp -r dist/* ~/.n8n/custom/

# 4. Restart n8n (if needed)
# n8n automatically picks up changes in most cases
```

### Automation Script

Create `dev-workflow.sh`:

```bash
#!/bin/bash
# Automated manual workflow

echo "🔨 Compiling TypeScript..."
npx tsc

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful"
    echo "📦 Copying to n8n custom directory..."
    cp -r dist/* ~/.n8n/custom/
    echo "🎉 Node updated! Refresh your browser."
else
    echo "❌ Compilation failed"
fi
```

Usage:
```bash
chmod +x dev-workflow.sh
./dev-workflow.sh
```

### Pros & Cons

✅ **Pros:**
- Works on any system
- Fastest startup time
- Complete control over build process
- No CLI dependencies

❌ **Cons:**
- No automatic hot reload
- Manual compilation required
- More steps per change

## 🔄 Workflow 3: Hybrid Approach

**Best for:** Teams wanting CLI benefits with reliable fallbacks

### Setup Strategy

```bash
# Primary: Try CLI first
pnpm dev

# If hangs after 2 minutes, fallback:
# Ctrl+C to cancel
pnpm dev --external-n8n
# Start n8n in separate terminal

# If still issues, go manual:
# Use traditional build tools
```

### Automated Fallback Script

Create `smart-dev.sh`:

```bash
#!/bin/bash
# Smart development starter with fallbacks

echo "🚀 Attempting CLI development..."
timeout 120 pnpm dev &
CLI_PID=$!

sleep 120
if kill -0 $CLI_PID 2>/dev/null; then
    echo "⚠️  CLI taking too long, switching to external n8n..."
    kill $CLI_PID
    
    echo "🔗 Starting external n8n approach..."
    pnpm dev --external-n8n &
    
    echo "🌐 Starting n8n server..."
    n8n start
else
    echo "✅ CLI started successfully!"
fi
```

### Pros & Cons

✅ **Pros:**
- Automatic fallback strategy
- Gets best performance available
- Adapts to system capabilities

❌ **Cons:**
- More complex setup
- Requires scripting knowledge

## 🏗️ Workflow 4: Traditional Build System Integration

**Best for:** Existing projects with working build systems

### Keep Existing Build System

```bash
# Don't replace your working build system
# Keep package.json scripts like:
{
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "start": "npm run build && n8n start"
  }
}
```

### Add CLI as Optional Enhancement

```bash
# Add CLI scripts as alternatives
{
  "scripts": {
    "build": "tsc && gulp build:icons",
    "build:cli": "n8n-node build",
    "dev": "tsc --watch",
    "dev:cli": "n8n-node dev --external-n8n",
    "start": "npm run build && n8n start"
  }
}
```

### Development Process

```bash
# Try CLI first
npm run dev:cli

# Fallback to traditional
npm run dev
# In separate terminal: npm start
```

## 🔧 Workflow 5: Docker-Based Development

**Best for:** Teams wanting consistent environments

### Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install n8n globally
RUN npm install -g n8n pnpm

# Copy package files
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Copy source code
COPY . .

# Expose n8n port
EXPOSE 5678

# Start script
CMD ["sh", "-c", "pnpm build && mkdir -p ~/.n8n/custom && cp -r dist/* ~/.n8n/custom/ && n8n start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  n8n-dev:
    build: .
    ports:
      - "5678:5678"
    volumes:
      - ./src:/app/src
      - ./dist:/app/dist
    environment:
      - NODE_OPTIONS=--max-old-space-size=4096
```

### Development Process

```bash
# Build and start
docker-compose up --build

# For changes:
docker-compose exec n8n-dev pnpm build
docker-compose restart
```

## 📊 Workflow Comparison

| Workflow | Setup Time | Startup Time | Hot Reload | Reliability | Best For |
|----------|------------|--------------|------------|-------------|----------|
| **CLI Standard** | 5 min | 2-10 min | ✅ | ⚠️ | High-end systems |
| **External n8n** | 10 min | 30 sec | ✅ | ✅ | Most developers |
| **Manual** | 15 min | 15 sec | ❌ | ✅ | Low-end systems |
| **Hybrid** | 20 min | Variable | ✅ | ✅ | Teams |
| **Traditional** | 0 min | 30 sec | ⚠️ | ✅ | Existing projects |
| **Docker** | 30 min | 1 min | ❌ | ✅ | Consistent environments |

## 🎯 Choosing the Right Workflow

### Decision Tree

```
Do you have >8GB RAM and SSD?
├─ Yes: Try CLI standard first
│   └─ If hangs: Use external n8n
└─ No: Use manual workflow

Is this an existing project?
├─ Yes: Keep traditional build system
│   └─ Add CLI as optional enhancement
└─ No: Use external n8n approach

Do you need team consistency?
├─ Yes: Use Docker or hybrid approach
└─ No: Use external n8n approach
```

### Quick Start Recommendations

**For New Developers:**
```bash
# Start here - works for most systems
pnpm create @n8n/node my-node
cd my-node
pnpm dev --external-n8n
# Separate terminal: n8n start
```

**For Existing Projects:**
```bash
# Keep your build system, add CLI optionally
npm install -g n8n
mkdir -p ~/.n8n/custom
npm run build  # your existing build
cp -r dist/* ~/.n8n/custom/
n8n start
```

**For Teams:**
```bash
# Document multiple approaches in README
# Provide scripts for different workflows
# Use Docker for consistency
```

## 🚨 Emergency Fallback

When everything fails:

```bash
# Nuclear option - guaranteed to work
npm install -g n8n
mkdir -p ~/.n8n/custom

# Copy ANY working compiled JavaScript files
cp your-working-files.js ~/.n8n/custom/

# Start n8n
n8n start

# Access at http://localhost:5678
```

---

**💡 Pro Tip:** Always have at least two workflows ready. The CLI tool is new and may have issues, but these alternatives ensure you can always continue development!
