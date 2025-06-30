/**
 * Campaign resource operations and fields for Instantly API v2
 */
export const campaignOperations = [
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
        action: 'Create a campaign',
        description: 'Create a new campaign',
        routing: {
          request: {
            method: 'POST',
            url: '/campaigns',
            body: {
              name: '={{$parameter["name"]}}',
              emailAccountId: '={{$parameter["emailAccountId"]}}',
            },
          },
        },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a campaign',
        description: 'Delete a campaign',
        routing: {
          request: {
            method: 'DELETE',
            url: '/campaigns/{{$parameter["campaignId"]}}',
          },
        },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a campaign',
        description: 'Get a campaign by ID',
        routing: {
          request: {
            method: 'GET',
            url: '/campaigns/{{$parameter["campaignId"]}}',
          },
        },
      },
      {
        name: 'Get Many',
        value: 'getMany',
        action: 'Get many campaigns',
        description: 'Get many campaigns',
        routing: {
          request: {
            method: 'GET',
            url: '/campaigns',
            qs: {
              limit: '={{$parameter["limit"]}}',
              starting_after: '={{$parameter["startingAfter"]}}',
            },
          },
          sendPaginate: true,
        },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update a campaign',
        description: 'Update a campaign',
        routing: {
          request: {
            method: 'PATCH',
            url: '/campaigns/{{$parameter["campaignId"]}}',
            body: {
              name: '={{$parameter["name"]}}',
              emailAccountId: '={{$parameter["emailAccountId"]}}',
            },
          },
        },
      },
    ],
    default: 'getMany',
  },
];

export const campaignFields = [
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
    description: 'ID of the campaign',
  },
  {
    displayName: 'Name',
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
    description: 'Name of the campaign',
  },
  {
    displayName: 'Email Account ID',
    name: 'emailAccountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['create', 'update'],
      },
    },
    description: 'ID of the email account to use',
  },
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
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Starting After',
    name: 'startingAfter',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['campaign'],
        operation: ['getMany'],
      },
    },
    description: 'Pagination cursor for next page',
  },
];
