import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class InstantlyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Trigger',
		name: 'instantlyTrigger',
		icon: 'file:instantly.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Handle Instantly webhook events',
		defaults: {
			name: 'Instantly Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'instantlyApi',
				required: true,
			},
		],
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
				displayName: 'Setup Instructions',
				name: 'setupNotice',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {},
				},
				description: `
					<h3>Webhook Setup Instructions</h3>
					<p>To use this trigger, you need to configure a webhook in your Instantly account:</p>
					<ol>
						<li>Go to your <strong>Instantly Settings</strong></li>
						<li>Navigate to the <strong>Integrations</strong> tab</li>
						<li>Click <strong>Add Webhook</strong></li>
						<li>Enter this URL: <code>{{$webhookUrl}}</code></li>
						<li>Select the campaign and events you want to monitor</li>
						<li>Click <strong>Add Webhook</strong></li>
					</ol>
					<p><strong>Note:</strong> Webhooks are configured per campaign in Instantly.</p>
				`,
			},
			{
				displayName: 'Trigger On',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'All Events',
						value: '*',
						description: 'Trigger on all webhook events',
					},
					{
						name: 'Email Sent',
						value: 'email_sent',
						description: 'When an email is sent in a campaign',
					},
					{
						name: 'Email Opened',
						value: 'email_opened',
						description: 'When a lead opens an email',
					},
					{
						name: 'Reply Received',
						value: 'reply_received',
						description: 'When a lead replies to an email',
					},
					{
						name: 'Auto Reply Received',
						value: 'auto_reply_received',
						description: 'When an auto-reply is received',
					},
					{
						name: 'Link Clicked',
						value: 'link_clicked',
						description: 'When a lead clicks a link in an email',
					},
					{
						name: 'Email Bounced',
						value: 'email_bounced',
						description: 'When an email bounces',
					},
					{
						name: 'Lead Unsubscribed',
						value: 'lead_unsubscribed',
						description: 'When a lead unsubscribes',
					},
					{
						name: 'Account Error',
						value: 'account_error',
						description: 'When there is an account error',
					},
					{
						name: 'Campaign Completed',
						value: 'campaign_completed',
						description: 'When a campaign is completed',
					},
					{
						name: 'Lead Interested',
						value: 'lead_interested',
						description: 'When a lead is marked as interested',
					},
					{
						name: 'Lead Not Interested',
						value: 'lead_not_interested',
						description: 'When a lead is marked as not interested',
					},
					{
						name: 'Lead Neutral',
						value: 'lead_neutral',
						description: 'When a lead is marked as neutral',
					},
					{
						name: 'Lead Meeting Booked',
						value: 'lead_meeting_booked',
						description: 'When a meeting is booked with a lead',
					},
					{
						name: 'Lead Meeting Completed',
						value: 'lead_meeting_completed',
						description: 'When a meeting with a lead is completed',
					},
					{
						name: 'Lead Closed',
						value: 'lead_closed',
						description: 'When a lead is marked as closed',
					},
					{
						name: 'Lead Out of Office',
						value: 'lead_out_of_office',
						description: 'When a lead is marked as out of office',
					},
					{
						name: 'Lead Wrong Person',
						value: 'lead_wrong_person',
						description: 'When a lead is marked as wrong person',
					},
				],
				required: true,
				default: [],
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
					},
					{
						displayName: 'Lead Email Filter',
						name: 'leadEmailFilter',
						type: 'string',
						default: '',
						description: 'Only trigger for specific lead email (optional)',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				// Since Instantly webhooks are configured through UI, 
				// we can't programmatically check if they exist
				// Always return true to indicate the webhook endpoint is ready
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				// Since Instantly webhooks are configured through UI,
				// we can't programmatically create them
				// Always return true to indicate the webhook endpoint is ready
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				// Since Instantly webhooks are configured through UI,
				// we can't programmatically delete them
				// Always return true to indicate cleanup is complete
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const events = this.getNodeParameter('events', []) as string[];
		const additionalFields = this.getNodeParameter('additionalFields', {}) as IDataObject;

		// Validate that we have the required event_type field
		if (!bodyData.event_type) {
			return {};
		}

		const eventType = bodyData.event_type as string;

		// Check if this event type should trigger the workflow
		if (!events.includes('*') && !events.includes(eventType)) {
			return {};
		}

		// Apply campaign filter if specified
		if (additionalFields.campaignFilter) {
			const campaignFilter = additionalFields.campaignFilter as string;
			if (bodyData.campaign_id !== campaignFilter) {
				return {};
			}
		}

		// Apply lead email filter if specified
		if (additionalFields.leadEmailFilter) {
			const leadEmailFilter = additionalFields.leadEmailFilter as string;
			if (bodyData.lead_email !== leadEmailFilter) {
				return {};
			}
		}

		// Return the webhook data to trigger the workflow
		return {
			workflowData: [this.helpers.returnJsonArray([bodyData])],
		};
	}
}
