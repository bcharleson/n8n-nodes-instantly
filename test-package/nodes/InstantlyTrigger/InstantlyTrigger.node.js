const { NodeConnectionTypes } = require('n8n-workflow');

class InstantlyTrigger {
    constructor() {
        this.description = {
            displayName: 'Instantly Trigger (Testing)',
            name: 'instantlyTrigger',
            icon: 'file:instantly.svg',
            group: ['trigger'],
            version: 1,
            subtitle: '={{$parameter["events"].join(", ")}}',
            description: 'Handle Instantly webhook events - Testing Version',
            defaults: {
                name: 'Instantly Trigger (Testing)',
            },
            inputs: [],
            outputs: [NodeConnectionTypes.Main],
            credentials: [],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Testing Notice',
                    name: 'testingNotice',
                    type: 'notice',
                    default: '',
                    displayOptions: {
                        show: {},
                    },
                    description: `
                        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
                            <strong>⚠️ Testing Package</strong><br>
                            This is a testing version of the InstantlyTrigger node.<br>
                            <em>Not intended for production use.</em>
                        </div>
                    `,
                },
                {
                    displayName: 'Webhook Setup Instructions',
                    name: 'setupNotice',
                    type: 'notice',
                    default: '',
                    displayOptions: {
                        show: {},
                    },
                    description: `
                        <h3>🔗 Webhook Setup Instructions</h3>
                        <p>To use this trigger, configure a webhook in your Instantly account:</p>
                        <ol>
                            <li>Go to <strong>Instantly Settings → Integrations</strong></li>
                            <li>Click <strong>Add Webhook</strong></li>
                            <li>Enter this URL: <code>{{$webhookUrl}}</code></li>
                            <li>Select campaign and events to monitor</li>
                            <li>Click <strong>Add Webhook</strong></li>
                        </ol>
                        <p><em>Note: Webhooks are configured per campaign in Instantly.</em></p>
                    `,
                },
                {
                    displayName: 'Trigger On',
                    name: 'events',
                    type: 'multiOptions',
                    options: [
                        { name: 'All Events', value: '*', description: 'Trigger on all webhook events' },
                        { name: 'Email Sent', value: 'email_sent', description: 'When an email is sent in a campaign' },
                        { name: 'Email Opened', value: 'email_opened', description: 'When a lead opens an email' },
                        { name: 'Reply Received', value: 'reply_received', description: 'When a lead replies to an email' },
                        { name: 'Auto Reply Received', value: 'auto_reply_received', description: 'When an auto-reply is received' },
                        { name: 'Link Clicked', value: 'link_clicked', description: 'When a lead clicks a link in an email' },
                        { name: 'Email Bounced', value: 'email_bounced', description: 'When an email bounces' },
                        { name: 'Lead Unsubscribed', value: 'lead_unsubscribed', description: 'When a lead unsubscribes' },
                        { name: 'Account Error', value: 'account_error', description: 'When there is an account error' },
                        { name: 'Campaign Completed', value: 'campaign_completed', description: 'When a campaign is completed' },
                        { name: 'Lead Interested', value: 'lead_interested', description: 'When a lead is marked as interested' },
                        { name: 'Lead Not Interested', value: 'lead_not_interested', description: 'When a lead is marked as not interested' },
                        { name: 'Lead Neutral', value: 'lead_neutral', description: 'When a lead is marked as neutral' },
                        { name: 'Lead Meeting Booked', value: 'lead_meeting_booked', description: 'When a meeting is booked with a lead' },
                        { name: 'Lead Meeting Completed', value: 'lead_meeting_completed', description: 'When a meeting with a lead is completed' },
                        { name: 'Lead Closed', value: 'lead_closed', description: 'When a lead is marked as closed' },
                        { name: 'Lead Out of Office', value: 'lead_out_of_office', description: 'When a lead is marked as out of office' },
                        { name: 'Lead Wrong Person', value: 'lead_wrong_person', description: 'When a lead is marked as wrong person' },
                    ],
                    required: true,
                    default: ['*'],
                    description: 'Select which events should trigger this workflow',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Campaign Filter',
                            name: 'campaignFilter',
                            type: 'string',
                            default: '',
                            description: 'Only trigger for specific campaign ID (optional)',
                            placeholder: 'campaign-id-123',
                        },
                        {
                            displayName: 'Lead Email Filter',
                            name: 'leadEmailFilter',
                            type: 'string',
                            default: '',
                            description: 'Only trigger for specific lead email (optional)',
                            placeholder: 'lead@example.com',
                        },
                        {
                            displayName: 'Debug Mode',
                            name: 'debugMode',
                            type: 'boolean',
                            default: false,
                            description: 'Enable debug logging for webhook events',
                        },
                    ],
                },
            ],
        };

        this.webhookMethods = {
            default: {
                async checkExists() {
                    return true;
                },
                async create() {
                    return true;
                },
                async delete() {
                    return true;
                },
            },
        };
    }

    async webhook() {
        const bodyData = this.getBodyData();
        const events = this.getNodeParameter('events', []);
        const additionalFields = this.getNodeParameter('additionalFields', {});

        // Debug logging if enabled
        if (additionalFields.debugMode) {
            console.log('🔔 InstantlyTrigger (Testing) webhook received:', JSON.stringify(bodyData, null, 2));
        }

        // Validate that we have the required event_type field
        if (!bodyData.event_type) {
            if (additionalFields.debugMode) {
                console.log('❌ Missing event_type field');
            }
            return {};
        }

        const eventType = bodyData.event_type;
        
        if (additionalFields.debugMode) {
            console.log(`🎯 Processing event: ${eventType}`);
        }

        // Check if this event type should trigger the workflow
        if (!events.includes('*') && !events.includes(eventType)) {
            if (additionalFields.debugMode) {
                console.log(`⏭️  Event ${eventType} not in filter: ${events.join(', ')}`);
            }
            return {};
        }

        // Apply campaign filter if specified
        if (additionalFields.campaignFilter) {
            if (bodyData.campaign_id !== additionalFields.campaignFilter) {
                if (additionalFields.debugMode) {
                    console.log(`⏭️  Campaign filter mismatch: ${bodyData.campaign_id} !== ${additionalFields.campaignFilter}`);
                }
                return {};
            }
        }

        // Apply lead email filter if specified
        if (additionalFields.leadEmailFilter) {
            if (bodyData.lead_email !== additionalFields.leadEmailFilter) {
                if (additionalFields.debugMode) {
                    console.log(`⏭️  Lead email filter mismatch: ${bodyData.lead_email} !== ${additionalFields.leadEmailFilter}`);
                }
                return {};
            }
        }

        if (additionalFields.debugMode) {
            console.log('✅ Webhook triggering workflow!');
        }

        // Return the webhook data to trigger the workflow
        return {
            workflowData: [this.helpers.returnJsonArray([bodyData])],
        };
    }
}

module.exports = {
    InstantlyTrigger,
};
