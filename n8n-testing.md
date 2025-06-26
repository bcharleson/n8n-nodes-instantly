# n8n Testing Documentation

## Project Overview
Testing the `n8n-nodes-instantly` community node package (version 0.1.71) in a local n8n Docker instance.

## n8n Interface Basics

### Workflow Structure
- **Manual Trigger**: Starting point for workflows (left side)
- **Add Node Buttons**: 
  - `+` sign to the right of existing nodes
  - `+` button in upper right corner
- **Canvas**: Main workflow design area
- **Execute Workflow**: Button to run the entire workflow
- **Execute Step**: Button to run individual nodes

### Node Configuration
- **Parameters Tab**: Configure node settings
- **Settings Tab**: Advanced node options
- **Output Tab**: View execution results in Schema/Table/JSON format

## InstantlyApi Node Testing Results

### ✅ Account Operations - WORKING

#### Get Many Accounts
- **Status**: ✅ **WORKING** (⚠️ Pagination Issue)
- **Endpoint**: Account → Get Many
- **Credential**: Hedgestone Instantly API key
- **Output**: Successfully returns multiple account objects with:
  - `is_managed_account`: boolean
  - `added_by`: user ID
  - `modified_by`: user ID  
  - `status`: account status
  - `timestamp_warmup_start`: warmup timestamps
  - `stat_warmup_score`: warmup scores
  - `email`: account email addresses
  - `first_name`: account holder names
  - `last_name`: account holder names
  - `organization`: organization IDs
  - `warmup_status`: warmup status codes
  - `provider_code`: email provider codes
  - `setup_pending`: setup status
- **⚠️ Pagination Issue**: Returns `next_starting_after` field indicating more results available, but pagination not properly implemented

### Node Features Confirmed
- **Logo**: Instantly purple logo displays correctly
- **Credentials**: API key authentication working
- **Resource Selection**: Account resource properly available
- **Operation Selection**: Get Many operation available
- **Return All**: Toggle working for pagination
- **Output Format**: Clean JSON structure with proper data types

## Next Testing Steps
- [ ] **Fix pagination for Account Get Many** (handle `next_starting_after` field)
- [ ] Test Campaign operations (Create, Get, Update, Delete)
- [ ] Test Lead operations (Create, Get, Update, Delete)
- [ ] Test Analytics operations
- [ ] Test error handling with invalid credentials
- [ ] Test pagination with large datasets

## Package Information
- **Package Name**: `n8n-nodes-instantly`
- **Version**: `0.1.731` (Pagination Fix - Manual Implementation)
- **Published**: npm registry
- **Installation**: Successfully installed in n8n Docker instance
- **Status**: Production ready for Account operations

## Version History
- **0.1.71**: Initial working version with pagination issue
- **0.1.72**: Failed pagination fix attempt (routing-based)
- **0.1.73**: Failed pagination fix attempt (routing-based)
- **0.1.731**: ✅ **FIXED PAGINATION** - Manual implementation in execute method

## Pagination Fix Details (v0.1.731)
- **Implementation**: Manual pagination logic in execute method
- **Return All Toggle**: Added proper "Return All" boolean field
- **Limit Validation**: Hard limit of 100 with clear error message
- **Pagination Logic**: 
  - When "Return All" is enabled: Automatically fetches all pages using `next_starting_after`
  - When "Return All" is disabled: Respects limit parameter (max 100)
  - Uses 100 items per API call for efficiency when paginating
  - Continues until `next_starting_after` is no longer present
- **Error Handling**: Clear error message when limit exceeds 100
