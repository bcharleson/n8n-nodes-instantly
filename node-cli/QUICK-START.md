# Quick Start Guide

> **Get up and running with @n8n/node-cli in 5 minutes**

## 🚀 TL;DR - Just Get It Working

### For Most Users (Recommended)

```bash
# 1. Create your node
pnpm create @n8n/node my-awesome-node
cd my-awesome-node

# 2. Install n8n globally (one-time setup)
npm install -g n8n

# 3. Start development (reliable approach)
pnpm dev --external-n8n

# 4. In separate terminal, start n8n
n8n start

# 5. Open http://localhost:5678
```

### If You Have Issues

```bash
# Emergency fallback (always works)
export NODE_OPTIONS="--max-old-space-size=8192"
mkdir -p ~/.n8n/custom
npx tsc
cp -r dist/* ~/.n8n/custom/
n8n start
```

## ⚡ 30-Second Decision Tree

**Do you have 8GB+ RAM and SSD?**
- ✅ **Yes:** Try `pnpm dev` first, fallback to external n8n if hangs
- ❌ **No:** Skip to external n8n approach immediately

**Is this an existing project?**
- ✅ **Yes:** Move files to `src/nodes/` and `src/credentials/` first
- ❌ **No:** Use `pnpm create @n8n/node` to start fresh

**Are you in a hurry?**
- ✅ **Yes:** Use manual approach (guaranteed 15-second startup)
- ❌ **No:** Try CLI approaches for hot reload benefits

## 🎯 Three Approaches (Pick One)

### Approach 1: CLI Standard (High-End Systems)

```bash
# Requirements: 8GB+ RAM, SSD, multi-core CPU
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm create @n8n/node my-node
cd my-node
pnpm dev
# Wait 2-10 minutes for startup
# Access: http://localhost:5678
```

**Pros:** Full CLI experience, automatic hot reload  
**Cons:** Can hang, high resource usage  
**Best for:** Powerful development machines  

### Approach 2: External n8n (Most Reliable)

```bash
# Works on most systems
pnpm create @n8n/node my-node
cd my-node
npm install -g n8n  # One-time setup

# Terminal 1:
pnpm dev --external-n8n

# Terminal 2:
n8n start

# Access: http://localhost:5678
```

**Pros:** Fast startup (30 sec), reliable, hot reload  
**Cons:** Two terminals needed  
**Best for:** Most developers  

### Approach 3: Manual (Guaranteed)

```bash
# Always works, any system
npm install -g n8n
mkdir -p ~/.n8n/custom

# Your development cycle:
# 1. Edit TypeScript files
# 2. Compile: npx tsc
# 3. Copy: cp -r dist/* ~/.n8n/custom/
# 4. Start: n8n start (if not running)
# 5. Refresh browser

# Access: http://localhost:5678
```

**Pros:** Fastest startup (15 sec), works anywhere  
**Cons:** No automatic hot reload  
**Best for:** Low-end systems, guaranteed reliability  

## 🔧 Common Issues & Quick Fixes

### Issue: "Cannot find nodes or credentials"

```bash
# Fix: Move files to expected structure
mkdir -p src
mv nodes src/
mv credentials src/
```

### Issue: CLI hangs at "Initializing n8n process"

```bash
# Fix: Use external n8n
# Ctrl+C to cancel, then:
pnpm dev --external-n8n
# Separate terminal: n8n start
```

### Issue: "Starting compilation in watch mode..." hangs

```bash
# Fix: Increase memory
export NODE_OPTIONS="--max-old-space-size=8192"
# Or use manual compilation: npx tsc
```

### Issue: High memory usage

```bash
# Fix: Clear caches and use external n8n
rm -rf ~/.n8n-node-cli/.n8n/custom
pnpm dev --external-n8n
```

## 📊 Performance Expectations

| System | CLI Standard | External n8n | Manual |
|--------|--------------|--------------|--------|
| **High-end** (16GB, SSD) | 2-3 min | 30 sec | 15 sec |
| **Mid-range** (8GB, SSD) | 5-8 min | 1 min | 30 sec |
| **Low-end** (<8GB, HDD) | Hangs | 2-3 min | 1 min |

## 🎯 Development Workflow

### Once Running

1. **Make changes** to files in `src/`
2. **Hot reload** (CLI approaches) or **manual compile** (manual approach)
3. **Test in n8n** at http://localhost:5678
4. **Repeat**

### Testing Your Node

1. **Open** http://localhost:5678
2. **Create new workflow**
3. **Add your node** (search by name)
4. **Configure and test** each operation
5. **Verify error handling**

## 🆘 Emergency Commands

### When Everything Breaks

```bash
# Nuclear reset
pkill -f "n8n"
rm -rf ~/.n8n-node-cli
rm -rf ~/.n8n/custom
rm -rf node_modules
rm -rf dist

# Start over
npm install -g n8n
pnpm install
mkdir -p ~/.n8n/custom
npx tsc
cp -r dist/* ~/.n8n/custom/
n8n start
```

### Quick Health Check

```bash
# Check if everything is working
echo "Node.js: $(node --version)"
echo "pnpm: $(pnpm --version)"
echo "n8n: $(n8n --version)"
echo "RAM: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo "CLI: $(pnpm list @n8n/node-cli)"
```

## 📚 Next Steps

### Once You're Running

1. **Read** [Best Practices](docs/best-practices.md) for optimal workflow
2. **Check** [Performance Guide](docs/performance-guide.md) for optimization
3. **Bookmark** [Troubleshooting](docs/troubleshooting.md) for issues

### For Production

1. **Don't use CLI** for production builds yet (use traditional tools)
2. **Test thoroughly** in n8n interface
3. **Follow n8n** [publishing guidelines](https://docs.n8n.io/integrations/creating-nodes/)

## 🤝 Getting Help

### If This Guide Doesn't Work

1. **Check** [Known Issues](docs/known-issues.md) for your specific problem
2. **Try** [Alternative Workflows](docs/alternative-workflows.md)
3. **Ask** on [n8n Community Forum](https://community.n8n.io/)
4. **Report** issues to help improve this documentation

### Share Your Experience

- **What worked** for your system?
- **What didn't work** and how you fixed it?
- **Performance results** from your setup?

---

**💡 Remember:** The CLI tool is brand new (v0.4.0). If one approach doesn't work, try another. The goal is to get you developing nodes, not fighting with tools!
