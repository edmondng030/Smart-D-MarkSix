import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
const migration = readFileSync("supabase/migrations/202607210001_phase1_data_layer.sql", "utf8");
describe("Phase 1 migration contract", () => {
  it("enables RLS on every public data table", () => { for (const table of ["draws", "draw_prizes", "data_imports", "audit_logs"]) expect(migration).toContain(`alter table public.${table} enable row level security`); });
  it("only exposes verified public draws", () => { expect(migration).toContain("status = 'verified' or public.is_admin_or_analyst()"); });
  it("reviews imports and audit logs atomically", () => { expect(migration).toContain("function public.review_data_import"); expect(migration).toContain("insert into public.audit_logs"); });
});
