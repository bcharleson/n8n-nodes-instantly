import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * Common types and interfaces for Instantly API operations
 */

export interface IInstantlyApiContext {
	context: IExecuteFunctions;
	itemIndex: number;
}

export interface IResourceLocator {
	mode: 'list' | 'id' | 'email';
	value: string;
}

export interface IPaginationOptions {
	returnAll: boolean;
	limit: number;
}

export interface IDateRange {
	startDate?: string;
	endDate?: string;
}

export interface IOperationResult {
	success: boolean;
	data?: any;
	error?: string;
}

export interface IAccountUpdateFields {
	firstName?: string;
	lastName?: string;
	dailyLimit?: number;
	trackingDomainName?: string;
	trackingDomainStatus?: string;
	enableSlowRamp?: boolean;
	inboxPlacementTestLimit?: number;
	sendingGap?: number;
	skipCnameCheck?: boolean;
	removeTrackingDomain?: boolean;
	warmup?: IWarmupConfig;
	warmupDailyIncrease?: number;
}

export interface IWarmupConfig {
	limit?: number;
	replyRate?: number;
	warmupCustomFtag?: string;
	increment?: 'disabled' | 'enabled';
}

export interface ICampaignFields {
	name: string;
	// Add other campaign fields as needed
}

// Campaign Creation Interfaces
export interface ICampaignScheduleTiming {
	from: string; // HH:MM format
	to: string;   // HH:MM format
}

export interface ICampaignScheduleDays {
	0?: boolean; // Sunday
	1?: boolean; // Monday
	2?: boolean; // Tuesday
	3?: boolean; // Wednesday
	4?: boolean; // Thursday
	5?: boolean; // Friday
	6?: boolean; // Saturday
}

export interface ICampaignScheduleItem {
	name: string;
	timing: ICampaignScheduleTiming;
	days: ICampaignScheduleDays;
	timezone: string;
}

export interface ICampaignSchedule {
	schedules: ICampaignScheduleItem[];
	start_date?: string; // ISO date-time
	end_date?: string;   // ISO date-time
}

export interface ICampaignSequenceStep {
	subject: string;
	body: string;
	delay?: number; // Only required for steps after the first one
}

export interface ICampaignSequence {
	subject: string;
	body: string;
	delay?: number; // According to API spec, sequences is an array of objects with subject, body, and optional delay
}

export interface ICampaignAutoVariantSelect {
	trigger?: 'click_rate' | 'open_rate' | 'reply_rate';
	// Add more auto variant select properties as needed
}

export interface ICampaignCreateFields {
	// Required fields
	name: string;
	campaign_schedule: ICampaignSchedule;

	// Optional basic fields
	pl_value?: number;
	is_evergreen?: boolean;
	email_gap?: number;
	random_wait_max?: number;
	text_only?: boolean;
	daily_limit?: number;
	daily_max_leads?: number;

	// Optional tracking fields
	link_tracking?: boolean;
	open_tracking?: boolean;
	stop_on_reply?: boolean;
	stop_on_auto_reply?: boolean;
	prioritize_new_leads?: boolean;
	match_lead_esp?: boolean;
	stop_for_company?: boolean;
	insert_unsubscribe_header?: boolean;
	allow_risky_contacts?: boolean;
	disable_bounce_protect?: boolean;

	// Optional array fields
	email_list?: string[];
	email_tag_list?: string[];
	cc_list?: string[];
	bcc_list?: string[];
	sequences?: ICampaignSequence[];

	// Optional complex objects
	auto_variant_select?: ICampaignAutoVariantSelect;
}

export interface ILeadFields {
	email: string;
	// Add other lead fields as needed
}

export interface IAnalyticsParams {
	returnAll: boolean;
	startDate?: string;
	endDate?: string;
	campaignId?: string;
}

export type ResourceType = 'account' | 'campaign' | 'lead' | 'analytics';
export type OperationType = 'addToCampaign' | 'create' | 'get' | 'getMany' | 'update' | 'delete' | 'pause' | 'resume' | 'getCampaignAnalytics' | 'updateInterestStatus';
