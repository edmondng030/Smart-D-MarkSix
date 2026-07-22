import { apiError, apiSuccess } from "@/lib/api/response";
import { stageRenavonSync } from "@/lib/renavon/marksix";
import { requireAdmin } from "@/lib/security/admin";

export async function POST() {
  const auth = await requireAdmin();
  if (!auth.authorized) return apiError(auth.reason, auth.reason === "UNAUTHORIZED" ? "Please sign in." : "Admin access required.", auth.reason === "UNAUTHORIZED" ? 401 : 403);
  try { return apiSuccess(await stageRenavonSync(auth.supabase, auth.user.id)); }
  catch (error) { return apiError("SYNC_FAILED", error instanceof Error ? error.message : "Renavon sync failed.", 502); }
}
