import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

import { instantlyApiRequest } from '../generic.functions';

export class Instantly implements INodeType {
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
						name: 'Create',
						value: 'create',
						description: 'Create an account',
						action: 'Create an account',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an account',
						action: 'Delete an account',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an account by email',
						action: 'Get an account by email',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get many accounts',
						action: 'Get many accounts',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an account',
						action: 'Update an account',
					},
				],
				default: 'getMany',
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

			// CAMPAIGN FIELDS

			// Campaign ID for operations that need it
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'ID of the campaign',
			},

			// Fields for create campaign
			{
				displayName: 'Campaign Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'Name of the campaign to create',
			},
			{
				displayName: 'Email Account ID',
				name: 'emailAccountId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['campaign'],
						operation: ['create'],
					},
				},
				description: 'ID of the email account to use',
			},

			// Fields for update campaign
			{
				displayName: 'Update Fields',
				name: 'updateFields',
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
					{
						displayName: 'Campaign Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name for the campaign',
					},
					{
						displayName: 'Email Account ID',
						name: 'emailAccountId',
						type: 'string',
						default: '',
						description: 'New email account ID for the campaign',
					},
				],
			},

			// ACCOUNT FIELDS

			// Account email for operations that need it
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The email of the account',
			},

			// Fields for create account
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['create'],
					},
				},
				description: 'The email of the account to create',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				typeOptions: {
					password: true,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['create'],
					},
				},
				description: 'The password for the account',
			},
			{
				displayName: 'Full Name',
				name: 'fullName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['account'],
						operation: ['create'],
					},
				},
				description: 'The full name for the account',
			},

			// Fields for update account
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
						displayName: 'Full Name',
						name: 'fullName',
						type: 'string',
						default: '',
						description: 'The full name for the account',
					},
					{
						displayName: 'Password',
						name: 'password',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'The password for the account',
					},
				],
			},

			// LEAD FIELDS

			// Lead ID for operations that need it
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['lead'],
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'ID of the lead',
			},

			// Fields for create lead
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
				description: 'The email of the lead to create',
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
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
						description: 'Company of the lead',
					},
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'First name of the lead',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'Last name of the lead',
					},
					{
						displayName: 'LinkedIn URL',
						name: 'linkedinUrl',
						type: 'string',
						default: '',
						description: 'LinkedIn URL of the lead',
					},
				],
			},

			// Fields for update lead
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
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
						description: 'Company of the lead',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'The email of the lead',
					},
					{
						displayName: 'First Name',
						name: 'firstName',
						type: 'string',
						default: '',
						description: 'First name of the lead',
					},
					{
						displayName: 'Last Name',
						name: 'lastName',
						type: 'string',
						default: '',
						description: 'Last name of the lead',
					},
					{
						displayName: 'LinkedIn URL',
						name: 'linkedinUrl',
						type: 'string',
						default: '',
						description: 'LinkedIn URL of the lead',
					},
				],
			},

			// Common options for get many operations
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
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
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;
		let responseData;

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				// Routes based on resource and operation
				if (resource === 'campaign') {
					if (operation === 'create') {
						// Create a campaign
						const name = this.getNodeParameter('name', i) as string;
						const emailAccountId = this.getNodeParameter('emailAccountId', i) as string;

						const body: IDataObject = {
							name,
							emailAccountId,
						};

						responseData = await instantlyApiRequest.call(this, 'POST', '/api/v2/campaigns', body);
					} else if (operation === 'get') {
						// Get a single campaign
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await instantlyApiRequest.call(this, 'GET', `/api/v2/campaigns/${campaignId}`);
					} else if (operation === 'getMany') {
						// Get many campaigns
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const qs: IDataObject = {
								limit,
							};
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/campaigns', {}, qs);
						}
					} else if (operation === 'update') {
						// Update a campaign
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.name) body.name = updateFields.name;
						if (updateFields.emailAccountId) body.emailAccountId = updateFields.emailAccountId;

						responseData = await instantlyApiRequest.call(
							this,
							'PATCH',
							`/api/v2/campaigns/${campaignId}`,
							body,
						);
					} else if (operation === 'delete') {
						// Delete a campaign
						const campaignId = this.getNodeParameter('campaignId', i) as string;
						responseData = await instantlyApiRequest.call(
							this,
							'DELETE',
							`/api/v2/campaigns/${campaignId}`,
						);
					}
				} else if (resource === 'account') {
					if (operation === 'create') {
						// Create an account
						const email = this.getNodeParameter('email', i) as string;
						const password = this.getNodeParameter('password', i) as string;
						const fullName = this.getNodeParameter('fullName', i) as string;

						const body: IDataObject = {
							email,
							password,
							fullName,
						};

						responseData = await instantlyApiRequest.call(this, 'POST', '/api/v2/accounts', body);
					} else if (operation === 'get') {
						// Get a single account
						const email = this.getNodeParameter('email', i) as string;
						responseData = await instantlyApiRequest.call(
							this,
							'GET',
							`/api/v2/accounts/${encodeURIComponent(email)}`,
						);
					} else if (operation === 'getMany') {
						// Get many accounts
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/accounts');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const qs: IDataObject = {
								limit,
							};
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/accounts', {}, qs);
						}
					} else if (operation === 'update') {
						// Update an account
						const email = this.getNodeParameter('email', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						const body: IDataObject = {};
						if (updateFields.fullName) body.fullName = updateFields.fullName;
						if (updateFields.password) body.password = updateFields.password;

						responseData = await instantlyApiRequest.call(
							this,
							'PATCH',
							`/api/v2/accounts/${encodeURIComponent(email)}`,
							body,
						);
					} else if (operation === 'delete') {
						// Delete an account
						const email = this.getNodeParameter('email', i) as string;
						responseData = await instantlyApiRequest.call(
							this,
							'DELETE',
							`/api/v2/accounts/${encodeURIComponent(email)}`,
						);
					}
				} else if (resource === 'lead') {
					if (operation === 'create') {
						// Create a lead
						const email = this.getNodeParameter('email', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

						const body: IDataObject = {
							email,
							...additionalFields,
						};

						responseData = await instantlyApiRequest.call(this, 'POST', '/api/v2/leads', body);
					} else if (operation === 'get') {
						// Get a single lead
						const leadId = this.getNodeParameter('leadId', i) as string;
						responseData = await instantlyApiRequest.call(this, 'GET', `/api/v2/leads/${leadId}`);
					} else if (operation === 'getMany') {
						// Get many leads
						const returnAll = this.getNodeParameter('returnAll', i) as boolean;

						if (returnAll) {
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/leads');
						} else {
							const limit = this.getNodeParameter('limit', i) as number;
							const qs: IDataObject = {
								limit,
							};
							responseData = await instantlyApiRequest.call(this, 'GET', '/api/v2/leads', {}, qs);
						}
					} else if (operation === 'update') {
						// Update a lead
						const leadId = this.getNodeParameter('leadId', i) as string;
						const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

						responseData = await instantlyApiRequest.call(
							this,
							'PATCH',
							`/api/v2/leads/${leadId}`,
							updateFields,
						);
					} else if (operation === 'delete') {
						// Delete a lead
						const leadId = this.getNodeParameter('leadId', i) as string;
						responseData = await instantlyApiRequest.call(
							this,
							'DELETE',
							`/api/v2/leads/${leadId}`,
						);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({ json: { error: errorMessage } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
