import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { analyticsQuerySchema, loadAnalyticsDraws } from "@/lib/analytics/repository";
import { calculateNumberStatistics, calculatePairCounts, calculatePatternStatistics } from "@/lib/statistics/draw-analytics";

export const revalidate = 300;
export default async function Page({params,searchParams}:{params:Promise<{locale:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>}){
  const [{locale},raw]=await Promise.all([params,searchParams]);
  const values=Object.fromEntries(Object.entries(raw).map(([key,value])=>[key,Array.isArray(value)?value[0]:value]));
  const query=analyticsQuerySchema.parse(values),draws=await loadAnalyticsDraws(query);
  return <AnalyticsDashboard locale={locale} filters={{window:query.window,from:query.from||undefined,to:query.to||undefined,includeExtra:query.includeExtra}} numbers={calculateNumberStatistics(draws,query.includeExtra)} patterns={calculatePatternStatistics(draws)} pairs={calculatePairCounts(draws)}/>;
}