# Contributing to n8n Node CLI Documentation

> **Help improve this community resource for @n8n/node-cli users**

## 🎯 How to Contribute

This documentation is **community-driven** and benefits from real-world experiences with the @n8n/node-cli tool. Your contributions help other developers avoid common pitfalls and use the tool more effectively.

## 🤝 Ways to Contribute

### 1. Share Your Experience

**Performance Benchmarks:**
- System specifications and CLI performance results
- Startup times, memory usage, build times
- Successful optimization strategies

**New Issues & Solutions:**
- Problems not covered in existing documentation
- Workarounds you've discovered
- System-specific issues and fixes

**Workflow Improvements:**
- Better development processes
- Automation scripts
- Team collaboration strategies

### 2. Documentation Improvements

**Content Updates:**
- Fix inaccuracies or outdated information
- Add missing troubleshooting steps
- Improve clarity and organization

**New Sections:**
- Advanced use cases
- Integration with other tools
- CI/CD pipeline configurations

**Examples & Code:**
- Working configuration examples
- Automation scripts
- Docker setups

### 3. Version Updates

**CLI Version Tracking:**
- Test new CLI versions as they're released
- Document changes in behavior
- Update performance benchmarks
- Verify if known issues are resolved

## 📝 Contribution Guidelines

### Before Contributing

1. **Check existing documentation** to avoid duplication
2. **Test your solutions** on real projects
3. **Document your system specs** for context
4. **Verify information accuracy**

### Content Standards

**Be Specific:**
```markdown
❌ "CLI is slow"
✅ "CLI takes 8-12 minutes to start on Intel i5, 8GB RAM, HDD"
```

**Include Context:**
```markdown
❌ "Use this workaround"
✅ "For systems with <8GB RAM, use external n8n approach:
    pnpm dev --external-n8n"
```

**Provide Complete Solutions:**
```markdown
❌ "Increase memory"
✅ "export NODE_OPTIONS='--max-old-space-size=8192'
    pnpm dev"
```

### Documentation Structure

**Follow Existing Patterns:**
- Use consistent heading levels
- Include code examples with syntax highlighting
- Add pros/cons for different approaches
- Provide system requirements context

**Use Standard Sections:**
- **Symptoms:** What users will see
- **Root Cause:** Why it happens
- **Solutions:** Step-by-step fixes
- **Expected Fix:** When official fix is expected

## 🚀 Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/bcharleson/n8n-node-cli.git
cd n8n-node-cli
```

### 2. Make Your Changes

**For New Issues:**
1. Add to `docs/known-issues.md`
2. Include workaround in `docs/troubleshooting.md`
3. Update `docs/alternative-workflows.md` if needed

**For Performance Data:**
1. Update `docs/performance-guide.md`
2. Add benchmarks with system specs
3. Include optimization tips

**For New Workflows:**
1. Add to `docs/alternative-workflows.md`
2. Update `docs/best-practices.md`
3. Include pros/cons comparison

### 3. Test Your Documentation

**Verify Information:**
- Test commands on real systems
- Confirm workarounds actually work
- Check links and references

**Review for Clarity:**
- Can a new user follow your instructions?
- Are system requirements clear?
- Is the context sufficient?

### 4. Submit Pull Request

**PR Title Format:**
```
Add: [Brief description]
Fix: [Brief description]
Update: [Brief description]
```

**PR Description Template:**
```markdown
## Changes Made
- Brief description of changes

## Testing Done
- System specs where tested
- Commands verified
- Results observed

## Context
- Why this change is needed
- What problem it solves
- Any related issues
```

## 📊 Contribution Types

### High-Value Contributions

**Performance Benchmarks:**
- System specs + CLI performance data
- Before/after optimization results
- Memory usage patterns

**New Workarounds:**
- Solutions for undocumented issues
- System-specific fixes
- Automation scripts

**Version Updates:**
- Testing new CLI releases
- Documenting behavior changes
- Updating known issues status

### Medium-Value Contributions

**Documentation Improvements:**
- Clarity enhancements
- Additional examples
- Better organization

**Workflow Enhancements:**
- Team collaboration tips
- Development process improvements
- Tool integrations

### All Contributions Welcome

**Even Small Improvements Help:**
- Typo fixes
- Link corrections
- Formatting improvements
- Additional context

## 🎯 Specific Needs

### Current Priority Areas

**Performance Data:**
- More system configurations
- Different operating systems
- Various Node.js versions

**Advanced Workflows:**
- CI/CD integration
- Docker configurations
- Team development setups

**Version Tracking:**
- CLI version 0.5.x testing
- Performance improvement verification
- New feature documentation

### System Configurations Needed

**Hardware Combinations:**
- Different RAM amounts (4GB, 8GB, 16GB, 32GB)
- Storage types (HDD, SSD, NVMe)
- CPU architectures (Intel, AMD, Apple Silicon)

**Operating Systems:**
- macOS versions
- Linux distributions
- Windows (including WSL)

**Development Environments:**
- Different Node.js versions
- Various package managers
- IDE integrations

## 🔍 Review Process

### What We Look For

**Accuracy:**
- Information is correct and tested
- Commands work as described
- System requirements are accurate

**Completeness:**
- Solutions include all necessary steps
- Context is provided
- Edge cases are considered

**Clarity:**
- Instructions are easy to follow
- Technical level is appropriate
- Examples are helpful

### Review Timeline

- **Simple fixes:** 1-2 days
- **New content:** 3-5 days
- **Major updates:** 1 week

## 🏆 Recognition

### Contributors

All contributors are recognized in:
- Repository contributors list
- Documentation credits
- Community acknowledgments

### Significant Contributions

**Major contributors receive:**
- Maintainer status consideration
- Direct collaboration opportunities
- Community recognition

## 📞 Questions?

**Need Help Contributing?**
- Open an issue with your question
- Join discussions in existing issues
- Reach out to maintainers

**Want to Discuss Ideas?**
- Create an issue for discussion
- Share your experience in issues
- Propose new documentation sections

---

**💡 Remember:** Every contribution helps the n8n community! Whether it's a small typo fix or a comprehensive new workflow, your input makes this resource better for everyone.
