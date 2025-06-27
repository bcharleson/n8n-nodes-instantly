import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { paginateInstantlyApi } from '../functions/paginationHelpers';
import { getEmailAccount } from '../functions/resourceLocatorHelpers';
import { IInstantlyApiContext, IAccountUpdateFields, IPaginationOptions } from '../types/common';

/**
 * Account operations handler
 */
export class AccountOperations {
	/**
	 * Get many accounts with pagination support
	 */
	static async getMany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Validate limit doesn't exceed 100
		if (limit > 100) {
			throw new NodeOperationError(context.getNode(), 'Limit cannot exceed 100. Instantly API has a maximum limit of 100.', { itemIndex });
		}

		if (returnAll) {
			// Get all accounts with pagination
			const allAccounts = await paginateInstantlyApi(context, '/api/v2/accounts', 'accounts');
			return { items: allAccounts };
		} else {
			// Get single page with specified limit
			const queryParams = { limit };
			return await instantlyApiRequest.call(context, 'GET', '/api/v2/accounts', {}, queryParams);
		}
	}

	/**
	 * Get single account by email
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailAccount = getEmailAccount(context, itemIndex);
		return await instantlyApiRequest.call(context, 'GET', `/api/v2/accounts/${emailAccount}`);
	}

	/**
	 * Pause an account
	 */
	static async pause(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailAccount = getEmailAccount(context, itemIndex);
		const continueOnError = context.getNodeParameter('continueOnError', itemIndex, false) as boolean;

		try {
			// Pause endpoint requires a simple POST without JSON content-type
			const options = {
				method: 'POST' as const,
				url: `https://api.instantly.ai/api/v2/accounts/${emailAccount}/pause`,
				headers: {},
			};

			return await context.helpers.httpRequestWithAuthentication.call(context, 'instantlyApi', options);
		} catch (error: any) {
			// Handle specific error cases for pause operation
			if (error.response?.statusCode === 404) {
				throw new NodeOperationError(context.getNode(), `Email account '${emailAccount}' not found. Please verify the email address is correct and the account exists in your Instantly workspace.`, { itemIndex });
			} else if (error.response?.statusCode === 400 || error.response?.statusCode === 422) {
				// Account might already be paused or in an invalid state
				if (continueOnError) {
					// Return a success response with warning message
					return {
						success: true,
						message: `Account '${emailAccount}' is already paused or cannot be paused in its current state.`,
						warning: 'Operation skipped - account may already be in the target state',
						email: emailAccount,
						operation: 'pause',
						skipped: true
					};
				} else {
					throw new NodeOperationError(context.getNode(), `Cannot pause account '${emailAccount}'. The account may already be paused or in a state that doesn't allow pausing. Please check the account status in your Instantly dashboard, or enable 'Continue on Error' to skip this error.`, { itemIndex });
				}
			} else {
				// Re-throw other errors with more context
				throw new NodeOperationError(context.getNode(), `Failed to pause account '${emailAccount}': ${error.message}`, { itemIndex });
			}
		}
	}

	/**
	 * Resume an account
	 */
	static async resume(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailAccount = getEmailAccount(context, itemIndex);
		const continueOnError = context.getNodeParameter('continueOnError', itemIndex, false) as boolean;

		try {
			// Resume endpoint requires a simple POST without JSON content-type
			const options = {
				method: 'POST' as const,
				url: `https://api.instantly.ai/api/v2/accounts/${emailAccount}/resume`,
				headers: {},
			};

			return await context.helpers.httpRequestWithAuthentication.call(context, 'instantlyApi', options);
		} catch (error: any) {
			// Handle specific error cases for resume operation
			if (error.response?.statusCode === 404) {
				throw new NodeOperationError(context.getNode(), `Email account '${emailAccount}' not found. Please verify the email address is correct and the account exists in your Instantly workspace.`, { itemIndex });
			} else if (error.response?.statusCode === 400 || error.response?.statusCode === 422) {
				// Account might already be resumed/active or in an invalid state
				if (continueOnError) {
					// Return a success response with warning message
					return {
						success: true,
						message: `Account '${emailAccount}' is already active/resumed or cannot be resumed in its current state.`,
						warning: 'Operation skipped - account may already be in the target state',
						email: emailAccount,
						operation: 'resume',
						skipped: true
					};
				} else {
					throw new NodeOperationError(context.getNode(), `Cannot resume account '${emailAccount}'. The account may already be active/resumed or in a state that doesn't allow resuming. Please check the account status in your Instantly dashboard, or enable 'Continue on Error' to skip this error.`, { itemIndex });
				}
			} else {
				// Re-throw other errors with more context
				throw new NodeOperationError(context.getNode(), `Failed to resume account '${emailAccount}': ${error.message}`, { itemIndex });
			}
		}
	}

	/**
	 * Update an account
	 */
	static async update(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailAccount = getEmailAccount(context, itemIndex);
		const updateFields = context.getNodeParameter('updateFields', itemIndex) as IAccountUpdateFields;

		// Build the update body with only provided fields using correct API field names
		const updateBody: any = {};

		// Basic account fields
		if (updateFields.firstName !== undefined) updateBody.first_name = updateFields.firstName;
		if (updateFields.lastName !== undefined) updateBody.last_name = updateFields.lastName;
		if (updateFields.dailyLimit !== undefined) updateBody.daily_limit = updateFields.dailyLimit;
		if (updateFields.trackingDomainName !== undefined) updateBody.tracking_domain_name = updateFields.trackingDomainName;
		if (updateFields.trackingDomainStatus !== undefined) updateBody.tracking_domain_status = updateFields.trackingDomainStatus;
		if (updateFields.enableSlowRamp !== undefined) updateBody.enable_slow_ramp = updateFields.enableSlowRamp;
		if (updateFields.inboxPlacementTestLimit !== undefined) updateBody.inbox_placement_test_limit = updateFields.inboxPlacementTestLimit;
		if (updateFields.sendingGap !== undefined) updateBody.sending_gap = updateFields.sendingGap;
		if (updateFields.skipCnameCheck !== undefined) updateBody.skip_cname_check = updateFields.skipCnameCheck;
		if (updateFields.removeTrackingDomain !== undefined) updateBody.remove_tracking_domain = updateFields.removeTrackingDomain;

		// Warmup configuration
		if (updateFields.warmup && Object.keys(updateFields.warmup).length > 0) {
			const warmupConfig: any = {};
			if (updateFields.warmup.limit !== undefined) warmupConfig.limit = updateFields.warmup.limit;
			if (updateFields.warmup.replyRate !== undefined) warmupConfig.reply_rate = updateFields.warmup.replyRate;
			if (updateFields.warmup.warmupCustomFtag !== undefined) warmupConfig.warmup_custom_ftag = updateFields.warmup.warmupCustomFtag;
			if (updateFields.warmup.increment !== undefined) warmupConfig.increment = updateFields.warmup.increment;
			updateBody.warmup = warmupConfig;
		}

		return await instantlyApiRequest.call(context, 'PATCH', `/api/v2/accounts/${emailAccount}`, updateBody);
	}
}
