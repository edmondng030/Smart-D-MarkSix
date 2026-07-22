import { LiveDashboard } from "@/components/home/live-dashboard";
import { listVerifiedDraws } from "@/lib/draws/repository";

export const revalidate = 300;
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const {draws,total}=await listVerifiedDraws({page:1,pageSize:100,sort:"date_desc"});
  return <LiveDashboard latest={draws[0]??null} recent={draws} total={total} locale={locale}/>;
}