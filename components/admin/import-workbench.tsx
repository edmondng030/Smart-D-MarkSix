"use client";

import { AlertTriangle, CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";
import { useState } from "react";

type Issue = { line: number; drawNumber: string | null; field: string; message: string; rawValue: string | null };
type ImportResult = { id: string; status: string; file_name: string; row_count: number; valid_row_count: number; invalid_row_count: number; validation_report: { issues?: Issue[] } };

export function ImportWorkbench() {
  const [result, setResult] = useState<ImportResult | null>(null), [error, setError] = useState<string | null>(null), [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true); setError(null); setResult(null);
    try {
      if (!file.name.toLowerCase().endsWith(".csv")) throw new Error("請選擇 .csv 檔案");
      if (file.size > 2_000_000) throw new Error("CSV 不可超過 2 MB");
      const response = await fetch("/api/admin/imports", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ fileName: file.name, content: await file.text() }) });
      const payload = await response.json() as { success: boolean; data?: ImportResult; error?: { message: string } };
      if (!response.ok || !payload.data) throw new Error(payload.error?.message ?? "上載失敗");
      setResult(payload.data);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "上載失敗"); } finally { setBusy(false); }
  }
  async function review(decision: "approve" | "reject") {
    if (!result) return;
    const reason = decision === "reject" ? window.prompt("請輸入拒絕原因") : undefined;
    if (decision === "reject" && !reason) return;
    setBusy(true); setError(null);
    try { const response = await fetch("/api/admin/imports/review", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ importId: result.id, decision, reason }) }); const payload = await response.json() as { success: boolean; error?: { message: string } }; if (!response.ok) throw new Error(payload.error?.message ?? "審核失敗"); setResult({ ...result, status: decision === "approve" ? "published" : "rejected" }); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "審核失敗"); } finally { setBusy(false); }
  }
  const issues = result?.validation_report.issues ?? [];
  return <div className="mt-10 space-y-5">
    <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-300/30 bg-indigo-400/[.045] p-6 text-center transition hover:bg-indigo-400/[.08]"><input className="sr-only" type="file" accept=".csv,text/csv" disabled={busy} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />{busy ? <Loader2 className="size-7 animate-spin text-indigo-300"/> : <Upload className="size-7 text-indigo-300"/>}<span className="mt-3 font-semibold">選擇 CSV 並建立驗證預覽</span><span className="mt-1 text-sm text-slate-400">最多 2 MB；上載不會自動公開資料</span></label>
    {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/8 p-4 text-sm text-red-200"><AlertTriangle className="mr-2 inline size-4"/>{error}</p>}
    {result && <section className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><FileSpreadsheet className="size-6 text-indigo-300"/><div><h2 className="font-bold">{result.file_name}</h2><p className="text-sm text-slate-400">狀態：{result.status}</p></div></div><div className="flex gap-4 text-sm"><span>全部 <b>{result.row_count}</b></span><span className="text-emerald-300">有效 <b>{result.valid_row_count}</b></span><span className="text-red-300">錯誤 <b>{result.invalid_row_count}</b></span></div></div>
      {issues.length > 0 ? <div className="mt-5 overflow-x-auto"><table className="w-full min-w-180 text-left text-sm"><thead className="text-slate-500"><tr><th className="p-3">行</th><th>期數</th><th>欄位</th><th>原始值</th><th>問題</th></tr></thead><tbody>{issues.map((issue, index) => <tr className="border-t border-white/8" key={`${issue.line}-${issue.field}-${index}`}><td className="p-3">{issue.line || "—"}</td><td>{issue.drawNumber ?? "—"}</td><td>{issue.field}</td><td>{issue.rawValue ?? "—"}</td><td className="text-red-200">{issue.message}</td></tr>)}</tbody></table></div> : <p className="mt-5 flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 className="size-4"/>所有資料通過格式驗證，等待管理員人工審核。</p>}
      {result.status === "pending_review" && <div className="mt-6 flex gap-3"><button disabled={busy} onClick={() => void review("approve")} className="min-h-11 rounded-xl bg-emerald-500 px-5 font-semibold text-slate-950">批准並發布</button><button disabled={busy} onClick={() => void review("reject")} className="min-h-11 rounded-xl border border-red-400/30 px-5 font-semibold text-red-200">拒絕</button></div>}
    </section>}
  </div>;
}
