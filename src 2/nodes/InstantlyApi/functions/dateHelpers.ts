/**
 * Date formatting utilities for Instantly API
 */

/**
 * Helper function to format dates for Instantly API (YYYY-MM-DD format)
 */
export function formatDateForApi(dateInput: any): string {
	if (!dateInput || dateInput === '') {
		return '';
	}

	let dateString = String(dateInput);

	// Handle n8n DateTime objects that come as "[DateTime: 2025-06-26T13:52:08.271Z]"
	if (dateString.startsWith('[DateTime: ') && dateString.endsWith(']')) {
		dateString = dateString.slice(11, -1); // Remove "[DateTime: " and "]"
	}

	// Handle ISO datetime strings (e.g., "2025-06-19T13:52:45.316Z")
	if (dateString.includes('T')) {
		dateString = dateString.split('T')[0];
	}

	// Handle date strings that might have time components separated by space
	if (dateString.includes(' ')) {
		dateString = dateString.split(' ')[0];
	}

	// Validate the resulting date format (should be YYYY-MM-DD)
	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateString)) {
		// Try to parse as Date and format
		try {
			const parsedDate = new Date(dateInput);
			if (!isNaN(parsedDate.getTime())) {
				// Format as YYYY-MM-DD
				const year = parsedDate.getFullYear();
				const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
				const day = String(parsedDate.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			}
		} catch (error) {
			// If parsing fails, return empty string
			return '';
		}
		// If all parsing attempts fail, return empty string
		return '';
	}

	return dateString;
}
