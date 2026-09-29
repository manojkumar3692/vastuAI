-- Match hosted Razorpay payments to a pending account using two customer
-- attributes. Phone-only matching allowed an attacker who pre-registered
-- somebody else's number to receive that person's credits.
delete from public.vastu_sessions
where expires_at <= now();

delete from public.vastu_sessions s
using (
  select id
  from (
    select id, row_number() over (
      partition by account_id
      order by created_at desc, id desc
    ) as session_rank
    from public.vastu_sessions
  ) ranked
  where session_rank > 1
) duplicate_sessions
where s.id = duplicate_sessions.id;

create unique index if not exists vastu_sessions_one_per_account_idx
on public.vastu_sessions(account_id);

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
  -- Serialize retries that carry the same Razorpay payment ID so two webhook
  -- deliveries cannot race between the duplicate check and the insert.
  perform pg_advisory_xact_lock(hashtextextended(p_payment_id, 0));

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
      p_contact, lower(trim(p_email)), p_payload
    );
    return query select 'rejected'::text, null::uuid, 0;
    return;
  end if;

  select * into v_account
  from public.vastu_accounts
  where phone = p_contact
    and lower(email) = lower(trim(p_email))
    and trim(coalesce(p_email, '')) <> ''
    and status <> 'disabled'
    and checkout_pending_until > now()
  for update;

  if not found then
    insert into public.vastu_purchases (
      razorpay_payment_id, razorpay_event_id, amount, currency, status,
      contact, email, raw_payload
    ) values (
      p_payment_id, nullif(p_event_id, ''), p_amount, upper(p_currency), 'unmatched',
      p_contact, lower(trim(p_email)), p_payload
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
    'captured', p_contact, lower(trim(p_email)), 10, p_payload
  );

  return query select 'activated'::text, v_account.id, v_account.credits;
end;
$$;

revoke all on function public.activate_vastu_pro_purchase(text, text, integer, text, text, text, jsonb)
from public, anon, authenticated;
grant execute on function public.activate_vastu_pro_purchase(text, text, integer, text, text, text, jsonb)
to service_role;
