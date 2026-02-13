-- Lynco MVP: Quote -> Approval schema
-- Apply in Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------- Types ----------
do $$ begin
  create type quote_status as enum ('draft','pending_approval','approved','rejected','sent','customer_approved','cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type approval_decision as enum ('approved','rejected');
exception when duplicate_object then null;
end $$;

-- ---------- Quotes ----------
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),

  customer_company text not null,
  customer_name text not null,
  customer_email text not null,

  currency text not null default 'USD',
  valid_until date null,

  subtotal_cents integer not null default 0,
  discount_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,

  status quote_status not null default 'draft',

  approval_token text null unique,
  customer_view_token text null unique,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  approval_requested_at timestamptz null,
  decided_at timestamptz null,
  sent_at timestamptz null,
  customer_approved_at timestamptz null
);

create index if not exists quotes_status_idx on public.quotes(status);

-- ---------- Quote line items ----------
create table if not exists public.quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,

  description text not null,
  quantity numeric not null default 1,
  unit_price_cents integer not null default 0,
  discount_percent numeric not null default 0,
  line_total_cents integer not null default 0,

  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists quote_line_items_quote_id_idx on public.quote_line_items(quote_id);

-- ---------- Approvals ----------
create table if not exists public.quote_approvals (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  decision approval_decision not null,
  comment text null,
  actor_name text null,
  actor_email text null,
  created_at timestamptz not null default now()
);

create index if not exists quote_approvals_quote_id_idx on public.quote_approvals(quote_id);

-- ---------- Events (audit trail) ----------
create table if not exists public.quote_events (
  id bigserial primary key,
  quote_id uuid not null references public.quotes(id) on delete cascade,
  type text not null,
  actor_type text not null default 'system', -- user|customer|system
  actor_name text null,
  actor_email text null,
  metadata jsonb null,
  created_at timestamptz not null default now()
);

create index if not exists quote_events_quote_id_created_at_idx on public.quote_events(quote_id, created_at desc);

-- ---------- Customer acceptance ----------
create table if not exists public.customer_acceptances (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  signer_name text not null,
  signer_company text null,
  po_number text null,
  comment text null,
  accepted_at timestamptz not null default now(),
  ip text null,
  user_agent text null
);

create index if not exists customer_acceptances_quote_id_idx on public.customer_acceptances(quote_id);

-- ---------- updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists set_quotes_updated_at on public.quotes;
create trigger set_quotes_updated_at
before update on public.quotes
for each row execute function public.set_updated_at();

-- ---------- RLS (default deny; service-role recommended for MVP server routes) ----------
alter table public.quotes enable row level security;
alter table public.quote_line_items enable row level security;
alter table public.quote_approvals enable row level security;
alter table public.quote_events enable row level security;
alter table public.customer_acceptances enable row level security;

-- For MVP, do NOT create permissive policies.
-- Use SUPABASE_SERVICE_ROLE_KEY in Next.js server routes.
