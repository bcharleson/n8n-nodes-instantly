/**
 * Utility functions for Instantly API v2 integration
 */

/**
 * Handle pagination for Instantly API responses
 */
export function handlePagination(response: any, limit?: number): any {
  if (!response || !Array.isArray(response.data)) {
    return response;
  }

  const data = response.data;
  const hasMore = response.has_more || false;
  const nextCursor = response.next_starting_after || null;

  return {
    data,
    hasMore,
    nextCursor,
    totalCount: data.length,
  };
}

/**
 * Transform Instantly API error responses into user-friendly messages
 */
export function transformErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return `Instantly API Error: ${error.response.data.message}`;
  }

  if (error.response?.data?.error) {
    return `Instantly API Error: ${error.response.data.error}`;
  }

  if (error.message) {
    return `Request Error: ${error.message}`;
  }

  return 'An unknown error occurred while communicating with Instantly API';
}

/**
 * Clean up request body by removing empty or undefined values
 */
export function cleanRequestBody(body: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

/**
 * Format campaign data for consistent output
 */
export function formatCampaignData(campaign: any): any {
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    emailAccountId: campaign.email_account_id,
    createdAt: campaign.created_at,
    updatedAt: campaign.updated_at,
    ...campaign,
  };
}

/**
 * Format lead data for consistent output
 */
export function formatLeadData(lead: any): any {
  return {
    id: lead.id,
    email: lead.email,
    firstName: lead.first_name,
    lastName: lead.last_name,
    company: lead.company,
    linkedinUrl: lead.linkedin_url,
    status: lead.status,
    createdAt: lead.created_at,
    updatedAt: lead.updated_at,
    ...lead,
  };
}
