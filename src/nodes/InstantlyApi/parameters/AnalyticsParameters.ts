import { INodeProperties } from 'n8n-workflow';

/**
 * Analytics parameter definitions
 * Extracted from InstantlyApi.node.ts to maintain exact compatibility
 */

export const analyticsParameters: INodeProperties[] = [
	// ANALYTICS OPERATIONS
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: [
			{
				name: 'Get Campaign Analytics',
				value: 'getCampaignAnalytics',
				description: 'Get analytics for a campaign',
				action: 'Get campaign analytics',
			},
		],
		default: 'getCampaignAnalytics',
	},

	// Return All toggle for analytics
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getCampaignAnalytics'],
			},
		},
		description: 'Whether to return analytics for all campaigns or just the selected campaign',
	},

	// Campaign Selector for analytics
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
				resource: ['analytics'],
				operation: ['getCampaignAnalytics'],
				returnAll: [false],
			},
		},
		description: 'The campaign to get analytics for. Choose from the list, or specify an ID.',
	},

	// Date Range Fields for Analytics
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getCampaignAnalytics'],
			},
		},
		description: 'Start date for analytics data (YYYY-MM-DD format). Leave empty for all-time analytics.',
		placeholder: 'e.g. 2024-01-01',
	},

	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getCampaignAnalytics'],
			},
		},
		description: 'End date for analytics data (YYYY-MM-DD format). Leave empty for all-time analytics.',
		placeholder: 'e.g. 2024-12-31',
	},
];
