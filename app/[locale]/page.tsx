import { LiveDashboard } from "@/components/home/live-dashboard";
import { countVerifiedDraws, getLatestVerifiedDraw } from "@/lib/draws/repository";

export const revalidate = 300;
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [latest, total] = await Promise.all([getLatestVerifiedDraw(), countVerifiedDraws()]);
  return <LiveDashboard latest={latest} total={total} locale={locale}/>;
}