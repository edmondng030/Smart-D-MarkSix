import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function PageShell({ icon: Icon, eyebrow, title, description, children }: { icon: LucideIcon; eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return <div className="mx-auto max-w-360 px-5 py-12 lg:px-8"><div className="max-w-3xl"><span className="mb-5 grid size-12 place-items-center rounded-2xl bg-indigo-500/12 text-indigo-300"><Icon className="size-6" /></span><p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-300">{eyebrow}</p><h1 className="mt-3 text-3xl font-bold sm:text-5xl">{title}</h1><p className="mt-5 text-lg leading-8 text-slate-400">{description}</p></div>{children ?? <div className="mt-10 rounded-2xl border border-dashed border-white/15 bg-white/[.025] p-8"><p className="font-semibold">Phase 0 頁面骨架已就緒</p><p className="mt-2 text-sm leading-7 text-slate-400">資料功能會在相應開發階段接入。現階段不會展示未經核實的真實數據。</p><Link href="/zh-HK" className="mt-5 inline-block text-sm font-semibold text-indigo-300">返回總覽 →</Link></div>}</div>;
}
