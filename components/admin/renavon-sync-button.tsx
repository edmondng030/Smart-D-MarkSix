"use client";

import { DatabaseZap, Loader2 } from "lucide-react";
import { useState } from "react";

type SyncResult = { status: string; fetched: number; staged: number; importId: string | null };

export function RenavonSyncButton() {
  const [busy, setBusy] = useState(false), [result, setResult] = useState<SyncResult | null>(null), [error, setError] = useState<string | null>(null);
  async function sync() {
    setBusy(true); setError(null); setResult(null);
    try {
      const response = await fetch("/api/admin/renavon-sync", { method: "POST" });
      const payload = await response.json() as { data?: SyncResult; error?: { message: string } };
      if (!response.ok || !payload.data) throw new Error(payload.error?.message ?? "Sync failed.");
      setResult(payload.data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Sync failed."); }
    finally { setBusy(false); }
  }
  async function review(decision: "approve" | "reject") {
    if (!result?.importId) return;
    const reason = decision === "reject" ? window.prompt("請輸入拒絕原因") : undefined;
    if (decision === "reject" && !reason) return;
    if (decision === "approve" && !window.confirm(`確定發布這批 ${result.staged} 期開獎資料？`)) return;
    setBusy(true); setError(null);
    try {
      const response = await fetch("/api/admin/imports/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ importId: result.importId, decision, reason }) });
      const payload = await response.json() as { error?: { message: string } };
      if (!response.ok) throw new Error(payload.error?.message ?? "Review failed.");
      setResult({ ...result, status: decision === "approve" ? "published" : "rejected", importId: null });
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Review failed."); }
    finally { setBusy(false); }
  }
  return <section className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/[.04] p-5">
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-bold text-white">Renavon 歷史資料同步</h2><p className="mt-1 text-sm text-slate-400">擷取及驗證新期數，然後送交管理員審核；不會自動覆蓋已發布資料。</p></div>
      <button type="button" disabled={busy} onClick={() => void sync()} className="flex min-h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 font-semibold text-slate-950 disabled:opacity-60">{busy ? <Loader2 className="size-4 animate-spin"/> : <DatabaseZap className="size-4"/>}{busy ? "同步中…" : "立即同步"}</button></div>
    {result && <p className="mt-4 text-sm text-emerald-300">已讀取 {result.fetched} 期；新增待審核 {result.staged} 期。狀態：{result.status}</p>}
    {result?.status === "pending_review" && result.importId && <div className="mt-4 flex gap-3"><button type="button" disabled={busy} onClick={() => void review("approve")} className="min-h-11 rounded-xl bg-emerald-400 px-4 font-semibold text-slate-950">批准發布</button><button type="button" disabled={busy} onClick={() => void review("reject")} className="min-h-11 rounded-xl border border-red-400/30 px-4 font-semibold text-red-200">拒絕</button></div>}
    {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
  </section>;
}
