# n8n-nodes-instantly

This is an n8n community node for integrating with the [Instantly](https://instantly.ai) API. It allows you to create, retrieve, and manage your Instantly resources directly from n8n workflows.

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

## Usage

1. Create an Instantly account at [instantly.ai](https://instantly.ai)
2. Generate an API key from the Instantly dashboard
3. In n8n, add the Instantly node to your workflow
4. Set up the credentials using your Instantly API key
5. Configure the node options according to your needs

## Features

This node supports the following resources and operations:

### Campaign Operations
- **Create**: Create a new email campaign
- **Get**: Retrieve a specific campaign by ID
- **Get Many**: Get a list of all campaigns
- **Update**: Update an existing campaign
- **Delete**: Delete a campaign

### Account Operations
- **Create**: Create a new email account
- **Get**: Retrieve a specific account by email
- **Get Many**: Get a list of all accounts
- **Update**: Update an existing account
- **Delete**: Delete an account

### Lead Operations
- **Create**: Create a new lead
- **Get**: Retrieve a specific lead by ID
- **Get Many**: Get a list of all leads
- **Update**: Update an existing lead
- **Delete**: Delete a lead

## Resources

- [Instantly API Documentation](https://api-docs.instantly.ai/)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
