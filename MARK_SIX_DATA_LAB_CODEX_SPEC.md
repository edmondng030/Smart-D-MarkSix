# 香港六合彩歷史數據分析及組合機率 Webapp
## Codex Agent 完整產品與開發規格

> 文件版本：1.0  
> 建立日期：2026-07-21  
> 專案代號：`mark-six-lab`  
> 建議產品名稱：**六合彩數據研究所 Mark Six Data Lab**  
> 文件用途：可直接交給 Codex Agent／其他 coding agent，按階段建立 Webapp。

---

# 0. 給 Codex Agent 的總指令

你是一名資深全端工程師、數據工程師、統計分析師及 UI/UX Designer。請根據本文件建立一個可實際運行、可部署、手機優先的香港六合彩歷史數據分析 Webapp。

開發時必須遵守以下原則：

1. 不得聲稱任何模型可以準確預測六合彩結果。
2. 不得將「歷史模式分數」標示為「中獎率」或「下期出現機率」。
3. 所有六個號碼組合在公平獨立攪珠下，中頭獎的理論機率相同。
4. 網站只提供歷史數據、統計分析、模擬、回測及娛樂用途。
5. 網站不得接受投注、代購彩票、收取賭款或連接博彩戶口。
6. 不得複製香港賽馬會的 Logo、官方版面、受版權保護圖像或大量原文內容。
7. 未確認資料授權前，不得建立高頻率或規避限制的網站爬蟲。
8. 初版資料匯入必須支援 CSV，由管理員核實後發布。
9. 所有模型必須與純隨機 baseline 比較。
10. 不得出現假資料而沒有清楚標示；開發假資料必須使用 `is_demo = true`。
11. 所有運算結果要可重現，產生組合時保存 `random_seed`、演算法版本及參數。
12. 使用 TypeScript strict mode，避免 `any`。
13. 所有表單要有前端及後端驗證。
14. 所有密鑰只可放在環境變數，不得提交到 Git。
15. 完成每個階段後，更新 `README.md`、`CHANGELOG.md` 及測試。

---

# 1. 產品定位

## 1.1 產品一句話

一個以透明統計、互動圖表、組合產生及時間序列回測為核心的六合彩歷史數據研究工具。

## 1.2 正確定位

網站不是「必中號碼預測器」，而是：

- 歷史結果資料庫
- 號碼統計分析器
- 組合條件篩選器
- 隨機組合產生器
- 歷史模式實驗工具
- Rolling backtest 回測平台
- 私人號碼儲存及對獎工具

## 1.3 不應使用的宣傳字眼

禁止：

- AI 必中號碼
- 預測下期頭獎
- 中獎率 80%
- 提升中頭獎機會
- 內幕號碼
- 穩賺策略
- 保證回報
- 高勝率組合

可以使用：

- 歷史模式評分
- 組合特徵評分
- 回測結果
- 隨機基準比較
- 歷史出現頻率
- 模型實驗
- 條件式組合產生
- 統計娛樂用途

## 1.4 目標用戶

### 主要用戶

- 想查閱歷史六合彩結果的人
- 喜歡分析號碼走勢及圖表的人
- 想按自訂條件產生組合的人
- 想保存私人號碼及快速對獎的人

### 次要用戶

- 學習概率及統計的人
- 想研究隨機性及模型回測的人
- 想比較不同選號策略的人

---

# 2. 概率基礎與網站固定說明

六合彩標準玩法為從 1 至 49 選取 6 個不同號碼。每期抽出 6 個正選號碼及 1 個特別號碼。

## 2.1 總組合數

```text
C(49, 6) = 13,983,816
```

## 2.2 單注頭獎理論機率

```text
1 / 13,983,816
≈ 0.000000071511
≈ 0.0000071511%
```

## 2.3 各獎項理論機率

以下以一張包含 6 個不同號碼的標準組合計算：

| 獎項 | 條件 | 有利組合數 | 約數 |
|---|---|---:|---:|
| 頭獎 | 6 個正選 | 1 | 1 / 13,983,816 |
| 二獎 | 5 個正選 + 特別號 | 6 | 1 / 2,330,636 |
| 三獎 | 5 個正選 | 252 | 1 / 55,491 |
| 四獎 | 4 個正選 + 特別號 | 630 | 1 / 22,197 |
| 五獎 | 4 個正選 | 12,915 | 1 / 1,083 |
| 六獎 | 3 個正選 + 特別號 | 17,220 | 1 / 812 |
| 七獎 | 3 個正選 | 229,600 | 1 / 61 |
| 任何獎項 | 上述任何一項 | 260,624 | 約 1 / 53.7 |

> 注意：實際派彩、獎金分配及玩法以香港賽馬會最新正式規則為準。

## 2.4 必須在 UI 顯示的說明

在「組合產生器」、「模型實驗」及「回測」頁面固定顯示：

> 所有六個號碼組合在公平及獨立攪珠下，中頭獎的理論機率相同。歷史頻率、冷熱號碼、模型評分及回測結果不代表未來結果。

---

# 3. MVP 範圍

## 3.1 MVP 必須完成

1. 歷史結果列表
2. 最新一期結果
3. 單期結果詳情
4. 號碼 1–49 出現頻率
5. 最近 10、30、50、100 期統計
6. 每個號碼距離上次出現的期數
7. 奇偶、大細、總和、跨度及連號分析
8. 號碼 Pair 共現矩陣
9. 純隨機組合產生器
10. 條件式組合產生器
11. 歷史權重組合產生器
12. 組合解釋卡
13. Rolling backtest
14. 模型與隨機 baseline 比較
15. 手動輸入號碼對獎
16. 儲存「我的號碼」
17. CSV 匯入及資料驗證
18. 管理員資料審核
19. 手機及桌面 Responsive UI
20. 中英文介面架構，MVP 先完成繁體中文

## 3.2 MVP 暫不包括

- 真實投注
- 代購彩票
- 付款功能
- 連接任何博彩戶口
- 推送「必買號碼」
- 社交排行榜
- 用戶公開分享投注金額
- 即時直播
- 大型神經網絡
- 自動高頻網頁爬蟲
- 以模型分數冒充真實概率
- 原生 iOS／Android App

---

# 4. 建議技術架構

## 4.1 前端

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Apache ECharts 或 Recharts
- React Hook Form
- Zod
- TanStack Table
- date-fns
- next-intl

## 4.2 後端

MVP 使用：

