import { IExecuteFunctions } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { ILeadFields } from '../types/common';

/**
 * Lead operations handler
 * Enhanced with comprehensive API coverage and proper endpoints
 */
export class LeadOperations {
	/**
	 * Create a new lead
	 */
	static async create(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const email = context.getNodeParameter('email', itemIndex) as string;
		const firstName = context.getNodeParameter('first_name', itemIndex, '') as string;
		const lastName = context.getNodeParameter('last_name', itemIndex, '') as string;
		const companyName = context.getNodeParameter('company_name', itemIndex, '') as string;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		const body: any = {
			email,
		};

		// Add basic fields if provided
		if (firstName) body.first_name = firstName;
		if (lastName) body.last_name = lastName;
		if (companyName) body.company_name = companyName;

		// Add additional fields
		if (additionalFields.phone) body.phone = additionalFields.phone;
		if (additionalFields.website) body.website = additionalFields.website;
		if (additionalFields.personalization) body.personalization = additionalFields.personalization;

		// Handle campaign resourceLocator
		if (additionalFields.campaign) {
			const campaignValue = additionalFields.campaign;
			if (campaignValue.mode === 'id' && campaignValue.value) {
				body.campaign = campaignValue.value;
			} else if (campaignValue.mode === 'list' && campaignValue.value) {
				body.campaign = campaignValue.value;
			}
		}

		// Handle custom fields - nest under custom_variables according to API spec
		if (additionalFields.customFields && additionalFields.customFields.customFieldValues && additionalFields.customFields.customFieldValues.field) {
			const customVariables: { [key: string]: any } = {};

			// Handle both single field and multiple fields
			const fields = Array.isArray(additionalFields.customFields.customFieldValues.field)
				? additionalFields.customFields.customFieldValues.field
				: [additionalFields.customFields.customFieldValues.field];

			fields.forEach((field: any) => {
				if (field.key && field.key.trim() !== '' && field.value !== undefined) {
					customVariables[field.key.trim()] = field.value;
				}
			});

			// Add custom_variables to the body if any were provided
			if (Object.keys(customVariables).length > 0) {
				body.custom_variables = customVariables;
			}
		}

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/leads', body);
	}

	/**
	 * Get a single lead by ID
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const leadLocator = context.getNodeParameter('leadId', itemIndex) as any;
		let leadId: string;

		if (leadLocator.mode === 'id') {
			leadId = leadLocator.value;
		} else if (leadLocator.mode === 'list') {
			leadId = leadLocator.value;
		} else {
			throw new Error('Lead ID is required');
		}

		return await instantlyApiRequest.call(context, 'GET', `/api/v2/leads/${leadId}`);
	}

	/**
	 * Get many leads with filtering and pagination
	 */
	static async getMany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const filters = context.getNodeParameter('filters', itemIndex, {}) as any;

		const body: any = {};

		// Add filters
		if (filters.search) body.search = filters.search;
		if (filters.filter) body.filter = filters.filter;
		if (filters.in_campaign !== undefined) body.in_campaign = filters.in_campaign;
		if (filters.esp_code !== undefined && filters.esp_code !== '') body.esp_code = filters.esp_code;

		// Handle campaign resourceLocator
		if (filters.campaign) {
			const campaignValue = filters.campaign;
			if (campaignValue.mode === 'id' && campaignValue.value) {
				body.campaign = campaignValue.value;
			} else if (campaignValue.mode === 'list' && campaignValue.value) {
				body.campaign = campaignValue.value;
			}
		}

