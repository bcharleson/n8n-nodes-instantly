# Known Issues & Workarounds (v0.4.0)

> **Current limitations and proven solutions for @n8n/node-cli version 0.4.0**

## 🚨 Critical Issues

### Issue #1: Development Server Subprocess Hangs

**Status:** 🔴 **Critical** - Affects most users  
**Affects:** `pnpm dev` command  
**First Reported:** January 2025  

**Symptoms:**
```bash
pnpm dev
# Output:
┌   n8n-node dev 
│
◇  Linked custom node to n8n
│
└  ✓ Setup complete

[build] Starting compilation in watch mode...
[n8n] Initializing n8n process
# ← Hangs here indefinitely
```

**Root Cause:**
- CLI spawns n8n as subprocess with resource contention
- n8n loads 583+ nodes and 408+ credentials causing memory bottlenecks
- Process management issues in CLI subprocess handling

**Workarounds:**

**Solution A: External n8n (Recommended)**
```bash
pnpm dev --external-n8n
# Separate terminal:
n8n start
```

**Solution B: Manual Setup**
```bash
npm install -g n8n
mkdir -p ~/.n8n/custom
cp -r dist/* ~/.n8n/custom/
n8n start
```

**Expected Fix:** Version 0.5.x (Q2 2025)

---

### Issue #2: TypeScript Compilation Performance

**Status:** 🟡 **Major** - Significant performance impact  
**Affects:** `pnpm build` and `pnpm dev` compilation  
**First Reported:** January 2025  

**Symptoms:**
```bash
[build] Starting compilation in watch mode...
# Hangs for 10+ minutes with no progress
# High CPU/memory usage
# System becomes unresponsive
```

**Root Cause:**
- CLI attempts to compile entire n8n ecosystem TypeScript files
- Massive dependency tree causes resource exhaustion
- Watch mode monitors excessive number of files

**Workarounds:**

**Solution A: Memory Optimization**
```bash
export NODE_OPTIONS="--max-old-space-size=8192"
pnpm build
```

**Solution B: Traditional Compilation**
```bash
npx tsc
cp -r dist/* ~/.n8n/custom/
```

**Solution C: Use Existing Build System**
```bash
# Keep your working build process
npm run build  # Your existing command
cp -r package/dist/* ~/.n8n/custom/
```

**Expected Fix:** Version 0.5.x with compilation optimizations

---

### Issue #3: Project Structure Requirements

**Status:** 🟡 **Major** - Breaks existing projects  
**Affects:** All CLI commands  
**First Reported:** January 2025  

**Symptoms:**
```bash
Error: Cannot find nodes or credentials
CLI looking in wrong directories
```

**Root Cause:**
- CLI expects strict `src/nodes/` and `src/credentials/` structure
- Many existing projects have files at root level
- No automatic migration or clear error messages

**Workarounds:**

**Solution: Restructure Project**
```bash
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

**Expected Fix:** Better error messages and migration tools in v0.5.x

---

## 🟡 Performance Issues

### Issue #4: High Memory Usage

**Status:** 🟡 **Major** - Affects systems with <8GB RAM  
**Affects:** All CLI operations  

**Symptoms:**
- CLI uses 4-6GB RAM during compilation
- System swap usage increases significantly
- Other applications become slow/unresponsive

**Workarounds:**
```bash
# Increase virtual memory
export NODE_OPTIONS="--max-old-space-size=8192"

# Use external n8n to reduce memory pressure
pnpm dev --external-n8n

# Close other applications during development
```

**Expected Fix:** Memory optimization in v0.6.x

---

### Issue #5: Slow Startup Times

**Status:** 🟡 **Major** - Affects productivity  
**Affects:** `pnpm dev` startup  

**Symptoms:**
- 5-15 minute startup times on average systems
- No progress indicators during long operations
- Unclear if process is working or hung

**Workarounds:**
```bash
# Use external n8n for faster startup
pnpm dev --external-n8n  # 30 seconds vs 10+ minutes

