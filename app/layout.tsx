import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "六合彩數據研究所", template: "%s｜六合彩數據研究所" },
  description: "獨立的六合彩歷史數據、概率與模型實驗工具。",
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-HK"><body>{children}</body></html>;
}
