import type{MetadataRoute}from"next";
export default function robots():MetadataRoute.Robots{const base=process.env.NEXT_PUBLIC_APP_URL||"https://smart-d-mark-six.vercel.app";return{rules:{userAgent:"*",allow:"/",disallow:["/api/","/auth/","/zh-HK/admin/","/en/admin/"]},sitemap:`${base}/sitemap.xml`};}
