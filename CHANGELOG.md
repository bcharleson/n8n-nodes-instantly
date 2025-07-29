# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-29

### 🚀 Major Enhancement: Automated Webhook Management

#### Added
- **Fully Automated Webhook Management**: InstantlyTrigger now automatically creates and deletes webhooks using Instantly's API
- **Campaign ID Parameter**: Required parameter for campaign-specific webhook management
- **API-Based Webhook Creation**: Uses discovered `/api/v2/campaigns/webhooks` endpoints
- **Automatic Webhook Cleanup**: Webhooks are automatically deleted when workflows are deactivated
- **Enhanced Error Handling**: Comprehensive error handling with detailed error messages
- **Improved Documentation**: Updated setup instructions reflecting the automated process

#### Changed
- **Breaking Change**: Campaign ID parameter is now required for InstantlyTrigger nodes
- **Webhook Methods**: Replaced placeholder methods with actual API-based implementations
- **User Experience**: Eliminated need for manual webhook configuration in Instantly dashboard
- **Authentication**: Now requires Instantly API credentials for webhook management

#### Technical Details
- Discovered and implemented undocumented Instantly webhook API endpoints
- Added proper TypeScript error handling with NodeApiError
- Implemented webhook ID storage for deletion tracking
- Enhanced node documentation with technical details and requirements

#### Migration Guide
For existing users:
1. Add Campaign ID parameter to existing InstantlyTrigger nodes
2. Configure Instantly API credentials in n8n
3. Remove any manually created webhooks from Instantly dashboard
4. Reactivate workflows to create automated webhooks

### Benefits
- ✅ **Zero Manual Configuration**: No dashboard setup required
- ✅ **Instant Setup**: Webhooks created automatically on activation
- ✅ **Automatic Cleanup**: No orphaned webhooks when deactivating
- ✅ **Production Ready**: Comprehensive error handling and logging
- ✅ **Consistent Experience**: Matches other premium n8n integrations

## [0.1.7523] - 2025-01-28

### Added
- Initial release with manual webhook configuration
- InstantlyTrigger node with 17 event types
- Instantly action node with comprehensive API coverage
- Support for all major Instantly API v2 endpoints

### Features
- Manual webhook setup through Instantly dashboard
- Event filtering and campaign-specific triggers
- Complete API coverage for leads, campaigns, accounts, and analytics
- Proper credential management and authentication
