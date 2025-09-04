import { IExecuteFunctions } from 'n8n-workflow';

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
}

export interface ICampaignScheduleTiming {
	from: string;
	to: string;
}

export interface ICampaignScheduleDays {
	0?: boolean;
	1?: boolean;
	2?: boolean;
	3?: boolean;
	4?: boolean;
	5?: boolean;
	6?: boolean;
}

export interface ICampaignScheduleItem {
	name: string;
	timing: ICampaignScheduleTiming;
	days: ICampaignScheduleDays;
	timezone: string;
}

export interface ICampaignSchedule {
	schedules: ICampaignScheduleItem[];
	start_date?: string;
	end_date?: string;
}

export interface ICampaignSequenceStepVariant {
	subject: string;
	body: string;
}

export interface ICampaignSequenceStep {
	type: string;
	delay: number;
	variants: ICampaignSequenceStepVariant[];
}

export interface ICampaignSequence {
	steps: ICampaignSequenceStep[];
}

export interface ICampaignAutoVariantSelect {
	trigger?: 'click_rate' | 'open_rate' | 'reply_rate';
}

export interface ICampaignCreateFields {
	name: string;
	campaign_schedule: ICampaignSchedule;
	pl_value?: number;
	is_evergreen?: boolean;
	email_gap?: number;
	random_wait_max?: number;
	text_only?: boolean;
	daily_limit?: number;
	daily_max_leads?: number;
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
	email_list?: string[];
	email_tag_list?: string[];
	cc_list?: string[];
	bcc_list?: string[];
	sequences?: ICampaignSequence[];
	auto_variant_select?: ICampaignAutoVariantSelect;
}

export interface ILeadFields {
	email: string;
}

export interface IAnalyticsParams {
	returnAll: boolean;
	startDate?: string;
	endDate?: string;
	campaignId?: string;
}

export type ResourceType = 'account' | 'campaign' | 'lead' | 'analytics';
export type OperationType = 'addToCampaign' | 'create' | 'get' | 'getMany' | 'update' | 'delete' | 'pause' | 'resume' | 'getCampaignAnalytics' | 'updateInterestStatus' | 'launch' | 'deleteAccount' | 'enableWarmup' | 'disableWarmup';
