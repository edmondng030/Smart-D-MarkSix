import { cn } from "@/lib/utils";

export function NumberBall({ number, extra = false }: { number: number; extra?: boolean }) {
  return <span aria-label={`${extra ? "特別號碼" : "正選號碼"} ${number}`} className={cn("grid size-11 shrink-0 place-items-center rounded-full border font-mono text-sm font-bold tabular-nums shadow-inner sm:size-12", extra ? "border-amber-300/50 bg-amber-300 text-slate-950" : "border-indigo-300/30 bg-gradient-to-b from-indigo-400 to-indigo-600 text-white")}>{String(number).padStart(2, "0")}</span>;
}
