import { Dices } from "lucide-react";
import { GeneratorWorkbench } from "@/components/generator/generator-workbench";
import { PageShell } from "@/components/layout/page-shell";
export default function Page(){return <PageShell icon={Dices} eyebrow="Seeded generator · Phase 4" title="可重現組合產生器" description="使用固定 seed、透明限制及 verified 歷史資料產生組合。每個有效的六號組合在正式開獎中的理論機率仍然相同。"><GeneratorWorkbench/></PageShell>;}