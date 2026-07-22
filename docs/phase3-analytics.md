# Phase 3 verified draw analytics

Analytics use only verified Supabase draws and are descriptive, not predictive.

## Metrics

- Frequency for numbers 1–49, optionally including the extra number.
- Theoretical expected frequency and relative deviation.
- Draws since last seen and average historical gap.
- Sum, odd/even, low/high, and consecutive-number patterns.
- Main-number pair co-occurrence counts and rates.

## Endpoints

- `GET /api/analytics/numbers`
- `GET /api/analytics/patterns`
- `GET /api/analytics/pairs`

All endpoints accept `window=all|10|30|50|100|custom`; custom windows accept `from` and `to`. Number analytics also accepts `includeExtra=true|false`.
