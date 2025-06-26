import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeConnectionType,
} from 'n8n-workflow';

import { instantlyApiRequest } from '../generic.functions';

export class InstantlyCampaign implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Instantly Campaign',
		name: 'instantlyCampaign',
		icon: 'file:instantly.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Create, get, update and delete campaigns',
		defaults: {
			name: 'Instantly Campaign',
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
						description: 'Create a campaign',
						action: 'Create a campaign',
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
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete a campaign',
						action: 'Delete a campaign',
					},
					{
						name: 'Start',
						value: 'start',
						description: 'Start a campaign',
						action: 'Start a campaign',
					},
					{
						name: 'Pause',
						value: 'pause',
						description: 'Pause a campaign',
						action: 'Pause a campaign',
					},
					{
						name: 'Resume',
						value: 'resume',
						description: 'Resume a campaign',
						action: 'Resume a campaign',
					},
					{
						name: 'Add Leads',
						value: 'addLeads',
						description: 'Add leads to a campaign',
						action: 'Add leads to a campaign',
					},
				],
				default: 'create',
			},

			// ----------------------------------
			//         campaign:create
			// ----------------------------------
			{
				displayName: 'Campaign Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
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
						operation: ['create'],
					},
				},
				description: 'ID of the email account to use',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Sending Schedule',
						name: 'sendingSchedule',
						type: 'collection',
						placeholder: 'Add Schedule Settings',
						default: {},
						options: [
							{
								displayName: 'Daily Limit',
								name: 'dailyLimit',
								type: 'number',
								default: 100,
								description: 'Maximum number of emails to send per day',
							},
							{
								displayName: 'Send Emails On Weekends',
								name: 'sendOnWeekends',
								type: 'boolean',
								default: false,
								description: 'Whether to send emails on weekends',
							},
							{
								displayName: 'Time Zone',
								name: 'timezone',
								type: 'string',
								default: 'America/New_York',
								description: 'Time zone for sending emails',
							},
							{
								displayName: 'Working Hours',
								name: 'workingHours',
								type: 'fixedCollection',
								default: {},
								options: [
									{
										displayName: 'Hours',
										name: 'hours',
										values: [
											{
												displayName: 'Start Time',
												name: 'startTime',
												type: 'string',
												default: '09:00',
												description: 'Start time in 24-hour format (HH:MM)',
											},
											{
												displayName: 'End Time',
												name: 'endTime',
												type: 'string',
												default: '17:00',
												description: 'End time in 24-hour format (HH:MM)',
											},
										],
									},
								],
							},
						],
					},
					{
						displayName: 'Sequence Settings',
						name: 'sequenceSettings',
						type: 'collection',
						placeholder: 'Add Sequence Settings',
						default: {},
						options: [
							{
								displayName: 'Follow Up Steps',
								name: 'followUpSteps',
								type: 'fixedCollection',
								default: {},
								typeOptions: {
									multipleValues: true,
								},
								options: [
									{
										displayName: 'Steps',
										name: 'steps',
										values: [
											{
												displayName: 'Wait Time (Days)',
												name: 'waitDays',
												type: 'number',
												default: 3,
												description: 'Days to wait before sending this follow up',
											},
											{
												displayName: 'Email Subject',
												name: 'subject',
												type: 'string',
												default: '',
												description: 'Subject of the follow up email',
											},
											{
												displayName: 'Email Body',
												name: 'body',
												type: 'string',
												typeOptions: {
													rows: 4,
												},
												default: '',
												description: 'Body content of the follow up email',
											},
										],
									},
								],
							},
						],
					},
					{
						displayName: 'Initial Email',
						name: 'initialEmail',
						type: 'collection',
						placeholder: 'Add Initial Email Details',
						default: {},
						options: [
							{
								displayName: 'Subject',
								name: 'subject',
								type: 'string',
								default: '',
								description: 'Subject line of the initial email',
							},
							{
								displayName: 'Body',
								name: 'body',
								type: 'string',
								typeOptions: {
									rows: 4,
								},
								default: '',
								description: 'Body content of the initial email',
							},
						],
					},
				],
			},

			// ----------------------------------
			//         campaign:get
			// ----------------------------------
			{
				displayName: 'Campaign ID',
				name: 'campaignId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete', 'start', 'pause', 'resume', 'addLeads'],
					},
				},
				description: 'ID of the campaign to operate on',
			},

			// ----------------------------------
			//         campaign:getMany
			// ----------------------------------
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
				default: {},
				displayOptions: {
					show: {
						operation: ['getMany'],
					},
				},
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
								name: 'Completed',
								value: 'completed',
							},
							{
								name: 'Draft',
								value: 'draft',
							},
						],
						default: 'active',
						description: 'Filter campaigns by status',
					},
					{
						displayName: 'Email Account ID',
						name: 'emailAccountId',
						type: 'string',
						default: '',
						description: 'Filter campaigns by email account ID',
					},
					{
						displayName: 'Created After',
						name: 'createdAfter',
						type: 'dateTime',
						default: '',
						description: 'Filter campaigns created after this date',
					},
					{
						displayName: 'Created Before',
						name: 'createdBefore',
						type: 'dateTime',
						default: '',
						description: 'Filter campaigns created before this date',
					},
				],
			},

			// ----------------------------------
			//         campaign:update
			// ----------------------------------
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						operation: ['update'],
					},
				},
				options: [
					{
						displayName: 'Campaign Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'New name of the campaign',
					},
					{
						displayName: 'Sending Schedule',
						name: 'sendingSchedule',
						type: 'collection',
						placeholder: 'Update Schedule Settings',
						default: {},
						options: [
							{
								displayName: 'Daily Limit',
								name: 'dailyLimit',
								type: 'number',
								default: 100,
								description: 'Maximum number of emails to send per day',
							},
							{
								displayName: 'Send Emails On Weekends',
								name: 'sendOnWeekends',
								type: 'boolean',
								default: false,
								description: 'Whether to send emails on weekends',
							},
							{
								displayName: 'Time Zone',
								name: 'timezone',
								type: 'string',
								default: 'America/New_York',
								description: 'Time zone for sending emails',
							},
							{
								displayName: 'Working Hours',
								name: 'workingHours',
								type: 'fixedCollection',
								default: {},
								options: [
									{
										displayName: 'Hours',
										name: 'hours',
										values: [
											{
												displayName: 'Start Time',
												name: 'startTime',
												type: 'string',
												default: '09:00',
												description: 'Start time in 24-hour format (HH:MM)',
											},
											{
												displayName: 'End Time',
												name: 'endTime',
												type: 'string',
												default: '17:00',
												description: 'End time in 24-hour format (HH:MM)',
											},
										],
									},
								],
							},
						],
					},
				],
			},

			// ----------------------------------
			//         campaign:addLeads
			// ----------------------------------
			{
				displayName: 'Leads',
				name: 'leads',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						operation: ['addLeads'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Lead',
						name: 'lead',
						values: [
							{
								displayName: 'Email',
								name: 'email',
								type: 'string',
								placeholder: 'name@email.com',
								default: '',
								required: true,
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
								displayName: 'Additional Fields',
								name: 'additionalFields',
								type: 'collection',
								placeholder: 'Add Field',
								default: {},
								options: [
									{
										displayName: 'Title',
										name: 'title',
										type: 'string',
										default: '',
										description: 'Job title of the lead',
									},
									{
										displayName: 'LinkedIn URL',
										name: 'linkedinUrl',
										type: 'string',
										default: '',
										description: 'LinkedIn profile URL of the lead',
									},
									{
										displayName: 'Phone',
										name: 'phone',
										type: 'string',
										default: '',
										description: 'Phone number of the lead',
									},
									{
										displayName: 'Website',
										name: 'website',
										type: 'string',
										default: '',
										description: 'Company website of the lead',
									},
								],
							},
						],
					},
				],
				description: 'The leads to add to the campaign',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['addLeads'],
					},
				},
				options: [
					{
						displayName: 'Skip Duplicates',
						name: 'skipDuplicates',
						type: 'boolean',
						default: true,
						description: 'Whether to skip adding leads that are already in the campaign',
					},
					{
						displayName: 'Start Sequence Immediately',
						name: 'startImmediately',
						type: 'boolean',
						default: false,
						description: 'Whether to start sending emails to these leads immediately',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];
		const length = items.length;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < length; i++) {
			try {
				// *********************************************************************
				//                              CREATE
				// *********************************************************************
				if (operation === 'create') {
					const name = this.getNodeParameter('name', i) as string;
					const emailAccountId = this.getNodeParameter('emailAccountId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

					const body: IDataObject = {
						name,
						emailAccountId,
						...additionalFields,
					};

					const response = await instantlyApiRequest.call(this, 'POST', '/campaigns', body);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                                GET
				// *********************************************************************
				else if (operation === 'get') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const response = await instantlyApiRequest.call(this, 'GET', `/campaigns/${campaignId}`);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                             GET MANY
				// *********************************************************************
				else if (operation === 'getMany') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const filters = this.getNodeParameter('filters', i) as IDataObject;

					const qs: IDataObject = {
						...filters,
					};

					if (!returnAll) {
						const limit = this.getNodeParameter('limit', i) as number;
						qs.limit = limit;
					}

					const response = await instantlyApiRequest.call(this, 'GET', '/campaigns', {}, qs);
					returnData.push(...(response as IDataObject[]));
				}

				// *********************************************************************
				//                              UPDATE
				// *********************************************************************
				else if (operation === 'update') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

					const body: IDataObject = {
						...updateFields,
					};

					const response = await instantlyApiRequest.call(this, 'PATCH', `/campaigns/${campaignId}`, body);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                              DELETE
				// *********************************************************************
				else if (operation === 'delete') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const response = await instantlyApiRequest.call(this, 'DELETE', `/campaigns/${campaignId}`);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                               START
				// *********************************************************************
				else if (operation === 'start') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const response = await instantlyApiRequest.call(this, 'POST', `/campaigns/${campaignId}/start`);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                               PAUSE
				// *********************************************************************
				else if (operation === 'pause') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const response = await instantlyApiRequest.call(this, 'POST', `/campaigns/${campaignId}/pause`);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                              RESUME
				// *********************************************************************
				else if (operation === 'resume') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;

					const response = await instantlyApiRequest.call(this, 'POST', `/campaigns/${campaignId}/resume`);
					returnData.push(response as IDataObject);
				}

				// *********************************************************************
				//                             ADD LEADS
				// *********************************************************************
				else if (operation === 'addLeads') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const leadsCollection = this.getNodeParameter('leads', i) as { lead: IDataObject[] };
					const options = this.getNodeParameter('options', i) as IDataObject;

					const leads = leadsCollection.lead || [];

					const body: IDataObject = {
						leads,
						...options,
					};

					const response = await instantlyApiRequest.call(this, 'POST', `/campaigns/${campaignId}/leads`, body);
					returnData.push(response as IDataObject);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ error: error instanceof Error ? error.message : String(error) });
					continue;
				}
				throw error;
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
