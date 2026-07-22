# Phase 2 live draw data

Public pages and APIs read only rows where `draws.status = 'verified'`.

## Public endpoints

- `GET /api/draws?page=1&pageSize=20&from=YYYY-MM-DD&to=YYYY-MM-DD&search=...&sort=date_desc`
- `GET /api/draws/latest`
- `GET /api/draws/:drawNumber`

List responses include draw records and pagination metadata. Invalid or unavailable records never expose draft, pending-review, or rejected imports.

## Pages

- The localized homepage shows the latest verified draw and verified record count.
- The results archive supports draw-number search, date filters, sort order, pagination, loading, empty, and error states.
- Both pages use a five-minute revalidation interval. Newly approved data appears automatically after cache revalidation; a redeploy is not required.
