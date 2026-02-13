# Lynco MVP Workplan — Quote → Approval

## Goal (Definition of Done)
Ship an end-to-end demoable flow:
1) Sales creates a quote
2) Approver approves/rejects
3) Customer accepts via public link
4) Quote timeline/audit is visible

## Canonical links
- Repo: https://github.com/nice2209/lynco-openclaw
- PR (current): https://github.com/nice2209/lynco-openclaw/pull/3

## Tracks (run in parallel)

### Track A — Backend + DB (Owner: BE)
- [ ] Apply Supabase migration: `web/SUPABASE_MIGRATIONS/001_quote_approval_mvp.sql`
- [ ] Verify tables exist: `quotes`, `quote_line_items`, `quote_approvals`, `quote_events`, `customer_acceptances`
- [ ] Decide whether to keep RLS “deny all” + service role only (current) or introduce auth-based RLS later
- [ ] (Optional) Add seed rows for demo

### Track B — Frontend (Owner: FE)
- [ ] `/quotes/new` create quote UI
- [ ] `/quote/[id]` internal status + timeline
- [ ] `/approve/[token]` approve/reject
- [ ] `/q/[token]` customer accept

### Track C — DevOps / Deployment (Owner: DevOps)
- [ ] Vercel env vars (Preview + Production)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional for later client auth)
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- [ ] Confirm Root Directory = `web`
- [ ] Confirm Deployment Protection settings match desired sharing

### Track D — QA / CI (Owner: QA)
- [ ] CI green on PR
- [ ] Manual smoke: create → approve → customer accept
- [ ] Add minimal Playwright coverage for new pages if needed (keep stable)

### Track E — Security / Hygiene (Owner: Sec)
- [ ] Ensure any secrets/files are ignored (e.g. supabase password files)
- [ ] Rotate Supabase keys if any chance they were exposed

## Operating rules (hand-off)
- Any change that affects other tracks MUST update `docs/CONTRACT.md` in the same PR.
- Prefer links + file diffs over chat explanations.
- One integrator (me) merges PRs and resolves conflicts.
