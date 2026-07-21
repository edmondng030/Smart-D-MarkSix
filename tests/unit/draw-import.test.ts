import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseCsvRecords, validateDrawCsv } from "@/lib/csv/draw-import";
describe("parseCsvRecords", () => { it("supports quoted commas and escaped quotes", () => { expect(parseCsvRecords('name,note\r\n1,"hello, ""world"""')).toEqual([["name", "note"], ["1", 'hello, "world"']]); }); });
describe("validateDrawCsv", () => {
  it("validates and normalizes a valid fixture", () => { const report = validateDrawCsv(readFileSync("tests/fixtures/draws-valid.csv", "utf8")); expect(report.issues).toEqual([]); expect(report.validRowCount).toBe(2); expect(report.validRows[0].number_1).toBe(1); expect(report.fileHash).toMatch(/^[a-f0-9]{64}$/); });
  it("reports line, field and raw value for invalid rows", () => { const report = validateDrawCsv(readFileSync("tests/fixtures/draws-invalid.csv", "utf8")); expect(report.invalidRowCount).toBe(4); expect(report.issues).toEqual(expect.arrayContaining([expect.objectContaining({ line: 2, field: "number_1", rawValue: "1" }), expect.objectContaining({ line: 3, field: "draw_date", rawValue: "not-a-date" }), expect.objectContaining({ line: 4, field: "number_6", rawValue: "50" }), expect.objectContaining({ line: 5, field: "extra_number", rawValue: "25" })])); });
  it("blocks a file with missing required headers", () => { const report = validateDrawCsv("draw_number,draw_date\n26/001,2026-01-01"); expect(report.missingHeaders).toContain("number_1"); expect(report.issues[0].code).toBe("MISSING_HEADER"); });
  it("detects duplicate draw numbers and dates", () => { const report = validateDrawCsv("draw_number,draw_date,number_1,number_2,number_3,number_4,number_5,number_6,extra_number\n1,2026-01-01,1,2,3,4,5,6,7\n1,2026-01-01,8,9,10,11,12,13,14"); expect(report.duplicateDrawNumbers).toEqual(["1"]); expect(report.duplicateDrawDates).toEqual(["2026-01-01"]); });
});
