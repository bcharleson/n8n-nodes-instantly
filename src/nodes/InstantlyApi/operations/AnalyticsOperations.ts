import { IExecuteFunctions } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { getCampaignId } from '../functions/resourceLocatorHelpers';
import { formatDateForApi } from '../functions/dateHelpers';
import { IAnalyticsParams } from '../types/common';

/**
 * Analytics operations handler
 */
export class AnalyticsOperations {
	/**
	 * Get campaign analytics with date filtering
	 */
	static async getCampaignAnalytics(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;

		// Get date parameters and format them for the API
		const startDateInput = context.getNodeParameter('startDate', itemIndex, '');
		const endDateInput = context.getNodeParameter('endDate', itemIndex, '');

		// Build query parameters object
		const queryParams: any = {};

		// Add date parameters if provided, using the robust date formatter
		const formattedStartDate = formatDateForApi(startDateInput);
		const formattedEndDate = formatDateForApi(endDateInput);

		if (formattedStartDate) {
			queryParams.start_date = formattedStartDate;
		}
		if (formattedEndDate) {
			queryParams.end_date = formattedEndDate;
		}

		if (returnAll) {
			// Get analytics for all campaigns with date filtering
			return await instantlyApiRequest.call(context, 'GET', '/api/v2/campaigns/analytics', {}, queryParams);
		} else {
			// Get analytics for specific campaign with date filtering
			const campaignId = getCampaignId(context, itemIndex);
			queryParams.id = campaignId;
			return await instantlyApiRequest.call(context, 'GET', '/api/v2/campaigns/analytics', {}, queryParams);
		}
	}
}