- Next.js Route Handlers
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- Row Level Security
- SQL functions／views
- Vercel Cron 或 GitHub Actions 作低頻資料更新及回測排程

第二階段可加入：

- Python FastAPI
- pandas
- NumPy
- SciPy
- scikit-learn
- Redis／Upstash 作快取及 rate limiting

## 4.3 部署

- Web：Vercel
- Database：Supabase
- Git：GitHub
- Monitoring：Sentry
- Analytics：Plausible 或 Vercel Analytics
- CI：GitHub Actions
- Unit test：Vitest
- Component test：Testing Library
- E2E：Playwright

## 4.4 架構原則

- 統計計算與 UI 分離
- 所有模型有版本號
- 所有產生結果可重現
- 不把大量統計運算放在 browser main thread
- 較重回測使用 server job
- 常用統計結果使用 materialized view 或快取
- 資料更新與公開顯示分開
- 未核實數據不得進入 production dataset

---

# 5. 建議專案資料夾

```text
mark-six-lab/
├─ app/
│  ├─ [locale]/
│  │  ├─ page.tsx
│  │  ├─ results/
│  │  │  ├─ page.tsx
│  │  │  └─ [drawNumber]/page.tsx
│  │  ├─ analytics/
│  │  │  ├─ page.tsx
│  │  │  ├─ numbers/page.tsx
│  │  │  ├─ patterns/page.tsx
│  │  │  └─ pairs/page.tsx
│  │  ├─ generator/page.tsx
│  │  ├─ backtest/page.tsx
│  │  ├─ checker/page.tsx
│  │  ├─ saved/page.tsx
│  │  ├─ methodology/page.tsx
│  │  ├─ responsible-use/page.tsx
│  │  └─ admin/
│  │     ├─ imports/page.tsx
│  │     ├─ review/page.tsx
│  │     └─ models/page.tsx
│  └─ api/
│     ├─ draws/
│     ├─ analytics/
│     ├─ generator/
│     ├─ backtests/
│     ├─ checker/
│     └─ admin/
├─ components/
│  ├─ layout/
│  ├─ draw/
│  ├─ charts/
│  ├─ generator/
│  ├─ backtest/
│  ├─ checker/
│  ├─ legal/
│  └─ ui/
├─ features/
│  ├─ draws/
│  ├─ analytics/
│  ├─ generator/
│  ├─ backtest/
│  ├─ checker/
│  └─ auth/
├─ lib/
│  ├─ supabase/
│  ├─ validation/
│  ├─ statistics/
│  ├─ probability/
│  ├─ generator/
│  ├─ backtest/
│  ├─ security/
│  └─ utils/
├─ scripts/
│  ├─ import-draws.ts
│  ├─ validate-draws.ts
│  ├─ rebuild-statistics.ts
│  └─ seed-demo.ts
├─ supabase/
│  ├─ migrations/
│  ├─ functions/
│  └─ seed.sql
├─ public/
│  ├─ icons/
│  └─ sample-data/
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  ├─ fixtures/
│  └─ e2e/
├─ docs/
│  ├─ methodology.md
│  ├─ data-source-policy.md
│  ├─ model-card.md
│  └─ responsible-use.md
├─ .env.example
├─ README.md
├─ CHANGELOG.md
└─ package.json
```

---

# 6. 資料庫設計

## 6.1 Enum

```sql
create type draw_status as enum (
  'draft',
  'pending_review',
  'verified',
  'rejected'
);

create type generation_method as enum (
  'uniform_random',
  'conditional_random',
  'historical_weighted'
);

create type import_status as enum (
  'uploaded',
  'validating',
  'validation_failed',
  'pending_review',
  'published',
  'rejected'
);
```

## 6.2 `draws`

```sql
create table public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_number text not null unique,
  draw_date date not null unique,

  number_1 smallint not null,
  number_2 smallint not null,
  number_3 smallint not null,
  number_4 smallint not null,
  number_5 smallint not null,
  number_6 smallint not null,
  extra_number smallint not null,

  turnover numeric(14, 2),
  first_prize_fund numeric(14, 2),
  first_prize_units numeric(10, 2),
  first_prize_dividend numeric(14, 2),

  source_name text,
  source_url text,
  source_retrieved_at timestamptz,
  source_hash text,

  status draw_status not null default 'draft',
  verified_by uuid references auth.users(id),
  verified_at timestamptz,

  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint numbers_range check (
    number_1 between 1 and 49 and
    number_2 between 1 and 49 and
    number_3 between 1 and 49 and
    number_4 between 1 and 49 and
    number_5 between 1 and 49 and
    number_6 between 1 and 49 and
    extra_number between 1 and 49
  ),

  constraint sorted_main_numbers check (
    number_1 < number_2 and
    number_2 < number_3 and
    number_3 < number_4 and
    number_4 < number_5 and
    number_5 < number_6
  ),

  constraint extra_not_main check (
    extra_number not in (
      number_1,
      number_2,
      number_3,
      number_4,
      number_5,
      number_6
    )
  )
);
```

## 6.3 `draw_prizes`

避免把所有獎項硬塞入 `draws`：

```sql
create table public.draw_prizes (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  division smallint not null check (division between 1 and 7),
  winning_units numeric(12, 2),
  dividend numeric(14, 2),
  created_at timestamptz not null default now(),
  unique(draw_id, division)
);
```

## 6.4 `saved_combinations`

```sql
create table public.saved_combinations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  label text,
  numbers smallint[] not null,
  method generation_method not null,
  model_version text,
  random_seed text,
  parameters jsonb not null default '{}'::jsonb,
  historical_score numeric(5, 2),

  is_favourite boolean not null default false,
  created_at timestamptz not null default now(),

  constraint six_numbers check (cardinality(numbers) = 6)
);
```

## 6.5 `generation_runs`

每次產生一批組合都保存：

```sql
create table public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  method generation_method not null,
  model_version text not null,
  random_seed text not null,
  parameters jsonb not null,
  generated_count integer not null,
  execution_ms integer,
  created_at timestamptz not null default now()
);
```

## 6.6 `generated_combinations`

```sql
create table public.generated_combinations (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.generation_runs(id) on delete cascade,
  numbers smallint[] not null,
  historical_score numeric(5, 2),
  explanation jsonb not null default '{}'::jsonb,
  rank_in_run integer not null,
  created_at timestamptz not null default now(),
  unique(run_id, rank_in_run)
);
```