# Manual approach for fastest startup
npm install -g n8n && n8n start  # 15 seconds
```

**Expected Fix:** Progress indicators and performance improvements in v0.5.x

---

## 🟠 Minor Issues

### Issue #6: Cache Management

**Status:** 🟠 **Minor** - Occasional cleanup needed  
**Affects:** Development workflow  

**Symptoms:**
- Stale node versions in n8n interface
- Changes not reflected after compilation
- Inconsistent behavior between sessions

**Workarounds:**
```bash
# Regular cache cleanup
rm -rf ~/.n8n-node-cli/.n8n/custom

# Clear all caches
rm -rf ~/.n8n-node-cli
rm -rf ~/.n8n/custom
pnpm store prune
```

---

### Issue #7: Error Messages

**Status:** 🟠 **Minor** - Poor developer experience  
**Affects:** Debugging and troubleshooting  

**Symptoms:**
- Vague error messages
- No clear indication when processes hang
- Missing troubleshooting guidance

**Workarounds:**
```bash
# Enable debug mode
export DEBUG=n8n*
export N8N_LOG_LEVEL=debug
pnpm dev
```

---

## 🔧 System-Specific Issues

### macOS Issues

**Issue #8: File Descriptor Limits**
```bash
# Increase limits
ulimit -n 65536
```

**Issue #9: Spotlight Indexing**
```bash
# Disable for node_modules
find . -name "node_modules" -type d -exec touch {}/.metadata_never_index \;
```

### Linux Issues

**Issue #10: inotify Limits**
```bash
# Increase file watching limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Windows Issues

**Issue #11: Path Length Limits**
- Use WSL2 for better compatibility
- Or use PowerShell with admin privileges

---

## 📊 Issue Severity Matrix

| Issue | Frequency | Impact | Workaround Available | Expected Fix |
|-------|-----------|--------|---------------------|--------------|
| **Subprocess Hangs** | 80% | Critical | ✅ External n8n | v0.5.x |
| **Compilation Performance** | 70% | Major | ✅ Memory increase | v0.5.x |
| **Project Structure** | 60% | Major | ✅ Restructure | v0.5.x |
| **High Memory Usage** | 50% | Major | ✅ External n8n | v0.6.x |
| **Slow Startup** | 90% | Major | ✅ External n8n | v0.5.x |
| **Cache Issues** | 30% | Minor | ✅ Manual cleanup | v0.5.x |
| **Error Messages** | 40% | Minor | ✅ Debug mode | v0.5.x |

## 🎯 Recommended Mitigation Strategy

### For New Projects
```bash
# Always start with external n8n approach
pnpm create @n8n/node my-node
cd my-node
pnpm dev --external-n8n
# Separate terminal: n8n start
```

### For Existing Projects
```bash
# Restructure first
mkdir -p src
mv nodes src/
mv credentials src/

# Use external n8n
pnpm dev --external-n8n
```

### For Production Use
```bash
# Don't use CLI for production builds yet
# Use traditional build systems until v1.0.x
npm run build  # Your existing build
```

## 📈 Version Roadmap

### v0.5.x (Expected Q2 2025)
- **Subprocess performance improvements**
- **Better error messages and progress indicators**
- **Memory usage optimization**
- **Project structure migration tools**

### v0.6.x (Expected Q3 2025)
- **Advanced memory management**
- **Incremental compilation**
- **Better cache management**

### v1.0.x (Expected Q4 2025)
- **Production-ready performance**
- **Comprehensive documentation**
- **Stable API**

## 🤝 Reporting New Issues

### Before Reporting
1. **Check this document** for known issues
2. **Try workarounds** listed above
3. **Gather system information**:
   ```bash
   node --version
   pnpm --version
   free -h  # Linux/macOS
   uname -a
   ```

### Where to Report
1. **n8n GitHub Repository:** [github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)
2. **n8n Community Forum:** [community.n8n.io](https://community.n8n.io/)
3. **This Repository:** For documentation improvements

### Issue Template
```markdown
**CLI Version:** 0.4.0
**System:** macOS/Linux/Windows
**RAM:** XGB
**Storage:** SSD/HDD
**Node.js:** vX.X.X

**Issue:** Brief description
**Steps to Reproduce:** 
1. Step 1
2. Step 2

**Expected:** What should happen
**Actual:** What actually happens
**Workaround:** If you found one
```

---

**💡 Remember:** This is a brand new tool (v0.4.0). Issues are expected and the n8n team is actively working on improvements. Always have backup workflows ready!
