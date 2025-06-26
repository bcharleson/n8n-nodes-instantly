import { INodeTypes, NodeConnectionType } from 'n8n-workflow';

import { Instantly } from './nodes/Instantly/Instantly.node';
import { InstantlyAccount } from './nodes/InstantlyAccount/InstantlyAccount.node';
import { InstantlyAnalytics } from './nodes/InstantlyAnalytics/InstantlyAnalytics.node';
import { InstantlyCampaign } from './nodes/InstantlyCampaign/InstantlyCampaign.node';
import { InstantlyInbox } from './nodes/InstantlyInbox/InstantlyInbox.node';
import { InstantlyLead } from './nodes/InstantlyLead/InstantlyLead.node';
import { InstantlyPlacementTest } from './nodes/InstantlyPlacementTest/InstantlyPlacementTest.node';
import { InstantlyApi } from './credentials/InstantlyApi.credentials';

// This exports the nodes for n8n to load
export const nodeTypes = {
	'instantly': Instantly,
	'instantlyAccount': InstantlyAccount,
	'instantlyAnalytics': InstantlyAnalytics,
	'instantlyCampaign': InstantlyCampaign,
	'instantlyInbox': InstantlyInbox,
	'instantlyLead': InstantlyLead,
	'instantlyPlacementTest': InstantlyPlacementTest,
};

export const credentialTypes = {
	'instantlyApi': InstantlyApi,
};