## 6.7 `model_versions`

```sql
create table public.model_versions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null,
  method generation_method not null,
  parameters_schema jsonb not null,
  status text not null check (
    status in ('draft', 'testing', 'active', 'retired')
  ),
  created_at timestamptz not null default now(),
  activated_at timestamptz
);
```

## 6.8 `backtest_runs`

```sql
create table public.backtest_runs (
  id uuid primary key default gen_random_uuid(),
  model_version_id uuid not null references public.model_versions(id),
  name text not null,

  start_draw_date date not null,
  end_draw_date date not null,
  minimum_training_draws integer not null,
  combinations_per_draw integer not null,

  random_seed text not null,
  parameters jsonb not null,

  status text not null check (
    status in ('queued', 'running', 'completed', 'failed')
  ),

  total_target_draws integer,
  total_generated_combinations integer,
  average_main_hits numeric(8, 6),
  random_average_main_hits numeric(8, 6),
  uplift_vs_random numeric(10, 6),
  simulated_cost numeric(14, 2),
  simulated_return numeric(14, 2),
  simulated_roi numeric(10, 6),

  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);
```

## 6.9 `backtest_predictions`

```sql
create table public.backtest_predictions (
  id uuid primary key default gen_random_uuid(),
  backtest_run_id uuid not null
    references public.backtest_runs(id) on delete cascade,
  target_draw_id uuid not null references public.draws(id),

  training_end_date date not null,
  generated_numbers smallint[] not null,
  model_score numeric(5, 2),

  main_hits smallint not null check (main_hits between 0 and 6),
  extra_hit boolean not null,
  prize_division smallint check (prize_division between 1 and 7),
  simulated_dividend numeric(14, 2),

  created_at timestamptz not null default now()
);
```

## 6.10 `data_imports`

```sql
create table public.data_imports (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references auth.users(id),
  file_name text not null,
  storage_path text not null,
  file_hash text not null,
  row_count integer,
  valid_row_count integer,
  invalid_row_count integer,
  status import_status not null default 'uploaded',
  validation_report jsonb,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
```

## 6.11 `audit_logs`

```sql
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  before_data jsonb,
  after_data jsonb,
  ip_hash text,
  created_at timestamptz not null default now()
);
```

---

# 7. 資料驗證規則

每一條 draw 必須通過：

1. `draw_number` 不可重複。
2. `draw_date` 不可重複。
3. 六個正選號碼必須為整數。
4. 所有號碼必須介乎 1–49。
5. 六個正選號碼不得重複。
6. 特別號碼不得與正選號碼重複。
7. 正選號碼在儲存前必須由小至大排序。
8. 日期不可在合理範圍之外。
9. 派彩金額不可為負數。
10. 中獎注數不可為負數。
11. CSV 欄位不足時整批不得直接發布。
12. 同一資料來源重複匯入時以 `source_hash` 檢查。
13. 任一數據修訂必須保存 audit log。
14. 只有 `verified` draw 可在公開頁面顯示。

---

# 8. CSV 格式

## 8.1 必要欄位

```csv
draw_number,draw_date,number_1,number_2,number_3,number_4,number_5,number_6,extra_number
26/001,2026-01-01,1,8,12,25,33,46,49
```

## 8.2 可選欄位

```csv
turnover,first_prize_fund,first_prize_units,first_prize_dividend,source_name,source_url
```

## 8.3 匯入流程

```text
上載 CSV
  ↓
計算檔案 hash
  ↓
解析欄位
  ↓
逐行 schema validation
  ↓
偵測重複 draw
  ↓
顯示錯誤報告
  ↓
管理員人工預覽
  ↓
管理員批准
  ↓
寫入 verified dataset
  ↓
重建統計快取
```

錯誤報告需包含：

- CSV 行號
- draw number
- 欄位名稱
- 錯誤類型
- 原始值
- 建議修正

---

# 9. API 規格

