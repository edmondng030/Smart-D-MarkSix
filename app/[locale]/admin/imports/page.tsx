import { ShieldAlert, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { ImportWorkbench } from "@/components/admin/import-workbench";
import { LogoutForm } from "@/components/auth/logout-form";
import { PageShell } from "@/components/layout/page-shell";
import { requireAdmin } from "@/lib/security/admin";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const auth = await requireAdmin();
  if (!auth.authorized && auth.reason === "UNAUTHORIZED") redirect(`/${locale}/login?error=${encodeURIComponent("請先登入管理員帳戶")}`);
  if (!auth.authorized) return <PageShell icon={ShieldAlert} eyebrow="Access denied" title="沒有管理員權限" description="你的帳戶已登入，但未被授予 admin role。"><div className="mt-8"><LogoutForm locale={locale}/></div></PageShell>;
  return <PageShell icon={ShieldCheck} eyebrow="Admin · Phase 1" title="CSV 資料匯入與審核" description="逐行驗證資料後才可人工批准發布。每次批准或拒絕均寫入 audit log。"><div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[.03] p-4 text-sm text-slate-400"><span>已登入：{auth.user.email ?? "管理員"}</span><LogoutForm locale={locale}/></div><ImportWorkbench /></PageShell>;
}