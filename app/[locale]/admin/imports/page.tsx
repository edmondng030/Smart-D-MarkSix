import { ShieldCheck } from "lucide-react";
import { ImportWorkbench } from "@/components/admin/import-workbench";
import { PageShell } from "@/components/layout/page-shell";

export default function Page() { return <PageShell icon={ShieldCheck} eyebrow="Admin · Phase 1" title="CSV 資料匯入與審核" description="逐行驗證資料後才可人工批准發布。每次批准或拒絕均寫入 audit log。"><ImportWorkbench /></PageShell>; }
