import { INodeProperties } from 'n8n-workflow';

/**
 * Lead parameter definitions
 * Enhanced with comprehensive API coverage following established patterns
 */

export const leadParameters: INodeProperties[] = [
	// LEAD OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lead'],
			},
		},
		options: [
			{
				name: 'Add Lead to Campaign',
				value: 'addToCampaign',
				description: 'Create a lead and add to campaign',
				action: 'Add lead to campaign',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a lead',
				action: 'Create a lead',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a lead',
				action: 'Delete a lead',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a lead',
				action: 'Get a lead',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many leads',
				action: 'Get many leads',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a lead',
				action: 'Update a lead',
			},
			{
				name: 'Update Interest Status',
				value: 'updateInterestStatus',
				description: 'Update lead interest status',
				action: 'Update lead interest status',
			},
		],
		default: 'create',
	},

	// ========================================
	// LEAD SELECTION (for Get, Update, Delete)
	// ========================================
	{
		displayName: 'Lead',
		name: 'leadId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['get', 'update', 'delete'],
			},
		},
		description: 'The lead to operate on',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a lead...',
				typeOptions: {
					searchListMethod: 'getLeads',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 01234567-89ab-cdef-0123-456789abcdef',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
							errorMessage: 'Not a valid lead ID',
						},
					},
				],
			},
		],
	},

	// ========================================
	// CREATE LEAD PARAMETERS
	// ========================================
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		description: 'The email address of the lead',
	},

	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		description: 'First name of the lead',
	},

	{
		displayName: 'Last Name',
		name: 'last_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		description: 'Last name of the lead',
	},

	{
		displayName: 'Company Name',
		name: 'company_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		description: 'Company name of the lead',
	},

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number of the lead',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website of the lead',
			},
			{
				displayName: 'Personalization',
				name: 'personalization',
				type: 'string',
				default: '',
				description: 'Personalization message for the lead',
			},
			{
				displayName: 'Campaign',
				name: 'campaign',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Campaign to associate with the lead',
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
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
									errorMessage: 'Not a valid campaign ID',
								},
							},
						],
					},
				],
			},
		],
	},

	// ========================================
	// UPDATE LEAD PARAMETERS
	// ========================================
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Campaign',
				name: 'campaign',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Campaign to associate with the lead',
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
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
									errorMessage: 'Not a valid campaign ID',
								},
							},
						],
					},
				],
			},
			{
				displayName: 'Company Name',
				name: 'company_name',
				type: 'string',
				default: '',
				description: 'Company name of the lead',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
				description: 'Email address of the lead',
			},
			{
				displayName: 'First Name',
				name: 'first_name',
				type: 'string',
				default: '',
				description: 'First name of the lead',
			},
			{
				displayName: 'Interest Status',
				name: 'lt_interest_status',
				type: 'options',
				default: 1,
				options: [
					{
						name: 'Out of Office',
						value: 0,
					},
					{
						name: 'Interested',
						value: 1,
					},
					{
						name: 'Meeting Booked',
						value: 2,
					},
					{
						name: 'Meeting Completed',
						value: 3,
					},
					{
						name: 'Closed',
						value: 4,
					},
					{
						name: 'Not Interested',
						value: -1,
					},
					{
						name: 'Wrong Person',
						value: -2,
					},
					{
						name: 'Lost',
						value: -3,
					},
				],
				description: 'Lead interest status',
			},
			{
				displayName: 'Last Name',
				name: 'last_name',
				type: 'string',
				default: '',
				description: 'Last name of the lead',
			},
			{
				displayName: 'Personalization',
				name: 'personalization',
				type: 'string',
				default: '',
				description: 'Personalization message for the lead',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number of the lead',
			},
			{
				displayName: 'Potential Value',
				name: 'pl_value_lead',
				type: 'string',
				default: '',
				description: 'Potential value of the lead',
			},
			{
				displayName: 'Website',
				name: 'website',
				type: 'string',
				default: '',
				description: 'Website of the lead',
			},
		],
	},

	// ========================================
	// UPDATE INTEREST STATUS PARAMETERS
	// ========================================
	{
		displayName: 'Interest Status',
		name: 'interestStatus',
		type: 'options',
		required: true,
		default: 1,
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateInterestStatus'],
			},
		},
		options: [
			{
				name: 'Out of Office',
				value: 0,
			},
			{
				name: 'Interested',
				value: 1,
			},
			{
				name: 'Meeting Booked',
				value: 2,
			},
			{
				name: 'Meeting Completed',
				value: 3,
			},
			{
				name: 'Closed',
				value: 4,
			},
			{
				name: 'Not Interested',
				value: -1,
			},
			{
				name: 'Wrong Person',
				value: -2,
			},
			{
				name: 'Lost',
				value: -3,
			},
		],
		description: 'New interest status for the lead',
	},

	{
		displayName: 'Lead IDs',
		name: 'leadIds',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['updateInterestStatus'],
			},
		},
		description: 'Comma-separated list of lead IDs to update',
	},

	// ========================================
	// GET MANY LEADS PARAMETERS
	// ========================================
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['lead'],
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
				resource: ['lead'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},

	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Campaign',
				name: 'campaign',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Filter by campaign',
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
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
									errorMessage: 'Not a valid campaign ID',
								},
							},
						],
					},
				],
			},
			{
				displayName: 'ESP Code',
				name: 'esp_code',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Google',
						value: 1,
					},
					{
						name: 'In Queue',
						value: 0,
					},
					{
						name: 'Libero.it',
						value: 13,
					},
					{
						name: 'Microsoft',
						value: 2,
					},
					{
						name: 'Not Found',
						value: 1000,
					},
					{
						name: 'Other',
						value: 999,
					},
					{
						name: 'Web.de',
						value: 12,
					},
					{
						name: 'Yahoo',
						value: 9,
					},
					{
						name: 'Yandex',
						value: 10,
					},
					{
						name: 'Zoho',
						value: 3,
					},
				],
				description: 'Filter by ESP (Email Service Provider) code',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Active',
						value: 'FILTER_VAL_ACTIVE',
					},
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Closed',
						value: 'FILTER_LEAD_CLOSED',
					},
					{
						name: 'Completed',
						value: 'FILTER_VAL_COMPLETED',
					},
					{
						name: 'Contacted',
						value: 'FILTER_VAL_CONTACTED',
					},
					{
						name: 'Interested',
						value: 'FILTER_LEAD_INTERESTED',
					},
					{
						name: 'Meeting Booked',
						value: 'FILTER_LEAD_MEETING_BOOKED',
					},
					{
						name: 'Meeting Completed',
						value: 'FILTER_LEAD_MEETING_COMPLETED',
					},
					{
						name: 'Not Contacted',
						value: 'FILTER_VAL_NOT_CONTACTED',
					},
					{
						name: 'Not Interested',
						value: 'FILTER_LEAD_NOT_INTERESTED',
					},
					{
						name: 'Unsubscribed',
						value: 'FILTER_VAL_UNSUBSCRIBED',
					},
				],
				description: 'Filter criteria for leads',
			},
			{
				displayName: 'Campaign',
				name: 'campaign',
				type: 'resourceLocator',
				default: { mode: 'list', value: '' },
				description: 'Filter by campaign',
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
						validation: [
							{
								type: 'regex',
								properties: {
									regex: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
									errorMessage: 'Not a valid campaign ID',
								},
							},
						],
					},
				],
			},
			{
				displayName: 'In Campaign',
				name: 'in_campaign',
				type: 'boolean',
				default: true,
				description: 'Whether the lead is in a campaign',
			},
			{
				displayName: 'ESP Code',
				name: 'esp_code',
				type: 'options',
				default: '',
				options: [
					{
						name: 'All',
						value: '',
					},
					{
						name: 'Google',
						value: 1,
					},
					{
						name: 'In Queue',
						value: 0,
					},
					{
						name: 'Libero.it',
						value: 13,
					},
					{
						name: 'Microsoft',
						value: 2,
					},
					{
						name: 'Not Found',
						value: 1000,
					},
					{
						name: 'Other',
						value: 999,
					},
					{
						name: 'Web.de',
						value: 12,
					},
					{
						name: 'Yahoo',
						value: 9,
					},
					{
						name: 'Yandex',
						value: 10,
					},
					{
						name: 'Zoho',
						value: 3,
					},
				],
				description: 'Filter by ESP (Email Service Provider) code',
			},
		],
	},

	// ========================================
	// ADD LEAD TO CAMPAIGN OPERATION
	// ========================================

	// Campaign Selection (Required)
	{
		displayName: 'Campaign',
		name: 'campaign',
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
				resource: ['lead'],
				operation: ['addToCampaign'],
			},
		},
		description: 'Campaign to add the lead to',
	},

	// Core Lead Fields (Required)
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addToCampaign'],
			},
		},
		description: 'Email address of the lead',
	},

	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addToCampaign'],
			},
		},
		description: 'First name of the lead',
	},

	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addToCampaign'],
			},
		},
		description: 'Last name of the lead',
	},

	// Personalization Field
	{
		displayName: 'Personalization',
		name: 'personalization',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addToCampaign'],
			},
		},
		description: 'Personalization message for campaign-specific messaging',
	},

	// Custom Fields Collection
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'collection',
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['lead'],
				operation: ['addToCampaign'],
			},
		},
		description: 'Custom key-value pairs for campaign personalization',
		options: [
			{
				displayName: 'Custom Field',
				name: 'customFieldValues',
				type: 'fixedCollection',
				default: {},
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Field Name',
								name: 'key',
								type: 'string',
								default: '',
								description: 'Name of the custom field',
							},
							{
								displayName: 'Field Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Value of the custom field',
							},
						],
					},
				],
			},
		],
	},
];
