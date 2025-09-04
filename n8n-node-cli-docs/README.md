# n8n Node CLI Documentation & Real-World Guide

> **Comprehensive documentation for the @n8n/node-cli tool with real-world experience, troubleshooting, and best practices**

[![npm version](https://img.shields.io/npm/v/@n8n/node-cli)](https://www.npmjs.com/package/@n8n/node-cli)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Community](https://img.shields.io/badge/community-n8n-orange)](https://community.n8n.io/)

## 🎯 About This Repository

This repository provides **enhanced documentation** for the official [@n8n/node-cli](https://www.npmjs.com/package/@n8n/node-cli) tool, combining the official documentation with **real-world experience**, **performance insights**, and **practical workarounds** discovered through hands-on development.

### 🚨 Current Status: CLI Tool Version 0.4.0
- **Released:** January 2025 (Brand New!)
- **Status:** Early release with known performance issues
- **Recommendation:** Use with fallback strategies (documented below)

## 📚 Documentation Structure

| Document | Description |
|----------|-------------|
| [📖 **Official Guide**](docs/official-guide.md) | Complete official documentation from npm registry |
| [⚡ **Performance Guide**](docs/performance-guide.md) | System requirements, optimization tips, and benchmarks |
| [🔧 **Troubleshooting**](docs/troubleshooting.md) | Comprehensive solutions for common issues |
| [🛠️ **Alternative Workflows**](docs/alternative-workflows.md) | Backup strategies when CLI tool has limitations |
| [📋 **Best Practices**](docs/best-practices.md) | Proven approaches for effective development |
| [🐛 **Known Issues**](docs/known-issues.md) | Current limitations and workarounds for v0.4.0 |

## 🚀 Quick Start

### Standard Approach (Try First)
```bash
# Create new node project
pnpm create @n8n/node my-awesome-node
cd my-awesome-node

# Start development
pnpm dev
```

### If CLI Hangs (Common Issue)
```bash
# Use external n8n approach
pnpm dev --external-n8n

# In separate terminal
npm install -g n8n
n8n start
```

## ⚠️ Critical Issues & Solutions

### 🔥 Most Common Problems

| Issue | Symptoms | Quick Fix |
|-------|----------|-----------|
| **Dev server hangs** | Stuck at "Initializing n8n process" | Use `--external-n8n` flag |
| **TypeScript compilation hangs** | "Starting compilation in watch mode..." never completes | Increase Node.js memory or use manual compilation |
| **Project structure errors** | CLI can't find nodes/credentials | Move files to `src/nodes/` and `src/credentials/` |

### 💡 Essential Workarounds

```bash
# 1. Performance optimization
export NODE_OPTIONS="--max-old-space-size=8192"

# 2. Clear CLI cache
rm -rf ~/.n8n-node-cli/.n8n/custom

# 3. Manual node linking (when CLI fails)
mkdir -p ~/.n8n/custom
cp -r dist/* ~/.n8n/custom/
```

## 🎯 Who This Documentation Is For

- **n8n Community Node Developers** using the new CLI tool
- **Developers experiencing performance issues** with the CLI
- **Teams looking for reliable development workflows** with fallback strategies
- **Contributors** wanting to understand CLI tool limitations and improvements

## 🤝 Contributing

This documentation is community-driven! Help improve it by:

1. **Sharing your experience** with the CLI tool
2. **Reporting new issues** and solutions you've found
3. **Contributing performance benchmarks** from different systems
4. **Updating documentation** as new CLI versions are released

## 📊 Performance Expectations

| System Specs | CLI Performance | Recommendation |
|---------------|-----------------|----------------|
| 8GB+ RAM, SSD, Multi-core | Good | Use CLI directly |
| 4-8GB RAM, HDD | Slow/Hangs | Use external n8n approach |
| <4GB RAM | Poor | Use manual workflows |

## 🔗 Official Resources

- **[Official CLI Package](https://www.npmjs.com/package/@n8n/node-cli)** - npm registry
- **[n8n Documentation](https://docs.n8n.io/integrations/creating-nodes/)** - Complete node development guide
- **[n8n Community Forum](https://community.n8n.io/)** - Get help and share experiences
- **[n8n GitHub Repository](https://github.com/n8n-io/n8n)** - Source code and issues

## 📈 Version Tracking

| CLI Version | Release Date | Status | Key Changes |
|-------------|--------------|--------|-------------|
| 0.4.0 | Jan 2025 | Current | Initial release, performance issues |
| 0.5.x | TBD | Expected | Performance improvements |

## 📝 License

This documentation is provided under the MIT License. The @n8n/node-cli tool is developed by the n8n team.

---

**💡 Pro Tip:** Always have a backup development workflow ready when using bleeding-edge tools like the n8n CLI!
