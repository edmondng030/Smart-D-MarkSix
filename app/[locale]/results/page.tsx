import { ResultsPage } from "@/components/results/results-page";
import { drawListQuerySchema, listVerifiedDraws } from "@/lib/draws/repository";

export const revalidate = 300;
export default async function Page({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [{ locale }, raw] = await Promise.all([params, searchParams]);
  const values = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]));
  const query = drawListQuerySchema.parse(values);
  const result = await listVerifiedDraws(query);
  return <ResultsPage draws={result.draws} total={result.total} page={result.page} totalPages={result.totalPages} locale={locale} filters={{ search: query.search, from: query.from || undefined, to: query.to || undefined, sort: query.sort, pageSize: query.pageSize }}/>;
}