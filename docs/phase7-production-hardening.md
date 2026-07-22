# Phase 7 production hardening

## Security

- Durable cross-instance rate limiting uses an atomic Supabase RPC and a SHA-256 hash of the request IP, scope, and server-only salt. Raw IP addresses are never stored.
- Generator: 20 requests/minute; checker: 60/minute; backtests: 5/minute; manual Renavon sync: 5/5 minutes.
- CSP, HSTS, frame denial, MIME sniffing protection, strict referrer policy, permissions policy, COOP, and disabled DNS prefetch are sent globally.
- Admin routes remain server-authorized and all owner data remains protected by RLS.

## SEO and accessibility

Production metadata is indexable and includes canonical, Open Graph, Twitter, robots, and sitemap resources. API/admin/auth paths are excluded from crawling. Keyboard skip navigation, global visible focus, labelled controls, responsive tables, and semantic landmarks are included.

## Operations

`GET /api/health` verifies public database reachability and reports the latest verified draw. Production should configure `RATE_LIMIT_SALT`, `CRON_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` as server-only sensitive variables. Never use a `NEXT_PUBLIC_` prefix for these values.

The durable limiter fails open if Supabase itself is unavailable so health/readiness failures remain observable rather than being misreported as HTTP 429.
