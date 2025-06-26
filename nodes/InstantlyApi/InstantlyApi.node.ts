import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { instantlyApiRequest } from '../generic.functions';

// Helper function for pagination
async function paginateInstantlyApi(
	context: IExecuteFunctions,
	endpoint: string,
	resourceName: string,
): Promise<any[]> {
	let allItems: any[] = [];
	let startingAfter: string | undefined;
	let hasMore = true;
	let pageCount = 0;

	console.log(`Starting pagination for ${resourceName}...`);

	while (hasMore) {
		pageCount++;
		const queryParams: any = { limit: 100 }; // Use max limit for efficiency
		if (startingAfter) {
			queryParams.starting_after = startingAfter;
		}

		console.log(`Fetching page ${pageCount} with params:`, queryParams);
		const response = await instantlyApiRequest.call(context, 'GET', endpoint, {}, queryParams);
		console.log(`Page ${pageCount} response:`, {
			hasItems: !!response.items,
			itemsLength: response.items?.length || 0,
			hasNextStartingAfter: !!response.next_starting_after,
			nextStartingAfter: response.next_starting_after
		});

		// Handle response structure - items are in 'items' array for paginated responses
		let itemsData: any[] = [];
		if (response.items && Array.isArray(response.items)) {
			itemsData = response.items;
		} else if (response.data && Array.isArray(response.data)) {
			itemsData = response.data;
		} else if (Array.isArray(response)) {
			itemsData = response;
		} else {
			console.warn('Unexpected response structure:', response);
		}

		if (itemsData.length > 0) {
			allItems = allItems.concat(itemsData);
			console.log(`Added ${itemsData.length} ${resourceName}. Total so far: ${allItems.length}`);
		} else {
			console.log(`No ${resourceName} found in this page, stopping pagination`);
			hasMore = false;
		}

		// Check if there are more pages using next_starting_after
		if (response.next_starting_after && itemsData.length > 0) {
			startingAfter = response.next_starting_after;
			console.log(`Next page cursor: ${startingAfter}`);
		} else {
			console.log('No more pages available');
			hasMore = false;
		}

		// Safety check to prevent infinite loops
		if (pageCount > 1000) {
			console.warn('Pagination stopped after 1000 pages to prevent infinite loop');
			break;
		}
	}

	console.log(`Pagination completed. Total ${resourceName} retrieved: ${allItems.length}`);
	return allItems;
}

export class InstantlyApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly API',
		name: 'instantlyApi',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Instantly API',
		defaults: {
			name: 'Instantly API',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'account',
					},
					{
						name: 'Analytics',
						value: 'analytics',
					},
					{
						name: 'Campaign',
						value: 'campaign',
					},
					{
						name: 'Lead',
						value: 'lead',
					},
				],
				default: 'campaign',
			},

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
						name: 'Update',
						value: 'update',
						description: 'Update a campaign',
						action: 'Update a campaign',
					},
				],
				default: 'create',
			},

			// Campaign ID
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the campaign',
			},

			// Campaign Name
			{
				displayName: 'Campaign Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create', 'update'],
					},
				},
				description: 'The name of the campaign',
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
				],
				default: 'create',
			},

			// Lead Email
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
						operation: ['create', 'get', 'update', 'delete'],
					},
				},
				description: 'The email address of the lead',
			},

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
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many email accounts',
						action: 'Get many email accounts',
					},
				],
				default: 'getMany',
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
					{
						name: 'Get Overall Analytics',
						value: 'getOverallAnalytics',
						action: 'Get overall analytics',
					},
				],
				default: 'getCampaignAnalytics',
			},

			// Campaign ID for analytics
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['analytics'],
						operation: ['getCampaignAnalytics'],
					},
				},
				description: 'The ID of the campaign to get analytics for',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData;

				if (resource === 'campaign') {
					if (operation === 'create') {
						const name = this.getNodeParameter('name', i) as string;
						responseData = await instantlyApiRequest.call(this, 'POST', '/api/v2/campaigns', {
							name,
						});
					} else if (operation === 'get') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await instantlyApiRequest.call(this, 'GET', `/api/v2/campaigns/${campaignId}`);
					} else if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						// Validate limit doesn't exceed 100
						if (limit > 100) {
							throw new NodeOperationError(this.getNode(), 'Limit cannot exceed 100. Instantly API has a maximum limit of 100.', { itemIndex: i });
						}

						if (returnAll) {
							// Get all campaigns with pagination
							const allCampaigns = await paginateInstantlyApi(this, '/api/v2/campaigns', 'campaigns');
							responseData = { items: allCampaigns };
						} else {
							// Get single page with specified limit
							const queryParams = { limit };
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns', {}, queryParams);
						}
					} else if (operation === 'update') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const name = this.getNodeParameter('name', i) as string;
						responseData = await instantlyApiRequest.call(this, 'PUT', `/api/v2/campaigns/${campaignId}`, {
							name,
						});
					} else if (operation === 'delete') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await instantlyApiRequest.call(this, 'DELETE', `/api/v2/campaigns/${campaignId}`);
					}
				} else if (resource === 'lead') {
					if (operation === 'create') {
						const email = this.getNodeParameter('email', i) as string;
						responseData = await instantlyApiRequest.call(this, 'POST', '/api/v2/leads', {
							email,
						});
					} else if (operation === 'get') {
						const email = this.getNodeParameter('email', i) as string;
						responseData = await instantlyApiRequest.call(this, 'GET', `/api/v2/leads/${email}`);
					} else if (operation === 'getMany') {
						responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/leads');
					} else if (operation === 'update') {
						const email = this.getNodeParameter('email', i) as string;
						responseData = await instantlyApiRequest.call(this, 'PUT', `/api/v2/leads/${email}`, {
							email,
						});
					} else if (operation === 'delete') {
						const email = this.getNodeParameter('email', i) as string;
						responseData = await instantlyApiRequest.call(this, 'DELETE', `/api/v2/leads/${email}`);
					}
				} else if (resource === 'account') {
					if (operation === 'getMany') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
						const limit = this.getNodeParameter('limit', i, 50) as number;

						// Validate limit doesn't exceed 100
						if (limit > 100) {
							throw new NodeOperationError(this.getNode(), 'Limit cannot exceed 100. Instantly API has a maximum limit of 100.', { itemIndex: i });
						}

						if (returnAll) {
							// Get all accounts with pagination
							const allAccounts = await paginateInstantlyApi(this, '/api/v2/accounts', 'accounts');
							responseData = { items: allAccounts };
						} else {
							// Get single page with specified limit
							const queryParams = { limit };
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/accounts', {}, queryParams);
						}
					}
				} else if (resource === 'analytics') {
					if (operation === 'getCampaignAnalytics') {
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await instantlyApiRequest.call(this, 'GET', `/api/v2/campaigns/analytics?campaign_id=${campaignId}`);
					} else if (operation === 'getOverallAnalytics') {
						responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/analytics');
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as any),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						[{ json: { error: (error as Error).message } }],
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
