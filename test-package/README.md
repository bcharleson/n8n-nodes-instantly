# n8n-nodes-instantly-testing

⚠️ **Testing Package** - This is a testing version of the InstantlyTrigger webhook node for n8n. Not intended for production use.

## 🚀 **NEW: Automated Webhook Management!**

This testing version includes **fully automated webhook management** - no manual setup required!

✨ **Key Features:**
- 🚀 **Zero Manual Setup**: Webhooks automatically created via API
- 🎯 **Campaign-Specific**: Monitor events for specific campaigns
- 🔄 **Auto Cleanup**: Webhooks deleted when workflow deactivated
- 🔒 **Secure**: Uses your Instantly API credentials

## 🧪 Purpose

This package contains a testing version of the InstantlyTrigger webhook node for n8n, designed to handle webhook events from the Instantly.ai platform with **automated webhook management**. This testing package allows for cloud-based testing of the enhanced webhook functionality before the production release.

## 📦 Installation

Install this package in your n8n instance:

```bash
npm install n8n-nodes-instantly-testing
```

Or using the n8n community nodes interface:
1. Go to **Settings → Community Nodes**
2. Enter: `n8n-nodes-instantly-testing`
3. Click **Install**

## 🔧 Usage

### Adding the Trigger Node

1. Create a new workflow in n8n
2. Look for **"Instantly Trigger (Testing)"** in the node palette under the **Trigger** section
3. Add the node to your workflow
4. Configure the trigger settings

### Webhook Configuration

1. **Copy the webhook URL** from the InstantlyTrigger node
2. **In your Instantly account:**
   - Go to **Settings → Integrations**
   - Click **Add Webhook**
   - Enter the webhook URL from n8n
   - Select the campaign and events you want to monitor
   - Click **Add Webhook**

### Event Types Supported

The InstantlyTrigger node supports all Instantly webhook event types:

#### Email Events
- `email_sent` - When an email is sent in a campaign
- `email_opened` - When a lead opens an email
- `email_bounced` - When an email bounces
- `link_clicked` - When a lead clicks a link in an email

#### Engagement Events
- `reply_received` - When a lead replies to an email
- `auto_reply_received` - When an auto-reply is received

#### Lead Status Events
- `lead_interested` - When a lead is marked as interested
- `lead_not_interested` - When a lead is marked as not interested
- `lead_neutral` - When a lead is marked as neutral
- `lead_closed` - When a lead is marked as closed
- `lead_out_of_office` - When a lead is marked as out of office
- `lead_wrong_person` - When a lead is marked as wrong person

#### Meeting Events
- `lead_meeting_booked` - When a meeting is booked with a lead
- `lead_meeting_completed` - When a meeting with a lead is completed

#### System Events
- `campaign_completed` - When a campaign is completed
- `account_error` - When there is an account error
- `lead_unsubscribed` - When a lead unsubscribes

### Configuration Options

#### Event Filtering
- **All Events**: Trigger on any webhook event
- **Specific Events**: Select only the events you want to monitor

#### Additional Filters
- **Campaign Filter**: Only trigger for specific campaign ID
- **Lead Email Filter**: Only trigger for specific lead email
- **Debug Mode**: Enable detailed logging for troubleshooting

## 🧪 Testing

### Manual Testing

1. **Set up the trigger** in your n8n workflow
2. **Configure webhook** in Instantly with the provided URL
3. **Trigger events** in Instantly (send emails, mark leads, etc.)
4. **Verify workflow execution** in n8n

### Test Webhook Payload

You can test the webhook endpoint directly:

```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "reply_received",
    "timestamp": "2025-01-25T17:30:00.000Z",
    "workspace": "test-workspace",
    "campaign_id": "test-campaign-123",
    "campaign_name": "Test Campaign",
    "lead_email": "test@example.com",
    "email_account": "sender@company.com",
    "reply_text": "Thanks for reaching out!"
  }'
```

## 🔍 Troubleshooting

### Webhook Not Triggering

1. **Check webhook URL** - Ensure it's correctly configured in Instantly
2. **Verify event types** - Make sure the events you're testing are selected
3. **Enable debug mode** - Turn on debug logging to see detailed information
4. **Check n8n logs** - Look for error messages in the n8n console

### Debug Mode

Enable debug mode in the node configuration to see detailed logging:
- Webhook payloads received
- Event filtering decisions
- Campaign and lead email filtering
- Workflow trigger decisions

## ⚠️ Important Notes

- **Testing Package**: This is for testing purposes only
- **Cloud Testing**: Designed for testing on cloud n8n instances
- **Not Production Ready**: Do not use in production workflows
- **Temporary**: This package may be removed after testing is complete

## 🔗 Links

- **GitHub Repository**: https://github.com/bcharleson/n8n-nodes-instantly
- **Issues**: https://github.com/bcharleson/n8n-nodes-instantly/issues
- **Instantly API Documentation**: https://developer.instantly.ai/

## 📄 License

MIT License - See LICENSE file for details.

## 👤 Author

Brandon Charleson ([@bcharleson](https://github.com/bcharleson))

---

**Note**: This testing package will be replaced by the production `n8n-nodes-instantly` package once testing is complete.
