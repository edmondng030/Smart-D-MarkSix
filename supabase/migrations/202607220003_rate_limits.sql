create table public.api_rate_limits (
  scope text not null, key_hash text not null, window_start timestamptz not null default now(), request_count integer not null default 0,
  primary key(scope,key_hash)
);
alter table public.api_rate_limits enable row level security;
create or replace function public.check_rate_limit(p_scope text,p_key_hash text,p_limit integer,p_window_seconds integer)
returns table(allowed boolean,retry_after integer,current_count integer)
language plpgsql security definer set search_path=public as $$
declare v_row public.api_rate_limits%rowtype;v_now timestamptz:=clock_timestamp();
begin
  if p_limit<1 or p_limit>1000 or p_window_seconds<1 or p_window_seconds>86400 or length(p_scope)>80 or length(p_key_hash)<>64 then raise exception 'INVALID_RATE_LIMIT_INPUT';end if;
  insert into public.api_rate_limits(scope,key_hash,window_start,request_count) values(p_scope,p_key_hash,v_now,1)
  on conflict(scope,key_hash) do update set window_start=case when api_rate_limits.window_start+(p_window_seconds||' seconds')::interval<=v_now then v_now else api_rate_limits.window_start end,request_count=case when api_rate_limits.window_start+(p_window_seconds||' seconds')::interval<=v_now then 1 else api_rate_limits.request_count+1 end
  returning * into v_row;
  allowed:=v_row.request_count<=p_limit;current_count:=v_row.request_count;retry_after:=greatest(0,ceil(extract(epoch from(v_row.window_start+(p_window_seconds||' seconds')::interval-v_now)))::integer);return next;
end;$$;
revoke all on function public.check_rate_limit(text,text,integer,integer) from public;
grant execute on function public.check_rate_limit(text,text,integer,integer) to anon,authenticated;
