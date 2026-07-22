import { apiError, apiSuccess } from "@/lib/api/response";
import { getLatestVerifiedDraw } from "@/lib/draws/repository";
export async function GET() { try { const draw = await getLatestVerifiedDraw(); return draw ? apiSuccess(draw) : apiError("DRAW_NOT_FOUND", "No verified draws are available.", 404); } catch { return apiError("INTERNAL_ERROR", "Unable to load the latest draw.", 500); } }
