import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { queryRenavon } from "@/lib/renavon/client";
import { drawCsvRowSchema, type ValidatedDrawRow } from "@/lib/validation/draw";

const SOURCE_NAME = "Renavon / HKJC Mark Six Results";
const SOURCE_URL = "https://renavon.com/data/hkjc/hkjc_marksix_results";
const sourceRowSchema = z.object({
  draw_id: z.union([z.string(), z.number()]).transform(String), draw_date: z.string(),
  ball_1: z.coerce.number(), ball_2: z.coerce.number(), ball_3: z.coerce.number(),
  ball_4: z.coerce.number(), ball_5: z.coerce.number(), ball_6: z.coerce.number(), extra_ball: z.coerce.number(),
  total_sales: z.coerce.number().nullish(), jackpot_amount: z.coerce.number().nullish(), first_prize_dividend: z.coerce.number().nullish()
}).passthrough();

export type RenavonValidationIssue = { row: number; drawNumber: string | null; message: string };

export function mapRenavonRows(rows: Record<string, unknown>[]) {
  const validRows: ValidatedDrawRow[] = [], issues: RenavonValidationIssue[] = [];
  rows.forEach((raw, index) => {
    const source = sourceRowSchema.safeParse(raw);
    if (!source.success) { issues.push({ row: index + 1, drawNumber: typeof raw.draw_id === "string" ? raw.draw_id : null, message: source.error.issues[0]?.message ?? "Invalid source row" }); return; }
    const mapped = drawCsvRowSchema.safeParse({
      draw_number: source.data.draw_id, draw_date: source.data.draw_date.slice(0, 10),
      number_1: source.data.ball_1, number_2: source.data.ball_2, number_3: source.data.ball_3,
      number_4: source.data.ball_4, number_5: source.data.ball_5, number_6: source.data.ball_6,
      extra_number: source.data.extra_ball, turnover: source.data.total_sales ?? undefined,
      first_prize_fund: source.data.jackpot_amount ?? undefined, first_prize_dividend: source.data.first_prize_dividend ?? undefined,
      source_name: SOURCE_NAME, source_url: SOURCE_URL
    });
    if (!mapped.success) { issues.push({ row: index + 1, drawNumber: source.data.draw_id, message: mapped.error.issues[0]?.message ?? "Invalid draw" }); return; }
    validRows.push(mapped.data);
  });
  return { validRows, issues };
}

async function getExistingDrawNumbers(supabase: SupabaseClient) {
  const existing = new Set<string>();
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("draws").select("draw_number").range(from, from + 999);
    if (error) throw new Error(`Unable to read existing draws: ${error.message}`);
    for (const row of data ?? []) existing.add(row.draw_number);
    if (!data || data.length < 1000) break;
  }
  return existing;
}

export async function stageRenavonSync(supabase: SupabaseClient, actorId: string | null) {
  const sourceRows = await queryRenavon("SELECT * FROM renavon_exports.hkjc_marksix_results WHERE has_results = 1 ORDER BY draw_date ASC, draw_id ASC");
  const validation = mapRenavonRows(sourceRows);
  if (validation.issues.length) throw new Error(`Renavon validation failed for ${validation.issues.length} row(s).`);
  const existing = await getExistingDrawNumbers(supabase);
  const newRows = validation.validRows.filter((row) => !existing.has(row.draw_number));
  if (!newRows.length) return { status: "up_to_date" as const, fetched: sourceRows.length, staged: 0, importId: null };
  const retrievedAt = new Date().toISOString();
  const fileHash = createHash("sha256").update(JSON.stringify(newRows)).digest("hex");
  const { data, error } = await supabase.from("data_imports").insert({ uploaded_by: actorId,
    file_name: `renavon-marksix-${retrievedAt.slice(0, 10)}.json`, storage_path: `renavon/${fileHash}.json`, file_hash: fileHash,
    row_count: newRows.length, valid_row_count: newRows.length, invalid_row_count: 0, status: "pending_review",
    validation_report: { source: SOURCE_NAME, sourceUrl: SOURCE_URL, retrievedAt, fetchedRowCount: sourceRows.length, newRowCount: newRows.length, issues: [] }, staged_rows: newRows
  }).select("id").single();
  if (error?.code === "23505") return { status: "already_staged" as const, fetched: sourceRows.length, staged: 0, importId: null };
  if (error) throw new Error(`Unable to stage Renavon import: ${error.message}`);
  const { error: auditError } = await supabase.from("audit_logs").insert({ actor_id: actorId, action: "renavon.sync_staged", entity_type: "data_import", entity_id: data.id, after_data: { fetched: sourceRows.length, staged: newRows.length, source: SOURCE_NAME } });
  if (auditError) throw new Error(`Unable to write sync audit log: ${auditError.message}`);
  return { status: "pending_review" as const, fetched: sourceRows.length, staged: newRows.length, importId: data.id };
}
