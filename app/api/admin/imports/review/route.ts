import { apiError, apiSuccess } from "@/lib/api/response";
import { requireAdmin } from "@/lib/security/admin";
import { importDecisionSchema } from "@/lib/validation/draw";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return apiError(auth.reason, auth.reason === "UNAUTHORIZED" ? "請先登入管理員帳戶" : "你沒有管理員權限", auth.reason === "UNAUTHORIZED" ? 401 : 403);
  const body = importDecisionSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return apiError("VALIDATION_ERROR", "審核資料無效", 400, body.error.flatten());
  const { data, error } = await auth.supabase.rpc("review_data_import", { p_import_id: body.data.importId, p_decision: body.data.decision, p_reason: body.data.reason ?? null });
  if (error) {
    const known = ["IMPORT_NOT_FOUND", "INVALID_IMPORT_STATUS", "IMPORT_HAS_INVALID_ROWS", "REJECTION_REASON_REQUIRED"];
    const code = known.find((item) => error.message.includes(item)) ?? "INTERNAL_ERROR";
    return apiError(code, code === "IMPORT_HAS_INVALID_ROWS" ? "匯入仍有錯誤，不能發布" : "無法完成審核操作", code === "IMPORT_NOT_FOUND" ? 404 : code === "INTERNAL_ERROR" ? 500 : 409);
  }
  return apiSuccess(data);
}