所有 API 使用統一 response：

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};
```

## 9.1 Draw API

### `GET /api/draws`

Query：

```text
page
pageSize
from
to
search
sort
```

Response：

```ts
type DrawSummary = {
  drawNumber: string;
  drawDate: string;
  mainNumbers: number[];
  extraNumber: number;
  firstPrizeDividend: number | null;
};
```

### `GET /api/draws/latest`

返回最新 verified draw。

### `GET /api/draws/:drawNumber`

返回：

- 正選號碼
- 特別號碼
- 派彩
- 該期組合特徵
- 與上一期重複號碼
- 每個號碼當時距離上次出現期數

## 9.2 Analytics API

### `GET /api/analytics/numbers`

Query：

```text
window=all|10|30|50|100|custom
from
to
includeExtra=false
```

返回每個號碼：

```ts
type NumberStatistics = {
  number: number;
  mainCount: number;
  extraCount: number;
  mainRate: number;
  expectedMainCount: number;
  deviationFromExpected: number;
  drawsSinceLastMain: number | null;
  averageGap: number | null;
  maximumGap: number | null;
  latestMainDate: string | null;
};
```

### `GET /api/analytics/patterns`

返回：

- 奇偶比例分布
- 大細比例分布
- 總和 histogram
- 跨度 histogram
- 連號分布
- 上期重複號分布
- 尾數分布
- 區間分布

### `GET /api/analytics/pairs`

Query：

```text
window
minimumCount
```

返回 49 × 49 共現矩陣或 sparse pair list。

## 9.3 Generator API

### `POST /api/generator`

Request：

```ts
type GenerateRequest = {
  method:
    | "uniform_random"
    | "conditional_random"
    | "historical_weighted";

  count: number;
  seed?: string;

  constraints?: {
    requiredNumbers?: number[];
    excludedNumbers?: number[];

    oddCount?: number | null;
    lowCount?: number | null;

    minSum?: number | null;
    maxSum?: number | null;

    allowConsecutive?: boolean;
    maxConsecutivePairs?: number | null;

    maxSameEndingDigit?: number | null;
    maxNumbersFromSameDecade?: number | null;

    excludePreviousDrawNumbers?: boolean;
    minimumDistanceBetweenNumbers?: number | null;
  };

  historicalModel?: {
    trainingWindow: "all" | 30 | 50 | 100 | 200;
    recentFrequencyWeight: number;
    longTermFrequencyWeight: number;
    gapWeight: number;
    pairWeight: number;
    patternBalanceWeight: number;
    randomWeight: number;
  };
};
```

限制：

- `count` MVP 最大 50。
- 權重總和必須為 1。
- 必選號碼與排除號碼不得重疊。
- 必選號碼最多 6 個。
- 無法滿足條件時返回清楚錯誤，而不是無限 loop。

Response：

```ts
type GeneratedCombination = {
  numbers: number[];
  rank: number;
  historicalScore: number | null;
  features: {
    oddCount: number;
    evenCount: number;
    lowCount: number;
    highCount: number;
    sum: number;
    span: number;
    consecutivePairs: number;
    repeatedFromPreviousDraw: number;
  };
  explanation: string[];
};
```

## 9.4 Checker API

### `POST /api/checker`

```ts
type CheckRequest = {
  numbers: number[];
  drawNumber?: string;
  from?: string;
  to?: string;
};
```

如提供 draw number，只核對一個 draw。  
如提供日期範圍，搜尋該組號碼在歷史期數中的命中情況。

## 9.5 Backtest API

### `POST /api/backtests`

只限登入用戶；高成本操作需 rate limit。

### `GET /api/backtests/:id`

返回：

- 狀態
- 進度
- 各期結果
- 命中分布
- 隨機 baseline
- 累積成本
- 模擬回報
- ROI
- 統計警告

---

# 10. 統計定義

## 10.1 出現頻率

對號碼 `n`：

```text
frequency(n) =
號碼 n 作為正選號出現的期數 / 總期數
```

理論正選出現率：

```text
6 / 49 ≈ 12.2449%
```

## 10.2 距離上次出現期數

若最新一期出現，gap = 0。  
若上一期出現，gap = 1。

## 10.3 平均間距

將該號碼所有正選出現位置排序，計算相鄰位置差的平均值。

## 10.4 奇偶

```text
oddCount = 六個正選號碼中的奇數數量
evenCount = 6 - oddCount
```

## 10.5 大細

MVP 定義：

- 小：1–24
- 大：25–49

必須在 methodology 頁清楚說明這只是分析分類。

## 10.6 總和

```text
sum = n1 + n2 + n3 + n4 + n5 + n6
```

## 10.7 跨度

```text
span = max(numbers) - min(numbers)
```

## 10.8 連號對數

排序後，如相鄰兩號差 1，計為一對。

例如：

```text
[3, 4, 5, 18, 25, 40]
```

包含：

- 3–4
- 4–5

所以 `consecutivePairs = 2`。

## 10.9 與上一期重複

目前 draw 的正選號碼與上一期正選號碼的 intersection size。

## 10.10 Pair 共現

對任何 `a < b`：

```text
pairCount(a, b) =
歷史 draw 中同時包含 a 和 b 的期數
```

Pair heatmap 不得暗示因果或未來概率提升。

---

# 11. 組合產生演算法

## 11.1 模式 A：純隨機

使用可靠的隨機來源：

- Server：Node `crypto`
- Seeded reproducibility：使用經審核 seeded PRNG library
- 不得使用 `Math.random()` 作唯一核心來源

偽代碼：

```ts
function generateUniformCombination(rng: SeededRng): number[] {
  const pool = Array.from({ length: 49 }, (_, index) => index + 1);

  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = rng.int(0, i);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, 6).sort((a, b) => a - b);
}
```

要求：

- 同一 seed + 同一版本 + 同一參數必須產生相同結果。
- 同一批不得出現完全重複組合。
- 最多重試次數必須有限制。

## 11.2 模式 B：條件式隨機

流程：

1. 驗證 constraints。
2. 將 required numbers 放入組合。
3. 從可用號碼中隨機補足。
4. 計算 features。
5. 檢查所有條件。
6. 不符合則重試。
7. 超過 `maxAttempts` 返回 `CONSTRAINTS_TOO_STRICT`。

必須先作 feasibility check，例如：

- oddCount = 0，但 requiredNumbers 包含奇數 → 無法滿足。
- minSum 大於理論可達最大值 → 無法滿足。
- requiredNumbers 與 excludedNumbers 重疊 → 無法滿足。
- minimumDistanceBetweenNumbers 過大 → 可能無法選足 6 個。

## 11.3 模式 C：歷史權重

### 原則

這個模式只按歷史資料建立抽樣權重及組合評分，不應標示為真實預測概率。

### 號碼層級特徵

每個號碼計算：

- 近期頻率
- 長期頻率
- 距離上次出現期數
- 平均間距偏差
- Pair compatibility
- 隨機噪音

所有連續值先正規化至 0–1。

### 建議初版權重

```text
近期頻率：0.20
長期頻率：0.10
間距特徵：0.15
Pair 共現：0.15
組合型態平衡：0.20
隨機成分：0.20
```

### 建議 score 定義

```text
historical_score =
100 × clamp(
  recent_component × w1 +
  long_term_component × w2 +
  gap_component × w3 +
  pair_component × w4 +
  pattern_component × w5 +
  random_component × w6,
  0,
  1
)
```

### 防止誤導

UI 標題只能是：

```text
歷史模式評分：76 / 100
```

旁邊 tooltip：

> 此評分只表示組合與所選歷史特徵的吻合程度，不是中獎機率。

## 11.4 Pattern balance

可以根據歷史中常見區域給分，但不得把罕見型態當成「不可能」。

例如使用 empirical percentile：

- 總和落在歷史第 10–90 percentile：較高 pattern score
- 奇偶 2:4、3:3、4:2：較高 pattern score
- 極端型態仍可產生，但分數可能較低

## 11.5 號碼分散及大眾選號風險

可提供一個獨立的「分獎擁擠風險」提示：

- 只選 1–31 可能與生日選號習慣重疊較多
- 整齊圖案、連續號碼、全尾數相同等，可能較多人選

但必須寫清楚：

> 這不會提高中獎機率；它只可能影響多人同中時的分獎情況，而且網站沒有完整投注分布數據，評估只屬啟發式提示。

---

# 12. Rolling Backtest

## 12.1 絕對禁止資料洩漏

預測第 `t` 期時，只可使用第 `1 ... t-1` 期資料。

禁止：

- 使用整份資料計算 normalization 後再回測舊期
- 使用 target draw 結果調參
- 在回測後挑選最好的時間段而不披露
- 只展示表現最好的 seed
- 隱藏失敗模型

## 12.2 Walk-forward 流程

```text
設定 minimum_training_draws
  ↓
取首個 target draw
  ↓
只用 target draw 之前的資料建立特徵
  ↓
