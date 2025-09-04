import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class InstantlyApi implements ICredentialType {
	name = 'instantlyApi';
	displayName = 'Instantly API';
	documentationUrl = 'https://developer.instantly.ai/api/v2';
	icon = 'file:instantly.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Instantly API key. You can find this in your Instantly dashboard under Settings > API Keys.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '=Bearer {{$credentials.apiKey}}',
			},
		},
	};
}
