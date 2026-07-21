"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(8).max(128),
  locale: z.enum(["zh-HK", "en"])
});

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password"), locale: formData.get("locale") });
  const locale = formData.get("locale") === "en" ? "en" : "zh-HK";
  if (!parsed.success) redirect(`/${locale}/login?error=${encodeURIComponent("請輸入有效電郵及至少 8 位密碼")}`);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password });
  if (error) redirect(`/${parsed.data.locale}/login?error=${encodeURIComponent("電郵或密碼不正確")}`);
  redirect(`/${parsed.data.locale}/admin/imports`);
}

export async function logout(formData: FormData) {
  const locale = formData.get("locale") === "en" ? "en" : "zh-HK";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/login?message=${encodeURIComponent("你已安全登出")}`);
}
