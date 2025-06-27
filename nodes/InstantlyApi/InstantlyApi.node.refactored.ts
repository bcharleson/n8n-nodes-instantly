import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeListSearchResult,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

import { instantlyApiRequest } from '../generic.functions';
import { OperationRouter } from './operations/OperationRouter';
import { ResourceType, OperationType } from './types/common';

// Import parameter definitions
import { accountParameters } from './parameters/AccountParameters';
import { campaignParameters } from './parameters/CampaignParameters';
import { leadParameters } from './parameters/LeadParameters';
import { analyticsParameters } from './parameters/AnalyticsParameters';

/**
 * List search methods for resource locators
 */
async function getCampaigns(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const campaigns = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns');
	return {
		results: campaigns.items?.map((campaign: any) => ({
			name: campaign.name,
			value: campaign.id,
		})) || [],
	};
}

async function getEmailAccounts(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const accounts = await instantlyApiRequest.call(this, 'GET', '/api/v2/accounts');
	return {
		results: accounts.items?.map((account: any) => ({
			name: `${account.first_name} ${account.last_name} (${account.email})`,
			value: account.email,
		})) || [],
	};
}

/**
 * Main Instantly API Node - Refactored for modularity
 */
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
			// Import all parameter definitions from modular files
			...campaignParameters,
			...leadParameters,
			...accountParameters,
			...analyticsParameters,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as ResourceType;
				const operation = this.getNodeParameter('operation', i) as OperationType;

				// Route to appropriate operation handler using the modular system
				const responseData = await OperationRouter.execute(this, i, resource, operation);

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
		},
	};
}
