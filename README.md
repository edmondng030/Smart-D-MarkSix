# 六合彩數據研究所 Mark Six Data Lab

一個手機優先、以透明統計、概率教育、可重現組合實驗及嚴格回測為核心的獨立研究工具。

> 本站不是官方網站，不接受投注、不代購彩票，亦不保證任何回報。歷史結果及模型評分不代表未來結果。只限 18 歲或以上人士使用。

## Phase 0 已完成

- Next.js App Router、React、TypeScript strict、Tailwind CSS
- shadcn/ui 相容設定與基礎 Button
- 繁體中文預設、預留英文 messages
- 主要 routes、全站 layout、桌面導覽與手機 bottom navigation
- Supabase browser/server client 架構（不含密鑰）
- Vitest、Testing Library、Playwright
- 清楚標記的首頁 demo data 與全站免責聲明

## 本機安裝

```bash
npm install
copy .env.example .env.local
npm run dev
```

開啟 `http://localhost:3000`。Supabase 尚未設定時，Phase 0 靜態頁面仍可運行。

## 檢查與測試

```bash
npm run lint
npm run typecheck
npm run test
npx playwright install chromium
npm run test:e2e
```

## 環境變數

參考 `.env.example`。真實 service role key 只可在 server 使用，不得提交到 Git 或傳至瀏覽器。

## Supabase、CSV 與模型

資料庫 migrations、CSV 人工審核流程與 audit log 將在 Phase 1 建立。初版不建立自動爬蟲；只有 `verified` 資料可公開。組合模型與回測會分階段實作，所有結果保存 seed、版本與參數，且必須與純隨機 baseline 比較。

## 資料來源與負責任使用

正式資料發布前必須記錄來源、取得日期、授權狀態並由管理員核實。本專案不複製官方 Logo、版面或受保護內容，不提供付款或博彩戶口連接。

## 部署

目標平台為 Vercel + Supabase。部署前需完成 RLS、安全 headers、rate limit、SEO、accessibility review 及 production secrets audit。

## 已知限制

Phase 0 只提供產品骨架及 demo 首頁；結果、分析、產生器、對獎、回測與管理員資料流程尚未接入。

## License

尚未選定；正式發布前補充。
