import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

export class InstantlyPlacementTest implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Placement Test',
		name: 'instantlyPlacementTest',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage inbox placement tests in Instantly',
		defaults: {
			name: 'Instantly Placement Test',
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
						description: 'Create an inbox placement test',
						action: 'Create an inbox placement test',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many inbox placement tests',
						action: 'Get many inbox placement tests',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get an inbox placement test by ID',
						action: 'Get an inbox placement test by ID',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update an inbox placement test',
						action: 'Update an inbox placement test',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete an inbox placement test',
						action: 'Delete an inbox placement test',
					},
					{
						name: 'Get ESP Options',
						value: 'getESPOptions',
						description: 'Get email service provider options',
						action: 'Get email service provider options',
					},
				],
				default: 'getAll',
			},

			// Fields for 'get', 'update', 'delete' operations
			{
				displayName: 'Test ID',
				name: 'testId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
				description: 'The ID of the inbox placement test',
			},

			// Fields for 'create' operation
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The name of the inbox placement test',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The subject line of the test email',
			},
			{
				displayName: 'From Email',
				name: 'fromEmail',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The email address to send from',
			},
			{
				displayName: 'From Name',
				name: 'fromName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The name to send from',
			},
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				description: 'The HTML content of the test email',
			},
			{
				displayName: 'ESP',
				name: 'esp',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Gmail',
						value: 'gmail',
					},
					{
						name: 'Office 365',
						value: 'office365',
					},
					{
						name: 'Outlook',
						value: 'outlook',
					},
					{
						name: 'Yahoo',
						value: 'yahoo',
					},
					{
						name: 'SMTP',
						value: 'smtp',
					},
				],
				default: 'gmail',
				description: 'The email service provider',
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
						displayName: 'Text Content',
						name: 'textContent',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'The plain text content of the test email',
					},
					{
						displayName: 'Seed List IDs',
						name: 'seedListIds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of seed list IDs',
					},
					{
						displayName: 'Reply To',
						name: 'replyTo',
						type: 'string',
						default: '',
						description: 'The reply-to email address',
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
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'The name of the inbox placement test',
					},
					{
						displayName: 'Subject',
						name: 'subject',
						type: 'string',
						default: '',
						description: 'The subject line of the test email',
					},
					{
						displayName: 'From Email',
						name: 'fromEmail',
						type: 'string',
						default: '',
						description: 'The email address to send from',
					},
					{
						displayName: 'From Name',
						name: 'fromName',
						type: 'string',
						default: '',
						description: 'The name to send from',
					},
					{
						displayName: 'HTML Content',
						name: 'htmlContent',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'The HTML content of the test email',
					},
					{
						displayName: 'Text Content',
						name: 'textContent',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						description: 'The plain text content of the test email',
					},
					{
						displayName: 'ESP',
						name: 'esp',
						type: 'options',
						options: [
							{
								name: 'Gmail',
								value: 'gmail',
							},
							{
								name: 'Office 365',
								value: 'office365',
							},
							{
								name: 'Outlook',
								value: 'outlook',
							},
							{
								name: 'Yahoo',
								value: 'yahoo',
							},
							{
								name: 'SMTP',
								value: 'smtp',
							},
						],
						default: 'gmail',
						description: 'The email service provider',
					},
					{
						displayName: 'Seed List IDs',
						name: 'seedListIds',
						type: 'string',
						default: '',
						description: 'Comma-separated list of seed list IDs',
					},
					{
						displayName: 'Reply To',
						name: 'replyTo',
						type: 'string',
						default: '',
						description: 'The reply-to email address',
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
								name: 'Pending',
								value: 'pending',
							},
							{
								name: 'In Progress',
								value: 'in_progress',
							},
							{
								name: 'Completed',
								value: 'completed',
							},
							{
								name: 'Failed',
								value: 'failed',
							},
							{
								name: 'All',
								value: 'all',
							},
						],
						default: 'all',
						description: 'Filter tests by status',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'Filter tests by start date',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
						description: 'Filter tests by end date',
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
