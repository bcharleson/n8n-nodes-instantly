import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { paginateInstantlyApi } from '../functions/paginationHelpers';

/**
 * SuperSearch Enrichment operations handler
 * NEW FEATURE: Added September 4, 2025
 * 
 * SuperSearch Enrichments provide AI-powered lead enrichment with:
 * - 450M+ contact database
 * - Waterfall enrichment from 5+ providers
 * - AI personalization with GPT-4o, GPT-5, Claude
 * - Company intelligence and funding data
 * - Email verification
 */
export class SuperSearchEnrichmentOperations {
	/**
	 * Create a new SuperSearch enrichment
	 */
	static async create(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const name = context.getNodeParameter('name', itemIndex) as string;
		const searchFilters = context.getNodeParameter('searchFilters', itemIndex, {}) as any;
		const enrichmentSettings = context.getNodeParameter('enrichmentSettings', itemIndex, {}) as any;
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		const body: any = {
			name: name.trim(),
		};

		// Add search filters
		if (searchFilters.location) {
			body.location = searchFilters.location;
		}
		if (searchFilters.jobTitles && searchFilters.jobTitles.length > 0) {
			body.job_titles = searchFilters.jobTitles;
		}
		if (searchFilters.companies && searchFilters.companies.length > 0) {
			body.companies = searchFilters.companies;
		}
		if (searchFilters.industries && searchFilters.industries.length > 0) {
			body.industries = searchFilters.industries;
		}

		// Add enrichment settings
		if (enrichmentSettings.enableWaterfallEnrichment !== undefined) {
			body.enable_waterfall_enrichment = enrichmentSettings.enableWaterfallEnrichment;
		}
		if (enrichmentSettings.enableAiEnrichment !== undefined) {
			body.enable_ai_enrichment = enrichmentSettings.enableAiEnrichment;
		}
		if (enrichmentSettings.aiModel) {
			body.ai_model = enrichmentSettings.aiModel;
		}
		if (enrichmentSettings.aiPrompt) {
			body.ai_prompt = enrichmentSettings.aiPrompt;
		}

		// Add additional fields
		if (additionalFields.maxResults) {
			body.max_results = additionalFields.maxResults;
		}
		if (additionalFields.enableEmailVerification !== undefined) {
			body.enable_email_verification = additionalFields.enableEmailVerification;
		}
		if (additionalFields.enableCompanyIntelligence !== undefined) {
			body.enable_company_intelligence = additionalFields.enableCompanyIntelligence;
		}

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/supersearch-enrichment', body);
	}

	/**
	 * Get a SuperSearch enrichment by resource ID
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const resourceId = context.getNodeParameter('resourceId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'GET', `/api/v2/supersearch-enrichment/${resourceId}`);
	}

	/**
	 * Run a SuperSearch enrichment
	 */
	static async run(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const resourceId = context.getNodeParameter('resourceId', itemIndex) as string;
		const runSettings = context.getNodeParameter('runSettings', itemIndex, {}) as any;

		const body: any = {
			resource_id: resourceId,
		};

		// Add run settings
		if (runSettings.priority) {
			body.priority = runSettings.priority;
		}
		if (runSettings.webhookUrl) {
			body.webhook_url = runSettings.webhookUrl;
		}

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/supersearch-enrichment/run', body);
	}

	/**
	 * Add enrichment to a resource (campaign or lead list)
	 */
	static async addToResource(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const resourceId = context.getNodeParameter('resourceId', itemIndex) as string;
		const targetResourceId = context.getNodeParameter('targetResourceId', itemIndex) as string;
		const targetResourceType = context.getNodeParameter('targetResourceType', itemIndex) as string;

		const body: any = {
			target_resource_id: targetResourceId,
			target_resource_type: targetResourceType,
		};

		return await instantlyApiRequest.call(context, 'POST', `/api/v2/supersearch-enrichment/${resourceId}/add`, body);
	}

	/**
	 * Run AI enrichment on existing data
	 */
	static async runAiEnrichment(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const leadIds = context.getNodeParameter('leadIds', itemIndex) as string[];
		const aiModel = context.getNodeParameter('aiModel', itemIndex) as string;
		const aiPrompt = context.getNodeParameter('aiPrompt', itemIndex) as string;
		const additionalSettings = context.getNodeParameter('additionalSettings', itemIndex, {}) as any;

		const body: any = {
			lead_ids: leadIds,
			ai_model: aiModel,
			ai_prompt: aiPrompt,
		};

		// Add additional AI settings
		if (additionalSettings.temperature !== undefined) {
			body.temperature = additionalSettings.temperature;
		}
		if (additionalSettings.maxTokens) {
			body.max_tokens = additionalSettings.maxTokens;
		}
		if (additionalSettings.customInstructions) {
			body.custom_instructions = additionalSettings.customInstructions;
		}

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/supersearch-enrichment/ai', body);
	}

	/**
	 * Get enrichment job status
	 */
	static async getJobStatus(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const jobId = context.getNodeParameter('jobId', itemIndex) as string;
		return await instantlyApiRequest.call(context, 'GET', `/api/v2/supersearch-enrichment/job/${jobId}`);
	}

	/**
	 * Get enrichment history for a resource
	 */
	static async getHistory(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const resourceId = context.getNodeParameter('resourceId', itemIndex) as string;
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Validate limit doesn't exceed 100
		if (limit > 100) {
			throw new NodeOperationError(context.getNode(), 'Limit cannot exceed 100. Instantly API has a maximum limit of 100.', { itemIndex });
		}

		if (returnAll) {
			// Get all history with pagination
			const allHistory = await paginateInstantlyApi(context, `/api/v2/supersearch-enrichment/history/${resourceId}`, 'history');
			return { items: allHistory };
		} else {
			// Get single page with specified limit
			const queryParams = { limit };
			return await instantlyApiRequest.call(context, 'GET', `/api/v2/supersearch-enrichment/history/${resourceId}`, {}, queryParams);
		}
	}
}
