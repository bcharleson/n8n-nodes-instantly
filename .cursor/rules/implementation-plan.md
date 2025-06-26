# Instantly V2 n8n Community Node - Implementation Plan

## 1. Initial Analysis

- **Authentication**: Only API key required; no OAuth.
- **Core Resources**: Analytics, Campaign, Lead, Inbox, Placement Test, Accounts.
- **Node Design**: One node per resource (e.g., Instantly Campaign), with a dropdown for all supported operations (CRUD, analytics, etc.) per resource.
- **Complexity**: Composite actions not required; focus on direct API mapping.
- **Testing**: User will test on a local n8n Docker instance.
- **Pagination**: Must be implemented for endpoints that support/require it, per Instantly API docs.

## 2. Phases & Steps

### Phase 1: Project Setup
- [ ] Clone the n8n-nodes-starter repo into the project directory.
- [ ] Set up project metadata (`package.json`, README, LICENSE).
- [ ] Configure TypeScript, linting, and formatting.

### Phase 2: Credential Node
- [ ] Implement Instantly API Key credential node in `/credentials`.
- [ ] Ensure secure storage and usage of the API key.

### Phase 3: Node Implementation (per Resource)
For each resource (Analytics, Campaign, Lead, Inbox, Placement Test, Accounts):
- [ ] Create a node file in `/nodes` (e.g., `InstantlyCampaign.node.ts`).
- [ ] Implement dropdown for all supported operations (e.g., create, get, update, delete, list, analytics).
- [ ] Map each operation to the corresponding Instantly API endpoint.
- [ ] Handle required/optional fields and nested JSON (especially for complex endpoints like campaign creation).
- [ ] Implement pagination for list endpoints as per API docs.
- [ ] Add error handling and user-friendly messages.

### Phase 4: Testing
- [ ] Write unit tests for each node and operation.
- [ ] Provide instructions for local testing with n8n Docker.
- [ ] Validate all endpoints and pagination with real Instantly API key.

### Phase 5: Documentation
- [ ] Update README with usage, setup, and example workflows.
- [ ] Document all available operations and required fields.

### Phase 6: Packaging & Publishing
- [ ] Ensure all nodes and credentials are registered in `package.json`.
- [ ] Lint and test the package.
- [ ] Publish to npm with the correct naming and keywords.

## 3. File Paths to Modify/Create

- `/credentials/InstantlyApi.credentials.ts`
- `/nodes/InstantlyAnalytics.node.ts`
- `/nodes/InstantlyCampaign.node.ts`
- `/nodes/InstantlyLead.node.ts`
- `/nodes/InstantlyInbox.node.ts`
- `/nodes/InstantlyPlacementTest.node.ts`
- `/nodes/InstantlyAccount.node.ts`
- `/package.json`
- `/README.md`
- `/test/` (for unit tests)

## 4. Risks & Mitigation

- **API Changes**: Monitor Instantly API docs for updates.
- **Pagination**: Test thoroughly to ensure all data is retrieved.
- **Complex Payloads**: Validate nested JSON for campaign creation.
- **n8n Compatibility**: Test on latest n8n version and document any version constraints.

## 5. Testing & Validation

- Unit tests for each operation.
- Manual testing on local n8n Docker instance.
- Test error handling, pagination, and edge cases (e.g., empty lists, invalid API key).

## 6. Documentation & NPM Publishing

- Usage instructions, supported operations, and troubleshooting in README.
- Ensure package follows n8n and npm community node standards.

## 7. Resource Estimation

- Moderate complexity: 2-3 days for initial implementation, 1-2 days for testing and documentation.