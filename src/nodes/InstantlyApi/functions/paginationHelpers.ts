import { IExecuteFunctions } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';

/**
 * Pagination utilities for Instantly API
 */

/**
 * Helper function for pagination
 */
export async function paginateInstantlyApi(
	context: IExecuteFunctions,
	endpoint: string,
	resourceName: string,
): Promise<any[]> {
	let allItems: any[] = [];
	let startingAfter: string | undefined;
	let hasMore = true;
	let pageCount = 0;

	console.log(`Starting pagination for ${resourceName}...`);

	while (hasMore) {
		pageCount++;
		const queryParams: any = { limit: 100 }; // Use max limit for efficiency
		if (startingAfter) {
			queryParams.starting_after = startingAfter;
		}

		const response = await instantlyApiRequest.call(context, 'GET', endpoint, {}, queryParams);

		if (response.items && Array.isArray(response.items)) {
			allItems = allItems.concat(response.items);
		}

		// Check if there are more pages
		if (response.next_starting_after) {
			startingAfter = response.next_starting_after;
			console.log(`More pages available. Next starting_after: ${startingAfter}`);
		} else {
			hasMore = false;
			console.log('No more pages available.');
		}

		// Safety check to prevent infinite loops
		if (pageCount > 1000) {
			console.warn('Pagination safety limit reached (1000 pages). Stopping.');
			break;
		}
	}

	console.log(`Pagination complete. Total items retrieved: ${allItems.length}`);
	return allItems;
}
