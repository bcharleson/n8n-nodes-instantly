import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
	IHttpRequestMethods,
	IDataObject,
} from 'n8n-workflow';

/**
 * Make an API request to Instantly
 */
export async function instantlyApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {

	const options: IHttpRequestOptions = {
		method,
		url: `https://api.instantly.ai/api/v2${endpoint}`,
		headers: {
			'Accept': 'application/json',
		},
		qs: {
			...qs,
		},
		body,
		json: true,
	};

	// Only set Content-Type and include body for requests that have data
	if (Object.keys(body).length > 0) {
		options.headers!['Content-Type'] = 'application/json';
	} else {
		// Remove body for requests without data (like DELETE)
		delete options.body;
	}

	try {
		return await this.helpers.httpRequestWithAuthentication.call(this, 'instantlyApi', options);
	} catch (error) {
		const err = error as any;
		if (err.response && err.response.body && err.response.body.message) {
			throw new Error(`Instantly error response [${err.response.statusCode}]: ${err.response.body.message}`);
		}
		throw error;
	}
}

/**
 * Make an API request to Instantly and return all results using cursor-based pagination
 * This function is deprecated - use custom pagination logic in the node implementation instead
 */
export async function instantlyApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	// This function is deprecated and should not be used
	// Use the custom pagination logic in the node implementation instead
	throw new Error('instantlyApiRequestAllItems is deprecated. Use custom pagination logic in the node implementation.');
}
