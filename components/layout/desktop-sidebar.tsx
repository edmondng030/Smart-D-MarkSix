import { CircleDot, LogIn, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { navItems } from "./nav-items";

export function DesktopSidebar() {
  return <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-white/8 bg-[#0a0f1c] xl:flex xl:flex-col">
    <Link href="/zh-HK" className="flex h-20 items-center gap-3 border-b border-white/8 px-6">
      <span className="grid size-10 place-items-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20"><CircleDot className="size-5"/></span>
      <span><strong className="block text-sm tracking-wide">六合彩數據實驗室</strong><span className="text-[10px] uppercase tracking-[.18em] text-slate-500">Mark Six Data Lab</span></span>
    </Link>
    <nav aria-label="桌面版主要導覽" className="flex-1 space-y-1 p-4">
      {navItems.map(({href,label,icon:Icon})=><Link key={href} href={href} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-slate-400 transition hover:bg-indigo-500/10 hover:text-white"><Icon className="size-5 text-indigo-300"/>{label}</Link>)}
      <Link href="/zh-HK/checker" className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-slate-400 transition hover:bg-emerald-500/10 hover:text-white"><ShieldCheck className="size-5 text-emerald-300"/>對獎工具</Link>
    </nav>
    <div className="border-t border-white/8 p-4"><Link href="/zh-HK/login" className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-300 hover:bg-white/5"><LogIn className="size-5"/>管理員登入</Link><p className="mt-4 text-xs leading-5 text-slate-600">只供數據研究及教育用途 · 只限 18+</p></div>
  </aside>;
}