產生 N 組模型組合
  ↓
用相同 N 及 seed 規則產生隨機 baseline
  ↓
核對 target draw
  ↓
保存命中結果
  ↓
target draw 向前移一期
  ↓
重複至結束日期
```

## 12.3 核心指標

- 平均正選命中數
- 中 0／1／2／3／4／5／6 個分布
- 中特別號次數
- 各獎項次數
- 每期最佳命中數
- 每期平均命中數
- 累積模擬成本
- 累積模擬派彩
- 模擬 ROI
- 最大回撤
- 最長連續無獎期數
- 與純隨機 baseline 差異
- 多 seed 結果區間

## 12.4 Baseline

至少包括：

1. Uniform random
2. 固定組合 baseline
3. 簡單頻率 baseline
4. 歷史權重模型

## 12.5 多 seed 評估

單一 seed 可能偶然表現特別好。建議每個模型執行：

```text
20–100 個 seeds
```

展示：

- 中位數
- 平均值
- 5th percentile
- 95th percentile

## 12.6 統計結果警告

若模型與隨機差異極小：

> 回測未顯示此模型能穩定優於純隨機基準。觀察到的差異可能來自隨機波動。

## 12.7 派彩模擬

派彩資料不完整時：

- 不可捏造實際 ROI
- 可只展示命中分布
- 或標示「使用固定模擬派彩」
- 模擬與真實派彩必須明確分開

---

# 13. 頁面與 UI 規格

## 13.1 全站導航

Desktop：

```text
Logo
最新結果
歷史結果
號碼分析
組合產生器
模型回測
對獎
我的號碼
方法說明
```

Mobile 使用 bottom navigation：

```text
首頁｜分析｜產生｜對獎｜更多
```

## 13.2 首頁 `/`

### Hero

- 最新一期號碼球
- draw number
- draw date
- 特別號碼
- 「查看詳情」
- 「核對我的號碼」

### KPI cards

- 已收錄期數
- 最近更新時間
- 最近 30 期最常出現號碼
- 最近 30 期最久未出現號碼

### 圖表

- 最近 20 期號碼總和
- 最近 30 期奇偶比例
- 1–49 頻率 mini heatmap

### CTA

- 純隨機產生一組
- 進階條件產生
- 查看回測

### 首頁警告

置於結果下方，不可藏在 footer：

> 歷史結果不代表未來結果；所有六號組合的理論頭獎機率相同。

## 13.3 歷史結果 `/results`

- 日期範圍 filter
- draw number search
- 分頁
- 每行顯示六個正選球及一個特別號
- 派彩資料可摺疊
- CSV export 只匯出網站有權提供的資料
- 清楚標示資料最後核實時間

## 13.4 單期詳情 `/results/[drawNumber]`

顯示：

- 正選號碼
- 特別號碼
- 派彩
- 奇偶
- 大細
- 總和
- 跨度
- 連號
- 與上期重複
- 該期號碼在當時的歷史頻率
- 上一期／下一期導航

## 13.5 號碼分析 `/analytics/numbers`

控制：

- 全部
- 最近 10
- 最近 30
- 最近 50
- 最近 100
- 自訂日期
- 包含／不包含特別號

視圖：

- 49 格 heatmap
- Bar chart
- Sortable table
- 點擊號碼開啟 detail drawer

Number drawer：

- 出現次數
- 出現率
- 理論期望值
- 最近出現日期
- 距離上次出現
- 平均 gap
- 最大 gap
- 歷史 timeline

## 13.6 型態分析 `/analytics/patterns`

Tabs：

- 奇偶
- 大細
- 總和
- 跨度
- 連號
- 上期重複
- 尾數
- 區間

每張圖必須有：

- 樣本期數
- 日期範圍
- 定義 tooltip
- 不代表未來結果提示

## 13.7 Pair 分析 `/analytics/pairs`

- 49 × 49 heatmap
- Hover 顯示 pair count
- 點擊 pair 顯示共同出現期數
- 可選最近 30／50／100／全部
- 不顯示對角線
- 支援 top 20 pairs table

## 13.8 組合產生器 `/generator`

### Step 1：模式

- 純隨機
- 條件式隨機
- 歷史權重

### Step 2：條件

- 產生數量
- 必選號碼
- 排除號碼
- 奇偶比例
- 大細比例
- 總和範圍
- 容許連號
- 最大連號對
- 是否排除上一期號碼
- 同尾數限制
- 區間集中限制

### Step 3：結果

每組顯示：

- 六個號碼球
- 模式
- 歷史模式評分
- 奇偶
- 大細
- 總和
- 跨度
- 連號
- 解釋
- 儲存
- 複製

### 結果卡示例

```text
08  14  21  27  36  44

