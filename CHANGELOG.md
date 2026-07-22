# Changelog

## 0.3.0 - 2026-07-21

- Added server-only Renavon Mark Six API integration and strict response validation.
- Added deduplicated historical/new-draw staging, admin sync UI, and audit logging.
- Added a protected daily Vercel Cron endpoint and Supabase service client.
- Added Renavon mapping tests and deployment documentation.

## 0.2.0 - 2026-07-21

- 新增 Supabase Phase 1 schema、constraints、indexes 及 RLS policies。
- 新增 CSV parser、Zod draw validation、hash 去重與逐行錯誤報告。
- 新增管理員 CSV 預覽、批准／拒絕 API 與 UI。
- 新增原子化發布與 audit log RPC。
- 新增 demo CSV、資料來源政策及 Phase 1 unit/integration tests。
- 新增管理員 email/password 登入、Auth callback、session refresh、登出及 server-side route guard。
## 0.1.0 - 2026-07-21

- 建立 Phase 0 Next.js、TypeScript、Tailwind 基礎。
- 加入 responsive 導覽、主要頁面骨架及繁中首頁。
- 加入 Supabase client 架構、Vitest、Testing Library 及 Playwright。
- 加入環境變數範本、免責與負責任使用聲明。
