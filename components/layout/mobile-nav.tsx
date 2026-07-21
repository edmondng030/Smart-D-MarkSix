import Link from "next/link";
import { navItems } from "./nav-items";

export function MobileNav() {
  return <nav aria-label="手機導覽" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0b1020]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
    <div className="mx-auto grid max-w-lg grid-cols-5">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg text-[10px] text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"><Icon className="size-5" /><span>{label}</span></Link>)}</div>
  </nav>;
}
