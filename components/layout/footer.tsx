import Link from "next/link";

export function Footer() {
  return <footer className="border-t border-white/8 bg-[#080c18] px-5 pb-24 pt-10 lg:pb-10">
    <div className="mx-auto grid max-w-360 gap-7 text-sm text-slate-400 md:grid-cols-[1fr_auto]">
      <div><p className="mb-2 font-semibold text-slate-200">獨立、透明、負責任</p><p className="max-w-3xl leading-7">本網站為獨立的數據分析及娛樂工具，與香港賽馬會並無關聯，亦不獲其認可或贊助。本網站不接受投注、不代購彩票，亦不提供任何保證回報。歷史數據及模型結果不代表未來結果。所有六號組合的理論頭獎機率相同。</p><p className="mt-3 font-medium text-amber-300">只限 18 歲或以上人士使用。請量力而為。</p></div>
      <div className="flex gap-5 md:flex-col md:items-end"><Link href="/zh-HK/methodology" className="hover:text-white">方法說明</Link><Link href="/zh-HK/responsible-use" className="hover:text-white">負責任使用</Link></div>
    </div>
  </footer>;
}
