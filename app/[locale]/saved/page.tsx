import { Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SavedCombinations } from "@/components/saved/saved-combinations";
import { createClient } from "@/lib/supabase/server";
export const dynamic="force-dynamic";
export default async function Page({params}:{params:Promise<{locale:string}>}){const{locale}=await params,supabase=await createClient(),{data:{user}}=await supabase.auth.getUser();if(!user)redirect(`/${locale}/login?next=/${locale}/saved`);const{data,error}=await supabase.from("saved_combinations").select("id,label,numbers,method,model_version,random_seed,historical_score,is_favourite,created_at").order("is_favourite",{ascending:false}).order("created_at",{ascending:false});if(error)throw new Error("Unable to load saved combinations.");return <PageShell icon={Heart} eyebrow="Personal workspace" title="我的收藏組合" description="管理由組合產生器儲存的號碼。收藏與歷史統計不會改變任何組合的理論中獎機率。"><SavedCombinations initial={data??[]} locale={locale}/></PageShell>}