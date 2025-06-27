import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { instantlyApiRequest } from '../../generic.functions';
import { paginateInstantlyApi } from '../functions/paginationHelpers';
import { getCampaignId } from '../functions/resourceLocatorHelpers';
import { ICampaignFields, IPaginationOptions, ICampaignCreateFields, ICampaignSchedule, ICampaignScheduleItem, ICampaignScheduleDays, ICampaignAutoVariantSelect } from '../types/common';

/**
 * Campaign operations handler
 */
export class CampaignOperations {
	/**
	 * Create a new campaign
	 */
	static async create(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		// Required fields
		const name = context.getNodeParameter('name', itemIndex) as string;
		const scheduleName = context.getNodeParameter('scheduleName', itemIndex) as string;
		const scheduleStartTime = context.getNodeParameter('scheduleStartTime', itemIndex) as string;
		const scheduleEndTime = context.getNodeParameter('scheduleEndTime', itemIndex) as string;
		const scheduleDays = context.getNodeParameter('scheduleDays', itemIndex) as string[];
		const scheduleTimezone = context.getNodeParameter('scheduleTimezone', itemIndex) as string;

		// Additional fields
		const additionalFields = context.getNodeParameter('additionalFields', itemIndex, {}) as any;

		// Build the days object from the selected days array
		const days: ICampaignScheduleDays = {};
		scheduleDays.forEach(day => {
			const dayKey = day as '0' | '1' | '2' | '3' | '4' | '5' | '6';
			days[dayKey] = true;
		});

		// Build the schedule object
		const scheduleItem: ICampaignScheduleItem = {
			name: scheduleName,
			timing: {
				from: scheduleStartTime,
				to: scheduleEndTime,
			},
			days,
			timezone: scheduleTimezone,
		};

		const campaignSchedule: ICampaignSchedule = {
			schedules: [scheduleItem],
		};

		// Add optional start/end dates if provided
		if (additionalFields.startDate) {
			campaignSchedule.start_date = additionalFields.startDate;
		}
		if (additionalFields.endDate) {
			campaignSchedule.end_date = additionalFields.endDate;
		}

		// Build the campaign creation payload
		const campaignData: ICampaignCreateFields = {
			name,
			campaign_schedule: campaignSchedule,
		};

		// Add optional fields if provided
		if (additionalFields.plValue !== undefined) {
			campaignData.pl_value = additionalFields.plValue;
		}
		if (additionalFields.isEvergreen !== undefined) {
			campaignData.is_evergreen = additionalFields.isEvergreen;
		}
		if (additionalFields.emailGap !== undefined) {
			campaignData.email_gap = additionalFields.emailGap;
		}
		if (additionalFields.randomWaitMax !== undefined) {
			campaignData.random_wait_max = additionalFields.randomWaitMax;
		}
		if (additionalFields.textOnly !== undefined) {
			campaignData.text_only = additionalFields.textOnly;
		}
		if (additionalFields.dailyLimit !== undefined) {
			campaignData.daily_limit = additionalFields.dailyLimit;
		}
		if (additionalFields.dailyMaxLeads !== undefined) {
			campaignData.daily_max_leads = additionalFields.dailyMaxLeads;
		}
		if (additionalFields.linkTracking !== undefined) {
			campaignData.link_tracking = additionalFields.linkTracking;
		}
		if (additionalFields.openTracking !== undefined) {
			campaignData.open_tracking = additionalFields.openTracking;
		}
		if (additionalFields.stopOnReply !== undefined) {
			campaignData.stop_on_reply = additionalFields.stopOnReply;
		}
		if (additionalFields.stopOnAutoReply !== undefined) {
			campaignData.stop_on_auto_reply = additionalFields.stopOnAutoReply;
		}
		if (additionalFields.stopForCompany !== undefined) {
			campaignData.stop_for_company = additionalFields.stopForCompany;
		}
		if (additionalFields.prioritizeNewLeads !== undefined) {
			campaignData.prioritize_new_leads = additionalFields.prioritizeNewLeads;
		}
		if (additionalFields.matchLeadEsp !== undefined) {
			campaignData.match_lead_esp = additionalFields.matchLeadEsp;
		}
		if (additionalFields.insertUnsubscribeHeader !== undefined) {
			campaignData.insert_unsubscribe_header = additionalFields.insertUnsubscribeHeader;
		}
		if (additionalFields.allowRiskyContacts !== undefined) {
			campaignData.allow_risky_contacts = additionalFields.allowRiskyContacts;
		}
		if (additionalFields.disableBounceProtect !== undefined) {
			campaignData.disable_bounce_protect = additionalFields.disableBounceProtect;
		}

		// Handle array fields
		if (additionalFields.emailList && additionalFields.emailList.length > 0) {
			campaignData.email_list = additionalFields.emailList;
		}
		if (additionalFields.emailTagList && additionalFields.emailTagList.length > 0) {
			campaignData.email_tag_list = additionalFields.emailTagList;
		}
		if (additionalFields.ccList && additionalFields.ccList.length > 0) {
			campaignData.cc_list = additionalFields.ccList;
		}
		if (additionalFields.bccList && additionalFields.bccList.length > 0) {
			campaignData.bcc_list = additionalFields.bccList;
		}

		// Handle auto variant select
		if (additionalFields.autoVariantSelectTrigger) {
			campaignData.auto_variant_select = {
				trigger: additionalFields.autoVariantSelectTrigger,
			};
		}

		// Handle email sequence steps
		if (additionalFields.sequenceSteps && additionalFields.sequenceSteps.steps && additionalFields.sequenceSteps.steps.step) {
			const sequenceSteps = Array.isArray(additionalFields.sequenceSteps.steps.step)
				? additionalFields.sequenceSteps.steps.step
				: [additionalFields.sequenceSteps.steps.step];

			// Validate and build sequences array
			const sequences: any[] = [];

			sequenceSteps.forEach((step: any, index: number) => {
				const stepNumber = index + 1;

				// Validate required fields
				if (!step.subject || !step.body) {
					throw new NodeOperationError(
						context.getNode(),
						`Email step ${stepNumber} is missing required subject or body`,
						{ itemIndex }
					);
				}

				// Build sequence step object
				const sequenceStep: any = {
					subject: step.subject,
					body: step.body,
				};

				// Add delay for steps after the first one
				if (stepNumber > 1) {
					if (!step.delay || step.delay < 1) {
						throw new NodeOperationError(
							context.getNode(),
							`Email step ${stepNumber} requires a delay of at least 1 day`,
							{ itemIndex }
						);
					}
					sequenceStep.delay = step.delay;
				}

				sequences.push(sequenceStep);
			});

			// Add sequences to campaign data if any were provided
			if (sequences.length > 0) {
				campaignData.sequences = sequences;
			}
		}

		return await instantlyApiRequest.call(context, 'POST', '/api/v2/campaigns', campaignData);
	}

