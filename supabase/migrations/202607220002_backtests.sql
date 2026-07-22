create table public.backtest_runs (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  method public.generation_method not null, model_version text not null, random_seed text not null, parameters jsonb not null,
  status text not null check(status in('queued','running','completed','failed')),
  target_draw_count integer not null check(target_draw_count between 5 and 500), combinations_per_draw integer not null check(combinations_per_draw between 1 and 20), seed_count integer not null check(seed_count between 1 and 10),
  average_main_hits numeric(10,6), random_average_main_hits numeric(10,6), uplift_vs_random numeric(12,8),
  simulated_cost numeric(16,2), known_return numeric(16,2), known_roi numeric(16,8), return_coverage numeric(8,6), execution_ms integer,
  created_at timestamptz not null default now(), completed_at timestamptz
);
create table public.backtest_predictions (
  id uuid primary key default gen_random_uuid(), backtest_run_id uuid not null references public.backtest_runs(id) on delete cascade,
  target_draw_id uuid not null references public.draws(id), training_end_date date not null, generated_numbers smallint[] not null check(cardinality(generated_numbers)=6),
  model_score numeric(12,4), main_hits smallint not null check(main_hits between 0 and 6), extra_hit boolean not null,
  prize_division smallint check(prize_division between 1 and 7), simulated_dividend numeric(16,2), created_at timestamptz not null default now()
);
alter table public.backtest_runs enable row level security;
alter table public.backtest_predictions enable row level security;
create policy "users manage own backtests" on public.backtest_runs for all using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "users manage own backtest predictions" on public.backtest_predictions for all using(exists(select 1 from public.backtest_runs where backtest_runs.id=backtest_predictions.backtest_run_id and backtest_runs.user_id=auth.uid())) with check(exists(select 1 from public.backtest_runs where backtest_runs.id=backtest_predictions.backtest_run_id and backtest_runs.user_id=auth.uid()));
create index backtest_runs_user_created_idx on public.backtest_runs(user_id,created_at desc);
create index backtest_predictions_run_idx on public.backtest_predictions(backtest_run_id);
