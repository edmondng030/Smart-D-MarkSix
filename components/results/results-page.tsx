import { CalendarSearch, ChevronLeft, ChevronRight, SearchCheck } from "lucide-react";
import Link from "next/link";
import { DrawCard } from "@/components/draw/draw-card";
import type { DrawSummary } from "@/features/draws/types";

type Filters = { search?: string; from?: string; to?: string; sort?: "date_desc" | "date_asc"; pageSize?: number };
export function ResultsPage({ draws, total, page, totalPages, locale, filters }: { draws: DrawSummary[]; total: number; page: number; totalPages: number; locale: string; filters: Filters }) {
  const base = `/${locale}/results`;
  function pageHref(target: number) { const params = new URLSearchParams(); if (filters.search) params.set("search", filters.search); if (filters.from) params.set("from", filters.from); if (filters.to) params.set("to", filters.to); if (filters.sort) params.set("sort", filters.sort); if (filters.pageSize) params.set("pageSize", String(filters.pageSize)); params.set("page", String(target)); return `${base}?${params}`; }
  return <div className="mx-auto max-w-360 px-5 py-12 lg:px-8">
    <header className="max-w-3xl"><span className="mb-5 grid size-12 place-items-center rounded-2xl bg-indigo-500/12 text-indigo-300"><SearchCheck className="size-6"/></span><p className="text-xs font-bold uppercase tracking-[.2em] text-indigo-300">Draw archive</p><h1 className="mt-3 text-3xl font-bold sm:text-5xl">歷史開獎結果</h1><p className="mt-5 text-lg leading-8 text-slate-400">瀏覽 Supabase 中已核實的真實開獎資料。新同步批次經管理員批准後會自動顯示。</p></header>
    <form className="mt-9 grid gap-4 rounded-2xl border border-white/10 bg-white/[.035] p-5 md:grid-cols-2 xl:grid-cols-6" action={base} method="get">
      <label className="xl:col-span-2"><span className="mb-2 block text-sm text-slate-400">搜尋期數</span><input name="search" defaultValue={filters.search} placeholder="例如 202677N" className="min-h-11 w-full rounded-xl border border-white/12 bg-slate-950/40 px-3 outline-none focus:border-indigo-400"/></label>
      <label><span className="mb-2 block text-sm text-slate-400">由</span><input type="date" name="from" defaultValue={filters.from} className="min-h-11 w-full rounded-xl border border-white/12 bg-slate-950/40 px-3 outline-none focus:border-indigo-400"/></label>
      <label><span className="mb-2 block text-sm text-slate-400">至</span><input type="date" name="to" defaultValue={filters.to} className="min-h-11 w-full rounded-xl border border-white/12 bg-slate-950/40 px-3 outline-none focus:border-indigo-400"/></label>
      <label><span className="mb-2 block text-sm text-slate-400">排序</span><select name="sort" defaultValue={filters.sort ?? "date_desc"} className="min-h-11 w-full rounded-xl border border-white/12 bg-slate-950/80 px-3"><option value="date_desc">最新優先</option><option value="date_asc">最早優先</option></select></label>
      <div className="flex items-end"><button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 font-semibold hover:bg-indigo-400"><CalendarSearch className="size-4"/>套用篩選</button></div>
      <input type="hidden" name="pageSize" value={filters.pageSize ?? 20}/>
    </form>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 text-sm"><p className="text-slate-400">找到 <strong className="text-white">{total.toLocaleString("zh-HK")}</strong> 期已核實結果</p>{(filters.search || filters.from || filters.to) && <Link href={base} className="font-semibold text-indigo-300">清除篩選</Link>}</div>
    {draws.length ? <section aria-label="開獎結果" className="mt-5 grid gap-5 xl:grid-cols-2">{draws.map((draw) => <DrawCard key={draw.drawNumber} draw={draw} locale={locale}/>)}</section> : <section className="mt-5 rounded-2xl border border-dashed border-white/15 p-10 text-center"><SearchCheck className="mx-auto size-8 text-slate-500"/><h2 className="mt-4 font-bold">找不到符合條件的結果</h2><p className="mt-2 text-sm text-slate-400">請清除搜尋或調整日期範圍。</p></section>}
    {totalPages > 1 && <nav aria-label="結果分頁" className="mt-8 flex items-center justify-center gap-4"><Link aria-disabled={page <= 1} href={page <= 1 ? pageHref(1) : pageHref(page-1)} className={`flex min-h-11 items-center gap-1 rounded-xl border border-white/12 px-4 font-semibold ${page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-white/5"}`}><ChevronLeft className="size-4"/>上一頁</Link><span className="text-sm text-slate-400">第 <strong className="text-white">{page}</strong> / {totalPages} 頁</span><Link aria-disabled={page >= totalPages} href={page >= totalPages ? pageHref(totalPages) : pageHref(page+1)} className={`flex min-h-11 items-center gap-1 rounded-xl border border-white/12 px-4 font-semibold ${page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-white/5"}`}>下一頁<ChevronRight className="size-4"/></Link></nav>}
  </div>;
}