	/**
	 * Get a single campaign by ID
	 */
	static async get(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const campaignId = getCampaignId(context, itemIndex);
		return await instantlyApiRequest.call(context, 'GET', `/api/v2/campaigns/${campaignId}`);
	}

	/**
	 * Get many campaigns with pagination support
	 */
	static async getMany(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const returnAll = context.getNodeParameter('returnAll', itemIndex, false) as boolean;
		const limit = context.getNodeParameter('limit', itemIndex, 50) as number;

		// Validate limit doesn't exceed 100
		if (limit > 100) {
			throw new NodeOperationError(context.getNode(), 'Limit cannot exceed 100. Instantly API has a maximum limit of 100.', { itemIndex });
		}

		if (returnAll) {
			// Get all campaigns with pagination
			const allCampaigns = await paginateInstantlyApi(context, '/api/v2/campaigns', 'campaigns');
			return { items: allCampaigns };
		} else {
			// Get single page with specified limit
			const queryParams = { limit };
			return await instantlyApiRequest.call(context, 'GET', '/api/v2/campaigns', {}, queryParams);
		}
	}

	/**
	 * Update a campaign
	 */
	static async update(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const campaignId = getCampaignId(context, itemIndex);
		const name = context.getNodeParameter('name', itemIndex, '') as string;
		const updateAdditionalFields = context.getNodeParameter('updateAdditionalFields', itemIndex, {}) as any;
		const campaignSchedule = context.getNodeParameter('campaignSchedule', itemIndex, {}) as any;

		// Build the request body
		const body: any = {};

		// Only add name if it's provided
		if (name && name.trim() !== '') {
			body.name = name.trim();
		}

		// Add additional fields if provided
		if (updateAdditionalFields.plValue !== undefined) {
			body.pl_value = updateAdditionalFields.plValue;
		}
		if (updateAdditionalFields.isEvergreen !== undefined) {
			body.is_evergreen = updateAdditionalFields.isEvergreen;
		}
		if (updateAdditionalFields.emailGap !== undefined) {
			body.email_gap = updateAdditionalFields.emailGap;
		}
		if (updateAdditionalFields.randomWaitMax !== undefined) {
			body.random_wait_max = updateAdditionalFields.randomWaitMax;
		}
		if (updateAdditionalFields.textOnly !== undefined) {
			body.text_only = updateAdditionalFields.textOnly;
		}
		if (updateAdditionalFields.dailyLimit !== undefined) {
			body.daily_limit = updateAdditionalFields.dailyLimit;
		}
		if (updateAdditionalFields.dailyMaxLeads !== undefined) {
			body.daily_max_leads = updateAdditionalFields.dailyMaxLeads;
		}
		if (updateAdditionalFields.emailList !== undefined && updateAdditionalFields.emailList.length > 0) {
			body.email_list = updateAdditionalFields.emailList;
		}
		if (updateAdditionalFields.emailTagList !== undefined && updateAdditionalFields.emailTagList.trim() !== '') {
			body.email_tag_list = updateAdditionalFields.emailTagList.split(',').map((tag: string) => tag.trim());
		}
		if (updateAdditionalFields.ccList !== undefined && updateAdditionalFields.ccList.trim() !== '') {
			body.cc_list = updateAdditionalFields.ccList.split(',').map((email: string) => email.trim());
		}
		if (updateAdditionalFields.bccList !== undefined && updateAdditionalFields.bccList.trim() !== '') {
			body.bcc_list = updateAdditionalFields.bccList.split(',').map((email: string) => email.trim());
		}
		if (updateAdditionalFields.linkTracking !== undefined) {
			body.link_tracking = updateAdditionalFields.linkTracking;
		}
		if (updateAdditionalFields.openTracking !== undefined) {
			body.open_tracking = updateAdditionalFields.openTracking;
		}
		if (updateAdditionalFields.stopOnReply !== undefined) {
			body.stop_on_reply = updateAdditionalFields.stopOnReply;
		}
		if (updateAdditionalFields.stopOnAutoReply !== undefined) {
			body.stop_on_auto_reply = updateAdditionalFields.stopOnAutoReply;
		}
		if (updateAdditionalFields.stopForCompany !== undefined) {
			body.stop_for_company = updateAdditionalFields.stopForCompany;
		}
		if (updateAdditionalFields.prioritizeNewLeads !== undefined) {
			body.prioritize_new_leads = updateAdditionalFields.prioritizeNewLeads;
		}
		if (updateAdditionalFields.matchLeadEsp !== undefined) {
			body.match_lead_esp = updateAdditionalFields.matchLeadEsp;
		}
		if (updateAdditionalFields.insertUnsubscribeHeader !== undefined) {
			body.insert_unsubscribe_header = updateAdditionalFields.insertUnsubscribeHeader;
		}
		if (updateAdditionalFields.allowRiskyContacts !== undefined) {
			body.allow_risky_contacts = updateAdditionalFields.allowRiskyContacts;
		}
		if (updateAdditionalFields.disableBounceProtect !== undefined) {
			body.disable_bounce_protect = updateAdditionalFields.disableBounceProtect;
		}
		if (updateAdditionalFields.autoVariantSelectTrigger !== undefined && updateAdditionalFields.autoVariantSelectTrigger !== '') {
			body.auto_variant_select = {
				trigger: updateAdditionalFields.autoVariantSelectTrigger,
			};
		}
		if (updateAdditionalFields.sequences !== undefined && updateAdditionalFields.sequences.trim() !== '') {
			try {
				body.sequences = JSON.parse(updateAdditionalFields.sequences);
			} catch (error) {
				throw new Error('Invalid JSON format for sequences field');
			}
		}

		// Handle campaign schedule
		if (campaignSchedule && Object.keys(campaignSchedule).length > 0) {
			const schedule: any = {};

			if (campaignSchedule.startDate) {
				schedule.start_date = campaignSchedule.startDate;
			}
			if (campaignSchedule.endDate) {
				schedule.end_date = campaignSchedule.endDate;
			}

			if (campaignSchedule.schedules && campaignSchedule.schedules.schedule && campaignSchedule.schedules.schedule.length > 0) {
				schedule.schedules = campaignSchedule.schedules.schedule.map((sched: any) => {
					const scheduleItem: any = {
						name: sched.name || 'Default Schedule',
						timing: {
							from: sched.from || '09:00',
							to: sched.to || '17:00',
						},
						timezone: sched.timezone || 'America/New_York',
					};

					// Convert days array to object format expected by API
					if (sched.days && Array.isArray(sched.days)) {
						const daysObj: any = {};
						for (let i = 0; i <= 6; i++) {
							daysObj[i.toString()] = sched.days.includes(i.toString());
						}
						scheduleItem.days = daysObj;
					} else {
						// Default to weekdays
						scheduleItem.days = {
							'0': false, // Sunday
							'1': true,  // Monday
							'2': true,  // Tuesday
							'3': true,  // Wednesday
							'4': true,  // Thursday
							'5': true,  // Friday
							'6': false, // Saturday
						};
					}

					return scheduleItem;
				});
			}

			if (Object.keys(schedule).length > 0) {
				body.campaign_schedule = schedule;
			}
		}

		return await instantlyApiRequest.call(context, 'PATCH', `/api/v2/campaigns/${campaignId}`, body);
	}

	/**
	 * Delete a campaign
	 */
	static async delete(context: IExecuteFunctions, itemIndex: number): Promise<any> {
		const campaignId = getCampaignId(context, itemIndex);
		return await instantlyApiRequest.call(context, 'DELETE', `/api/v2/campaigns/${campaignId}`);
	}
}