歷史模式評分：76 / 100
奇偶：3 / 3
大小：3 / 3
總和：150
跨度：36
連號：0
模型版本：historical-v1
```

## 13.9 回測 `/backtest`

### 設定面板

- 模型
- 日期範圍
- 最少訓練期數
- 每期產生組合數
- seeds 數量
- 模型參數

### 結果

- 模型 vs 隨機平均命中
- 命中分布 bar chart
- 累積成本與回報
- ROI
- 各 seed box／range chart
- 每期明細 table
- 方法說明
- 結論卡

結論不得自動誇大。依結果使用：

- 「未見穩定優勢」
- 「部分期間高於 baseline，但未證明可延續」
- 「結果對 seed 敏感」
- 「樣本不足」

## 13.10 對獎 `/checker`

輸入方法：

- 點擊 1–49 number pad
- 文字貼上
- 從我的號碼選擇

支援：

- 核對最新一期
- 選擇指定一期
- 搜尋歷史全部期數

結果：

- 命中正選數
- 是否命中特別號
- 對應獎項
- Highlight matched balls
- 如無派彩資料，顯示獎項但不估計金額

## 13.11 我的號碼 `/saved`

- 登入後使用
- label
- favourite
- 產生方法
- 建立日期
- 快速對獎
- 刪除
- 批量核對
- Export JSON／CSV

## 13.12 方法說明 `/methodology`

必須包括：

- 49 選 6 組合數
- 各獎項概率計算
- 冷熱號定義
- gap 定義
- pair 定義
- 模型評分定義
- 回測方法
- 資料限制
- 為何歷史模式不是未來概率
- 模型版本紀錄

## 13.13 負責任使用 `/responsible-use`

顯示：

- 只限 18 歲或以上
- 量力而為
- 不借貸投注
- 不追損
- 設定娛樂預算
- 本站不提供投注服務
- 香港平和基金戒賭輔導熱線資料
- 官方負責任博彩資訊連結

---

# 14. 視覺設計系統

## 14.1 整體方向

採用「金融數據 dashboard + 現代彩票球」風格：

- 乾淨
- 專業
- 數據優先
- 不使用廉價博彩閃爍效果
- 不使用誇張金幣、鈔票、Jackpot 爆炸動畫
- 動畫短而節制
- 支援深色及淺色模式

## 14.2 色彩

建議建立自有色系，不直接模仿官方品牌：

```text
Background dark: #0B1020
Surface dark:    #141B2D
Primary:         #6D7CFF
Positive:        #30C48D
Warning:         #F4B740
Danger:          #EF6262
Text primary:    #F4F7FB
Text muted:      #9BA7BD
```

號碼球顏色只作分組視覺，不代表機率。

## 14.3 字體

- 中文：Noto Sans TC
- 數字：Inter 或 Geist
- 號碼球使用 tabular numerals

## 14.4 Accessibility

- 符合 WCAG AA 對比
- 所有圖表有 table alternative
- 不只靠顏色傳達資訊
- number ball 有 `aria-label`
- keyboard 可操作
- focus state 清楚
- 支援 reduced motion
- Touch target 最少 44 × 44 px

---

# 15. Responsive 規格

## Mobile

- 360 px 起
- number grid 每行 7 個
- 圖表可水平 scroll 或轉換成簡化圖
- Filter 放 bottom sheet
- 結果卡垂直排列
- Bottom navigation 固定但不得遮擋內容

## Tablet

- 兩欄 dashboard
- 分析控制與圖表可左右排列

## Desktop

- 最大內容寬度 1440 px
- Sidebar／top navigation
- Dashboard 12-column grid
- 大型 heatmap 保持正方形

---

# 16. Auth 與權限

## 16.1 角色

```text
guest
user
analyst
admin
```

### Guest

- 查看公開結果
- 查看分析
- 產生有限次組合
- 單次對獎

### User

- 儲存組合
- 查看歷史產生紀錄
- 執行有限回測
- 匯出私人資料

### Analyst

- 建立模型版本
- 執行較大型回測
- 查看模型診斷

### Admin

- 匯入 CSV
- 審核資料
- 發布／修訂 draw
- 管理模型狀態
- 查看 audit log

## 16.2 RLS

`saved_combinations`：

```sql
user_id = auth.uid()
```

`data_imports`、`audit_logs`：

- 只限 admin／analyst 按需要查看
- 不可讓普通用戶讀取

公開 `draws`：

- 只可讀 `status = 'verified'`
- 管理員寫入使用 server-side service role
- service role key 不得送到 client

---

# 17. Security

1. Zod 驗證所有 request。
2. Rate limit generator、checker、backtest。
3. 管理員路由做 server-side role check。
4. CSV 上載限制 MIME、大小及副檔名。
5. 防 CSV formula injection；export 時處理 `=`, `+`, `-`, `@` 開頭值。
6. 不 render 未清理 HTML。
7. 使用 Content Security Policy。
8. 設定 secure headers。
9. 使用 parameterized queries。
10. Service role key 只在 server。
11. 保存 audit log。
12. 錯誤回應不得洩露 stack trace。
13. Sentry 不得上傳敏感私人資料。
14. 對高成本 backtest 設 queue、timeout 及最大範圍。
15. 防止 generator 以極端條件造成無限計算。
16. 不保存用戶投注金額，MVP 只保存組合。
17. 不建立引導用戶增加投注的 notification。

---

# 18. Performance

目標：

- 首頁 LCP < 2.5 秒
- API p95 < 500 ms，重型回測除外
- 49-number heatmap 初次 render < 300 ms
- 統計查詢使用 index／materialized views
- 首頁使用 server rendering
- 大型圖表 lazy load
- 不把完整歷史資料全部送到 client
- Pair matrix 可使用壓縮 sparse format
- 回測分頁載入明細

建議 index：

```sql
create index draws_verified_date_idx
on public.draws (draw_date desc)
where status = 'verified';

create index backtest_predictions_run_idx
on public.backtest_predictions (backtest_run_id);

