create type public.generation_method as enum ('uniform_random','conditional_random','historical_weighted');

create table public.generation_runs (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  method public.generation_method not null, model_version text not null, random_seed text not null,
  parameters jsonb not null default '{}'::jsonb, generated_count integer not null check(generated_count between 1 and 50),
  execution_ms integer check(execution_ms>=0), created_at timestamptz not null default now()
);
create table public.generated_combinations (
  id uuid primary key default gen_random_uuid(), run_id uuid not null references public.generation_runs(id) on delete cascade,
  numbers smallint[] not null check(cardinality(numbers)=6), historical_score numeric(12,4), explanation jsonb not null default '[]'::jsonb,
  rank_in_run integer not null check(rank_in_run>=1), created_at timestamptz not null default now(), unique(run_id,rank_in_run)
);
create table public.saved_combinations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  label text, numbers smallint[] not null check(cardinality(numbers)=6), method public.generation_method not null,
  model_version text, random_seed text, parameters jsonb not null default '{}'::jsonb, historical_score numeric(12,4),
  is_favourite boolean not null default false, created_at timestamptz not null default now()
);
alter table public.generation_runs enable row level security;
alter table public.generated_combinations enable row level security;
alter table public.saved_combinations enable row level security;
create policy "users manage own runs" on public.generation_runs for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "users manage own generated combinations" on public.generated_combinations for all using(exists(select 1 from public.generation_runs where generation_runs.id=generated_combinations.run_id and generation_runs.user_id=auth.uid())) with check(exists(select 1 from public.generation_runs where generation_runs.id=generated_combinations.run_id and generation_runs.user_id=auth.uid()));
create policy "users manage own saved combinations" on public.saved_combinations for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create index generation_runs_user_created_idx on public.generation_runs(user_id,created_at desc);
create index saved_combinations_user_created_idx on public.saved_combinations(user_id,created_at desc);
