# n8n-nodes-instantly

This is an n8n community node for integrating with the [Instantly](https://instantly.ai) API v2. It provides comprehensive access to Instantly's email outreach platform, allowing you to manage campaigns, accounts, leads, and analytics directly from n8n workflows.

## Installation

### Community Nodes (Recommended)

For users on n8n v0.187.0+, install directly through the n8n interface:

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-instantly`
4. Click **Download**

### Manual Installation

```bash
npm install n8n-nodes-instantly
```

## Quick Setup

1. **Get API Key**: Go to [Instantly Dashboard](https://app.instantly.ai) → Settings → Integrations → API
2. **Add Node**: In n8n, search for "Instantly" in the node palette
3. **Configure Credentials**: Enter your Instantly API key
4. **Select Operation**: Choose from the available resources and operations below

## Supported Operations

### 📧 **Campaign Management**
- **Create Campaign**: Create new email campaigns with sequences and variants
- **Get Campaign**: Retrieve campaign details by ID
- **Get Many Campaigns**: List all campaigns with pagination
- **Update Campaign**: Modify campaign settings and content
- **Delete Campaign**: Remove campaigns
- **Launch Campaign**: Start campaign execution
- **Pause Campaign**: Pause running campaigns

### 👤 **Account Management**
- **Create Account**: Add new email accounts with SMTP configuration
- **Get Account**: Retrieve account details by email
- **Get Many Accounts**: List all email accounts
- **Update Account**: Modify account settings and limits
- **Delete Account**: Remove email accounts
- **Pause Account**: Stop account from sending emails
- **Resume Account**: Reactivate paused accounts
- **Enable Warmup**: Start email warmup process ✨
- **Disable Warmup**: Stop email warmup process ✨

### 🎯 **Lead Management**
- **Create Lead**: Add new leads to campaigns
- **Get Lead**: Retrieve lead information
- **Get Many Leads**: List leads with filtering options
- **Update Lead**: Modify lead details and status
- **Delete Lead**: Remove leads from campaigns
- **Add to Campaign**: Assign leads to specific campaigns
- **Remove from Campaign**: Unassign leads from campaigns

### 📊 **Analytics & Reporting**
- **Get Campaign Summary**: Retrieve campaign performance metrics
- **Get Campaign Count**: Get campaign statistics and counts

## Key Features

✨ **Recently Fixed**: Warmup operations now working with correct API v2 endpoints
🚀 **Full API v2 Support**: Complete integration with Instantly's latest API
📊 **Bulk Operations**: Manage multiple accounts and leads simultaneously
🔄 **Pagination Support**: Handle large datasets efficiently
⚡ **Error Handling**: Robust error handling with detailed feedback
🎯 **Resource Locators**: Easy account and campaign selection

## Requirements

- n8n v0.187.0 or higher
- Instantly account with API access (Hypergrowth plan or above)
- Valid Instantly API key

## Resources

- [Instantly API Documentation](https://developer.instantly.ai/api/v2)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/bcharleson/n8n-nodes-instantly)

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/bcharleson/n8n-nodes-instantly/issues)
- **Email**: brandon@instantly.ai

## License

[MIT](LICENSE.md)