create index saved_combinations_user_idx
on public.saved_combinations (user_id, created_at desc);
```

---

# 19. SEO 與 Metadata

頁面 metadata：

- 最新六合彩結果分析
- 六合彩歷史號碼統計
- 六合彩組合產生器
- 六合彩概率與回測

禁止 metadata：

- 必中
- 包中
- 高勝率
- 穩賺
- 內幕

加入：

- Open Graph
- Canonical URL
- Sitemap
- robots.txt
- Structured data 只使用合適的 WebApplication／Dataset schema
- 不使用容易被誤解為官方網站的名稱

---

# 20. Legal、資料來源及負責任使用

## 20.1 網站聲明

全站 footer：

> 本網站為獨立的數據分析及娛樂工具，與香港賽馬會並無關聯，亦不獲其認可或贊助。本網站不接受投注、不代購彩票，亦不提供任何保證回報。歷史數據及模型結果不代表未來結果。所有六號組合的理論頭獎機率相同。

## 20.2 年齡提示

> 只限 18 歲或以上人士使用。請量力而為。

## 20.3 資料來源政策

建立 `docs/data-source-policy.md`：

1. 記錄資料來源。
2. 記錄取得日期。
3. 記錄使用條款及授權狀態。
4. 不複製 Logo、圖片及網站版面。
5. 不假設網頁可被自由大量擷取。
6. 未有授權時優先使用：
   - 手動 CSV
   - 公開授權 dataset
   - 用戶合法擁有的資料
   - 獲授權 API
7. 資料只作事實性統計時仍需評估版權、資料庫權利及網站條款。
8. 正式商業發布前尋求香港法律意見。

## 20.4 官方參考

在 `methodology` 或 `responsible-use` 頁放置外部參考連結：

- 香港賽馬會六合彩玩法及獎項資格
- 香港賽馬會負責任博彩政策
- 香港政府博彩政策
- 平和基金／相關輔導資訊

連結需在發布前由管理員核實。

---

# 21. Analytics 事件

只記錄產品使用，不記錄敏感投注內容。

建議事件：

```text
view_latest_draw
change_analysis_window
open_number_detail
generate_combinations
save_combination
run_checker
start_backtest
complete_backtest
view_methodology
view_responsible_use
```

不得記錄：

- 完整私人號碼至第三方 analytics
- 投注戶口資料
- 身份證明資料
- 信用卡
- 財務損失資料

---

# 22. Testing

## 22.1 Unit tests

### Probability

- `combination(49, 6) === 13983816`
- 各獎項有利組合數正確
- probability sum 不超過 1

### Draw validation

- 正常六個號碼通過
- 重複號碼失敗
- 特別號與正選重複失敗
- 0、50、decimal、string 失敗
- 儲存前排序

### Feature calculation

測試：

```text
[3, 4, 5, 18, 25, 40]
```

期望：

- oddCount = 3
- evenCount = 3
- lowCount = 4
- highCount = 2
- sum = 95
- span = 37
- consecutivePairs = 2

### Generator

- 產生 6 個 unique 整數
- 全部在 1–49
- required numbers 一定存在
- excluded numbers 一定不存在
- 同 seed 可重現
- 條件不可能時快速失敗
- 批次內無重複組合

### Checker

- 6 main → 頭獎
- 5 main + extra → 二獎
- 5 main → 三獎
- 4 main + extra → 四獎
- 4 main → 五獎
- 3 main + extra → 六獎
- 3 main → 七獎
- 其他 → 無獎

### Backtest

- target draw 不出現在 training data
- normalization 只用 training window
- baseline 使用相同組合數
- 同 seed 可重現
- 空資料及不足訓練期數有清楚錯誤

## 22.2 Integration tests

- CSV upload → validate → approve → public result
- generator API → save combination
- checker API → correct prize division
- backtest job → completed summary
- RLS 阻止讀取其他用戶 saved combinations

## 22.3 E2E

1. Guest 查看最新結果。
2. Guest 切換最近 30 期分析。
3. Guest 產生 5 組純隨機號碼。
4. User 登入及儲存一組。
5. User 對最新一期。
6. Admin 匯入 CSV。
7. Admin 看見錯誤行。
8. Admin 核准有效資料。
9. 新 draw 出現在首頁。
10. Mobile bottom navigation 不遮擋操作。

---

# 23. Error Handling

標準錯誤碼：

```text
VALIDATION_ERROR
DRAW_NOT_FOUND
DUPLICATE_DRAW
INVALID_NUMBER_SET
CONSTRAINTS_TOO_STRICT
GENERATION_LIMIT_EXCEEDED
BACKTEST_RANGE_TOO_LARGE
INSUFFICIENT_TRAINING_DATA
IMPORT_VALIDATION_FAILED
UNAUTHORIZED
FORBIDDEN
RATE_LIMITED
INTERNAL_ERROR
```

用戶錯誤訊息應使用自然語言，例如：

> 目前條件無法產生足夠組合。請減少必選號碼、放寬總和範圍，或增加容許的奇偶比例。

不可只顯示：

```text
Error 500
```

---

# 24. Environment Variables

`.env.example`：

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SENTRY_DSN=
NEXT_PUBLIC_ANALYTICS_DOMAIN=

CRON_SECRET=
BACKTEST_JOB_SECRET=

APP_DEFAULT_LOCALE=zh-HK
APP_ENABLE_DEMO_DATA=false
APP_MAX_GENERATION_COUNT=50
APP_MAX_BACKTEST_DRAWS=500
```

---

# 25. README 必須包括

1. 產品介紹
2. 免責聲明
3. 功能
4. 技術棧
5. 本機安裝
6. 環境變數
7. Supabase migration
8. Seed demo data
9. 執行測試
10. 部署
11. CSV 格式
12. 模型方法
13. 資料來源政策
14. 負責任使用
15. License
16. 已知限制

---

# 26. 分階段開發計劃

## Phase 0：初始化

任務：

- 建立 Next.js + TypeScript
- Tailwind
- shadcn/ui
- ESLint
- Prettier
- Vitest
- Playwright
- Supabase client
- 基本 i18n
- README
- `.env.example`

驗收：

- `npm run dev` 正常
- `npm run lint` 通過
- `npm run typecheck` 通過
- `npm run test` 通過

## Phase 1：資料層

任務：

- 建立 migrations
- Draw schema
- Prize schema
- CSV parser
- Validation report
- Admin import UI
- Review workflow
- Audit log

驗收：

- 可匯入 sample CSV
- 錯誤行可準確指出
- 未核實資料不公開
- 重複匯入被攔截

## Phase 2：結果頁

任務：

- 最新結果
- 歷史列表
- 單期詳情
- Pagination
- Filters
- Loading／empty／error states

驗收：

- 手機及桌面正常
- URL query 可分享
- 所有結果只來自 verified draw

## Phase 3：統計分析

任務：

- Number stats
- Pattern stats
- Pair matrix
- Charts
- Methodology tooltips
- 快取

驗收：

- 與測試 fixture 手動計算一致
- Window filter 正確
- 圖表有 accessible table

## Phase 4：組合產生器

任務：

- Uniform random
- Conditional random
- Historical weighted v1
- Seed
- Explanation
- Save combination

驗收：

- 1000 次 unit test 無 invalid set
- 不可能條件快速返回
- 歷史分數不稱為概率

## Phase 5：對獎

任務：

- Number pad
- Latest draw check
- Draw selection
- Historical search
- Prize classification

驗收：

- 七個獎項測試全部正確
- Match highlight 正確

## Phase 6：回測

任務：

- Walk-forward engine
- Random baseline
- Multi-seed
- Results dashboard
- Export report

驗收：

- 無資料洩漏
- 同 seed 可重現
- 顯示樣本量及限制
- 模型沒有優勢時誠實顯示

## Phase 7：安全及發布

任務：

- RLS
- Rate limit
- Security headers
- Sentry
- Analytics
- Responsible use
- SEO
- Accessibility review
- Production deployment

驗收：

- 無 service role key 洩漏
- Lighthouse accessibility 達標
- Admin route 未授權不可進入
- Footer 聲明全站可見

---

# 27. Codex 每階段工作方式

Codex 每次只處理一個 Phase，避免一次產生過多未測試代碼。

每次開始前：

1. 閱讀 `README.md`
2. 閱讀本規格
3. 檢查現有 folder
4. 檢查 migration
5. 執行現有測試
6. 列出本次會修改的檔案

每次完成後：

