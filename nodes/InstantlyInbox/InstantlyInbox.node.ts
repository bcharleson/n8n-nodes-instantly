import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class InstantlyInbox implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Inbox',
		name: 'instantlyInbox',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage your Instantly inbox',
		defaults: {
			name: 'Instantly Inbox',
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
						name: 'Reply to Email',
						value: 'reply',
						description: 'Reply to an email in your inbox',
						action: 'Reply to an email',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many emails from your inbox',
						action: 'Get many emails',
					},
					{
						name: 'Get Email',
						value: 'get',
						description: 'Get a specific email by ID',
						action: 'Get an email',
					},
					{
						name: 'Update Email',
						value: 'update',
						description: 'Update email properties',
						action: 'Update an email',
					},
					{
						name: 'Delete Email',
						value: 'delete',
						description: 'Delete an email',
						action: 'Delete an email',
					},
				],
				default: 'getAll',
			},

			// Fields for 'reply', 'get', 'update', 'delete' operations
			{
				displayName: 'Email ID',
				name: 'emailId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['reply', 'get', 'update', 'delete'],
					},
				},
				description: 'The ID of the email',
			},

			// Fields for 'reply' operation
			{
				displayName: 'Reply Body',
				name: 'body',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['reply'],
					},
				},
				description: 'The body of your reply email',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						operation: ['reply'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Attachments',
						name: 'attachments',
						placeholder: 'Add Attachment',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'attachment',
								displayName: 'Attachment',
								values: [
									{
										displayName: 'Attachment Name',
										name: 'name',
										type: 'string',
										default: '',
										description: 'Name of the attachment',
									},
									{
										displayName: 'Binary Property',
										name: 'binaryProperty',
										type: 'string',
										default: 'data',
										description: 'Binary property containing the file data',
									},
								],
							},
						],
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
						displayName: 'Status',
						name: 'status',
						type: 'options',
						options: [
							{
								name: 'Read',
								value: 'read',
							},
							{
								name: 'Unread',
								value: 'unread',
							},
							{
								name: 'Archived',
								value: 'archived',
							},
						],
						default: 'read',
						description: 'The status of the email',
					},
					{
						displayName: 'Labels',
						name: 'labels',
						type: 'string',
						default: '',
						description: 'Comma-separated list of labels to apply to the email',
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
								name: 'All',
								value: 'all',
							},
							{
								name: 'Read',
								value: 'read',
							},
							{
								name: 'Unread',
								value: 'unread',
							},
							{
								name: 'Archived',
								value: 'archived',
							},
						],
						default: 'all',
						description: 'Filter emails by status',
					},
					{
						displayName: 'From Email',
						name: 'fromEmail',
						type: 'string',
						default: '',
						description: 'Filter emails by sender email address',
					},
					{
						displayName: 'Campaign ID',
						name: 'campaignId',
						type: 'string',
						default: '',
						description: 'Filter emails by associated campaign ID',
					},
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
						description: 'Filter emails received after this date/time',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
						description: 'Filter emails received before this date/time',
					},
					{
						displayName: 'Label',
						name: 'label',
						type: 'string',
						default: '',
						description: 'Filter emails by label',
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
