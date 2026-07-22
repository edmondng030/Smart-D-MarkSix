import { apiError, apiSuccess } from "@/lib/api/response";
import { getVerifiedDraw } from "@/lib/draws/repository";
export async function GET(_request: Request, context: { params: Promise<{ drawNumber: string }> }) { const { drawNumber } = await context.params; if (!/^[\p{L}\p{N}/_-]{1,30}$/u.test(drawNumber)) return apiError("VALIDATION_ERROR", "Invalid draw number.", 400); try { const draw = await getVerifiedDraw(drawNumber); return draw ? apiSuccess(draw) : apiError("DRAW_NOT_FOUND", "Draw not found.", 404); } catch { return apiError("INTERNAL_ERROR", "Unable to load the draw.", 500); } }
