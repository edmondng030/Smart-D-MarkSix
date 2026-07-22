import { NumberBall } from "@/components/draw/number-ball";
import type { DrawSummary } from "@/features/draws/types";

const money = new Intl.NumberFormat("zh-HK", { style: "currency", currency: "HKD", maximumFractionDigits: 0 });
export function formatDrawDate(date: string, locale = "zh-HK") { return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Hong_Kong" }).format(new Date(`${date}T00:00:00+08:00`)); }

export function DrawCard({ draw, locale = "zh-HK" }: { draw: DrawSummary; locale?: string }) {
  return <article className="rounded-2xl border border-white/10 bg-[#141b2d]/80 p-5 shadow-lg shadow-black/10">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-indigo-300">期數</p><h2 className="mt-1 text-xl font-bold">{draw.drawNumber}</h2></div><time dateTime={draw.drawDate} className="text-sm text-slate-400">{formatDrawDate(draw.drawDate, locale)}</time></div>
    <div className="mt-5 flex flex-wrap items-center gap-2">{draw.mainNumbers.map((number) => <NumberBall key={number} number={number}/>)}<span aria-hidden className="mx-1 text-slate-500">+</span><NumberBall number={draw.extraNumber} extra/></div>
    <dl className="mt-5 grid gap-3 border-t border-white/8 pt-4 text-sm sm:grid-cols-3"><div><dt className="text-slate-500">投注額</dt><dd className="mt-1 font-semibold">{draw.turnover == null ? "—" : money.format(draw.turnover)}</dd></div><div><dt className="text-slate-500">頭獎基金</dt><dd className="mt-1 font-semibold">{draw.firstPrizeFund == null ? "—" : money.format(draw.firstPrizeFund)}</dd></div><div><dt className="text-slate-500">頭獎派彩</dt><dd className="mt-1 font-semibold">{draw.firstPrizeDividend == null ? "—" : money.format(draw.firstPrizeDividend)}</dd></div></dl>
  </article>;
}
