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

## Usage Examples

### Create and Launch a Campaign
1. **Create Campaign**: Set up your email sequences and targeting
2. **Add Leads**: Import or create leads for your campaign
3. **Launch Campaign**: Activate your campaign to start sending emails

### Account Management Workflow
1. **Create Account**: Add new email accounts with SMTP settings
2. **Enable Warmup**: Start the warmup process for new accounts
3. **Monitor Status**: Check account health and sending limits
4. **Pause/Resume**: Control account activity as needed

### Lead Management Process
1. **Import Leads**: Create leads with custom variables
2. **Assign to Campaigns**: Add leads to specific email campaigns
3. **Track Engagement**: Monitor lead responses and interest levels
4. **Update Status**: Manage lead lifecycle and follow-up actions

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
- **Create Lead**: Add new leads with custom variables and data
- **Get Lead**: Retrieve detailed lead information by ID
- **Get Many Leads**: List leads with advanced filtering and pagination
- **Update Lead**: Modify lead details, status, and custom variables
- **Delete Lead**: Remove leads from your database
- **Add Lead to Campaign**: Create and assign leads to specific campaigns
- **Update Interest Status**: Manage lead engagement and interest levels

### 📊 **Analytics & Reporting**
- **Get Campaign Analytics**: Retrieve comprehensive campaign performance metrics and statistics

## Key Features

🚀 **Full API v2 Support**: Complete integration with Instantly's latest API
📊 **Comprehensive Operations**: 24 operations across campaigns, accounts, leads, and analytics
⚡ **Advanced Account Management**: Full warmup control and SMTP configuration
🎯 **Campaign Control**: Launch, pause, and manage email campaigns with precision
📈 **Lead Management**: Complete lead lifecycle management and campaign assignment
🔄 **Pagination Support**: Handle large datasets efficiently with built-in pagination
⚡ **Robust Error Handling**: Detailed error feedback and validation
🎯 **Resource Locators**: Intuitive account and campaign selection interface
📊 **Bulk Operations**: Manage multiple accounts and leads simultaneously
🔒 **Secure Integration**: API key-based authentication with proper credential management

## Requirements

- n8n v0.187.0 or higher
- Instantly account with API access (Hypergrowth plan or above)
- Valid Instantly API key

## Resources

- [Instantly API Documentation](https://developer.instantly.ai/api/v2)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [GitHub Repository](https://github.com/Instantly-ai/n8n-nodes-instantly)

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Instantly-ai/n8n-nodes-instantly/issues)
- **Email**: brandon@instantly.ai

## License

[MIT](LICENSE.md)
