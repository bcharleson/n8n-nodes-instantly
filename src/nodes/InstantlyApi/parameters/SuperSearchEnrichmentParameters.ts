import { INodeProperties } from 'n8n-workflow';

/**
 * SuperSearch Enrichment Parameters
 * NEW FEATURE: Added September 4, 2025
 *
 * Provides comprehensive lead enrichment with AI-powered personalization
 */
export const superSearchEnrichmentParameters: INodeProperties[] = [
	// SUPERSEARCH ENRICHMENT OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
			},
		},
		options: [
			{
				name: 'Create Enrichment',
				value: 'create',
				description: 'Create a new SuperSearch enrichment',
				action: 'Create a SuperSearch enrichment',
			},
			{
				name: 'Get Enrichment',
				value: 'get',
				description: 'Get a SuperSearch enrichment by resource ID',
				action: 'Get a SuperSearch enrichment',
			},
			{
				name: 'Run Enrichment',
				value: 'run',
				description: 'Execute a SuperSearch enrichment process',
				action: 'Run a SuperSearch enrichment',
			},
			{
				name: 'Add to Resource',
				value: 'addToResource',
				description: 'Add enrichment results to a campaign or lead list',
				action: 'Add enrichment to resource',
			},
			{
				name: 'AI Enrichment',
				value: 'runAiEnrichment',
				description: 'Run AI-powered enrichment on existing leads',
				action: 'Run AI enrichment',
			},
			{
				name: 'Get Job Status',
				value: 'getJobStatus',
				description: 'Get the status of an enrichment job',
				action: 'Get enrichment job status',
			},
			{
				name: 'Get History',
				value: 'getHistory',
				description: 'Get enrichment history for a resource',
				action: 'Get enrichment history',
			},
		],
		default: 'create',
	},

	// CREATE ENRICHMENT PARAMETERS
	{
		displayName: 'Enrichment Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'My SuperSearch Enrichment',
		description: 'Name for the SuperSearch enrichment',
	},

	// SEARCH FILTERS
	{
		displayName: 'Search Filters',
		name: 'searchFilters',
		type: 'collection',
		placeholder: 'Add Search Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				placeholder: 'San Francisco, CA',
				description: 'Geographic location to search (city, state, country)',
			},
			{
				displayName: 'Job Titles',
				name: 'jobTitles',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'CEO, Founder, Marketing Director',
				description: 'Job titles to target',
			},
			{
				displayName: 'Companies',
				name: 'companies',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'Google, Microsoft, Apple',
				description: 'Specific companies to target',
			},
			{
				displayName: 'Industries',
				name: 'industries',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				placeholder: 'Technology, Healthcare, Finance',
				description: 'Industries to target',
			},
		],
	},

	// ENRICHMENT SETTINGS
	{
		displayName: 'Enrichment Settings',
		name: 'enrichmentSettings',
		type: 'collection',
		placeholder: 'Add Enrichment Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Enable Waterfall Enrichment',
				name: 'enableWaterfallEnrichment',
				type: 'boolean',
				default: true,
				description: 'Whether to use multiple data providers for better coverage',
			},
			{
				displayName: 'Enable AI Enrichment',
				name: 'enableAiEnrichment',
				type: 'boolean',
				default: false,
				description: 'Whether to use AI for personalization and insights',
			},
			{
				displayName: 'AI Model',
				name: 'aiModel',
				type: 'options',
				displayOptions: {
					show: {
						enableAiEnrichment: [true],
					},
				},
				options: [
					{
						name: 'GPT-4o',
						value: 'gpt-4o',
					},
					{
						name: 'GPT-5',
						value: 'gpt-5',
					},
					{
						name: 'Claude 3.5 Sonnet',
						value: 'claude-3-5-sonnet',
					},
					{
						name: 'Claude 3 Opus',
						value: 'claude-3-opus',
					},
					{
						name: 'DeepSeek',
						value: 'deepseek',
					},
				],
				default: 'gpt-4o',
				description: 'AI model to use for enrichment',
			},
			{
				displayName: 'AI Prompt',
				name: 'aiPrompt',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						enableAiEnrichment: [true],
					},
				},
				default: '',
				placeholder: 'Write a personalized opening line based on the lead\'s company and role...',
				description: 'Custom AI prompt for personalization',
			},
		],
	},

	// ADDITIONAL FIELDS FOR CREATE
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Max Results',
				name: 'maxResults',
				type: 'number',
				default: 1000,
				typeOptions: {
					minValue: 1,
					maxValue: 10000,
				},
				description: 'Maximum number of leads to find',
			},
			{
				displayName: 'Enable Email Verification',
				name: 'enableEmailVerification',
				type: 'boolean',
				default: true,
				description: 'Whether to verify email addresses',
			},
			{
				displayName: 'Enable Company Intelligence',
				name: 'enableCompanyIntelligence',
				type: 'boolean',
				default: false,
				description: 'Whether to gather company intelligence (funding, news, etc.)',
			},
		],
	},

	// RESOURCE ID PARAMETER (for get, run, addToResource, getHistory)
	{
		displayName: 'Resource ID',
		name: 'resourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['get', 'run', 'addToResource', 'getHistory'],
			},
		},
		default: '',
		description: 'The SuperSearch enrichment resource ID',
	},

	// RUN SETTINGS
	{
		displayName: 'Run Settings',
		name: 'runSettings',
		type: 'collection',
		placeholder: 'Add Run Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['run'],
			},
		},
		options: [
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'High',
						value: 'high',
					},
				],
				default: 'normal',
				description: 'Processing priority for the enrichment job',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				placeholder: 'https://your-webhook-url.com/callback',
				description: 'URL to receive completion notification',
			},
		],
	},

	// ADD TO RESOURCE PARAMETERS
	{
		displayName: 'Target Resource ID',
		name: 'targetResourceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['addToResource'],
			},
		},
		default: '',
		description: 'ID of the campaign or lead list to add results to',
	},

	{
		displayName: 'Target Resource Type',
		name: 'targetResourceType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['addToResource'],
			},
		},
		options: [
			{
				name: 'Campaign',
				value: 'campaign',
			},
			{
				name: 'Lead List',
				value: 'lead_list',
			},
		],
		default: 'campaign',
		description: 'Type of resource to add enrichment results to',
	},

	// AI ENRICHMENT PARAMETERS
	{
		displayName: 'Lead IDs',
		name: 'leadIds',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['runAiEnrichment'],
			},
		},
		default: [],
		description: 'IDs of leads to enrich with AI',
	},

	{
		displayName: 'AI Model',
		name: 'aiModel',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['runAiEnrichment'],
			},
		},
		options: [
			{
				name: 'GPT-4o',
				value: 'gpt-4o',
			},
			{
				name: 'GPT-5',
				value: 'gpt-5',
			},
			{
				name: 'Claude 3.5 Sonnet',
				value: 'claude-3-5-sonnet',
			},
			{
				name: 'Claude 3 Opus',
				value: 'claude-3-opus',
			},
			{
				name: 'DeepSeek',
				value: 'deepseek',
			},
		],
		default: 'gpt-4o',
		description: 'AI model to use for enrichment',
	},

	{
		displayName: 'AI Prompt',
		name: 'aiPrompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['runAiEnrichment'],
			},
		},
		default: '',
		placeholder: 'Write a personalized opening line based on the lead\'s company and role...',
		description: 'AI prompt for lead personalization',
	},

	// AI ADDITIONAL SETTINGS
	{
		displayName: 'Additional Settings',
		name: 'additionalSettings',
		type: 'collection',
		placeholder: 'Add AI Setting',
		default: {},
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['runAiEnrichment'],
			},
		},
		options: [
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					numberPrecision: 2,
					minValue: 0,
					maxValue: 2,
				},
				default: 0.7,
				description: 'AI creativity level (0 = deterministic, 2 = very creative)',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 150,
				typeOptions: {
					minValue: 1,
					maxValue: 4000,
				},
				description: 'Maximum number of tokens in AI response',
			},
			{
				displayName: 'Custom Instructions',
				name: 'customInstructions',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Additional instructions for the AI model',
			},
		],
	},

	// JOB ID PARAMETER
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['getJobStatus'],
			},
		},
		default: '',
		description: 'The enrichment job ID to check status for',
	},

	// PAGINATION PARAMETERS FOR HISTORY
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['getHistory'],
			},
		},
		description: 'Whether to return all enrichment history or limit results',
	},

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['superSearchEnrichment'],
				operation: ['getHistory'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of enrichment history records to return (max 100)',
	},
];
