import { Footer } from "@/components/layout/footer";
import { DesktopSidebar } from "@/components/layout/desktop-sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { locales } from "@/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() { return locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!locales.includes(locale as (typeof locales)[number])) notFound();
  return <><a href="#main-content" className="skip-link">跳到主要內容</a><DesktopSidebar/><div className="xl:pl-64"><Header/><main id="main-content" tabIndex={-1} className="min-h-[70vh] pb-20 outline-none lg:pb-0">{children}</main><Footer/></div><MobileNav/></>
}
