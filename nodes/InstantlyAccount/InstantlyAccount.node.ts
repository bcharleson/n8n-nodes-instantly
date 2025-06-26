import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class InstantlyAccount implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Account',
		name: 'instantlyAccount',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Instantly Account API',
		defaults: {
			name: 'Instantly Account',
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
						name: 'Create',
						value: 'create',
						description: 'Create an account',
						action: 'Create an account',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many accounts',
						action: 'Get many accounts',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an account by email',
						action: 'Get an account by email',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an account',
						action: 'Update an account',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an account',
						action: 'Delete an account',
					},
					{
						name: 'Pause',
						value: 'pause',
						description: 'Pause an account',
						action: 'Pause an account',
					},
					{
						name: 'Resume',
						value: 'resume',
						description: 'Resume an account',
						action: 'Resume an account',
					},
				],
				default: 'getAll',
			},

			// Fields for 'get' operation
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete', 'pause', 'resume'],
					},
				},
				description: 'The email of the account',
			},

			// Fields for 'create' operation
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				required: true,
				default: '',
				displayOptions: {
					show: {
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
						operation: ['create'],
					},
				},
				description: 'The full name for the account',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Account Type',
						name: 'accountType',
						type: 'options',
						options: [
							{
								name: 'Gmail',
								value: 'gmail',
							},
							{
								name: 'O365',
								value: 'o365',
							},
							{
								name: 'SMTP',
								value: 'smtp',
							},
						],
						default: 'gmail',
						description: 'The type of account',
					},
					{
						displayName: 'Send Limit Daily',
						name: 'sendLimitDaily',
						type: 'number',
						default: 200,
						description: 'The daily send limit for the account',
					},
					{
						displayName: 'Warmup Enabled',
						name: 'warmupEnabled',
						type: 'boolean',
						default: true,
						description: 'Whether warmup is enabled for the account',
					},
					{
						displayName: 'Warmup Daily Increase',
						name: 'warmupDailyIncrease',
						type: 'number',
						default: 5,
						description: 'The daily increase for warmup',
					},
				],
			},

			// Fields for 'update' operation
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				default: {},
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
					{
						displayName: 'Send Limit Daily',
						name: 'sendLimitDaily',
						type: 'number',
						default: 200,
						description: 'The daily send limit for the account',
					},
					{
						displayName: 'Warmup Enabled',
						name: 'warmupEnabled',
						type: 'boolean',
						default: true,
						description: 'Whether warmup is enabled for the account',
					},
					{
						displayName: 'Warmup Daily Increase',
						name: 'warmupDailyIncrease',
						type: 'number',
						default: 5,
						description: 'The daily increase for warmup',
					},
				],
			},

			// Fields for 'getAll' operation
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				displayOptions: {
					show: {
						operation: ['getAll'],
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
						operation: ['getAll'],
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
				displayOptions: {
					show: {
						operation: ['getAll'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Active',
								value: 'active',
							},
							{
								name: 'Paused',
								value: 'paused',
							},
							{
								name: 'All',
								value: 'all',
							},
						],
						default: 'all',
						description: 'Filter accounts by status',
					},
				],
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
