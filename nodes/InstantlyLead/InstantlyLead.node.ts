import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
} from 'n8n-workflow';

export class InstantlyLead implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Lead',
		name: 'instantlyLead',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Manage your Instantly leads',
		defaults: {
			name: 'Instantly Lead',
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
						description: 'Create a new lead',
						action: 'Create a new lead',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a lead by ID',
						action: 'Get a lead',
					},
					{
						name: 'Get Many',
						value: 'getMany',
						description: 'Get multiple leads',
						action: 'Get multiple leads',
					},
					{
						name: 'Update',
						value: 'update',
						description: 'Update a lead',
						action: 'Update a lead',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a lead',
						action: 'Delete a lead',
					},
					{
						name: 'Update Interest Status',
						value: 'updateInterestStatus',
						description: 'Update lead interest status',
						action: 'Update lead interest status',
					},
					{
						name: 'Remove From Subsequence',
						value: 'removeFromSubsequence',
						description: 'Remove a lead from a subsequence',
						action: 'Remove a lead from a subsequence',
					},
				],
				default: 'create',
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
				description: 'Email address of the lead',
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
						displayName: 'Campaign ID',
						name: 'campaignId',
						type: 'string',
						default: '',
						description: 'ID of the campaign to add the lead to',
					},
					{
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
						description: 'Company name of the lead',
					},
					{
						displayName: 'Position',
						name: 'position',
						type: 'string',
						default: '',
						description: 'Job title or position of the lead',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Phone number of the lead',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City of the lead',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'State of the lead',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country of the lead',
					},
					{
						displayName: 'LinkedIn URL',
						name: 'linkedinUrl',
						type: 'string',
						default: '',
						description: 'LinkedIn profile URL of the lead',
					},
					{
						displayName: 'Twitter URL',
						name: 'twitterUrl',
						type: 'string',
						default: '',
						description: 'Twitter profile URL of the lead',
					},
					{
						displayName: 'Website',
						name: 'website',
						type: 'string',
						default: '',
						description: 'Website of the lead or their company',
					},
					{
						displayName: 'Custom Fields',
						name: 'customFields',
						placeholder: 'Add Custom Field',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'field',
								displayName: 'Field',
								values: [
									{
										displayName: 'Field Name or ID',
										name: 'fieldName',
										type: 'string',
										default: '',
										description: 'Name of the custom field',
									},
									{
										displayName: 'Field Value',
										name: 'fieldValue',
										type: 'string',
										default: '',
										description: 'Value to set for the custom field',
									},
								],
							},
						],
					},
				],
			},

			// Fields for 'get', 'update', 'delete', 'updateInterestStatus' operations
			{
				displayName: 'Lead ID',
				name: 'leadId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete', 'updateInterestStatus'],
					},
				},
				description: 'ID of the lead',
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
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Email address of the lead',
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
						displayName: 'Company',
						name: 'company',
						type: 'string',
						default: '',
						description: 'Company name of the lead',
					},
					{
						displayName: 'Position',
						name: 'position',
						type: 'string',
						default: '',
						description: 'Job title or position of the lead',
					},
					{
						displayName: 'Phone',
						name: 'phone',
						type: 'string',
						default: '',
						description: 'Phone number of the lead',
					},
					{
						displayName: 'City',
						name: 'city',
						type: 'string',
						default: '',
						description: 'City of the lead',
					},
					{
						displayName: 'State',
						name: 'state',
						type: 'string',
						default: '',
						description: 'State of the lead',
					},
					{
						displayName: 'Country',
						name: 'country',
						type: 'string',
						default: '',
						description: 'Country of the lead',
					},
					{
						displayName: 'LinkedIn URL',
						name: 'linkedinUrl',
						type: 'string',
						default: '',
						description: 'LinkedIn profile URL of the lead',
					},
					{
						displayName: 'Twitter URL',
						name: 'twitterUrl',
						type: 'string',
						default: '',
						description: 'Twitter profile URL of the lead',
					},
					{
						displayName: 'Website',
						name: 'website',
						type: 'string',
						default: '',
						description: 'Website of the lead or their company',
					},
					{
						displayName: 'Custom Fields',
						name: 'customFields',
						placeholder: 'Add Custom Field',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						options: [
							{
								name: 'field',
								displayName: 'Field',
								values: [
									{
										displayName: 'Field Name or ID',
										name: 'fieldName',
										type: 'string',
										default: '',
										description: 'Name of the custom field',
									},
									{
										displayName: 'Field Value',
										name: 'fieldValue',
										type: 'string',
										default: '',
										description: 'Value to set for the custom field',
									},
								],
							},
						],
					},
				],
			},

			// Fields for 'updateInterestStatus' operation
			{
				displayName: 'Interest Status',
				name: 'interestStatus',
				type: 'options',
				required: true,
				displayOptions: {
					show: {
						operation: ['updateInterestStatus'],
					},
				},
				options: [
					{
						name: 'Not Interested',
						value: 'notInterested',
					},
					{
						name: 'Interested',
						value: 'interested',
					},
					{
						name: 'Very Interested',
						value: 'veryInterested',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
				],
				default: 'notInterested',
				description: 'Interest status to set for the lead',
			},

			// Fields for 'removeFromSubsequence' operation
			{
				displayName: 'Lead IDs',
				name: 'leadIds',
				type: 'string',
				typeOptions: {
					multipleValues: true,
					multipleValueButtonText: 'Add ID',
				},
				required: true,
				default: [],
				displayOptions: {
					show: {
						operation: ['removeFromSubsequence'],
					},
				},
				description: 'IDs of the leads to remove',
			},
			{
				displayName: 'Subsequence ID',
				name: 'subsequenceId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						operation: ['removeFromSubsequence'],
					},
				},
				description: 'ID of the subsequence to remove the leads from',
			},

			// Fields for 'getMany' operation
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
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Campaign ID',
						name: 'campaignId',
						type: 'string',
						default: '',
						description: 'Filter leads by campaign ID',
					},
					{
						displayName: 'Email',
						name: 'email',
						type: 'string',
						placeholder: 'name@email.com',
						default: '',
						description: 'Filter leads by email address',
					},
					{
						displayName: 'Created After',
						name: 'createdAfter',
						type: 'dateTime',
						default: '',
						description: 'Filter leads created after this date',
					},
					{
						displayName: 'Created Before',
						name: 'createdBefore',
						type: 'dateTime',
						default: '',
						description: 'Filter leads created before this date',
					},
					{
						displayName: 'Interest Status',
						name: 'interestStatus',
						type: 'options',
						options: [
							{
								name: 'Not Interested',
								value: 'notInterested',
							},
							{
								name: 'Interested',
								value: 'interested',
							},
							{
								name: 'Very Interested',
								value: 'veryInterested',
							},
							{
								name: 'Customer',
								value: 'customer',
							},
						],
						default: 'notInterested',
						description: 'Filter leads by interest status',
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
