import { WandSparkles } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
export default function Page() { return <PageShell icon={WandSparkles} eyebrow="Generator" title="組合實驗" description="建立可重現的隨機與條件式組合；歷史模式評分不是中獎率。"><Notice /></PageShell>; }
function Notice() { return <div className="mt-10 rounded-2xl border border-amber-300/15 bg-amber-300/[.05] p-6 text-sm leading-7 text-amber-100/80">所有六個號碼組合在公平及獨立攪珠下，中頭獎的理論機率相同。此功能將於 Generator Phase 建立。</div>; }
