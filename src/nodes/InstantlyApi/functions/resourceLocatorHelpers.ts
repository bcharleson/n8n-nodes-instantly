import { IExecuteFunctions } from 'n8n-workflow';
import { IResourceLocator } from '../types/common';

/**
 * Resource locator utilities for extracting IDs and values
 */

/**
 * Helper function to extract campaign ID from resourceLocator
 */
export function getCampaignId(context: IExecuteFunctions, itemIndex: number): string {
	const campaignLocator = context.getNodeParameter('campaignId', itemIndex) as any;
	if (typeof campaignLocator === 'string') {
		// Backward compatibility - if it's still a string
		return campaignLocator;
	}
	// Extract value from resourceLocator
	return campaignLocator.value || campaignLocator;
}

/**
 * Helper function to extract email from resourceLocator
 */
export function getEmailAccount(context: IExecuteFunctions, itemIndex: number): string {
	const emailLocator = context.getNodeParameter('emailAccount', itemIndex) as any;
	if (typeof emailLocator === 'string') {
		// Backward compatibility - if it's still a string
		return emailLocator;
	}
	// Extract value from resourceLocator
	return emailLocator.value || emailLocator;
}

/**
 * Generic helper to extract value from any resource locator
 */
export function getResourceLocatorValue(locator: any): string {
	if (typeof locator === 'string') {
		return locator;
	}
	return locator.value || locator;
}
