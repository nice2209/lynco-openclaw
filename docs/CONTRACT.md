# Lynco MVP Contract — Quote → Approval

This document is the source of truth for cross-team (FE/BE/QA) coordination.

## Status values
Quote `status`:
- `draft`
- `pending_approval`
- `approved`
- `rejected`
- `sent`
- `customer_approved`
- `cancelled`

## Public tokens
- `approval_token` → manager approval link
- `customer_view_token` → customer view/accept link

## API endpoints

### Create quote
`POST /api/quotes`

Request body:
```json
{
  "customerCompany": "Acme Inc",
  "customerName": "Jane Smith",
  "customerEmail": "jane@acme.com",
  "currency": "USD",
  "taxCents": 0,
  "lineItems": [
    {
      "description": "Implementation",
      "quantity": 1,
      "unitPriceCents": 150000,
      "discountPercent": 0,
      "sortOrder": 0
    }
  ]
}
```

Response:
```json
{
  "id": "<quoteId>",
  "quoteUrl": "/quote/<quoteId>",
  "approvalUrl": "/approve/<approvalToken>",
  "customerUrl": "/q/<customerToken>"
}
```

### List quotes (admin/server)
`GET /api/quotes`

Response:
```json
{ "quotes": [ { "id": "...", "customer_company": "...", "status": "draft" } ] }
```

### Get quote details
`GET /api/quotes/:id`

Response:
```json
{
  "quote": { "id": "...", "status": "draft", "currency": "USD", "total_cents": 1000, "approval_token": "...", "customer_view_token": "..." },
  "items": [ { "description": "...", "quantity": 1, "unit_price_cents": 1000, "discount_percent": 0, "line_total_cents": 1000 } ],
  "events": [ { "type": "created", "actor_type": "system", "created_at": "..." } ]
}
```

### Update quote status
`PATCH /api/quotes/:id`

Request:
```json
{ "status": "sent" }
```

Response:
```json
{ "ok": true }
```

### Approver decision
`GET /api/approve/:token` → quote summary for approval UI

`POST /api/approve/:token`

Request:
```json
{ "decision": "approved", "name": "Manager Name", "email": "manager@company.com", "comment": "ok" }
```

Response:
```json
{ "ok": true, "status": "approved" }
```

### Customer accept
`GET /api/q/:token` → quote summary for customer UI

`POST /api/q/:token`

Request:
```json
{ "signerName": "Customer", "signerCompany": "Acme", "poNumber": "PO-123", "comment": "LGTM" }
```

Response:
```json
{ "ok": true, "status": "customer_approved" }
```

## DB tables (Supabase)
Defined in: `web/SUPABASE_MIGRATIONS/001_quote_approval_mvp.sql`

Minimum tables:
- `quotes`
- `quote_line_items`
- `quote_approvals`
- `quote_events`
- `customer_acceptances`

## Env vars
Required (server routes):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional:
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
