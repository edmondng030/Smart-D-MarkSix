import { apiError, apiSuccess } from "@/lib/api/response";
import { analyticsQuerySchema, loadAnalyticsDraws } from "@/lib/analytics/repository";
import { calculatePairCounts } from "@/lib/statistics/draw-analytics";
export async function GET(request:Request){const query=analyticsQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));try{const draws=await loadAnalyticsDraws(query);return apiSuccess({drawCount:draws.length,pairs:calculatePairCounts(draws)});}catch{return apiError("INTERNAL_ERROR","Unable to calculate pair analytics.",500);}}
