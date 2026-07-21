import { FlaskConical } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
export default function Page() { return <PageShell icon={FlaskConical} eyebrow="Backtest" title="模型回測" description="以嚴格時間序列方式比較模型與純隨機 baseline，不使用未來資料。" />; }
