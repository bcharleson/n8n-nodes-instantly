# Manual Installation Instructions

## Option 1: n8n Custom Nodes Directory
1. Copy this entire folder to: `~/.n8n/custom/`
2. Restart n8n
3. The node should appear in the nodes panel

## Option 2: n8n Docker Custom Nodes
1. Copy this folder to your n8n custom nodes volume
2. Restart the n8n container
3. The node should be available

## Option 3: Development Environment
1. Copy this folder to your n8n development environment
2. Run `npm run build` in the n8n root
3. Restart n8n in development mode

## Verification
- Look for "Instantly API" in the nodes panel
- Select it and verify "Email" appears as a resource option
- Test the email operations with your Instantly API credentials
