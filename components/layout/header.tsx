import { CircleDot, Menu } from "lucide-react";
import Link from "next/link";
import { navItems } from "./nav-items";

export function Header() {
  return <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0b1020]/85 backdrop-blur-xl">
    <div className="mx-auto flex h-18 max-w-360 items-center justify-between px-5 lg:px-8">
      <Link href="/zh-HK" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
        <span className="grid size-9 place-items-center rounded-xl bg-indigo-500 shadow-lg shadow-indigo-500/20"><CircleDot className="size-5" /></span>
        <span><span className="block text-sm font-bold tracking-wide">六合彩數據研究所</span><span className="block text-[10px] uppercase tracking-[.2em] text-slate-500">Mark Six Data Lab</span></span>
      </Link>
      <nav aria-label="主要導覽" className="hidden items-center gap-1 lg:flex">
        {navItems.map(({ href, label }) => <Link key={href} href={href} className="rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white">{label}</Link>)}
      </nav>
      <div className="flex items-center gap-2"><Link href="/zh-HK/login" className="hidden min-h-11 items-center rounded-xl border border-white/10 px-3 text-sm font-semibold text-slate-300 hover:bg-white/5 sm:inline-flex">管理員登入</Link><span className="hidden rounded-full border border-amber-400/25 bg-amber-400/8 px-3 py-1.5 text-xs text-amber-300 md:block">獨立研究工具 · 18+</span><button aria-label="開啟選單" className="grid size-11 place-items-center rounded-xl border border-white/10 lg:hidden"><Menu className="size-5" /></button></div>
    </div>
  </header>;
}
