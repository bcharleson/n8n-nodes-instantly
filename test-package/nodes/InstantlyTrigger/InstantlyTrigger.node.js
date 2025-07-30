import type {
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeApiError } from 'n8n-workflow';

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
					<h3>🚀 Automated Webhook Setup</h3>
					<p>This trigger automatically creates and manages webhooks in your Instantly account using the API.</p>

					<div style="background: #e8f5e8; border-left: 4px solid #4caf50; padding: 12px; margin: 10px 0;">
						<strong>✅ Fully Automated:</strong><br>
						• Webhook is automatically created when you activate this workflow<br>
						• No manual configuration in Instantly dashboard required<br>
						• Webhook is automatically deleted when workflow is deactivated<br>
						• Uses your Instantly API credentials for secure management
					</div>

					<div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 12px; margin: 10px 0;">
						<strong>📡 How it works:</strong><br>
						• Instantly sends <strong>HTTP POST</strong> requests to your webhook URL<br>
						• Content-Type: <code>application/json</code><br>
						• Each event includes an <code>event_type</code> field for identification<br>
						• Webhooks are configured per campaign using Instantly's API
					</div>

					<div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 12px; margin: 10px 0;">
						<strong>⚠️ Requirements:</strong><br>
						• Valid Instantly API credentials must be configured<br>
						• Campaign ID must be provided (found in your Instantly campaign URL)<br>
						• Workflow must be activated to create the webhook
					</div>
				`,
			},
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Enter your Instantly campaign ID',
				description: 'The ID of the campaign to monitor for webhook events. You can find this in your Instantly campaign URL.',
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
				try {
					const campaignId = this.getNodeParameter('campaignId') as string;
					const webhookUrl = this.getNodeWebhookUrl('default');

					// Get existing webhooks for the campaign
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'instantlyApi',
						{
							method: 'GET',
							url: `/api/v2/campaigns/webhooks`,
							qs: { campaign_id: campaignId },
						},
					);

					// Check if our webhook URL already exists
					if (Array.isArray(response)) {
						return response.some((webhook: any) => webhook.url === webhookUrl);
					}

					return false;
				} catch (error) {
					// If we can't check, assume it doesn't exist
					return false;
				}
			},
			async create(this: IHookFunctions): Promise<boolean> {
				try {
					const campaignId = this.getNodeParameter('campaignId') as string;
					const events = this.getNodeParameter('events') as string[];
					const webhookUrl = this.getNodeWebhookUrl('default');

					// Create webhook using the discovered API endpoint
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'instantlyApi',
						{
							method: 'POST',
							url: `/api/v2/campaigns/webhooks`,
							body: {
								campaign_id: campaignId,
								url: webhookUrl,
								events: events.includes('*') ? ['*'] : events,
								active: true,
							},
						},
					);

					// Store webhook ID for later deletion
					if (response && response.id) {
						await this.helpers.setValue('webhookId', response.id);
					}

					return true;
				} catch (error) {
					throw new NodeApiError(this.getNode(), error as JsonObject, {
						message: `Failed to create Instantly webhook: ${error.message}`,
					});
				}
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				try {
					const webhookId = await this.helpers.getValue('webhookId');

					if (webhookId) {
						// Delete the specific webhook
						await this.helpers.httpRequestWithAuthentication.call(
							this,
							'instantlyApi',
							{
								method: 'DELETE',
								url: `/api/v2/campaigns/webhooks/${webhookId}`,
							},
						);
					}

					return true;
				} catch (error) {
					// Don't throw error on deletion failure - just log it
					console.warn(`Failed to delete Instantly webhook: ${error.message}`);
					return true;
				}
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
