import { createHash } from "node:crypto";
import { drawCsvRowSchema, type ValidatedDrawRow } from "@/lib/validation/draw";

export const REQUIRED_DRAW_HEADERS = ["draw_number", "draw_date", "number_1", "number_2", "number_3", "number_4", "number_5", "number_6", "extra_number"] as const;

export type CsvValidationIssue = { line: number; drawNumber: string | null; field: string; code: string; rawValue: string | null; message: string };
export type CsvValidationReport = { fileHash: string; rowCount: number; validRowCount: number; invalidRowCount: number; missingHeaders: string[]; duplicateDrawNumbers: string[]; duplicateDrawDates: string[]; validRows: ValidatedDrawRow[]; issues: CsvValidationIssue[] };

export function parseCsvRecords(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], value = "", quoted = false;
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted && character === '"' && input[index + 1] === '"') { value += '"'; index += 1; }
    else if (character === '"') quoted = !quoted;
    else if (character === "," && !quoted) { row.push(value); value = ""; }
    else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && input[index + 1] === "\n") index += 1;
      row.push(value); if (row.some((cell) => cell.trim() !== "")) rows.push(row); row = []; value = "";
    } else value += character;
  }
  row.push(value); if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  return rows;
}

export function validateDrawCsv(input: string): CsvValidationReport {
  const fileHash = createHash("sha256").update(input, "utf8").digest("hex");
  const records = parseCsvRecords(input.replace(/^\uFEFF/, ""));
  const headers = records[0]?.map((header) => header.trim()) ?? [];
  const missingHeaders = REQUIRED_DRAW_HEADERS.filter((header) => !headers.includes(header));
  const issues: CsvValidationIssue[] = missingHeaders.map((field) => ({ line: 1, drawNumber: null, field, code: "MISSING_HEADER", rawValue: null, message: `缺少必要欄位 ${field}` }));
  const validRows: ValidatedDrawRow[] = [];
  const seenDrawNumbers = new Set<string>(), duplicateDrawNumbers = new Set<string>();
  const seenDates = new Set<string>(), duplicateDrawDates = new Set<string>();

  records.slice(1).forEach((values, rowIndex) => {
    const raw = Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() ?? ""]));
    const drawNumber = raw.draw_number || null;
    const result = drawCsvRowSchema.safeParse(raw);
    if (drawNumber && seenDrawNumbers.has(drawNumber)) duplicateDrawNumbers.add(drawNumber); else if (drawNumber) seenDrawNumbers.add(drawNumber);
    if (raw.draw_date && seenDates.has(raw.draw_date)) duplicateDrawDates.add(raw.draw_date); else if (raw.draw_date) seenDates.add(raw.draw_date);
    if (!result.success) result.error.issues.forEach((issue) => { const field = String(issue.path[0] ?? "row"); issues.push({ line: rowIndex + 2, drawNumber, field, code: "VALIDATION_ERROR", rawValue: raw[field] ?? null, message: issue.message }); });
    else validRows.push(result.data);
  });

  duplicateDrawNumbers.forEach((value) => issues.push({ line: 0, drawNumber: value, field: "draw_number", code: "DUPLICATE_DRAW", rawValue: value, message: "CSV 內有重複期數" }));
  duplicateDrawDates.forEach((value) => issues.push({ line: 0, drawNumber: null, field: "draw_date", code: "DUPLICATE_DATE", rawValue: value, message: "CSV 內有重複日期" }));
  const invalidLines = new Set(issues.filter((issue) => issue.line > 1).map((issue) => issue.line));
  const duplicatePenalty = duplicateDrawNumbers.size + duplicateDrawDates.size;
  return { fileHash, rowCount: Math.max(records.length - 1, 0), validRowCount: Math.max(validRows.length - duplicatePenalty, 0), invalidRowCount: invalidLines.size + duplicatePenalty, missingHeaders: [...missingHeaders], duplicateDrawNumbers: [...duplicateDrawNumbers], duplicateDrawDates: [...duplicateDrawDates], validRows, issues };
}
