/**
 * Account resource operations and fields for Instantly API v2
 */
export const accountOperations = [
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
        action: 'Create an account',
        description: 'Create a new email account',
        routing: {
          request: {
            method: 'POST',
            url: '/accounts',
            body: {
              email: '={{$parameter["email"]}}',
              password: '={{$parameter["password"]}}',
              firstName: '={{$parameter["firstName"]}}',
              lastName: '={{$parameter["lastName"]}}',
              smtpHost: '={{$parameter["smtpHost"]}}',
              smtpPort: '={{$parameter["smtpPort"]}}',
              smtpUsername: '={{$parameter["smtpUsername"]}}',
              smtpPassword: '={{$parameter["smtpPassword"]}}',
            },
          },
        },
      },
      {
        name: 'Delete',
        value: 'delete',
        action: 'Delete an account',
        description: 'Delete an email account',
        routing: {
          request: {
            method: 'DELETE',
            url: '/accounts/{{$parameter["accountId"]}}',
          },
        },
      },
      {
        name: 'Get',
        value: 'get',
        action: 'Get an account',
        description: 'Get an email account by ID',
        routing: {
          request: {
            method: 'GET',
            url: '/accounts/{{$parameter["accountId"]}}',
          },
        },
      },
      {
        name: 'Get Many',
        value: 'getMany',
        action: 'Get many accounts',
        description: 'Get many email accounts',
        routing: {
          request: {
            method: 'GET',
            url: '/accounts',
            qs: {
              limit: '={{$parameter["limit"] || 100}}',
              starting_after: '={{$parameter["startingAfter"]}}',
            },
          },
        },
      },
      {
        name: 'Update',
        value: 'update',
        action: 'Update an account',
        description: 'Update an email account',
        routing: {
          request: {
            method: 'PATCH',
            url: '/accounts/{{$parameter["accountId"]}}',
            body: {
              firstName: '={{$parameter["firstName"]}}',
              lastName: '={{$parameter["lastName"]}}',
              smtpHost: '={{$parameter["smtpHost"]}}',
              smtpPort: '={{$parameter["smtpPort"]}}',
              smtpUsername: '={{$parameter["smtpUsername"]}}',
              smtpPassword: '={{$parameter["smtpPassword"]}}',
            },
          },
        },
      },
    ],
    default: 'getMany',
  },
];

export const accountFields = [
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'ID of the email account',
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
        resource: ['account'],
        operation: ['create'],
      },
    },
    description: 'Email address for the account',
  },
  {
    displayName: 'Password',
    name: 'password',
    type: 'string',
    typeOptions: { password: true },
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create'],
      },
    },
    description: 'Password for the email account',
  },
  {
    displayName: 'First Name',
    name: 'firstName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create', 'update'],
      },
    },
    description: 'First name for the account',
  },
  {
    displayName: 'Last Name',
    name: 'lastName',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create', 'update'],
      },
    },
    description: 'Last name for the account',
  },
  {
    displayName: 'SMTP Host',
    name: 'smtpHost',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create', 'update'],
      },
    },
    description: 'SMTP server host',
  },
  {
    displayName: 'SMTP Port',
    name: 'smtpPort',
    type: 'number',
    typeOptions: {
      minValue: 1,
      maxValue: 65535,
    },
    default: 587,
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create', 'update'],
      },
    },
    description: 'SMTP server port',
  },
  {
    displayName: 'SMTP Username',
    name: 'smtpUsername',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create', 'update'],
      },
    },
  },
  {
    displayName: 'SMTP Password',
    name: 'smtpPassword',
    type: 'string',
    typeOptions: { password: true },
    default: '',
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['create', 'update'],
      },
    },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['account'],
        operation: ['getMany'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
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
        resource: ['account'],
        operation: ['getMany'],
        returnAll: [false],
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
        resource: ['account'],
        operation: ['getMany'],
      },
    },
    description: 'Pagination cursor for next page',
  },
];
