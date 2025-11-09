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

		// Handle response structure - items are in 'items' array for paginated responses
		let itemsData: any[] = [];
		if (response.items && Array.isArray(response.items)) {
			itemsData = response.items;
		} else if (response.data && Array.isArray(response.data)) {
			itemsData = response.data;
		} else if (Array.isArray(response)) {
			itemsData = response;
		} else {
			console.warn('Unexpected response structure:', response);
		}

		if (itemsData.length > 0) {
			allItems = allItems.concat(itemsData);
			console.log(`Page ${pageCount}: Retrieved ${itemsData.length} items. Total so far: ${allItems.length}`);
		} else {
			hasMore = false;
			console.log('No items in response. Stopping pagination.');
		}

		// Check if there are more pages using next_starting_after
		if (response.next_starting_after && itemsData.length > 0) {
			startingAfter = response.next_starting_after;
			console.log(`More pages available. Next starting_after: ${startingAfter}`);
		} else {
			hasMore = false;
			console.log('No more pages available.');
		}

		// Safety check to prevent infinite loops
		if (pageCount > 1000) {
			console.warn('Pagination stopped after 1000 pages to prevent infinite loop');
			break;
		}
	}

	console.log(`Pagination complete. Total items retrieved: ${allItems.length}`);
	return allItems;
}
