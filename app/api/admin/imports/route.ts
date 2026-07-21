import { z } from "zod";
import { apiError, apiSuccess } from "@/lib/api/response";
import { validateDrawCsv } from "@/lib/csv/draw-import";
import { requireAdmin } from "@/lib/security/admin";

const uploadSchema = z.object({ fileName: z.string().trim().min(1).max(200).refine((name) => name.toLowerCase().endsWith(".csv"), "只接受 CSV 檔案"), content: z.string().min(1).max(2_000_000) });

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return apiError(auth.reason, auth.reason === "UNAUTHORIZED" ? "請先登入管理員帳戶" : "你沒有管理員權限", auth.reason === "UNAUTHORIZED" ? 401 : 403);
  const { data, error } = await auth.supabase.from("data_imports").select("id,file_name,file_hash,row_count,valid_row_count,invalid_row_count,status,validation_report,created_at").order("created_at", { ascending: false }).limit(50);
  if (error) return apiError("INTERNAL_ERROR", "無法讀取匯入紀錄", 500);
  return apiSuccess(data);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return apiError(auth.reason, auth.reason === "UNAUTHORIZED" ? "請先登入管理員帳戶" : "你沒有管理員權限", auth.reason === "UNAUTHORIZED" ? 401 : 403);
  const body = uploadSchema.safeParse(await request.json().catch(() => null));
  if (!body.success) return apiError("VALIDATION_ERROR", "CSV 上載內容無效", 400, body.error.flatten());
  const report = validateDrawCsv(body.data.content);
  const status = report.issues.length === 0 ? "pending_review" : "validation_failed";
  const publicReport = { ...report, validRows: undefined };
  const { data, error } = await auth.supabase.from("data_imports").insert({ uploaded_by: auth.user.id, file_name: body.data.fileName, storage_path: `pending/${report.fileHash}/${body.data.fileName}`, file_hash: report.fileHash, row_count: report.rowCount, valid_row_count: report.validRowCount, invalid_row_count: report.invalidRowCount, status, validation_report: publicReport, staged_rows: report.validRows }).select("id,status,file_name,row_count,valid_row_count,invalid_row_count,validation_report,created_at").single();
  if (error?.code === "23505") return apiError("DUPLICATE_DRAW", "相同內容的 CSV 已經匯入", 409);
  if (error) return apiError("INTERNAL_ERROR", "無法建立匯入紀錄", 500);
  return apiSuccess(data, 201);
}
