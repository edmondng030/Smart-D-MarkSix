import { LogOut } from "lucide-react";
import { logout } from "@/app/[locale]/login/actions";

export function LogoutForm({ locale }: { locale: string }) {
  return <form action={logout}><input type="hidden" name="locale" value={locale} /><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-4 text-sm font-semibold text-slate-200 hover:bg-white/10"><LogOut className="size-4"/>登出</button></form>;
}
