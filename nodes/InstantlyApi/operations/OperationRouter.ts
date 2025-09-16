import { IExecuteFunctions } from 'n8n-workflow';
import { AccountOperations } from './AccountOperations';
import { CampaignOperations } from './CampaignOperations';
import { LeadOperations } from './LeadOperations';
import { AnalyticsOperations } from './AnalyticsOperations';
import { ResourceType, OperationType } from '../types/common';

/**
 * Main operation router that delegates to specific resource handlers
 */
export class OperationRouter {
	/**
	 * Route operation to appropriate handler based on resource and operation type
	 */
	static async execute(
		context: IExecuteFunctions,
		itemIndex: number,
		resource: ResourceType,
		operation: OperationType
	): Promise<any> {
		switch (resource) {
			case 'account':
				return await this.handleAccountOperation(context, itemIndex, operation);
			case 'campaign':
				return await this.handleCampaignOperation(context, itemIndex, operation);
			case 'lead':
				return await this.handleLeadOperation(context, itemIndex, operation);
			case 'analytics':
				return await this.handleAnalyticsOperation(context, itemIndex, operation);
			default:
				throw new Error(`Unknown resource: ${resource}`);
		}
	}

	/**
	 * Handle account operations
	 */
	private static async handleAccountOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getMany':
				return await AccountOperations.getMany(context, itemIndex);
			case 'get':
				return await AccountOperations.get(context, itemIndex);
			case 'pause':
				return await AccountOperations.pause(context, itemIndex);
			case 'resume':
				return await AccountOperations.resume(context, itemIndex);
			case 'update':
				return await AccountOperations.update(context, itemIndex);
			case 'create':
				return await AccountOperations.create(context, itemIndex);
			case 'deleteAccount':
				return await AccountOperations.deleteAccount(context, itemIndex);
			case 'enableWarmup':
				return await AccountOperations.enableWarmup(context, itemIndex);
			case 'disableWarmup':
				return await AccountOperations.disableWarmup(context, itemIndex);
			default:
				throw new Error(`Unknown account operation: ${operation}`);
		}
	}

	/**
	 * Handle campaign operations
	 */
	private static async handleCampaignOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'create':
				return await CampaignOperations.create(context, itemIndex);
			case 'get':
				return await CampaignOperations.get(context, itemIndex);
			case 'getMany':
				return await CampaignOperations.getMany(context, itemIndex);
			case 'update':
				return await CampaignOperations.update(context, itemIndex);
			case 'delete':
				return await CampaignOperations.delete(context, itemIndex);
			case 'launch':
				return await CampaignOperations.launch(context, itemIndex);
			case 'pause':
				return await CampaignOperations.pause(context, itemIndex);
			default:
				throw new Error(`Unknown campaign operation: ${operation}`);
		}
	}

	/**
	 * Handle lead operations
	 */
	private static async handleLeadOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'addToCampaign':
				return await LeadOperations.addToCampaign(context, itemIndex);
			case 'create':
				return await LeadOperations.create(context, itemIndex);
			case 'get':
				return await LeadOperations.get(context, itemIndex);
			case 'getMany':
				return await LeadOperations.getMany(context, itemIndex);
			case 'update':
				return await LeadOperations.update(context, itemIndex);
			case 'delete':
				return await LeadOperations.delete(context, itemIndex);
			case 'updateInterestStatus':
				return await LeadOperations.updateInterestStatus(context, itemIndex);
			default:
				throw new Error(`Unknown lead operation: ${operation}`);
		}
	}

	/**
	 * Handle analytics operations
	 */
	private static async handleAnalyticsOperation(
		context: IExecuteFunctions,
		itemIndex: number,
		operation: OperationType
	): Promise<any> {
		switch (operation) {
			case 'getCampaignAnalytics':
				return await AnalyticsOperations.getCampaignAnalytics(context, itemIndex);
			default:
				throw new Error(`Unknown analytics operation: ${operation}`);
		}
	}
}
