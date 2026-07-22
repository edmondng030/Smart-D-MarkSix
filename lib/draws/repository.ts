import { z } from "zod";
import type { DrawDetail, DrawSummary } from "@/features/draws/types";
import { createClient } from "@/lib/supabase/server";

const drawColumns = "draw_number,draw_date,number_1,number_2,number_3,number_4,number_5,number_6,extra_number,turnover,first_prize_fund,first_prize_dividend,source_name,source_retrieved_at";
export const drawListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1), pageSize: z.coerce.number().int().min(1).max(100).catch(20),
  from: z.union([z.literal(""), z.iso.date()]).optional().catch(undefined), to: z.union([z.literal(""), z.iso.date()]).optional().catch(undefined),
  search: z.string().trim().max(30).regex(/^[\p{L}\p{N}/_-]*$/u).optional().catch(undefined), sort: z.enum(["date_desc", "date_asc"]).catch("date_desc")
});
type DrawRow = { draw_number: string; draw_date: string; number_1: number; number_2: number; number_3: number; number_4: number; number_5: number; number_6: number; extra_number: number; turnover: number | null; first_prize_fund: number | null; first_prize_dividend: number | null; source_name: string | null; source_retrieved_at: string | null };
function mapSummary(row: DrawRow): DrawSummary { return { drawNumber: row.draw_number, drawDate: row.draw_date, mainNumbers: [row.number_1,row.number_2,row.number_3,row.number_4,row.number_5,row.number_6], extraNumber: row.extra_number, turnover: row.turnover, firstPrizeFund: row.first_prize_fund, firstPrizeDividend: row.first_prize_dividend, sourceName: row.source_name, sourceRetrievedAt: row.source_retrieved_at }; }

export async function listVerifiedDraws(input: z.input<typeof drawListQuerySchema>) {
  const query = drawListQuerySchema.parse(input), supabase = await createClient(), fromIndex = (query.page - 1) * query.pageSize;
  let request = supabase.from("draws").select(drawColumns, { count: "exact" }).eq("status", "verified");
  if (query.from) request = request.gte("draw_date", query.from); if (query.to) request = request.lte("draw_date", query.to); if (query.search) request = request.ilike("draw_number", `%${query.search}%`);
  const { data, error, count } = await request.order("draw_date", { ascending: query.sort === "date_asc" }).range(fromIndex, fromIndex + query.pageSize - 1);
  if (error) throw new Error(`Unable to load draws: ${error.message}`);
  const total = count ?? 0; return { draws: (data as DrawRow[]).map(mapSummary), page: query.page, pageSize: query.pageSize, total, totalPages: Math.max(1, Math.ceil(total / query.pageSize)) };
}
export async function getLatestVerifiedDraw() { const supabase = await createClient(); const { data, error } = await supabase.from("draws").select(drawColumns).eq("status", "verified").order("draw_date", { ascending: false }).limit(1).maybeSingle(); if (error) throw new Error(`Unable to load latest draw: ${error.message}`); return data ? mapSummary(data as DrawRow) : null; }
export async function countVerifiedDraws() { const supabase = await createClient(); const { count, error } = await supabase.from("draws").select("id", { count: "exact", head: true }).eq("status", "verified"); if (error) throw new Error(`Unable to count draws: ${error.message}`); return count ?? 0; }
export async function getVerifiedDraw(drawNumber: string): Promise<DrawDetail | null> {
  const supabase = await createClient(); const { data, error } = await supabase.from("draws").select(`${drawColumns},source_url,draw_prizes(division,winning_units,dividend)`).eq("status", "verified").eq("draw_number", drawNumber).maybeSingle();
  if (error) throw new Error(`Unable to load draw: ${error.message}`); if (!data) return null;
  const row = data as DrawRow & { source_url: string | null; source_retrieved_at: string | null; draw_prizes: Array<{ division: number; winning_units: number | null; dividend: number | null }> };
  return { ...mapSummary(row), sourceUrl: row.source_url, sourceRetrievedAt: row.source_retrieved_at, prizes: row.draw_prizes.map((prize) => ({ division: prize.division, winningUnits: prize.winning_units, dividend: prize.dividend })).sort((a,b) => a.division-b.division) };
}
