import { InstantlyApi } from './src/nodes/InstantlyApi/InstantlyApi.node';
import { InstantlyApi as InstantlyApiCredentials } from './src/credentials/InstantlyApi.credentials';

// This exports the nodes for n8n to load
export const nodeTypes = {
	'instantly': InstantlyApi,
};

export const credentialTypes = {
	'instantlyApi': InstantlyApiCredentials,
};
