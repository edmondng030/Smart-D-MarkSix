import { FlaskConical } from "lucide-react";
import { BacktestWorkbench } from "@/components/backtest/backtest-workbench";
import { PageShell } from "@/components/layout/page-shell";
export default function Page(){return <PageShell icon={FlaskConical} eyebrow="Walk-forward · Phase 6" title="策略回測實驗室" description="每個 target 只使用之前的 verified draws 訓練，並與相同 targets、組數及 multi-seed 設定的 uniform random baseline 比較。"><BacktestWorkbench/></PageShell>;}