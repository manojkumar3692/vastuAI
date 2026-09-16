create extension if not exists pgcrypto;

create table if not exists public.vastu_accounts (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  name text not null,
  email text not null,
  pin_hash text not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'disabled')),
  credits integer not null default 0 check (credits >= 0),
  checkout_pending_until timestamptz,
  failed_login_count integer not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vastu_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.vastu_accounts(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists vastu_sessions_account_idx on public.vastu_sessions(account_id);
create index if not exists vastu_sessions_expiry_idx on public.vastu_sessions(expires_at);

create table if not exists public.vastu_purchases (
  id uuid primary key default gen_random_uuid(),
  razorpay_payment_id text not null unique,
  razorpay_event_id text unique,
  account_id uuid references public.vastu_accounts(id) on delete set null,
  amount integer not null,
  currency text not null,
  status text not null check (status in ('captured', 'failed', 'unmatched', 'rejected')),
  contact text,
  email text,
  credits_awarded integer not null default 0,
  raw_payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists vastu_purchases_account_idx on public.vastu_purchases(account_id);

create table if not exists public.vastu_reports (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.vastu_accounts(id) on delete cascade,
  title text not null,
  status text not null default 'generating' check (status in ('generating', 'ready', 'failed')),
  storage_path text,
  credit_debited boolean not null default true,
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists vastu_reports_account_idx on public.vastu_reports(account_id, created_at desc);

alter table public.vastu_accounts enable row level security;
alter table public.vastu_sessions enable row level security;
alter table public.vastu_purchases enable row level security;
alter table public.vastu_reports enable row level security;

insert into storage.buckets (id, name, public)
values ('vastu-reports', 'vastu-reports', false)
on conflict (id) do update set public = false;

create or replace function public.activate_vastu_pro_purchase(
  p_payment_id text,
  p_event_id text,
  p_amount integer,
  p_currency text,
  p_contact text,
  p_email text,
  p_payload jsonb
)
returns table(result text, account_id uuid, credits integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.vastu_accounts%rowtype;
  v_existing public.vastu_purchases%rowtype;
begin
  select * into v_existing
  from public.vastu_purchases
  where razorpay_payment_id = p_payment_id;

  if found then
    return query
      select 'duplicate'::text, v_existing.account_id, coalesce(a.credits, 0)
      from (select 1) x
      left join public.vastu_accounts a on a.id = v_existing.account_id;
    return;
  end if;

  if p_amount <> 79900 or upper(p_currency) <> 'INR' then
    insert into public.vastu_purchases (
      razorpay_payment_id, razorpay_event_id, amount, currency, status,
      contact, email, raw_payload
    ) values (
      p_payment_id, nullif(p_event_id, ''), p_amount, upper(p_currency), 'rejected',
      p_contact, p_email, p_payload
    );
    return query select 'rejected'::text, null::uuid, 0;
    return;
  end if;

  select * into v_account
  from public.vastu_accounts
  where phone = p_contact
    and status <> 'disabled'
    and checkout_pending_until > now()
  for update;

  if not found then
    insert into public.vastu_purchases (
      razorpay_payment_id, razorpay_event_id, amount, currency, status,
      contact, email, raw_payload
    ) values (
      p_payment_id, nullif(p_event_id, ''), p_amount, upper(p_currency), 'unmatched',
      p_contact, p_email, p_payload
    );
    return query select 'unmatched'::text, null::uuid, 0;
    return;
  end if;

  update public.vastu_accounts
  set credits = vastu_accounts.credits + 10,
      status = 'active',
      checkout_pending_until = null,
      updated_at = now()
  where id = v_account.id
  returning vastu_accounts.credits into v_account.credits;

  insert into public.vastu_purchases (
    razorpay_payment_id, razorpay_event_id, account_id, amount, currency,
    status, contact, email, credits_awarded, raw_payload
  ) values (
    p_payment_id, nullif(p_event_id, ''), v_account.id, p_amount, upper(p_currency),
    'captured', p_contact, p_email, 10, p_payload
  );

  return query select 'activated'::text, v_account.id, v_account.credits;
end;
$$;

create or replace function public.reserve_vastu_report(
  p_account_id uuid,
  p_title text
)
returns table(report_id uuid, credits_remaining integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_credits integer;
  v_report_id uuid;
begin
  select credits into v_credits
  from public.vastu_accounts
  where id = p_account_id and status = 'active'
  for update;

  if not found or v_credits < 1 then
    raise exception 'NO_CREDITS';
  end if;

  update public.vastu_accounts
  set credits = credits - 1, updated_at = now()
  where id = p_account_id
  returning credits into v_credits;

  insert into public.vastu_reports(account_id, title)
  values (p_account_id, left(coalesce(nullif(trim(p_title), ''), 'Vastu report'), 120))
  returning id into v_report_id;

  return query select v_report_id, v_credits;
end;
$$;

create or replace function public.fail_vastu_report(
  p_report_id uuid,
  p_error text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_report public.vastu_reports%rowtype;
begin
  select * into v_report
  from public.vastu_reports
  where id = p_report_id
  for update;

  if found and v_report.status = 'generating' and v_report.credit_debited then
    update public.vastu_accounts
    set credits = credits + 1, updated_at = now()
    where id = v_report.account_id;

    update public.vastu_reports
    set status = 'failed', credit_debited = false, error_message = left(p_error, 500)
    where id = p_report_id;
  end if;
end;
$$;

revoke all on function public.activate_vastu_pro_purchase(text, text, integer, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.reserve_vastu_report(uuid, text) from public, anon, authenticated;
revoke all on function public.fail_vastu_report(uuid, text) from public, anon, authenticated;
grant execute on function public.activate_vastu_pro_purchase(text, text, integer, text, text, text, jsonb) to service_role;
grant execute on function public.reserve_vastu_report(uuid, text) to service_role;
grant execute on function public.fail_vastu_report(uuid, text) to service_role;

