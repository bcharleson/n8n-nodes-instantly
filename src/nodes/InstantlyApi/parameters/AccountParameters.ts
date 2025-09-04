import { INodeProperties } from 'n8n-workflow';

/**
 * Account parameter definitions
 * Extracted from InstantlyApi.node.ts to maintain exact compatibility
 */

export const accountParameters: INodeProperties[] = [
	// ACCOUNT OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['account'],
			},
		},
		options: [
			{
				name: 'Get Many Accounts',
				value: 'getMany',
				description: 'Get many email accounts',
				action: 'Get many email accounts',
			},
			{
				name: 'Get Single Account',
				value: 'get',
				description: 'Get a single email account by email address',
				action: 'Get a single email account',
			},
			{
				name: 'Pause Account',
				value: 'pause',
				description: 'Pause an email account to stop sending',
				action: 'Pause an email account',
			},
			{
				name: 'Resume Account',
				value: 'resume',
				description: 'Resume a paused email account',
				action: 'Resume an email account',
			},
			{
				name: 'Create Account',
				value: 'create',
				description: 'Create a new email account',
				action: 'Create an email account',
			},
			{
				name: 'Delete Account',
				value: 'deleteAccount',
				description: 'Delete an email account',
				action: 'Delete an email account',
			},
			{
				name: 'Enable Warmup',
				value: 'enableWarmup',
				description: 'Enable warmup for an email account',
				action: 'Enable account warmup',
			},
			{
				name: 'Disable Warmup',
				value: 'disableWarmup',
				description: 'Disable warmup for an email account',
				action: 'Disable account warmup',
			},
			{
				name: 'Update Account',
				value: 'update',
				description: 'Update account settings and details',
				action: 'Update an email account',
			},
		],
		default: 'getMany',
	},

	// Email Account Selector
	{
		displayName: 'Email Account',
		name: 'emailAccount',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select an email account...',
				typeOptions: {
					searchListMethod: 'getEmailAccounts',
					searchable: true,
				},
			},
			{
				displayName: 'By Email',
				name: 'email',
				type: 'string',
				placeholder: 'e.g. user@example.com',
			},
		],
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['get', 'pause', 'resume', 'update', 'deleteAccount', 'enableWarmup', 'disableWarmup'],
			},
		},
		description: 'The email account to operate on. Choose from the list, or specify an email address.',
	},

	// Continue on Error option for pause/resume operations
	{
		displayName: 'Continue on Error',
		name: 'continueOnError',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['pause', 'resume'],
			},
		},
		description: 'Whether to continue execution if the account is already in the target state (e.g., trying to resume an already active account). When enabled, the operation will succeed with a warning message instead of failing.',
	},

	// Return All for accounts
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},

	// Limit for accounts
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// Update Account Fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'The first name for the account',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'The last name for the account',
			},
			{
				displayName: 'Daily Limit',
				name: 'dailyLimit',
				type: 'number',
				default: 100,
				description: 'Daily email sending limit',
			},
			{
				displayName: 'Tracking Domain Name',
				name: 'trackingDomainName',
				type: 'string',
				default: '',
				description: 'Tracking domain for the account',
			},
			{
				displayName: 'Tracking Domain Status',
				name: 'trackingDomainStatus',
				type: 'string',
				default: '',
				description: 'Status of the tracking domain',
			},
			{
				displayName: 'Enable Slow Ramp',
				name: 'enableSlowRamp',
				type: 'boolean',
				default: false,
				description: 'Whether to enable slow ramp up for sending limits',
			},
			{
				displayName: 'Inbox Placement Test Limit',
				name: 'inboxPlacementTestLimit',
				type: 'number',
				default: 10,
				description: 'The limit for inbox placement tests',
			},
			{
				displayName: 'Sending Gap (Minutes)',
				name: 'sendingGap',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1440,
				},
				default: 10,
				description: 'The gap between emails sent from this account in minutes (0-1440)',
			},
			{
				displayName: 'Skip CNAME Check',
				name: 'skipCnameCheck',
				type: 'boolean',
				default: false,
				description: 'Skip CNAME check for tracking domain',
			},
			{
				displayName: 'Remove Tracking Domain',
				name: 'removeTrackingDomain',
				type: 'boolean',
				default: false,
				description: 'Whether to remove the tracking domain from the account',
			},
			{
				displayName: 'Warmup Configuration',
				name: 'warmup',
				type: 'collection',
				placeholder: 'Add Warmup Setting',
				default: {},
				description: 'Warmup configuration for the account',
				options: [
					{
						displayName: 'Warmup Limit',
						name: 'limit',
						type: 'number',
						default: 100,
						description: 'Daily warmup email limit',
					},
					{
						displayName: 'Reply Rate',
						name: 'replyRate',
						type: 'number',
						typeOptions: {
							numberPrecision: 2,
							minValue: 0,
							maxValue: 1,
						},
						default: 0.1,
						description: 'Reply rate for warmup emails (0.0 to 1.0)',
					},
					{
						displayName: 'Warmup Custom Tag',
						name: 'warmupCustomFtag',
						type: 'string',
						default: 'warmup',
						description: 'Custom tag for warmup emails',
					},
					{
						displayName: 'Increment',
						name: 'increment',
						type: 'options',
						options: [
							{
								name: 'Disabled',
								value: 'disabled',
							},
							{
								name: 'Enabled',
								value: 'enabled',
							},
						],
						default: 'disabled',
						description: 'Whether to enable warmup increment',
					},
				],
			},
			{
				displayName: 'Warmup Daily Increase',
				name: 'warmupDailyIncrease',
				type: 'number',
				default: 5,
				description: 'The daily increase for warmup',
			},
		],
	},

	// CREATE ACCOUNT PARAMETERS
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'user@example.com',
		description: 'The email address for the new account',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'The password for the email account',
	},
	{
		displayName: 'SMTP Host',
		name: 'smtpHost',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'smtp.gmail.com',
		description: 'The SMTP server hostname',
	},
	{
		displayName: 'SMTP Port',
		name: 'smtpPort',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		default: 587,
		description: 'The SMTP server port (usually 587 for TLS or 465 for SSL)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'First name for the account',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Last name for the account',
			},
			{
				displayName: 'Signature',
				name: 'signature',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Email signature for the account',
			},
			{
				displayName: 'Enable Warmup',
				name: 'warmupEnabled',
				type: 'boolean',
				default: true,
				description: 'Whether to enable warmup for this account',
			},
		],
	},
];
