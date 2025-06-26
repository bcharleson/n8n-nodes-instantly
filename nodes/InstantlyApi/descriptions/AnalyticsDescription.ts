/**
 * Analytics resource operations and fields for Instantly API v2
 */
export const analyticsOperations = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['analytics'],
      },
    },
    options: [
      {
        name: 'Get Campaign Analytics',
        value: 'getCampaignAnalytics',
        action: 'Get campaign analytics',
        description: 'Get analytics data for a specific campaign',
        routing: {
          request: {
            method: 'GET',
            url: '/analytics/campaigns/{{$parameter["campaignId"]}}',
            qs: {
              start_date: '={{$parameter["startDate"]}}',
              end_date: '={{$parameter["endDate"]}}',
            },
          },
        },
      },
      {
        name: 'Get Account Analytics',
        value: 'getAccountAnalytics',
        action: 'Get account analytics',
        description: 'Get analytics data for a specific email account',
        routing: {
          request: {
            method: 'GET',
            url: '/analytics/accounts/{{$parameter["accountId"]}}',
            qs: {
              start_date: '={{$parameter["startDate"]}}',
              end_date: '={{$parameter["endDate"]}}',
            },
          },
        },
      },
      {
        name: 'Get Overall Analytics',
        value: 'getOverallAnalytics',
        action: 'Get overall analytics',
        description: 'Get overall analytics data across all campaigns',
        routing: {
          request: {
            method: 'GET',
            url: '/analytics/overall',
            qs: {
              start_date: '={{$parameter["startDate"]}}',
              end_date: '={{$parameter["endDate"]}}',
            },
          },
        },
      },
    ],
    default: 'getCampaignAnalytics',
  },
];

export const analyticsFields = [
  {
    displayName: 'Campaign ID',
    name: 'campaignId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getCampaignAnalytics'],
      },
    },
    description: 'ID of the campaign to get analytics for',
  },
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getAccountAnalytics'],
      },
    },
    description: 'ID of the email account to get analytics for',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getCampaignAnalytics', 'getAccountAnalytics', 'getOverallAnalytics'],
      },
    },
    description: 'Start date for analytics data (ISO 8601 format)',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['analytics'],
        operation: ['getCampaignAnalytics', 'getAccountAnalytics', 'getOverallAnalytics'],
      },
    },
    description: 'End date for analytics data (ISO 8601 format)',
  },
];
