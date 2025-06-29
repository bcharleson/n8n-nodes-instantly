import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodeListSearchItems,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { instantlyApiRequest } from '../generic.functions';
import { OperationRouter } from './operations/OperationRouter';
import { ResourceType, OperationType } from './types/common';
import { leadParameters } from './parameters/LeadParameters';
import { campaignParameters } from './parameters/CampaignParameters';

// Helper function to format dates for Instantly API (YYYY-MM-DD format)
function formatDateForApi(dateInput: any): string {
	if (!dateInput || dateInput === '') {
		return '';
	}

	let dateString = String(dateInput);

	// Handle n8n DateTime objects that come as "[DateTime: 2025-06-26T13:52:08.271Z]"
	if (dateString.startsWith('[DateTime: ') && dateString.endsWith(']')) {
		dateString = dateString.slice(11, -1); // Remove "[DateTime: " and "]"
	}

	// Handle ISO datetime strings (e.g., "2025-06-19T13:52:45.316Z")
	if (dateString.includes('T')) {
		dateString = dateString.split('T')[0];
	}

	// Handle date strings that might have time components separated by space
	if (dateString.includes(' ')) {
		dateString = dateString.split(' ')[0];
	}

	// Validate the resulting date format (should be YYYY-MM-DD)
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) {
		// Try to parse as Date and format
		try {
			const parsedDate = new Date(dateInput);
			if (!isNaN(parsedDate.getTime())) {
				// Format as YYYY-MM-DD
				const year = parsedDate.getFullYear();
				const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
				const day = String(parsedDate.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
		} catch (error) {
			console.warn('Failed to parse date:', dateInput, error);
		}

		// If all parsing fails, return empty string to avoid API errors
		console.warn('Invalid date format for Instantly API:', dateInput);
		return '';
	}

	return dateString;
}

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



	while (hasMore) {
		pageCount++;
		const queryParams: any = { limit: 100 }; // Use max limit for efficiency
		if (startingAfter) {
			queryParams.starting_after = startingAfter;
		}

		const response = await instantlyApiRequest.call(context, 'GET', endpoint, {}, queryParams);

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
		} else {
			hasMore = false;
		}

		// Check if there are more pages using next_starting_after
		if (response.next_starting_after && itemsData.length > 0) {
			startingAfter = response.next_starting_after;
		} else {
			hasMore = false;
		}

		// Safety check to prevent infinite loops
		if (pageCount > 1000) {
			console.warn('Pagination stopped after 1000 pages to prevent infinite loop');
			break;
		}
	}


	return allItems;
}

// Helper function to get campaigns for dropdown
async function getCampaigns(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		// Get campaigns using our existing pagination function
		const responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns', {}, { limit: 100 });

		// Handle response structure - campaigns are in 'items' array for paginated responses
		let campaigns = [];
		if (responseData.items && Array.isArray(responseData.items)) {
			campaigns = responseData.items;
		} else if (Array.isArray(responseData)) {
			campaigns = responseData;
		}

		// Filter campaigns if filter is provided
		const filteredCampaigns = campaigns.filter((campaign: any) => {
			if (!filter) return true;
			const campaignName = `${campaign.name || ''}`.toLowerCase();
			return campaignName.includes(filter.toLowerCase());
		});

		// Map campaigns to dropdown options
		const campaignOptions: INodePropertyOptions[] = filteredCampaigns.map((campaign: any) => ({
			name: campaign.name || `Campaign ${campaign.id}`,
			value: campaign.id,
		}));

		return {
			results: campaignOptions,
		};
	} catch (error) {
		console.error('Error fetching campaigns for dropdown:', error);
		return {
			results: [],
		};
	}
}

// Helper function to get email accounts for dropdown
async function getEmailAccounts(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		// Get email accounts using the accounts API endpoint
		const responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/accounts', {}, { limit: 100 });

		// Handle response structure - accounts are in 'items' array for paginated responses
		let accounts = [];
		if (responseData.items && Array.isArray(responseData.items)) {
			accounts = responseData.items;
		} else if (Array.isArray(responseData)) {
			accounts = responseData;
		}

		// Filter accounts if filter is provided
		const filteredAccounts = accounts.filter((account: any) => {
			if (!filter) return true;
			const accountEmail = `${account.email || ''}`.toLowerCase();
			const accountName = `${account.first_name || ''} ${account.last_name || ''}`.toLowerCase().trim();
			return accountEmail.includes(filter.toLowerCase()) || accountName.includes(filter.toLowerCase());
		});

		// Map accounts to dropdown options
		const accountOptions: INodePropertyOptions[] = filteredAccounts.map((account: any) => {
			const displayName = account.first_name && account.last_name
				? `${account.email} (${account.first_name} ${account.last_name})`
				: account.email;
			return {
				name: displayName || `Account ${account.id}`,
				value: account.email,
			};
		});

		return {
			results: accountOptions,
		};
	} catch (error) {
		console.error('Error fetching email accounts for dropdown:', error);
		return {
			results: [],
		};
	}
}

