import { BookOpen } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
export default function Page() { return <PageShell icon={BookOpen} eyebrow="Methodology" title="方法與概率" description="透明交代組合數、統計定義、模型限制與可重現方法。"><div className="mt-10 grid gap-4 md:grid-cols-2"><Card title="總組合數" value="C(49, 6) = 13,983,816"/><Card title="單注頭獎理論機率" value="1 / 13,983,816"/></div></PageShell>; }
function Card({ title, value }: { title: string; value: string }) { return <div className="rounded-2xl border border-white/8 bg-white/[.035] p-6"><p className="text-sm text-slate-400">{title}</p><p className="mt-3 font-mono text-xl font-bold tabular-nums">{value}</p></div>; }
