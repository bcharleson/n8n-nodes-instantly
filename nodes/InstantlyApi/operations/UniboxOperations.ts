import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { paginateInstantlyApi } from '../functions/paginationHelpers';
import { IInstantlyApiContext, IPaginationOptions } from '../types/common';

/**
 * Unibox operations handler for Instantly API v2
 *
 * These operations manage messages in the Instantly Unibox (inbox).
 * They are for viewing, replying to, and managing received/sent emails.
 *
 * NOTE: These are NOT for configuring SMTP email accounts - use Account operations for that.
 */
export class UniboxOperations {
	/**
	 * Get many Unibox messages with pagination and filtering support
	 */
	static async getMany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Validate limit doesn't exceed 100
		if (limit > 100) {
			throw new NodeOperationError(context.getNode(), 'Limit cannot exceed 100. Instantly API has a maximum limit of 100.', { itemIndex });
		}

		// Build query parameters
		const queryParams: any = {};

		// Optional filters
		const search = context.getNodeParameter('search', itemIndex, '') as string;
		const campaignId = context.getNodeParameter('campaignId', itemIndex, '') as string;
		const eaccount = context.getNodeParameter('eaccount', itemIndex, '') as string;
		const isUnread = context.getNodeParameter('isUnread', itemIndex, undefined) as boolean | undefined;
		const hasReminder = context.getNodeParameter('hasReminder', itemIndex, undefined) as boolean | undefined;
		const mode = context.getNodeParameter('mode', itemIndex, '') as string;
		const emailType = context.getNodeParameter('emailType', itemIndex, '') as string;
		const lead = context.getNodeParameter('lead', itemIndex, '') as string;
		const sortOrder = context.getNodeParameter('sortOrder', itemIndex, 'desc') as string;

		if (search) queryParams.search = search;
		if (campaignId) queryParams.campaign_id = campaignId;
		if (eaccount) queryParams.eaccount = eaccount;
		if (isUnread !== undefined) queryParams.is_unread = isUnread;
		if (hasReminder !== undefined) queryParams.has_reminder = hasReminder;
		if (mode) queryParams.mode = mode;
		if (emailType) queryParams.email_type = emailType;
		if (lead) queryParams.lead = lead;
		if (sortOrder) queryParams.sort_order = sortOrder;

		if (returnAll) {
			// Get all Unibox messages with pagination
			// Note: When filters are applied, we need to manually paginate
			let allMessages: any[] = [];
			let startingAfter: string | undefined;
			let hasMore = true;

			while (hasMore) {
				const paginationParams: any = { ...queryParams, limit: 100 };
				if (startingAfter) {
					paginationParams.starting_after = startingAfter;
				}

				const response = await instantlyApiRequest.call(context, 'GET', '/api/v2/emails', {}, paginationParams);

				// Handle response structure
				let itemsData: any[] = [];
				if (response.items && Array.isArray(response.items)) {
					itemsData = response.items;
				} else if (response.data && Array.isArray(response.data)) {
					itemsData = response.data;
				} else if (Array.isArray(response)) {
					itemsData = response;
				}

				if (itemsData.length > 0) {
					allMessages = allMessages.concat(itemsData);
					// Get the last item's ID for pagination
					const lastItem = itemsData[itemsData.length - 1];
					startingAfter = lastItem.id || lastItem._id;

					// Check if there are more items
					if (itemsData.length < 100) {
						hasMore = false;
					}
				} else {
					hasMore = false;
				}
			}

			return { items: allMessages };
		} else {
			// Get single page with specified limit
			queryParams.limit = limit;
			return await instantlyApiRequest.call(context, 'GET', '/api/v2/emails', {}, queryParams);
		}
	}

	/**
	 * Get single Unibox message by ID
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const messageId = context.getNodeParameter('messageId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'GET', `/api/v2/emails/${messageId}`);
	}

	/**
	 * Reply to a Unibox message
	 */
	static async reply(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const replyToUuid = context.getNodeParameter('replyToUuid', itemIndex) as string;
		const eaccount = context.getNodeParameter('eaccount', itemIndex) as string;
		const subject = context.getNodeParameter('subject', itemIndex) as string;

		// Body can be HTML or text
		const bodyHtml = context.getNodeParameter('bodyHtml', itemIndex, '') as string;
		const bodyText = context.getNodeParameter('bodyText', itemIndex, '') as string;

		// Optional fields
		const ccAddressEmailList = context.getNodeParameter('ccAddressEmailList', itemIndex, '') as string;
		const bccAddressEmailList = context.getNodeParameter('bccAddressEmailList', itemIndex, '') as string;
		const reminderTs = context.getNodeParameter('reminderTs', itemIndex, '') as string;
		const assignedTo = context.getNodeParameter('assignedTo', itemIndex, '') as string;

		// Build request body
		const body: any = {
			reply_to_uuid: replyToUuid,
			eaccount,
			subject,
			body: {}
		};

		// Add body content (at least one is required)
		if (bodyHtml) body.body.html = bodyHtml;
		if (bodyText) body.body.text = bodyText;

		// Validate that at least one body type is provided
		if (!bodyHtml && !bodyText) {
			throw new NodeOperationError(context.getNode(), 'Either HTML body or text body must be provided', { itemIndex });
		}

		// Add optional fields
		if (ccAddressEmailList) body.cc_address_email_list = ccAddressEmailList;
		if (bccAddressEmailList) body.bcc_address_email_list = bccAddressEmailList;
		if (reminderTs) body.reminder_ts = reminderTs;
		if (assignedTo) body.assigned_to = assignedTo;

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/emails/reply', body);
	}

	/**
	 * Update a Unibox message
	 */
	static async update(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const messageId = context.getNodeParameter('messageId', itemIndex) as string;

		// Build update fields
		const updateFields: any = {};

		const subject = context.getNodeParameter('subject', itemIndex, '') as string;
		const reminderTs = context.getNodeParameter('reminderTs', itemIndex, '') as string;
		const isUnread = context.getNodeParameter('isUnread', itemIndex, undefined) as number | undefined;
		const isFocused = context.getNodeParameter('isFocused', itemIndex, undefined) as number | undefined;
		const iStatus = context.getNodeParameter('iStatus', itemIndex, undefined) as number | undefined;

		if (subject) updateFields.subject = subject;
		if (reminderTs) updateFields.reminder_ts = reminderTs;
		if (isUnread !== undefined) updateFields.is_unread = isUnread;
		if (isFocused !== undefined) updateFields.is_focused = isFocused;
		if (iStatus !== undefined) updateFields.i_status = iStatus;

		// Validate that at least one field is being updated
		if (Object.keys(updateFields).length === 0) {
			throw new NodeOperationError(context.getNode(), 'At least one field must be provided for update', { itemIndex });
		}

		return await instantlyApiRequest.call(context, 'PATCH', `/api/v2/emails/${messageId}`, updateFields);
	}

	/**
	 * Delete a Unibox message
	 */
	static async delete(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const messageId = context.getNodeParameter('messageId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'DELETE', `/api/v2/emails/${messageId}`);
	}

	/**
	 * Get unread Unibox message count
	 */
	static async getUnreadCount(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		return await instantlyApiRequest.call(context, 'GET', '/api/v2/emails/unread/count');
	}

	/**
	 * Mark Unibox thread as read
	 */
	static async markThreadAsRead(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const threadId = context.getNodeParameter('threadId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'POST', `/api/v2/emails/threads/${threadId}/mark-as-read`);
	}
}

