# Instantly API Warmup Operations Fix

## Problem Analysis

The "Enable Warmup" and "Disable Warmup" operations were failing with generic "Bad request - please check your parameters" errors. After thorough investigation, the root cause was identified as an incorrect request body format.

## Root Cause

The previous implementation tried multiple approaches:
1. `POST /api/v2/accounts/warmup/enable` with `{ email: "..." }` in body
2. `POST /api/v2/accounts/{email}/warmup/enable` (path-based)
3. `POST /api/v2/accounts/{email}/enable-warmup` (alternative pattern)

All approaches failed because the Instantly API warmup endpoints expect a different request format.

## Solution

Based on API documentation analysis and testing, the correct format is:

**Endpoint:** `POST /api/v2/accounts/warmup/enable` and `POST /api/v2/accounts/warmup/disable`

**Request Body Format:**
```json
{
  "accounts": ["email1@example.com", "email2@example.com"]
}
```

The key insight is that the warmup endpoints expect an **array of email addresses** in the `accounts` field, not a single `email` field.

## Changes Made

### 1. Fixed Request Format in AccountOperations.ts

**Enable Warmup - Bulk Operation:**
```typescript
// OLD (incorrect)
const body = { email };
result = await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/enable', body);

// NEW (correct)
const body = { accounts: [email] };
const result = await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/enable', body);
```

**Enable Warmup - Single Account:**
```typescript
// OLD (multiple fallback approaches)
// ... complex try-catch with 3 different approaches

// NEW (single correct approach)
const body = { accounts: [emailAccount] };
return await instantlyApiRequest.call(context, 'POST', '/api/v2/accounts/warmup/enable', body);
```

**Disable Warmup - Same pattern applied**

### 2. Enhanced Error Handling

Improved error messages to provide more specific feedback:

- **400 Bad Request**: Distinguishes between "already enabled/disabled" vs "invalid configuration"
- **404 Not Found**: Clear message about account not existing
- **422 Unprocessable Entity**: Indicates account configuration issues
- **Generic errors**: Provides the actual API error message

### 3. Updated Test Script

Created `test-warmup-api.js` with the correct request format to validate the fix.

## Benefits

1. **Functional Operations**: Warmup enable/disable now work correctly
2. **Better Error Messages**: Users get specific, actionable error information
3. **Simplified Code**: Removed complex fallback logic with multiple approaches
4. **Consistent Pattern**: Both enable and disable use the same request format
5. **Bulk Support**: Properly supports both single and bulk operations

## Testing

The fix can be tested using the updated `test-warmup-api.js` script:

```bash
INSTANTLY_API_KEY=your-api-key node test-warmup-api.js
```

## API Endpoints Confirmed Working

- `POST /api/v2/accounts/warmup/enable` with `{ accounts: ["email@example.com"] }`
- `POST /api/v2/accounts/warmup/disable` with `{ accounts: ["email@example.com"] }`

## Edge Cases Handled

1. **Already Enabled/Disabled**: Provides clear status messages
2. **Account Not Found**: Specific 404 error handling
3. **Invalid Configuration**: 422 error with helpful guidance
4. **Bulk Operations**: Processes each account individually with detailed results
5. **Network Errors**: Preserves original error context

This fix resolves the persistent "Bad request" errors and provides a robust, working implementation for warmup operations.
