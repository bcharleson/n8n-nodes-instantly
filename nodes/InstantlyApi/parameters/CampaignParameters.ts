import { INodeProperties } from 'n8n-workflow';
import { TIMEZONE_OPTIONS, DEFAULT_TIMEZONE } from '../functions/timezoneOptions';

/**
 * Campaign parameter definitions
 * Extracted from InstantlyApi.node.ts to maintain exact compatibility
 */

export const campaignParameters: INodeProperties[] = [
	// CAMPAIGN OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a campaign',
				action: 'Create a campaign',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a campaign',
				action: 'Delete a campaign',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a campaign',
				action: 'Get a campaign',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many campaigns',
				action: 'Get many campaigns',
			},
			{
				name: 'Launch',
				value: 'launch',
				description: 'Launch (activate) a campaign',
				action: 'Launch a campaign',
			},
			{
				name: 'Pause',
				value: 'pause',
				description: 'Pause a campaign',
				action: 'Pause a campaign',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a campaign',
				action: 'Update a campaign',
			},
		],
		default: 'create',
	},

	// Campaign Selector
	{
		displayName: 'Campaign',
		name: 'campaignId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a campaign...',
				typeOptions: {
					searchListMethod: 'getCampaigns',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 01234567-89ab-cdef-0123-456789abcdef',
			},
		],
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['get', 'update', 'delete', 'launch', 'pause'],
			},
		},
		description: 'The campaign to operate on. Choose from the list, or specify an ID.',
	},

	// Campaign Name
	{
		displayName: 'Campaign Name',
		name: 'name',
		type: 'string',
		required: false,
		default: '',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		description: 'The name of the campaign (leave empty to keep current name)',
	},
	{
		displayName: 'Campaign Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		description: 'The name of the campaign',
	},

	// Additional Fields for Update Campaign
	{
		displayName: 'Additional Fields',
		name: 'updateAdditionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		options: [
			// Basic Campaign Settings
			{
				displayName: 'Positive Lead Value',
				name: 'plValue',
				type: 'number',
				default: 0,
				description: 'Value of every positive lead',
			},
			{
				displayName: 'Is Evergreen',
				name: 'isEvergreen',
				type: 'boolean',
				default: false,
				description: 'Whether the campaign is evergreen',
			},

			// Email Settings
			{
				displayName: 'Email Gap (Minutes)',
				name: 'emailGap',
				type: 'number',
				default: 10,
				description: 'The gap between emails in minutes',
			},
			{
				displayName: 'Random Wait Max (Minutes)',
				name: 'randomWaitMax',
				type: 'number',
				default: 10,
				description: 'The maximum random wait time in minutes',
			},
			{
				displayName: 'Text Only',
				name: 'textOnly',
				type: 'boolean',
				default: false,
				description: 'Whether the campaign is text only',
			},
			{
				displayName: 'Daily Limit',
				name: 'dailyLimit',
				type: 'number',
				default: 100,
				description: 'The daily limit for sending emails',
			},
			{
				displayName: 'Daily Max Leads',
				name: 'dailyMaxLeads',
				type: 'number',
				default: 100,
				description: 'The daily maximum new leads to contact',
			},

			// Email Accounts and Lists
			{
				displayName: 'Email Accounts',
				name: 'emailList',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getEmailAccounts',
				},
				default: [],
				description: 'List of email accounts to use for sending emails',
			},
			{
				displayName: 'Email Tag List',
				name: 'emailTagList',
				type: 'string',
				default: '',
				description: 'Comma-separated list of tag UUIDs to use for sending emails',
			},
			{
				displayName: 'CC List',
				name: 'ccList',
				type: 'string',
				default: '',
				description: 'Comma-separated list of email addresses to CC on emails',
			},
			{
				displayName: 'BCC List',
				name: 'bccList',
				type: 'string',
				default: '',
				description: 'Comma-separated list of email addresses to BCC on emails',
			},

			// Tracking Settings
			{
				displayName: 'Link Tracking',
				name: 'linkTracking',
				type: 'boolean',
				default: true,
				description: 'Whether to track links in emails',
			},
			{
				displayName: 'Open Tracking',
				name: 'openTracking',
				type: 'boolean',
				default: true,
				description: 'Whether to track opens in emails',
			},

			// Reply and Auto-Reply Settings
			{
				displayName: 'Stop on Reply',
				name: 'stopOnReply',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the campaign on reply',
			},
			{
				displayName: 'Stop on Auto Reply',
				name: 'stopOnAutoReply',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the campaign on auto reply',
			},
			{
				displayName: 'Stop for Company',
				name: 'stopForCompany',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the campaign for the entire company (domain) when a lead replies',
			},

			// Lead Management
			{
				displayName: 'Prioritize New Leads',
				name: 'prioritizeNewLeads',
				type: 'boolean',
				default: false,
				description: 'Whether to prioritize new leads',
			},
			{
				displayName: 'Match Lead ESP',
				name: 'matchLeadEsp',
				type: 'boolean',
				default: false,
				description: 'Whether to match leads by ESP',
			},

			// Security and Compliance
			{
				displayName: 'Insert Unsubscribe Header',
				name: 'insertUnsubscribeHeader',
				type: 'boolean',
				default: false,
				description: 'Whether to insert an unsubscribe header in emails',
			},
			{
				displayName: 'Allow Risky Contacts',
				name: 'allowRiskyContacts',
				type: 'boolean',
				default: false,
				description: 'Whether to allow risky contacts',
			},
			{
				displayName: 'Disable Bounce Protect',
				name: 'disableBounceProtect',
				type: 'boolean',
				default: false,
				description: 'Whether to disable bounce protection',
			},

			// Auto Variant Select
			{
				displayName: 'Auto Variant Select Trigger',
				name: 'autoVariantSelectTrigger',
				type: 'options',
				options: [
					{
						name: 'None',
						value: '',
					},
					{
						name: 'Click Rate',
						value: 'click_rate',
					},
					{
						name: 'Open Rate',
						value: 'open_rate',
					},
					{
						name: 'Reply Rate',
						value: 'reply_rate',
					},
				],
				default: '',
				description: 'Auto variant select trigger setting',
			},

		],
	},

	// Campaign Schedule for Update
	{
		displayName: 'Campaign Schedule',
		name: 'campaignSchedule',
		type: 'collection',
		placeholder: 'Add Schedule',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'When to start the campaign (optional)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'When to end the campaign (optional)',
			},
			{
				displayName: 'Schedules',
				name: 'schedules',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'schedule',
						displayName: 'Schedule',
						values: [
							{
								displayName: 'Schedule Name',
								name: 'name',
								type: 'string',
								default: 'Default Schedule',
								description: 'Name of the schedule',
							},
							{
								displayName: 'From Time',
								name: 'from',
								type: 'string',
								default: '09:00',
								placeholder: '09:00',
								description: 'Start time in HH:MM format (24-hour)',
							},
							{
								displayName: 'To Time',
								name: 'to',
								type: 'string',
								default: '17:00',
								placeholder: '17:00',
								description: 'End time in HH:MM format (24-hour)',
							},
							{
								displayName: 'Timezone',
								name: 'timezone',
								type: 'options',
								default: DEFAULT_TIMEZONE,
								options: TIMEZONE_OPTIONS,
								description: 'Timezone for the schedule',
							},
							{
								displayName: 'Days of Week',
								name: 'days',
								type: 'multiOptions',
								options: [
									{ name: 'Sunday', value: '0' },
									{ name: 'Monday', value: '1' },
									{ name: 'Tuesday', value: '2' },
									{ name: 'Wednesday', value: '3' },
									{ name: 'Thursday', value: '4' },
									{ name: 'Friday', value: '5' },
									{ name: 'Saturday', value: '6' },
								],
								default: ['1', '2', '3', '4', '5'],
								description: 'Days of the week to send emails',
							},
						],
					},
				],
			},
		],
	},

	// Return All for campaigns
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},

	// Limit for campaigns
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
				resource: ['campaign'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},

	// ===== CAMPAIGN SCHEDULE (REQUIRED) =====
	{
		displayName: 'Schedule Name',
		name: 'scheduleName',
		type: 'string',
		required: true,
		default: 'Default Schedule',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		description: 'Name for the campaign schedule',
	},

	{
		displayName: 'Start Time',
		name: 'scheduleStartTime',
		type: 'string',
		required: true,
		default: '09:00',
		placeholder: 'HH:MM (e.g., 09:00)',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		description: 'Start time for sending emails (24-hour format)',
	},

	{
		displayName: 'End Time',
		name: 'scheduleEndTime',
		type: 'string',
		required: true,
		default: '17:00',
		placeholder: 'HH:MM (e.g., 17:00)',
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		description: 'End time for sending emails (24-hour format)',
	},

	{
		displayName: 'Days of Week',
		name: 'scheduleDays',
		type: 'multiOptions',
		required: true,
		default: ['1', '2', '3', '4', '5'],
		options: [
			{ name: 'Sunday', value: '0' },
			{ name: 'Monday', value: '1' },
			{ name: 'Tuesday', value: '2' },
			{ name: 'Wednesday', value: '3' },
			{ name: 'Thursday', value: '4' },
			{ name: 'Friday', value: '5' },
			{ name: 'Saturday', value: '6' },
		],
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		description: 'Days of the week to send emails',
	},

	{
		displayName: 'Timezone',
		name: 'scheduleTimezone',
		type: 'options',
		required: true,
		default: DEFAULT_TIMEZONE,
		options: TIMEZONE_OPTIONS,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		description: 'Timezone for the campaign schedule',
	},

	// ===== ADDITIONAL FIELDS SECTION =====
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['create'],
			},
		},
		options: [
			// Campaign Dates
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'When to start the campaign (optional)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'When to end the campaign (optional)',
			},

			// Lead Value and Evergreen
			{
				displayName: 'Lead Value',
				name: 'plValue',
				type: 'number',
				default: 0,
				description: 'Value of every positive lead',
			},
			{
				displayName: 'Is Evergreen',
				name: 'isEvergreen',
				type: 'boolean',
				default: false,
				description: 'Whether the campaign is evergreen (continues indefinitely)',
			},

			// Email Timing Settings
			{
				displayName: 'Email Gap (minutes)',
				name: 'emailGap',
				type: 'number',
				default: 10,
				description: 'The gap between emails in minutes',
			},
			{
				displayName: 'Random Wait Max (minutes)',
				name: 'randomWaitMax',
				type: 'number',
				default: 10,
				description: 'The maximum random wait time in minutes',
			},

			// Email Format and Limits
			{
				displayName: 'Text Only',
				name: 'textOnly',
				type: 'boolean',
				default: false,
				description: 'Whether the campaign should send text-only emails',
			},
			{
				displayName: 'Daily Limit',
				name: 'dailyLimit',
				type: 'number',
				default: 100,
				description: 'The daily limit for sending emails',
			},
			{
				displayName: 'Daily Max Leads',
				name: 'dailyMaxLeads',
				type: 'number',
				default: 100,
				description: 'The daily maximum new leads to contact',
			},

			// Tracking Settings
			{
				displayName: 'Link Tracking',
				name: 'linkTracking',
				type: 'boolean',
				default: true,
				description: 'Whether to track links in emails',
			},
			{
				displayName: 'Open Tracking',
				name: 'openTracking',
				type: 'boolean',
				default: true,
				description: 'Whether to track opens in emails',
			},

			// Reply Handling
			{
				displayName: 'Stop on Reply',
				name: 'stopOnReply',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the campaign when a lead replies',
			},
			{
				displayName: 'Stop on Auto Reply',
				name: 'stopOnAutoReply',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the campaign on auto reply',
			},
			{
				displayName: 'Stop for Company',
				name: 'stopForCompany',
				type: 'boolean',
				default: false,
				description: 'Whether to stop the campaign for the entire company when a lead replies',
			},

			// Lead Management
			{
				displayName: 'Prioritize New Leads',
				name: 'prioritizeNewLeads',
				type: 'boolean',
				default: false,
				description: 'Whether to prioritize new leads',
			},
			{
				displayName: 'Match Lead ESP',
				name: 'matchLeadEsp',
				type: 'boolean',
				default: false,
				description: 'Whether to match leads by ESP (Email Service Provider)',
			},

			// Safety and Compliance
			{
				displayName: 'Insert Unsubscribe Header',
				name: 'insertUnsubscribeHeader',
				type: 'boolean',
				default: false,
				description: 'Whether to insert an unsubscribe header in emails',
			},
			{
				displayName: 'Allow Risky Contacts',
				name: 'allowRiskyContacts',
				type: 'boolean',
				default: false,
				description: 'Whether to allow risky contacts',
			},
			{
				displayName: 'Disable Bounce Protect',
				name: 'disableBounceProtect',
				type: 'boolean',
				default: false,
				description: 'Whether to disable bounce protection',
			},

			// Email Lists
			{
				displayName: 'Email List',
				name: 'emailList',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'john@example.com',
				description: 'List of email accounts to use for sending emails',
			},
			{
				displayName: 'Email Tag List',
				name: 'emailTagList',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'tag-uuid',
				description: 'List of email tag UUIDs to use for sending emails',
			},
			{
				displayName: 'CC List',
				name: 'ccList',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'cc@example.com',
				description: 'List of email addresses to CC on emails',
			},
			{
				displayName: 'BCC List',
				name: 'bccList',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'bcc@example.com',
				description: 'List of email addresses to BCC on emails',
			},

			// Email Sequence Builder
			{
				displayName: 'Email Sequence Steps',
				name: 'sequenceSteps',
				type: 'collection',
				placeholder: 'Add Email Step',
				default: {},
				description: 'Build your email sequence step by step. First step has no delay, subsequent steps require delay in days.',
				options: [
					{
						displayName: 'Sequence Steps',
						name: 'steps',
						type: 'fixedCollection',
						default: {},
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								displayName: 'Email Step',
								name: 'step',
								values: [
									{
										displayName: 'Step Number',
										name: 'stepNumber',
										type: 'number',
										default: 1,
										description: 'Step number in the sequence (auto-calculated, for reference)',
										typeOptions: {
											minValue: 1,
										},
									},
									{
										displayName: 'Delay (Days)',
										name: 'delay',
										type: 'number',
										default: 1,
										description: 'Number of days to wait before sending this email (not required for first step)',
										displayOptions: {
											hide: {
												stepNumber: [1],
											},
										},
										typeOptions: {
											minValue: 1,
											maxValue: 365,
										},
									},
									{
										displayName: 'Email Subject',
										name: 'subject',
										type: 'string',
										default: '',
										required: true,
										description: 'Subject line for this email step. Supports both Instantly variables ({{firstName}}) and n8n expressions ({{ $json.fieldName }}) for maximum flexibility.',
										placeholder: 'e.g., Hi {{firstName}}, your order {{ $json.orderNumber }} is ready!',
										hint: 'Use {{firstName}} for Instantly personalization, {{ $json.field }} for n8n data',
									},
									{
										displayName: 'Email Body',
										name: 'body',
										type: 'string',
										default: '',
										required: true,
										typeOptions: {
											rows: 6,
										},
										description: 'Email content for this step. Mix Instantly variables ({{firstName}}) with n8n expressions ({{ $json.data }}) seamlessly. Line breaks are preserved.',
										placeholder: 'Hi {{firstName}},\n\nYour order {{ $json.orderNumber }} for {{companyName}} is ready!\n\nBest regards,\n{{senderName}}',
										hint: 'Instantly vars: {{firstName}}, {{lastName}} | n8n data: {{ $json.field }}',
									},
								],
							},
						],
					},
				],
			},

			// Auto Variant Select
			{
				displayName: 'Auto Variant Select Trigger',
				name: 'autoVariantSelectTrigger',
				type: 'options',
				default: '',
				options: [
					{ name: 'None', value: '' },
					{ name: 'Click Rate', value: 'click_rate' },
					{ name: 'Open Rate', value: 'open_rate' },
					{ name: 'Reply Rate', value: 'reply_rate' },
				],
				description: 'Trigger for automatic variant selection',
			},
		],
	},
];
