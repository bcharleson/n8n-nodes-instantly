import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { paginateInstantlyApi } from '../functions/paginationHelpers';
import { IInstantlyApiContext, IPaginationOptions } from '../types/common';

/**
 * Email operations handler for Instantly API v2
 */
export class EmailOperations {
	/**
	 * Get many emails with pagination and filtering support
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
			// Get all emails with pagination
			const allEmails = await paginateInstantlyApi(context, '/api/v2/emails', 'items', queryParams);
			return { items: allEmails };
		} else {
			// Get single page with specified limit
			queryParams.limit = limit;
			return await instantlyApiRequest.call(context, 'GET', '/api/v2/emails', {}, queryParams);
		}
	}

	/**
	 * Get single email by ID
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailId = context.getNodeParameter('emailId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'GET', `/api/v2/emails/${emailId}`);
	}

	/**
	 * Reply to an email
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
	 * Update an email
	 */
	static async update(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailId = context.getNodeParameter('emailId', itemIndex) as string;
		
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

		return await instantlyApiRequest.call(context, 'PATCH', `/api/v2/emails/${emailId}`, updateFields);
	}

	/**
	 * Delete an email
	 */
	static async delete(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailId = context.getNodeParameter('emailId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'DELETE', `/api/v2/emails/${emailId}`);
	}

	/**
	 * Get unread email count
	 */
	static async getUnreadCount(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		return await instantlyApiRequest.call(context, 'GET', '/api/v2/emails/unread/count');
	}

	/**
	 * Mark thread as read
	 */
	static async markThreadAsRead(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const threadId = context.getNodeParameter('threadId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'POST', `/api/v2/emails/threads/${threadId}/mark-as-read`);
	}
}
