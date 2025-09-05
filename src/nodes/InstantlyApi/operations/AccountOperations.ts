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

	/**
	 * Enable warmup for an account or all accounts
	 * Phase 1A: Critical Account Control - Enhanced with bulk operations
	 *
	 * IMPORTANT: Uses undocumented API v2 endpoints discovered through testing:
	 * - Endpoint: POST /api/v2/accounts/warmup/enable
	 * - Request format: {"emails": ["email@example.com"]} (NOT {"accounts": [...]})
	 * - Response: Returns async job tracking object with warmup_status: 1
	 */
	static async enableWarmup(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const allEmails = context.getNodeParameter('allEmails', itemIndex, false) as boolean;

		try {
			if (allEmails) {
				// Bulk operation for all accounts with exclusions
				const excludedEmails = context.getNodeParameter('excludedEmails', itemIndex, []) as string[];

				// Get all accounts first
				const allAccountsResponse = await instantlyApiRequest.call(context, 'GET', '/api/v2/accounts');
				const allAccounts = allAccountsResponse.items || [];

				// Filter out excluded emails
				const targetEmails = allAccounts
					.map((account: any) => account.email)
					.filter((email: string) => !excludedEmails.includes(email));

				if (targetEmails.length === 0) {
					return {
						success: true,
						message: 'No accounts to enable warmup for (all accounts excluded)',
						processed: 0,
						excluded: excludedEmails.length
					};
				}

				// Enable warmup for all target accounts
				const results = [];
				let successCount = 0;
				let errorCount = 0;

				for (const email of targetEmails) {
					try {
						// Use API v2 endpoint with CORRECT format: "emails" not "accounts"
						const body = { emails: [email] };
						const result = await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/enable', body);

						results.push({ email, success: true, result });
						successCount++;
					} catch (error: any) {
						// Parse the actual error message from the API response
						let errorMessage = error.message;
						if (error.response?.body) {
							if (typeof error.response.body === 'string') {
								errorMessage = error.response.body;
							} else if (error.response.body.message) {
								errorMessage = error.response.body.message;
							} else if (error.response.body.error) {
								errorMessage = error.response.body.error;
							}
						}

						// Handle specific error cases with more detailed messages
						if (error.response?.statusCode === 400) {
							if (errorMessage.toLowerCase().includes('already enabled') ||
								errorMessage.toLowerCase().includes('warmup is already active') ||
								errorMessage.toLowerCase().includes('warmup already enabled')) {
								errorMessage = `Warmup is already enabled for account ${email}`;
							} else if (errorMessage.toLowerCase().includes('invalid') ||
									   errorMessage.toLowerCase().includes('bad request')) {
								errorMessage = `Invalid account or warmup configuration for ${email}. Please verify the account exists and is properly configured.`;
							} else {
								errorMessage = `Cannot enable warmup for ${email}: ${errorMessage}`;
							}
						} else if (error.response?.statusCode === 404) {
							errorMessage = `Account ${email} not found. Please verify the email address is correct.`;
						} else if (error.response?.statusCode === 422) {
							errorMessage = `Account ${email} cannot have warmup enabled. The account may not be properly configured or may be in an invalid state.`;
						} else {
							// Generic error handling for other status codes
							errorMessage = `Failed to enable warmup for ${email}: ${errorMessage}`;
						}

						results.push({
							email,
							success: false,
							error: errorMessage
						});
						errorCount++;
					}
				}

				return {
					success: true,
					message: `Warmup enable operation completed for ${targetEmails.length} accounts`,
					processed: targetEmails.length,
					successful: successCount,
					failed: errorCount,
					excluded: excludedEmails.length,
					results
				};
			} else {
				// Single account operation - use API v2 endpoint with CORRECT format
				const emailAccount = getEmailAccount(context, itemIndex);

				// Use CORRECT format: "emails" not "accounts" (discovered via CURL testing)
				const body = { emails: [emailAccount] };
				return await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/enable', body);
			}
		} catch (error: any) {
			// Enhanced error handling with specific messages
			const emailAccount = allEmails ? 'accounts' : getEmailAccount(context, itemIndex);

			// Parse the actual error message from the API response
			let errorMessage = error.message;
			if (error.response?.body) {
				if (typeof error.response.body === 'string') {
					errorMessage = error.response.body;
				} else if (error.response.body.message) {
					errorMessage = error.response.body.message;
				} else if (error.response.body.error) {
					errorMessage = error.response.body.error;
				}
			}

			// Handle specific error cases for warmup enable operation
			if (error.response?.statusCode === 404) {
				throw new NodeOperationError(context.getNode(), `Email account '${emailAccount}' not found. Please verify the email address is correct and the account exists in your Instantly workspace.`, { itemIndex });
			} else if (error.response?.statusCode === 400 || error.response?.statusCode === 422) {
				// Check for specific warmup status errors
				if (errorMessage.toLowerCase().includes('already enabled') || errorMessage.toLowerCase().includes('warmup is already active')) {
					throw new NodeOperationError(context.getNode(), `Warmup is already enabled for account '${emailAccount}'. No action needed.`, { itemIndex });
				} else {
					throw new NodeOperationError(context.getNode(), `Cannot enable warmup for account '${emailAccount}': ${errorMessage}`, { itemIndex });
				}
			} else {
				// Re-throw other errors with the actual API error message
				throw new NodeOperationError(context.getNode(), `Failed to enable warmup for ${emailAccount}: ${errorMessage}`, { itemIndex });
			}
		}
	}

	/**
	 * Disable warmup for an account or all accounts
	 * Phase 1A: Critical Account Control - Enhanced with bulk operations
	 *
	 * IMPORTANT: Uses undocumented API v2 endpoints discovered through testing:
	 * - Endpoint: POST /api/v2/accounts/warmup/disable
	 * - Request format: {"emails": ["email@example.com"]} (NOT {"accounts": [...]})
	 * - Response: Returns async job tracking object with warmup_status: 0
	 */
	static async disableWarmup(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const allEmails = context.getNodeParameter('allEmails', itemIndex, false) as boolean;

		try {
			if (allEmails) {
				// Bulk operation for all accounts with exclusions
				const excludedEmails = context.getNodeParameter('excludedEmails', itemIndex, []) as string[];

				// Get all accounts first
				const allAccountsResponse = await instantlyApiRequest.call(context, 'GET', '/api/v2/accounts');
				const allAccounts = allAccountsResponse.items || [];

				// Filter out excluded emails
				const targetEmails = allAccounts
					.map((account: any) => account.email)
					.filter((email: string) => !excludedEmails.includes(email));

				if (targetEmails.length === 0) {
					return {
						success: true,
						message: 'No accounts to disable warmup for (all accounts excluded)',
						processed: 0,
						excluded: excludedEmails.length
					};
				}

				// Disable warmup for all target accounts
				const results = [];
				let successCount = 0;
				let errorCount = 0;

				for (const email of targetEmails) {
					try {
						// Use API v2 endpoint with CORRECT format: "emails" not "accounts"
						const body = { emails: [email] };
						const result = await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/disable', body);

						results.push({ email, success: true, result });
						successCount++;
					} catch (error: any) {
						// Parse the actual error message from the API response
						let errorMessage = error.message;
						if (error.response?.body) {
							if (typeof error.response.body === 'string') {
								errorMessage = error.response.body;
							} else if (error.response.body.message) {
								errorMessage = error.response.body.message;
							} else if (error.response.body.error) {
								errorMessage = error.response.body.error;
							}
						}

						// Handle specific error cases with more detailed messages
						if (error.response?.statusCode === 400) {
							if (errorMessage.toLowerCase().includes('already disabled') ||
								errorMessage.toLowerCase().includes('warmup is already paused') ||
								errorMessage.toLowerCase().includes('warmup already disabled')) {
								errorMessage = `Warmup is already disabled for account ${email}`;
							} else if (errorMessage.toLowerCase().includes('invalid') ||
									   errorMessage.toLowerCase().includes('bad request')) {
								errorMessage = `Invalid account or warmup configuration for ${email}. Please verify the account exists and is properly configured.`;
							} else {
								errorMessage = `Cannot disable warmup for ${email}: ${errorMessage}`;
							}
						} else if (error.response?.statusCode === 404) {
							errorMessage = `Account ${email} not found. Please verify the email address is correct.`;
						} else if (error.response?.statusCode === 422) {
							errorMessage = `Account ${email} cannot have warmup disabled. The account may not be properly configured or may be in an invalid state.`;
						} else {
							// Generic error handling for other status codes
							errorMessage = `Failed to disable warmup for ${email}: ${errorMessage}`;
						}

						results.push({
							email,
							success: false,
							error: errorMessage
						});
						errorCount++;
					}
				}

				return {
					success: true,
					message: `Warmup disable operation completed for ${targetEmails.length} accounts`,
					processed: targetEmails.length,
					successful: successCount,
					failed: errorCount,
					excluded: excludedEmails.length,
					results
				};
			} else {
				// Single account operation - use API v2 endpoint with CORRECT format
				const emailAccount = getEmailAccount(context, itemIndex);

				// Use CORRECT format: "emails" not "accounts" (discovered via CURL testing)
				const body = { emails: [emailAccount] };
				return await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/disable', body);
			}
		} catch (error: any) {
			// Enhanced error handling with specific messages
			const emailAccount = allEmails ? 'accounts' : getEmailAccount(context, itemIndex);

			// Parse the actual error message from the API response
			let errorMessage = error.message;
			if (error.response?.body) {
				if (typeof error.response.body === 'string') {
					errorMessage = error.response.body;
				} else if (error.response.body.message) {
					errorMessage = error.response.body.message;
				} else if (error.response.body.error) {
					errorMessage = error.response.body.error;
				}
			}

			// Handle specific error cases for warmup disable operation
			if (error.response?.statusCode === 404) {
				throw new NodeOperationError(context.getNode(), `Email account '${emailAccount}' not found. Please verify the email address is correct and the account exists in your Instantly workspace.`, { itemIndex });
			} else if (error.response?.statusCode === 400 || error.response?.statusCode === 422) {
				// Check for specific warmup status errors
				if (errorMessage.toLowerCase().includes('already disabled') || errorMessage.toLowerCase().includes('warmup is already paused')) {
					throw new NodeOperationError(context.getNode(), `Warmup is already disabled for account '${emailAccount}'. No action needed.`, { itemIndex });
				} else {
					throw new NodeOperationError(context.getNode(), `Cannot disable warmup for account '${emailAccount}': ${errorMessage}`, { itemIndex });
				}
			} else {
				// Re-throw other errors with the actual API error message
				throw new NodeOperationError(context.getNode(), `Failed to disable warmup for ${emailAccount}: ${errorMessage}`, { itemIndex });
			}
		}
	}

	/**
	 * Create a new account
	 * Phase 1A: Critical Account Management
	 */
	static async create(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		// Required fields
		const email = context.getNodeParameter('email', itemIndex) as string;
		const password = context.getNodeParameter('password', itemIndex) as string;
		const smtpHost = context.getNodeParameter('smtpHost', itemIndex) as string;
		const smtpPort = context.getNodeParameter('smtpPort', itemIndex) as number;

		// Additional fields
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		const body: any = {
			email,
			password,
			smtp_host: smtpHost,
			smtp_port: smtpPort,
		};

		// Add optional fields if provided
		if (additionalFields.firstName) body.first_name = additionalFields.firstName;
		if (additionalFields.lastName) body.last_name = additionalFields.lastName;
		if (additionalFields.signature) body.signature = additionalFields.signature;
		if (additionalFields.warmupEnabled !== undefined) body.warmup_enabled = additionalFields.warmupEnabled;

		try {
			return await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts', body);
		} catch (error: any) {
			// Handle specific error cases for account creation
			if (error.response?.statusCode === 400 || error.response?.statusCode === 422) {
				const errorMessage = error.response?.body?.message || error.message;
				throw new NodeOperationError(context.getNode(), `Cannot create account '${email}'. ${errorMessage}. Please verify all account details are correct and the email is not already in use.`, { itemIndex });
			} else {
				// Re-throw other errors with more context
				throw new NodeOperationError(context.getNode(), `Failed to create account '${email}': ${error.message}`, { itemIndex });
			}
		}
	}

	/**
	 * Delete an account
	 * Phase 1A: Critical Account Management
	 */
	static async deleteAccount(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const emailAccount = getEmailAccount(context, itemIndex);

		try {
			return await instantlyApiRequest.call(context, 'DELETE', `/api/v2/accounts/${emailAccount}`);
		} catch (error: any) {
			// Handle specific error cases for account deletion
			if (error.response?.statusCode === 404) {
				throw new NodeOperationError(context.getNode(), `Email account '${emailAccount}' not found. Please verify the email address is correct and the account exists in your Instantly workspace.`, { itemIndex });
			} else if (error.response?.statusCode === 400 || error.response?.statusCode === 422) {
				// Account might be in use by active campaigns
				const errorMessage = error.response?.body?.message || error.message;
				throw new NodeOperationError(context.getNode(), `Cannot delete account '${emailAccount}'. ${errorMessage}. The account may be assigned to active campaigns. Please pause or remove the account from campaigns first.`, { itemIndex });
			} else {
				// Re-throw other errors with more context
				throw new NodeOperationError(context.getNode(), `Failed to delete account '${emailAccount}': ${error.message}`, { itemIndex });
			}
		}
	}
}
