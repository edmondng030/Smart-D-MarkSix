import type{MetadataRoute}from"next";
const routes=["","/results","/analytics","/generator","/checker","/backtest","/methodology","/responsible-use"];
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.NEXT_PUBLIC_APP_URL||"https://smart-d-mark-six.vercel.app",now=new Date();return["zh-HK","en"].flatMap((locale)=>routes.map((route)=>({url:`${base}/${locale}${route}`,lastModified:now,changeFrequency:route===""||route==="/results"?"daily" as const:"weekly" as const,priority:route===""?1:route==="/results"?0.9:0.7})));}
