import { BarChart3, FlaskConical, Home, SearchCheck, WandSparkles } from "lucide-react";

export const navItems = [
  { href: "/zh-HK", label: "總覽", icon: Home },
  { href: "/zh-HK/results", label: "攪珠結果", icon: SearchCheck },
  { href: "/zh-HK/analytics", label: "數據分析", icon: BarChart3 },
  { href: "/zh-HK/generator", label: "組合實驗", icon: WandSparkles },
  { href: "/zh-HK/backtest", label: "回測", icon: FlaskConical }
] as const;
