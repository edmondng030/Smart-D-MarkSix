import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return { authorized: false as const, reason: "UNAUTHORIZED" as const };
  const { data: isAdmin, error: roleError } = await supabase.rpc("is_admin");
  if (roleError || !isAdmin) return { authorized: false as const, reason: "FORBIDDEN" as const };
  return { authorized: true as const, supabase, user };
}
