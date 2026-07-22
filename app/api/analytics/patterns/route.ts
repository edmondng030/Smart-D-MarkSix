import { apiError, apiSuccess } from "@/lib/api/response";
import { analyticsQuerySchema, loadAnalyticsDraws } from "@/lib/analytics/repository";
import { calculatePatternStatistics } from "@/lib/statistics/draw-analytics";
export async function GET(request:Request){const query=analyticsQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams));try{return apiSuccess(calculatePatternStatistics(await loadAnalyticsDraws(query)));}catch{return apiError("INTERNAL_ERROR","Unable to calculate pattern analytics.",500);}}
