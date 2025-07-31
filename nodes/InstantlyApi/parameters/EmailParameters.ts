import { INodeProperties } from 'n8n-workflow';

/**
 * Email operation parameters for Instantly API v2
 */
export const emailParameters: INodeProperties[] = [
	// EMAIL OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['email'],
			},
		},
		options: [
			{
				name: 'Get Many Emails',
				value: 'getMany',
				description: 'Get many emails from inbox',
				action: 'Get many emails',
			},
			{
				name: 'Get Email',
				value: 'get',
				description: 'Get a single email by ID',
				action: 'Get email',
			},
			{
				name: 'Reply to Email',
				value: 'reply',
				description: 'Reply to an existing email',
				action: 'Reply to email',
			},
			{
				name: 'Update Email',
				value: 'update',
				description: 'Update email properties',
				action: 'Update email',
			},
			{
				name: 'Delete Email',
				value: 'delete',
				description: 'Delete an email',
				action: 'Delete email',
			},
			{
				name: 'Get Unread Count',
				value: 'getUnreadCount',
				description: 'Get count of unread emails',
				action: 'Get unread count',
			},
			{
				name: 'Mark Thread as Read',
				value: 'markThreadAsRead',
				description: 'Mark all emails in a thread as read',
				action: 'Mark thread as read',
			},
		],
		default: 'getMany',
	},

	// GET MANY EMAILS PARAMETERS
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
				operation: ['getMany'],
			},
		},
		description: 'Search term to filter emails',
	},
	{
		displayName: 'Campaign ID',
		name: 'campaignId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['email'],
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
				resource: ['email'],
				operation: ['getMany'],
			},
		},
		description: 'Filter by email account',
	},
	{
		displayName: 'Is Unread',
		name: 'isUnread',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['email'],
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
				resource: ['email'],
				operation: ['getMany'],
			},
		},
		description: 'Filter emails with reminders',
	},
	{
		displayName: 'Mode',
		name: 'mode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['email'],
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
		description: 'Email mode filter',
	},
	{
		displayName: 'Email Type',
		name: 'emailType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['email'],
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
		description: 'Type of emails to retrieve',
	},
	{
		displayName: 'Lead Email',
		name: 'lead',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['email'],
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
				resource: ['email'],
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

	// GET SINGLE EMAIL PARAMETERS
	{
		displayName: 'Email ID',
		name: 'emailId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the email',
	},

	// REPLY TO EMAIL PARAMETERS
	{
		displayName: 'Reply To Email ID',
		name: 'replyToUuid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['reply'],
			},
		},
		default: '',
		description: 'The ID of the email to reply to',
	},
	{
		displayName: 'Email Account',
		name: 'eaccount',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
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
				resource: ['email'],
				operation: ['reply'],
			},
		},
		description: 'User ID to assign the lead to',
	},

	// UPDATE EMAIL PARAMETERS
	{
		displayName: 'Subject',
		name: 'subject',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['update'],
			},
		},
		description: 'Update email subject',
	},
	{
		displayName: 'Reminder Timestamp',
		name: 'reminderTs',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['email'],
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
				resource: ['email'],
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
		description: 'Mark email as read or unread',
	},
	{
		displayName: 'Is Focused',
		name: 'isFocused',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['email'],
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
		description: 'Mark email as focused or not',
	},
	{
		displayName: 'Interest Status',
		name: 'iStatus',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['update'],
			},
		},
		description: 'Interest status of the email',
	},

	// MARK THREAD AS READ PARAMETERS
	{
		displayName: 'Thread ID',
		name: 'threadId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['email'],
				operation: ['markThreadAsRead'],
			},
		},
		default: '',
		description: 'The ID of the email thread to mark as read',
	},
];
