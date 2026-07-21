import { describe, expect, it } from "vitest";
import { drawCsvRowSchema, importDecisionSchema } from "@/lib/validation/draw";
const valid = { draw_number: "26/001", draw_date: "2026-01-01", number_1: "46", number_2: "1", number_3: "12", number_4: "25", number_5: "8", number_6: "33", extra_number: "49" };
describe("drawCsvRowSchema", () => {
  it("coerces integers and sorts main numbers", () => { const result = drawCsvRowSchema.parse(valid); expect([result.number_1, result.number_2, result.number_3, result.number_4, result.number_5, result.number_6]).toEqual([1, 8, 12, 25, 33, 46]); });
  it("rejects repeated main numbers", () => { expect(drawCsvRowSchema.safeParse({ ...valid, number_2: "46" }).success).toBe(false); });
  it("rejects extra number contained in main numbers", () => { expect(drawCsvRowSchema.safeParse({ ...valid, extra_number: "12" }).success).toBe(false); });
  it.each(["0", "50", "1.5", "number"])("rejects invalid number %s", (number) => { expect(drawCsvRowSchema.safeParse({ ...valid, number_1: number }).success).toBe(false); });
});
describe("importDecisionSchema", () => { it("requires a rejection reason", () => { expect(importDecisionSchema.safeParse({ importId: "2df59eeb-f640-4dd5-9723-523ae2f74a48", decision: "reject" }).success).toBe(false); }); });
