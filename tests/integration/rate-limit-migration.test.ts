import{readFileSync}from"node:fs";
import{join}from"node:path";
import{describe,expect,it}from"vitest";
const sql=readFileSync(join(process.cwd(),"supabase/migrations/202607220003_rate_limits.sql"),"utf8");
describe("durable rate-limit migration",()=>{it("uses an RLS-protected table and security-definer RPC",()=>{expect(sql).toContain("alter table public.api_rate_limits enable row level security");expect(sql).toContain("security definer");expect(sql).toContain("grant execute on function public.check_rate_limit");});it("bounds caller-controlled limits and windows",()=>{expect(sql).toContain("p_limit>1000");expect(sql).toContain("p_window_seconds>86400");});});
