create extension if not exists pgcrypto;

create type public.draw_status as enum ('draft', 'pending_review', 'verified', 'rejected');
create type public.import_status as enum ('uploaded', 'validating', 'validation_failed', 'pending_review', 'published', 'rejected');

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'analyst', 'admin')) default 'user',
  created_at timestamptz not null default now()
);

create table public.draws (
  id uuid primary key default gen_random_uuid(), draw_number text not null unique, draw_date date not null unique,
  number_1 smallint not null, number_2 smallint not null, number_3 smallint not null, number_4 smallint not null, number_5 smallint not null, number_6 smallint not null, extra_number smallint not null,
  turnover numeric(14,2), first_prize_fund numeric(14,2), first_prize_units numeric(10,2), first_prize_dividend numeric(14,2),
  source_name text, source_url text, source_retrieved_at timestamptz, source_hash text,
  status public.draw_status not null default 'draft', verified_by uuid references auth.users(id), verified_at timestamptz,
  is_demo boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  constraint numbers_range check (number_1 between 1 and 49 and number_2 between 1 and 49 and number_3 between 1 and 49 and number_4 between 1 and 49 and number_5 between 1 and 49 and number_6 between 1 and 49 and extra_number between 1 and 49),
  constraint sorted_main_numbers check (number_1 < number_2 and number_2 < number_3 and number_3 < number_4 and number_4 < number_5 and number_5 < number_6),
  constraint extra_not_main check (extra_number not in (number_1, number_2, number_3, number_4, number_5, number_6)),
  constraint nonnegative_financials check (coalesce(turnover,0) >= 0 and coalesce(first_prize_fund,0) >= 0 and coalesce(first_prize_units,0) >= 0 and coalesce(first_prize_dividend,0) >= 0)
);

create table public.draw_prizes (
  id uuid primary key default gen_random_uuid(), draw_id uuid not null references public.draws(id) on delete cascade,
  division smallint not null check (division between 1 and 7), winning_units numeric(12,2) check (winning_units >= 0), dividend numeric(14,2) check (dividend >= 0),
  created_at timestamptz not null default now(), unique(draw_id, division)
);

create table public.data_imports (
  id uuid primary key default gen_random_uuid(), uploaded_by uuid not null references auth.users(id), file_name text not null,
  storage_path text not null, file_hash text not null unique, row_count integer check (row_count >= 0), valid_row_count integer check (valid_row_count >= 0), invalid_row_count integer check (invalid_row_count >= 0),
  status public.import_status not null default 'uploaded', validation_report jsonb, staged_rows jsonb not null default '[]'::jsonb,
  reviewed_by uuid references auth.users(id), reviewed_at timestamptz, rejection_reason text, created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), action text not null,
  entity_type text not null, entity_id text, before_data jsonb, after_data jsonb, ip_hash text, created_at timestamptz not null default now()
);

create index draws_verified_date_idx on public.draws(draw_date desc) where status = 'verified';
create index data_imports_status_idx on public.data_imports(status, created_at desc);
create index audit_logs_entity_idx on public.audit_logs(entity_type, entity_id, created_at desc);

create or replace function public.is_admin_or_analyst() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role in ('admin','analyst'));
$$;
create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = auth.uid() and role = 'admin');
$$;

alter table public.user_roles enable row level security;
alter table public.draws enable row level security;
alter table public.draw_prizes enable row level security;
alter table public.data_imports enable row level security;
alter table public.audit_logs enable row level security;

create policy "verified draws are public" on public.draws for select using (status = 'verified' or public.is_admin_or_analyst());
create policy "verified prizes are public" on public.draw_prizes for select using (exists(select 1 from public.draws where draws.id = draw_prizes.draw_id and (draws.status = 'verified' or public.is_admin_or_analyst())));
create policy "staff read imports" on public.data_imports for select using (public.is_admin_or_analyst());
create policy "admins create imports" on public.data_imports for insert with check (public.is_admin() and uploaded_by = auth.uid());
create policy "admins update imports" on public.data_imports for update using (public.is_admin()) with check (public.is_admin());
create policy "staff read audit logs" on public.audit_logs for select using (public.is_admin_or_analyst());

create or replace function public.review_data_import(p_import_id uuid, p_decision text, p_reason text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_import public.data_imports%rowtype; v_row jsonb; v_inserted int := 0;
begin
  if not public.is_admin() then raise exception 'FORBIDDEN'; end if;
  select * into v_import from public.data_imports where id = p_import_id for update;
  if not found then raise exception 'IMPORT_NOT_FOUND'; end if;
  if v_import.status <> 'pending_review' then raise exception 'INVALID_IMPORT_STATUS'; end if;
  if p_decision = 'reject' then
    if coalesce(trim(p_reason),'') = '' then raise exception 'REJECTION_REASON_REQUIRED'; end if;
    update public.data_imports set status='rejected', reviewed_by=auth.uid(), reviewed_at=now(), rejection_reason=p_reason where id=p_import_id;
    insert into public.audit_logs(actor_id,action,entity_type,entity_id,before_data,after_data) values(auth.uid(),'import.rejected','data_import',p_import_id::text,to_jsonb(v_import),jsonb_build_object('status','rejected','reason',p_reason));
    return jsonb_build_object('status','rejected','inserted',0);
  elsif p_decision <> 'approve' then raise exception 'INVALID_DECISION'; end if;
  if coalesce(v_import.invalid_row_count,0) > 0 then raise exception 'IMPORT_HAS_INVALID_ROWS'; end if;
  for v_row in select * from jsonb_array_elements(v_import.staged_rows) loop
    insert into public.draws(draw_number,draw_date,number_1,number_2,number_3,number_4,number_5,number_6,extra_number,turnover,first_prize_fund,first_prize_units,first_prize_dividend,source_name,source_url,source_hash,status,verified_by,verified_at)
    values(v_row->>'draw_number',(v_row->>'draw_date')::date,(v_row->>'number_1')::smallint,(v_row->>'number_2')::smallint,(v_row->>'number_3')::smallint,(v_row->>'number_4')::smallint,(v_row->>'number_5')::smallint,(v_row->>'number_6')::smallint,(v_row->>'extra_number')::smallint,nullif(v_row->>'turnover','')::numeric,nullif(v_row->>'first_prize_fund','')::numeric,nullif(v_row->>'first_prize_units','')::numeric,nullif(v_row->>'first_prize_dividend','')::numeric,nullif(v_row->>'source_name',''),nullif(v_row->>'source_url',''),v_import.file_hash,'verified',auth.uid(),now());
    v_inserted := v_inserted + 1;
  end loop;
  update public.data_imports set status='published', reviewed_by=auth.uid(), reviewed_at=now() where id=p_import_id;
  insert into public.audit_logs(actor_id,action,entity_type,entity_id,before_data,after_data) values(auth.uid(),'import.published','data_import',p_import_id::text,to_jsonb(v_import),jsonb_build_object('status','published','inserted',v_inserted));
  return jsonb_build_object('status','published','inserted',v_inserted);
end; $$;
revoke all on function public.review_data_import(uuid,text,text) from public;
grant execute on function public.review_data_import(uuid,text,text) to authenticated;
