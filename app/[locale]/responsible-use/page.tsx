import { HeartHandshake } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
export default function Page() { return <PageShell icon={HeartHandshake} eyebrow="Responsible use" title="負責任使用" description="本工具不接受投注或代購彩票。只限 18 歲或以上人士使用。"><ul className="mt-10 grid gap-3 text-slate-300 sm:grid-cols-2">{["量力而為並設定娛樂預算", "切勿借貸投注", "不要追討損失", "需要時尋求專業支援"].map((item) => <li key={item} className="rounded-xl border border-white/8 bg-white/[.03] p-5">{item}</li>)}</ul></PageShell>; }
