# n8n-nodes-instantly

This is an n8n community node for integrating with the [Instantly](https://instantly.ai) API. It provides comprehensive integration with **automated webhook management**, allowing you to create, retrieve, and manage your Instantly resources directly from n8n workflows.

## ✨ Key Features

- 🚀 **Automated Webhook Management**: Webhooks are automatically created and deleted via API
- 📧 **Complete API Coverage**: Support for all major Instantly API v2 endpoints
- 🎯 **17 Event Types**: Monitor email sends, opens, replies, bounces, and more
- 🔒 **Secure Authentication**: Bearer token authentication with credential management
- ⚡ **Zero Manual Setup**: No need to configure webhooks in Instantly dashboard

## Installation

### Community Nodes (Recommended)

For users on n8n v0.187.0+, you can install this node directly through the n8n interface:

1. Go to **Settings > Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-instantly` and click **Download**

### Manual Installation

To install this node manually:

```bash
npm install n8n-nodes-instantly
```

## Quick Start

### 🚀 Automated Webhook Setup (InstantlyTrigger)

1. Create an Instantly account at [instantly.ai](https://instantly.ai)
2. Generate an API key from the Instantly dashboard
3. In n8n, add the **InstantlyTrigger** node to your workflow
4. Configure your Instantly API credentials
5. Enter your **Campaign ID** (found in your Instantly campaign URL)
6. Select the events you want to monitor
7. **Activate the workflow** - webhook is automatically created! ✨

**No manual webhook configuration required!** The node automatically:
- Creates webhooks when workflows are activated
- Deletes webhooks when workflows are deactivated
- Handles all API authentication and error management

### 📧 API Operations (Instantly Node)

1. Add the **Instantly** action node to your workflow
2. Set up the credentials using your Instantly API key
3. Choose your operation (Create Lead, Send Campaign, etc.)
4. Configure the node options according to your needs

## Features

This package includes two nodes for comprehensive Instantly integration:

### 🔄 Instantly Node (Action Node)
Perform operations on your Instantly resources:

#### Campaign Operations
- **Create**: Create a new email campaign
- **Get**: Retrieve a specific campaign by ID
- **Get Many**: Get a list of all campaigns
- **Update**: Update an existing campaign
- **Delete**: Delete a campaign

#### Account Operations
- **Create**: Create a new email account
- **Get**: Retrieve a specific account by email
- **Get Many**: Get a list of all accounts
- **Update**: Update an existing account
- **Delete**: Delete an account

#### Lead Operations
- **Create**: Create a new lead
- **Get**: Retrieve a specific lead by ID
- **Get Many**: Get a list of all leads
- **Update**: Update an existing lead
- **Delete**: Delete a lead

### ⚡ Instantly Trigger Node (Automated Webhook Trigger)
🚀 **Fully automated webhook management** - no manual setup required!

#### 🎯 Supported Webhook Events (17 Total)
- **Email Events**: `email_sent`, `email_opened`, `email_bounced`, `link_clicked`
- **Reply Events**: `reply_received`, `auto_reply_received`
- **Lead Status Events**: `lead_interested`, `lead_not_interested`, `lead_neutral`
- **Lead Actions**: `lead_closed`, `lead_out_of_office`, `lead_wrong_person`
- **Meeting Events**: `lead_meeting_booked`, `lead_meeting_completed`
- **Campaign Events**: `campaign_completed`, `account_error`
- **Subscription Events**: `lead_unsubscribed`

#### ✨ Automated Features
- **🚀 Zero Manual Setup**: Webhooks created automatically via API
- **🎯 Event Filtering**: Choose specific events or monitor all events
- **📊 Campaign-Specific**: Monitors events for your specified campaign
- **🔄 Auto Cleanup**: Webhooks automatically deleted when workflow deactivated
- **🔒 Secure**: Uses your Instantly API credentials for authentication
- **⚡ Instant Activation**: Ready to receive events immediately after activation

#### 🛠️ Automated Setup Process
1. **Configure Campaign ID**: Enter your Instantly campaign ID
2. **Select Events**: Choose which events to monitor
3. **Activate Workflow**: Webhook is automatically created! ✨
4. **Start Receiving Events**: No additional configuration needed

**🎉 That's it!** No manual webhook configuration in Instantly dashboard required.

## Resources

- [Instantly API Documentation](https://developer.instantly.ai/api/v2)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
