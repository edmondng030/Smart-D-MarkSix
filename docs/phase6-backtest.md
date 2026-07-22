# Phase 6 walk-forward backtesting

For every target draw, training data ends at the immediately preceding verified draw. The target and all later draws are excluded from frequency calculation. Strategy results are compared with an independently generated uniform-random baseline using the same targets, combination count, and seed count.

Requests are bounded to 5–500 targets, 1–20 combinations per target, and 1–10 seeds. Results include hit distributions, average main hits, relative uplift, simulated ticket cost, known recorded return, return coverage, and a per-target training audit.

Renavon imports currently provide mainly first-prize dividends rather than complete lower-division payouts. Consequently known return and ROI are incomplete and must not be interpreted as actual profitability. Hit distributions and the random baseline are the primary comparison.

Authenticated summaries are stored in `backtest_runs` under owner-only RLS. `POST /api/backtests` also works anonymously without persistence.
