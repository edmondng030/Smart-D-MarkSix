import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { createClient } from "@/lib/supabase/server";
import { login } from "./actions";

export default async function LoginPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ error?: string; message?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect(`/${locale}/admin/imports`);

  return <PageShell icon={LockKeyhole} eyebrow="Secure access" title="管理員登入" description="登入後才可匯入、審核及發布資料。">
    <div className="mt-10 max-w-lg rounded-2xl border border-white/10 bg-[#141b2d]/80 p-6 sm:p-8">
      {query.error && <p role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-400/8 p-4 text-sm text-red-200">{query.error}</p>}
      {query.message && <p role="status" className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/8 p-4 text-sm text-emerald-200">{query.message}</p>}
      <form action={login} className="space-y-5">
        <input type="hidden" name="locale" value={locale} />
        <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-300">電郵</span><input name="email" type="email" autoComplete="email" required className="min-h-12 w-full rounded-xl border border-white/12 bg-[#0b1020] px-4 text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25" /></label>
        <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-300">密碼</span><input name="password" type="password" autoComplete="current-password" minLength={8} required className="min-h-12 w-full rounded-xl border border-white/12 bg-[#0b1020] px-4 text-white outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/25" /></label>
        <button type="submit" className="min-h-12 w-full rounded-xl bg-indigo-500 px-5 font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300">安全登入</button>
      </form>
      <p className="mt-5 text-xs leading-6 text-slate-500">只限獲授權管理員使用。登入操作由 Supabase Auth 處理，網站不會記錄你的密碼。</p>
    </div>
  </PageShell>;
}
