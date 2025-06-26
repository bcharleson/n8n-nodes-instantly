import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class InstantlyAnalytics implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Analytics',
		name: 'instantlyAnalytics',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get analytics data from Instantly',
		defaults: {
			name: 'Instantly Analytics',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'instantlyApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get Campaign Analytics',
						value: 'getCampaignAnalytics',
						description: 'Get analytics for campaigns',
						action: 'Get analytics for campaigns',
					},
					{
						name: 'Get Campaign Analytics Overview',
						value: 'getCampaignAnalyticsOverview',
						action: 'Get campaign analytics overview',
					},
					{
						name: 'Get Campaign Analytics Daily',
						value: 'getCampaignAnalyticsDaily',
						description: 'Get daily campaign analytics',
						action: 'Get daily campaign analytics',
					},
					{
						name: 'Get Campaign Analytics Steps',
						value: 'getCampaignAnalyticsSteps',
						action: 'Get campaign analytics steps',
					},
					{
						name: 'Get Warmup Analytics',
						value: 'getWarmupAnalytics',
						description: 'Get warmup analytics for accounts',
						action: 'Get warmup analytics for accounts',
					},
					{
						name: 'Get Account Test Vitals',
						value: 'getAccountTestVitals',
						action: 'Get account test vitals',
					},
				],
				default: 'getCampaignAnalytics',
			},

			// Fields for campaign analytics operations
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: [
							'getCampaignAnalytics',
							'getCampaignAnalyticsOverview',
							'getCampaignAnalyticsDaily',
							'getCampaignAnalyticsSteps'
						],
					},
				},
				description: 'The ID of the campaign',
			},

			// Fields for warmup analytics
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: [
							'getAccountTestVitals',
						],
					},
				},
				description: 'The email of the account',
			},

			// Common filters for analytics
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'The start date for analytics data (YYYY-MM-DD)',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
						description: 'The end date for analytics data (YYYY-MM-DD)',
					},
				],
			},

			// Pagination for analytics that support it
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: [
							'getCampaignAnalytics',
							'getCampaignAnalyticsDaily',
							'getWarmupAnalytics',
						],
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
						operation: [
							'getCampaignAnalytics',
							'getCampaignAnalyticsDaily',
							'getWarmupAnalytics',
						],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
				},
				default: 50,
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Placeholder for API implementation
		// This will be implemented in subsequent phases with actual API calls to Instantly

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For MVP, return a basic success message
		// In the next phase, we'll implement the actual API calls
		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;

			// Sample response
			const response = {
				success: true,
				operation,
				message: `${operation} operation would be sent to Instantly API`,
			};

			returnData.push({
				json: response,
			});
		}

		return [returnData];
	}
}
