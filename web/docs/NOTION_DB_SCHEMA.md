# Notion Lead Capture Database Schema

This document describes the expected Notion database schema for the lead capture API endpoint (`/api/lead`).

## Database Properties

The Notion database must have the following properties configured:

### Required Properties (Core)

These properties are REQUIRED for the fallback mechanism to work:

- **Name** (type: `title`)
  - The lead's full name
  - Example: "홍길동", "Taylor Kim"

- **Email** (type: `email`)
  - The lead's email address
  - Example: "taylor@lynco.io"

- **Message** (type: `rich_text`)
  - Optional message from the lead
  - Example: "현재 운영 중인 프로세스에서 가장 답답한 지점을 알려주세요."

### Extended Properties (Full)

These properties are used when available in the database:

- **Company** (type: `rich_text`)
  - The lead's company name
  - Example: "Lynco Labs", "린코 랩스"

- **Source** (type: `select`)
  - The source of the lead
  - Automatically set to "Landing" for form submissions

- **Created At** (type: `date`)
  - Timestamp when the lead was created
  - Automatically set to current ISO timestamp

- **Status** (type: `select`)
  - Lead status
  - Automatically set to "New" for new submissions

## Fallback Behavior

The API implements a graceful fallback mechanism:

1. **First attempt**: Try to create a page with all properties (including Company, Source, Created At, Status)
2. **Fallback attempt**: If the first attempt fails with a `validation_error` (e.g., because some properties don't exist in the database), retry with only the core properties (Name, Email, Message)

This ensures the API works with both minimal and fully-configured Notion databases.

## UTF-8 Encoding

All text fields support full UTF-8 character encoding, including:
- Korean characters (한글): "홍길동", "린코 랩스"
- Special characters and emojis
- Mixed language content: "Lynco 데모 요청"

The API explicitly sets `Content-Type: application/json; charset=utf-8` to ensure proper encoding when sending data to Notion.

## Environment Variables

To configure the Notion integration:

```bash
NOTION_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_API_URL=https://api.notion.com/v1/pages
```

**Important**:
- Both values are automatically trimmed to remove leading/trailing whitespace
- Database ID is sanitized to remove non-hex characters and validated to 32 hex chars
- If either variable is missing, the API returns a 503 error

**Test-only (CI/local)**:
- `NOTION_TEST_OVERRIDE=true` allows sending `x-notion-key` and
  `x-notion-database-id` headers to the API for mock tests
- `NOTION_MOCK_ENABLED=true` enables the `/api/notion-mock` endpoint used by tests

## Creating the Database

You can use the provided Python scripts to create and configure the database:

```bash
# Create a new leads database
python scripts/notion_create_leads_db.py

# Update database properties
python scripts/notion_update_db_properties.py <database_id>

# Insert a test lead (with Korean text)
python scripts/notion_insert_test_lead.py <database_id>
```

## Testing

The E2E tests verify:
- Proper error handling when Notion is not configured (503 response)
- Form submission with Korean text (when Notion is configured)
- Fallback mechanism for databases with missing properties
- UTF-8 encoding preservation for Korean characters

Run tests with:
```bash
npm run test:e2e
```
