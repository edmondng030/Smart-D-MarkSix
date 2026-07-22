# Renavon Mark Six synchronization

The server queries `renavon_exports.hkjc_marksix_results`, validates every draw, removes draw numbers already present in Supabase, and creates a `pending_review` data import. Existing verified draws are never overwritten by synchronization.

## Environment variables

- `RENAVON_API_KEY`: server-only Renavon credential.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase credential used by the scheduled job.
- `CRON_SECRET`: secret sent by Vercel in the scheduled request Authorization header.

Never prefix these variables with `NEXT_PUBLIC_` and never commit their values.

## Operations

- An administrator can start a sync at `/zh-HK/admin/imports`.
- Vercel calls `/api/cron/renavon-sync` daily at 15:30 UTC (23:30 Hong Kong time).
- A successful sync with new draws creates one review batch and one audit-log event.
- An administrator must review and approve the batch before its draws become verified and public.
