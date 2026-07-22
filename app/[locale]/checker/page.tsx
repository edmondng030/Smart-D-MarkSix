import { SearchCheck } from "lucide-react";
import { CheckerWorkbench } from "@/components/checker/checker-workbench";
import { PageShell } from "@/components/layout/page-shell";
import { listVerifiedDraws } from "@/lib/draws/repository";
export const revalidate=300;
export default async function Page({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<{numbers?:string}>}){const[{locale},query]=await Promise.all([params,searchParams]),initialNumbers=(query.numbers??"").split(",").map(Number).filter(number=>Number.isInteger(number)&&number>=1&&number<=49),{draws}=await listVerifiedDraws({page:1,pageSize:100,sort:"date_desc"});return <PageShell icon={SearchCheck} eyebrow="Prize checker · Phase 5" title="開獎結果核對" description="選擇六個號碼並與 verified 開獎結果比較。獎項只按命中規則分類，派彩以資料來源及官方結果為準。"><CheckerWorkbench draws={draws} locale={locale} initialNumbers={new Set(initialNumbers).size===6?initialNumbers:[]}/></PageShell>;}