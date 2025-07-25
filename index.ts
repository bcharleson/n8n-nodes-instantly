import { INodeTypes, NodeConnectionType } from 'n8n-workflow';

import { InstantlyApi } from './nodes/Instantly/Instantly.node';
import { InstantlyTrigger } from './nodes/InstantlyTrigger/InstantlyTrigger.node';
import { InstantlyApi as InstantlyApiCredentials } from './credentials/InstantlyApi.credentials';

// This exports the nodes for n8n to load
export const nodeTypes = {
	'instantly': InstantlyApi,
	'instantlyTrigger': InstantlyTrigger,
};

export const credentialTypes = {
	'instantlyApi': InstantlyApiCredentials,
};
