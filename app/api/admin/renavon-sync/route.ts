import { apiError, apiSuccess } from "@/lib/api/response";
import { stageRenavonSync } from "@/lib/renavon/marksix";
import { requireAdmin } from "@/lib/security/admin";
import { enforceRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, { scope: "admin-renavon-sync", limit: 5, windowSeconds: 300 });
  if (limited) return limited;
  const auth = await requireAdmin();
  if (!auth.authorized) return apiError(auth.reason, auth.reason === "UNAUTHORIZED" ? "Please sign in." : "Admin access required.", auth.reason === "UNAUTHORIZED" ? 401 : 403);
  try { return apiSuccess(await stageRenavonSync(auth.supabase, auth.user.id)); }
  catch (error) { return apiError("SYNC_FAILED", error instanceof Error ? error.message : "Renavon sync failed.", 502); }
}
