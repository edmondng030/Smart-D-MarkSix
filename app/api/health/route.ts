import{apiError,apiSuccess}from"@/lib/api/response";
import{getLatestVerifiedDraw}from"@/lib/draws/repository";
export const dynamic="force-dynamic";
export async function GET(){try{const latest=await getLatestVerifiedDraw();return apiSuccess({status:"ok",database:"reachable",latestVerifiedDraw:latest?.drawNumber??null,timestamp:new Date().toISOString()});}catch{return apiError("SERVICE_UNAVAILABLE","Database health check failed.",503);}}