1. 執行 lint
2. 執行 typecheck
3. 執行 unit tests
4. 執行相關 E2E
5. 更新 README
6. 更新 CHANGELOG
7. 列出已完成項目
8. 列出未完成或風險
9. 不得聲稱測試通過，除非真的執行過

---

# 28. 第一個可直接交給 Codex 的 Prompt

```text
請在目前 workspace 建立「六合彩數據研究所 Mark Six Data Lab」MVP。

先只執行 Phase 0，不要開始其他 Phase。

要求：
1. 使用 Next.js App Router、React、TypeScript strict mode、Tailwind CSS。
2. 加入 shadcn/ui 基本設定。
3. 加入 Supabase browser/server client 架構，但不要寫入真實密鑰。
4. 加入 Vitest、Testing Library 及 Playwright。
5. 建立繁體中文為預設的 i18n 架構，預留英文。
6. 建立基本 routes、layout、navigation、footer 及 responsive mobile bottom navigation。
7. Footer 必須包含獨立網站、非官方、不接受投注、歷史結果不代表未來及 18+ 聲明。
8. 建立首頁 UI skeleton，使用明確標示的 demo data。
9. 建立 .env.example、README.md、CHANGELOG.md。
10. 不得建立博彩付款、投注連結或「必中」宣傳。
11. 完成後執行 lint、typecheck、unit tests 及 Playwright smoke test。
12. 回覆時列出：
   - 新增／修改檔案
   - 架構決定
   - 實際執行的指令
   - 測試結果
   - 下一個 Phase 建議
```

---

# 29. Phase 1 Codex Prompt

```text
請根據 MARK_SIX_WEBAPP_SPEC.md 執行 Phase 1：資料層。

只完成以下工作：
- Supabase SQL migrations
- draws、draw_prizes、data_imports、audit_logs
- RLS policies
- CSV parser
- Zod validation
- CSV validation report
- Admin import preview
- Approve／reject workflow
- Demo CSV fixture
- Unit及integration tests

重要：
- 只有 verified draw 可公開讀取。
- 六個正選號碼必須 unique、1–49、排序。
- 特別號不得與正選重複。
- 不建立自動爬蟲。
- 所有 admin action 保存 audit log。
- 完成後執行 migration test、lint、typecheck、tests，並更新 README 和 CHANGELOG。
```

---

# 30. Phase 3 統計 Codex Prompt

```text
請根據規格執行統計分析 Phase。

建立純函數，最少包括：
- calculateNumberFrequency
- calculateDrawsSinceLastSeen
- calculateAverageGap
- calculatePatternFeatures
- calculatePairCounts
- calculateExpectedFrequency
- calculateDeviationFromExpected

要求：
- 正選號及特別號分開。
- 支援 all、10、30、50、100及自訂日期。
- 所有函數要有 fixtures 和 unit tests。
- 不在 UI 使用「下期出現機率」。
- Chart 必須有 accessible table fallback。
- 加入 methodology tooltip。
```

---

# 31. Phase 4 Generator Codex Prompt

```text
請建立三種組合產生模式：

1. uniform_random
2. conditional_random
3. historical_weighted

要求：
- 使用 seeded RNG，保存 seed。
- 同一 seed、版本及參數可重現。
- 每組必須為 1–49 中六個不同整數。
- 支援 required、excluded、oddCount、lowCount、sum range、consecutive、same ending digit、previous draw exclusion。
- 在生成前進行 feasibility validation。
- 設 maxAttempts，禁止無限 loop。
- historical_score 只能叫「歷史模式評分」，不是中獎率。
- 每組返回 feature explanation。
- 建立 property-based 或大量隨機 unit tests。
```

---

# 32. Phase 6 Backtest Codex Prompt

```text
請建立嚴格 walk-forward rolling backtest。

核心規則：
- 預測 target draw 時，只能使用 target draw 以前的資料。
- 所有 normalization 只能用當時 training window。
- 每期模型與 uniform random 使用相同組合數。
- 支援 multi-seed。
- 保存 model version、seed、parameters、training end date。
- 顯示 hit distribution、average hits、baseline comparison、cost、return、ROI。
- 派彩不足時不得捏造實際 ROI。
- 建立明確 data leakage tests。
- 結論文字必須保守；沒有穩定優勢時顯示「未見穩定優勢」。
```

---

# 33. Definition of Done

整個 MVP 完成需符合：

- [ ] 功能與本文件一致
- [ ] 無真實投注功能
- [ ] 無誤導式概率
- [ ] 歷史分數與理論概率分開
- [ ] 最新結果及歷史結果可用
- [ ] 統計 window 正確
- [ ] 三種 generator 可用
- [ ] 對獎七個獎項正確
- [ ] Rolling backtest 無 leakage
- [ ] Random baseline 可比較
- [ ] CSV 有人工審核流程
- [ ] RLS 正確
- [ ] Admin route 受保護
- [ ] Mobile usable
- [ ] Accessibility 基本達標
- [ ] Lint 通過
- [ ] Typecheck 通過
- [ ] Unit tests 通過
- [ ] Integration tests 通過
- [ ] E2E smoke tests 通過
- [ ] README 完整
- [ ] Methodology 完整
- [ ] Responsible use 頁完整
- [ ] 全站免責及 18+ 提示存在
- [ ] Production secrets 無提交到 Git

---

# 34. 後續版本建議

## Version 1.1

- PWA
- 離線查看已下載結果
- 自訂 dashboard
- 組合批量比較
- 更多圖表
- 模型卡下載
- Backtest CSV export

## Version 1.2

- Python analytics service
- Bootstrap confidence intervals
- Monte Carlo model comparison
- Chi-square／runs test 教學頁
- 參數 sensitivity analysis
- Model registry

## Version 2.0

- 個人研究 notebook
- 自訂策略 DSL
- Strategy marketplace 只分享分析設定，不涉及投注交易
- 公開可重現 backtest
- Dataset versioning
- 完整英文版

---

# 35. 最後提醒

這個產品最有價值的地方，不是聲稱能破解隨機攪珠，而是：

- 把歷史資料整理得清楚
- 把概率解釋得透明
- 讓用戶建立及比較不同選號方法
- 用嚴謹回測揭示模型是否真的比隨機更好
- 讓所有結果可重現及接受檢查
- 在娛樂功能與負責任使用之間保持清晰界線

產品成功標準不是「預測中幾多次」，而是：

> 用戶能清楚理解資料、概率、模型限制及隨機性的本質，同時享受一個高質素、透明及好用的數據分析工具。
