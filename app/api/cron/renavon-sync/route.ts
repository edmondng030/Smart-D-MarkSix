import { apiError, apiSuccess } from "@/lib/api/response";
import { stageRenavonSync } from "@/lib/renavon/marksix";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return apiError("UNAUTHORIZED", "Invalid cron authorization.", 401);
  try { return apiSuccess(await stageRenavonSync(createServiceClient(), null)); }
  catch (error) { return apiError("SYNC_FAILED", error instanceof Error ? error.message : "Renavon sync failed.", 502); }
}
