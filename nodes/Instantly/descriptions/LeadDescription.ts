/**
 * Lead resource operations and fields for Instantly API v2
 */
export const leadOperations = [
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
        action: 'Create a lead',
        description: 'Create a new lead',
        routing: {
          request: {
            method: 'POST',
            url: '/leads',
            body: {
              email: '={{$parameter["email"]}}',
              company: '={{$parameter["company"]}}',
              firstName: '={{$parameter["firstName"]}}',
              lastName: '={{$parameter["lastName"]}}',
              linkedinUrl: '={{$parameter["linkedinUrl"]}}',
            },
          },
        },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete a lead',
        description: 'Delete a lead',
        routing: {
          request: {
            method: 'DELETE',
            url: '/leads/{{$parameter["leadId"]}}',
          },
        },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get a lead',
        description: 'Get a lead by ID',
        routing: {
          request: {
            method: 'GET',
            url: '/leads/{{$parameter["leadId"]}}',
          },
        },
      },
      {
        name: 'Get Many',
        value: 'getMany',
        action: 'Get many leads',
        description: 'Get many leads',
        routing: {
          request: {
            method: 'GET',
            url: '/leads',
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
        action: 'Update a lead',
        description: 'Update a lead',
        routing: {
          request: {
            method: 'PATCH',
            url: '/leads/{{$parameter["leadId"]}}',
            body: {
              email: '={{$parameter["email"]}}',
              company: '={{$parameter["company"]}}',
              firstName: '={{$parameter["firstName"]}}',
              lastName: '={{$parameter["lastName"]}}',
              linkedinUrl: '={{$parameter["linkedinUrl"]}}',
            },
          },
        },
      },
    ],
    default: 'getMany',
  },
];

export const leadFields = [
  {
    displayName: 'Lead ID',
    name: 'leadId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'ID of the lead',
  },
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
        operation: ['create', 'update'],
      },
    },
    description: 'Email of the lead',
  },
  {
    displayName: 'Company',
    name: 'company',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create', 'update'],
      },
    },
    description: 'Company of the lead',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create', 'update'],
      },
    },
    description: 'First name of the lead',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create', 'update'],
      },
    },
    description: 'Last name of the lead',
  },
  {
    displayName: 'LinkedIn URL',
    name: 'linkedinUrl',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['lead'],
        operation: ['create', 'update'],
      },
    },
    description: 'LinkedIn URL of the lead',
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
        resource: ['lead'],
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
        resource: ['lead'],
        operation: ['getMany'],
      },
    },
    description: 'Pagination cursor for next page',
  },
];
