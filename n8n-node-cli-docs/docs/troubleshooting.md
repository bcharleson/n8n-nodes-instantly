# Comprehensive Troubleshooting Guide

> **Real-world solutions for common @n8n/node-cli issues based on hands-on experience**

## 🚨 Critical Issues (Version 0.4.0)

### 1. Development Server Hangs at "Initializing n8n process"

**Symptoms:**
```bash
pnpm dev
# Output stops at:
[n8n] Initializing n8n process
# No further progress for 10+ minutes
```

**Root Cause:**
- CLI spawns n8n as subprocess with resource contention issues
- n8n loads 583+ nodes and 408+ credentials causing memory bottlenecks
- Process management issues in CLI tool

**Solutions (in order of preference):**

#### Solution 1: Use External n8n Flag
```bash
pnpm dev --external-n8n
# In separate terminal:
npm install -g n8n
n8n start
```

#### Solution 2: Manual n8n Setup
```bash
# Install n8n globally
npm install -g n8n

# Link your node manually
mkdir -p ~/.n8n/custom
cp -r dist/* ~/.n8n/custom/

# Start n8n
n8n start
```

#### Solution 3: Increase System Resources
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=8192"

# Try CLI again
pnpm dev
```

### 2. TypeScript Compilation Hangs

**Symptoms:**
```bash
[build] Starting compilation in watch mode...
# Hangs indefinitely with no progress
```

**Root Cause:**
- CLI attempts to compile entire n8n ecosystem TypeScript files
- Massive dependency tree causes resource exhaustion
- Watch mode monitors too many files

**Solutions:**

#### Solution 1: Traditional TypeScript Compilation
```bash
# Kill hanging process
# Use standard TypeScript compiler
npx tsc

# Copy compiled files
cp -r dist/* ~/.n8n/custom/
```

#### Solution 2: Use Existing Build System
```bash
# If you have working build process
npm run build  # or your existing build command
cp -r package/dist/* ~/.n8n/custom/
```

#### Solution 3: Memory Optimization
```bash
# Increase memory and try again
export NODE_OPTIONS="--max-old-space-size=8192"
export TSC_COMPILE_ON_ERROR=true
pnpm build
```

### 3. Project Structure Errors

**Symptoms:**
```bash
Error: Cannot find nodes or credentials
CLI looking in wrong directories
```

**Root Cause:**
- CLI expects `src/nodes/` and `src/credentials/` structure
- Many existing projects have files at root level

**Solution:**
```bash
# Create expected structure
mkdir -p src
mv nodes src/
mv credentials src/

# Verify structure
tree src/
# Should show:
# src/
# ├── nodes/
# │   └── YourNode/
# └── credentials/
```

## 🔧 Performance Issues

### Slow Startup Times

**Symptoms:**
- CLI takes 5-10 minutes to start
- High CPU/memory usage during startup

**Diagnostic Commands:**
```bash
# Check system resources
top -p $(pgrep -f "n8n-node")
htop

# Check memory usage
free -h
```

**Solutions:**

#### For Systems with <8GB RAM:
```bash
# Always use external n8n
pnpm dev --external-n8n
npm install -g n8n
n8n start
```

#### For Systems with 8GB+ RAM:
```bash
# Optimize Node.js settings
export NODE_OPTIONS="--max-old-space-size=8192 --max-semi-space-size=128"
pnpm dev
```

### Build Performance Issues

**Symptoms:**
- `pnpm build` takes extremely long
- System becomes unresponsive during build

**Solutions:**

#### Parallel Processing:
```bash
# Use multiple CPU cores
export UV_THREADPOOL_SIZE=8
pnpm build
```

#### Memory Management:
```bash
# Clear caches first
rm -rf node_modules/.cache
rm -rf ~/.n8n-node-cli/.n8n/custom
pnpm build
```

## 🛠️ Cache and State Issues

### Clear All Caches

**When to use:** After CLI updates, strange behavior, or switching projects

```bash
# Clear CLI cache
rm -rf ~/.n8n-node-cli/.n8n/custom

# Clear n8n cache
rm -rf ~/.n8n/custom

# Clear npm/pnpm cache
pnpm store prune
npm cache clean --force

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Reset Development Environment

**Nuclear option when everything is broken:**

```bash
# 1. Kill all processes
pkill -f "n8n"
pkill -f "node-cli"

# 2. Clear all caches
rm -rf ~/.n8n-node-cli
rm -rf ~/.n8n/custom
rm -rf node_modules
rm -rf dist

# 3. Reinstall
pnpm install

# 4. Start fresh
pnpm dev --external-n8n
```

## 🔍 Diagnostic Tools

### Check CLI Status
```bash
# Verify CLI installation
pnpm list @n8n/node-cli

# Check CLI version
npx n8n-node --version

# Verify pnpm setup
pnpm --version
which pnpm
```

### Monitor Resource Usage
```bash
# Real-time monitoring during CLI operations
# Terminal 1: Start CLI
pnpm dev

# Terminal 2: Monitor resources
watch -n 1 'ps aux | grep -E "(n8n|node)" | head -10'
```

### Debug Mode
```bash
# Enable verbose logging
export DEBUG=n8n*
export N8N_LOG_LEVEL=debug
pnpm dev
```

## 📊 Performance Benchmarks

### Expected Startup Times

| System Specs | CLI Startup | External n8n | Manual Setup |
|---------------|-------------|--------------|--------------|
| 16GB RAM, SSD, 8-core | 2-3 min | 30 sec | 15 sec |
| 8GB RAM, SSD, 4-core | 5-8 min | 1 min | 30 sec |
| 4GB RAM, HDD, 2-core | Hangs | 2-3 min | 1 min |

### Memory Usage Patterns

| Phase | Expected RAM Usage | Warning Signs |
|-------|-------------------|---------------|
| CLI Startup | 1-2GB | >4GB |
| TypeScript Compilation | 2-4GB | >6GB |
| n8n Running | 500MB-1GB | >2GB |

## 🆘 Emergency Procedures

### When Everything Fails

1. **Stop all processes:**
   ```bash
   pkill -f "n8n"
   pkill -f "pnpm"
   ```

2. **Use manual workflow:**
   ```bash
   npm install -g n8n
   mkdir -p ~/.n8n/custom
   # Copy your compiled node files
   n8n start
   ```

3. **Report the issue:**
   - Document exact error messages
   - Include system specs
   - Share with n8n community

### Getting Help

1. **n8n Community Forum:** [community.n8n.io](https://community.n8n.io/)
2. **GitHub Issues:** [github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)
3. **This Repository:** Create an issue with your experience

---

**💡 Remember:** The CLI tool is brand new (v0.4.0). Having fallback strategies is essential for productive development!
