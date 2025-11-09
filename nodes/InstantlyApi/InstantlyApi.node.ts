import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodeListSearchItems,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { instantlyApiRequest } from '../generic.functions';
import { OperationRouter } from './operations/OperationRouter';
import { ResourceType, OperationType } from './types/common';
import { formatDateForApi } from './functions/dateHelpers';
import { paginateInstantlyApi } from './functions/paginationHelpers';
import { leadParameters } from './parameters/LeadParameters';
import { campaignParameters } from './parameters/CampaignParameters';
import { accountParameters } from './parameters/AccountParameters';
import { analyticsParameters } from './parameters/AnalyticsParameters';
import { uniboxParameters } from './parameters/UniboxParameters';

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
						description: 'Manage SMTP email accounts for sending',
					},
					{
						name: 'Analytics',
						value: 'analytics',
						description: 'Get campaign and account analytics',
					},
					{
						name: 'Campaign',
						value: 'campaign',
						description: 'Manage email campaigns',
					},
					{
						name: 'Lead',
						value: 'lead',
						description: 'Manage leads and contacts',
					},
					{
						name: 'Unibox',
						value: 'unibox',
						description: 'Manage inbox messages and conversations',
					},
				],
				default: 'campaign',
			},

			// CAMPAIGN OPERATIONS - Using modular parameters
			...campaignParameters,

			// LEAD OPERATIONS - Using modular parameters
			...leadParameters,

			// ACCOUNT OPERATIONS - Using modular parameters
			...accountParameters,

			// ANALYTICS OPERATIONS - Using modular parameters
			...analyticsParameters,

			// UNIBOX OPERATIONS - Using modular parameters
			...uniboxParameters,
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
					// Use the modular OperationRouter for Account operations
					responseData = await OperationRouter.execute(this, i, resource as ResourceType, operation as OperationType);
				} else if (resource === 'analytics') {
					// Use the modular OperationRouter for Analytics operations
					responseData = await OperationRouter.execute(this, i, resource as ResourceType, operation as OperationType);
				} else if (resource === 'unibox') {
					// Use the modular OperationRouter for Unibox operations
					responseData = await OperationRouter.execute(this, i, resource as ResourceType, operation as OperationType);
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
		loadOptions: {
			// Load email accounts for multi-select dropdown
			async getEmailAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await instantlyApiRequest.call(this, 'GET', '/api/v2/accounts');
					const accounts = response.items || [];

					return accounts.map((account: any) => ({
						name: `${account.email} (${account.first_name} ${account.last_name})`,
						value: account.email,
					}));
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `Failed to load email accounts: ${error.message}`);
				}
			},
		},
	};
}