// Helper function to get leads for dropdown
async function getLeads(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	try {
		// Get leads using the leads list API endpoint
		const body: any = {
			limit: 100,
		};

		// Add search filter if provided
		if (filter) {
			body.search = filter;
		}

		const response = await instantlyApiRequest.call(this, 'POST', '/api/v2/leads/list', body);

		const leadOptions: INodeListSearchItems[] = [];

		if (response.items && Array.isArray(response.items)) {
			for (const lead of response.items) {
				const name = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.email || 'Unknown Lead';
				const value = lead.id;
				leadOptions.push({
					name: `${name} (${lead.email || 'No email'})`,
					value,
				});
			}
		}

		return {
			results: leadOptions,
		};
	} catch (error) {
		console.error('Error fetching leads for dropdown:', error);
		return {
			results: [],
		};
	}
}

export class InstantlyApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly',
		name: 'instantly',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Instantly API',
		defaults: {
			name: 'Instantly',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
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

			// CAMPAIGN OPERATIONS - Using modular parameters
			...campaignParameters,

			// LEAD OPERATIONS - Using modular parameters
			...leadParameters,

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
						operation: ['get'],
					},
				},
				description: 'The email account to retrieve. Choose from the list, or specify an email address.',
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Helper function to extract campaign ID from resourceLocator
		const getCampaignId = (i: number): string => {
			const campaignLocator = this.getNodeParameter('campaignId', i) as any;
			if (typeof campaignLocator === 'string') {
				// Backward compatibility - if it's still a string
				return campaignLocator;
			}
			// Extract value from resourceLocator
			return campaignLocator.value || campaignLocator;
		};

		// Helper function to extract email from resourceLocator
		const getEmailAccount = (i: number): string => {
			const emailLocator = this.getNodeParameter('emailAccount', i) as any;
			if (typeof emailLocator === 'string') {
				// Backward compatibility - if it's still a string
				return emailLocator;
			}
			// Extract value from resourceLocator
			return emailLocator.value || emailLocator;
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData;

				if (resource === 'campaign') {
					// Use the modular OperationRouter for Campaign operations
					responseData = await OperationRouter.execute(this, i, resource as ResourceType, operation as OperationType);
				} else if (resource === 'lead') {
					// Use the modular OperationRouter for Lead operations
					responseData = await OperationRouter.execute(this, i, resource as ResourceType, operation as OperationType);
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
					} else if (operation === 'get') {
						const emailAccount = getEmailAccount(i);
						responseData = await instantlyApiRequest.call(this, 'GET', `/api/v2/accounts/${emailAccount}`);
					}
				} else if (resource === 'analytics') {
					if (operation === 'getCampaignAnalytics') {
						const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;

						// Get date parameters and format them for the API
						const startDateInput = this.getNodeParameter('startDate', i, '');
						const endDateInput = this.getNodeParameter('endDate', i, '');

						// Build query parameters object
						const queryParams: any = {};

						// Add date parameters if provided, using the robust date formatter
						const formattedStartDate = formatDateForApi(startDateInput);
						const formattedEndDate = formatDateForApi(endDateInput);

						if (formattedStartDate) {
							queryParams.start_date = formattedStartDate;
						}
						if (formattedEndDate) {
							queryParams.end_date = formattedEndDate;
						}

						if (returnAll) {
							// Get analytics for all campaigns with date filtering
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns/analytics', {}, queryParams);
						} else {
							// Get analytics for specific campaign with date filtering
							const campaignId = getCampaignId(i);
							queryParams.id = campaignId;
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns/analytics', {}, queryParams);
						}
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

	methods = {
		listSearch: {
			getCampaigns,
			getEmailAccounts,
			getLeads,
		},
	};
}
