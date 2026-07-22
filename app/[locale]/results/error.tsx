"use client";
import { AlertTriangle } from "lucide-react";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <div className="mx-auto max-w-360 px-5 py-16 text-center lg:px-8"><AlertTriangle className="mx-auto size-10 text-red-300"/><h1 className="mt-5 text-2xl font-bold">暫時無法載入開獎結果</h1><p className="mt-3 text-slate-400">資料服務可能暫時繁忙，請稍後再試。</p><button onClick={reset} className="mt-6 min-h-11 rounded-xl bg-indigo-500 px-5 font-semibold">重新載入</button></div>; }
