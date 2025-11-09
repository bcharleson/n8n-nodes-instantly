import { INodeProperties } from 'n8n-workflow';

/**
 * Unibox operation parameters for Instantly API v2
 * 
 * These parameters manage messages in the Instantly Unibox (inbox).
 * They are for viewing, replying to, and managing received/sent emails.
 * 
 * NOTE: These are NOT for configuring SMTP email accounts - use Account resource for that.
 */
export const uniboxParameters: INodeProperties[] = [
	// UNIBOX OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['unibox'],
			},
		},
		options: [
			{
				name: 'Get Many Unibox Messages',
				value: 'getMany',
				description: 'Get many messages from the Instantly Unibox (inbox)',
				action: 'Get many unibox messages',
			},
			{
				name: 'Get Unibox Message',
				value: 'get',
				description: 'Get a single Unibox message by ID',
				action: 'Get unibox message',
			},
			{
				name: 'Reply to Unibox Message',
				value: 'reply',
				description: 'Reply to an existing Unibox message',
				action: 'Reply to unibox message',
			},
			{
				name: 'Update Unibox Message',
				value: 'update',
				description: 'Update Unibox message properties (subject, read status, etc.)',
				action: 'Update unibox message',
			},
			{
				name: 'Delete Unibox Message',
				value: 'delete',
				description: 'Delete a Unibox message',
				action: 'Delete unibox message',
			},
			{
				name: 'Get Unread Count',
				value: 'getUnreadCount',
				description: 'Get count of unread messages in Unibox',
				action: 'Get unread count',
			},
			{
				name: 'Mark Thread as Read',
				value: 'markThreadAsRead',
				description: 'Mark all messages in a Unibox thread as read',
				action: 'Mark thread as read',
			},
		],
		default: 'getMany',
	},

	// GET MANY UNIBOX MESSAGES PARAMETERS
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},

	// FILTERS FOR GET MANY - Individual parameters
	{
		displayName: 'Search',
		name: 'search',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		description: 'Search term to filter Unibox messages',
	},
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		description: 'Filter by campaign ID',
	},
	{
		displayName: 'Email Account',
		name: 'eaccount',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		description: 'Filter by email account (sender/receiver)',
	},
	{
		displayName: 'Is Unread',
		name: 'isUnread',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		description: 'Filter by unread status',
	},
	{
		displayName: 'Has Reminder',
		name: 'hasReminder',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		description: 'Filter messages with reminders',
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'Focused',
				value: 'emode_focused',
			},
			{
				name: 'Others',
				value: 'emode_others',
			},
			{
				name: 'All',
				value: 'emode_all',
			},
		],
		default: 'emode_all',
		description: 'Unibox message mode filter',
	},
	{
		displayName: 'Email Type',
		name: 'emailType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'Received',
				value: 'received',
			},
			{
				name: 'Sent',
				value: 'sent',
			},
			{
				name: 'Manual',
				value: 'manual',
			},
		],
		default: 'received',
		description: 'Type of messages to retrieve',
	},
	{
		displayName: 'Lead Email',
		name: 'lead',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		description: 'Filter by lead email address',
	},
	{
		displayName: 'Sort Order',
		name: 'sortOrder',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				name: 'Ascending',
				value: 'asc',
			},
			{
				name: 'Descending',
				value: 'desc',
			},
		],
		default: 'desc',
		description: 'Sort order for results',
	},

	// GET SINGLE UNIBOX MESSAGE PARAMETERS
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the Unibox message',
	},

	// REPLY TO UNIBOX MESSAGE PARAMETERS
	{
		displayName: 'Reply To Message ID',
		name: 'replyToUuid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		default: '',
		description: 'The ID of the Unibox message to reply to',
	},
	{
		displayName: 'Email Account',
		name: 'eaccount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		default: '',
		description: 'Email account to send the reply from',
	},
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		default: '',
		description: 'Subject line of the reply',
	},
	{
		displayName: 'Body Type',
		name: 'bodyType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		options: [
			{
				name: 'HTML',
				value: 'html',
			},
			{
				name: 'Text',
				value: 'text',
			},
			{
				name: 'Both',
				value: 'both',
			},
		],
		default: 'html',
		description: 'Type of email body to send',
	},
	{
		displayName: 'HTML Body',
		name: 'bodyHtml',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
				bodyType: ['html', 'both'],
			},
		},
		default: '',
		description: 'HTML content of the email',
	},
	{
		displayName: 'Text Body',
		name: 'bodyText',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
				bodyType: ['text', 'both'],
			},
		},
		default: '',
		description: 'Text content of the email',
	},

	// REPLY ADDITIONAL FIELDS
	{
		displayName: 'CC Email List',
		name: 'ccAddressEmailList',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		description: 'Comma-separated list of CC email addresses',
	},
	{
		displayName: 'BCC Email List',
		name: 'bccAddressEmailList',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		description: 'Comma-separated list of BCC email addresses',
	},
	{
		displayName: 'Reminder Timestamp',
		name: 'reminderTs',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		description: 'Schedule email for later sending',
	},
	{
		displayName: 'Assigned To',
		name: 'assignedTo',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['reply'],
			},
		},
		description: 'User ID to assign the lead to',
	},

	// UPDATE UNIBOX MESSAGE PARAMETERS
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['update'],
			},
		},
		description: 'Update message subject',
	},
	{
		displayName: 'Reminder Timestamp',
		name: 'reminderTs',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['update'],
			},
		},
		description: 'Set or update reminder timestamp',
	},
	{
		displayName: 'Is Unread',
		name: 'isUnread',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Unread',
				value: 1,
			},
			{
				name: 'Read',
				value: 0,
			},
		],
		default: 1,
		description: 'Mark message as read or unread',
	},
	{
		displayName: 'Is Focused',
		name: 'isFocused',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Focused',
				value: 1,
			},
			{
				name: 'Not Focused',
				value: 0,
			},
		],
		default: 1,
		description: 'Mark message as focused or not',
	},
	{
		displayName: 'Interest Status',
		name: 'iStatus',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['update'],
			},
		},
		description: 'Interest status of the message',
	},

	// MARK THREAD AS READ PARAMETERS
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['unibox'],
				operation: ['markThreadAsRead'],
			},
		},
		default: '',
		description: 'The ID of the Unibox thread to mark as read',
	},
];