		if (returnAll) {
			// Get all results with pagination
			const allResults: any[] = [];
			let hasMore = true;
			let startingAfter: string | undefined;

			while (hasMore) {
				const requestBody = { ...body };
				if (startingAfter) {
					requestBody.starting_after = startingAfter;
				}
				requestBody.limit = 100; // Maximum allowed

				const response = await instantlyApiRequest.call(context, 'POST', '/api/v2/leads/list', requestBody);

				if (response.items && response.items.length > 0) {
					allResults.push(...response.items);
					startingAfter = response.next_starting_after;
					hasMore = !!startingAfter;
				} else {
					hasMore = false;
				}
			}

			return { items: allResults };
		} else {
			// Get limited results
			const limit = context.getNodeParameter('limit', itemIndex, 50) as number;
			body.limit = limit;

			return await instantlyApiRequest.call(context, 'POST', '/api/v2/leads/list', body);
		}
	}

	/**
	 * Update a lead
	 */
	static async update(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const leadLocator = context.getNodeParameter('leadId', itemIndex) as any;
		const updateFields = context.getNodeParameter('updateFields', itemIndex, {}) as any;

		let leadId: string;
		if (leadLocator.mode === 'id') {
			leadId = leadLocator.value;
		} else if (leadLocator.mode === 'list') {
			leadId = leadLocator.value;
		} else {
			throw new Error('Lead ID is required');
		}

		const body: any = {};

		// Add update fields
		if (updateFields.email) body.email = updateFields.email;
		if (updateFields.first_name) body.first_name = updateFields.first_name;
		if (updateFields.last_name) body.last_name = updateFields.last_name;
		if (updateFields.company_name) body.company_name = updateFields.company_name;
		if (updateFields.phone) body.phone = updateFields.phone;
		if (updateFields.website) body.website = updateFields.website;
		if (updateFields.personalization) body.personalization = updateFields.personalization;
		if (updateFields.lt_interest_status !== undefined) body.lt_interest_status = updateFields.lt_interest_status;
		if (updateFields.pl_value_lead) body.pl_value_lead = updateFields.pl_value_lead;

		// Handle campaign resourceLocator
		if (updateFields.campaign) {
			const campaignValue = updateFields.campaign;
			if (campaignValue.mode === 'id' && campaignValue.value) {
				body.campaign = campaignValue.value;
			} else if (campaignValue.mode === 'list' && campaignValue.value) {
				body.campaign = campaignValue.value;
			}
		}

		return await instantlyApiRequest.call(context, 'PATCH', `/api/v2/leads/${leadId}`, body);
	}

	/**
	 * Delete a lead
	 */
	static async delete(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const leadLocator = context.getNodeParameter('leadId', itemIndex) as any;
		let leadId: string;

		if (leadLocator.mode === 'id') {
			leadId = leadLocator.value;
		} else if (leadLocator.mode === 'list') {
			leadId = leadLocator.value;
		} else {
			throw new Error('Lead ID is required');
		}

		return await instantlyApiRequest.call(context, 'DELETE', `/api/v2/leads/${leadId}`);
	}

	/**
	 * Update interest status for leads
	 */
	static async updateInterestStatus(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const interestStatus = context.getNodeParameter('interestStatus', itemIndex) as number;
		const leadIds = context.getNodeParameter('leadIds', itemIndex) as string;

		const body = {
			interest_status: interestStatus,
			lead_ids: leadIds.split(',').map(id => id.trim()),
		};

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/leads/update-interest-status', body);
	}

	/**
	 * Add lead to campaign - streamlined operation for creating a lead and associating with campaign
	 */
	static async addToCampaign(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		// Get campaign ID from resourceLocator
		const campaignLocator = context.getNodeParameter('campaign', itemIndex) as any;
		let campaignId: string;

		if (typeof campaignLocator === 'string') {
			// Backward compatibility
			campaignId = campaignLocator;
		} else {
			// ResourceLocator format
			campaignId = campaignLocator.mode === 'id' ? campaignLocator.value : campaignLocator.value;
		}

		// Required core fields
		const email = context.getNodeParameter('email', itemIndex) as string;
		const firstName = context.getNodeParameter('firstName', itemIndex) as string;
		const lastName = context.getNodeParameter('lastName', itemIndex) as string;

		// Optional fields
		const personalization = context.getNodeParameter('personalization', itemIndex, '') as string;
		const customFields = context.getNodeParameter('customFields', itemIndex, {}) as any;

		// Build the lead creation payload
		const body: any = {
			email,
			first_name: firstName,
			last_name: lastName,
			campaign: campaignId, // FIXED: Use 'campaign' instead of 'campaign_id' per API spec
		};

		// Add personalization if provided
		if (personalization && personalization.trim() !== '') {
			body.personalization = personalization.trim();
		}

		// Process custom fields if provided - FIXED: Nest under custom_variables per API spec
		if (customFields.customFieldValues && customFields.customFieldValues.field) {
			const customVariables: { [key: string]: any } = {};

			// Handle both single field and multiple fields
			const fields = Array.isArray(customFields.customFieldValues.field)
				? customFields.customFieldValues.field
				: [customFields.customFieldValues.field];

			fields.forEach((field: any) => {
				if (field.key && field.key.trim() !== '' && field.value !== undefined) {
					customVariables[field.key.trim()] = field.value;
				}
			});

			// Add custom_variables to the body if any were provided
			if (Object.keys(customVariables).length > 0) {
				body.custom_variables = customVariables;
			}
		}

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/leads', body);
	}
}
