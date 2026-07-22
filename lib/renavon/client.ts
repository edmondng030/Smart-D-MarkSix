import { z } from "zod";

const responseSchema = z.object({
  columns: z.array(z.object({ name: z.string() })),
  data: z.array(z.union([z.array(z.unknown()), z.record(z.string(), z.unknown())])),
  row_count: z.number().int().nonnegative(),
  truncated: z.boolean()
});

export class RenavonError extends Error {
  constructor(message: string, readonly code: "NOT_CONFIGURED" | "REQUEST_FAILED" | "INVALID_RESPONSE" | "TRUNCATED") {
    super(message);
    this.name = "RenavonError";
  }
}

export async function queryRenavon(query: string): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.RENAVON_API_KEY?.trim();
  if (!apiKey) throw new RenavonError("RENAVON_API_KEY is not configured.", "NOT_CONFIGURED");
  const response = await fetch("https://renavon.com/api/v1/query", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify({ query }), cache: "no-store", signal: AbortSignal.timeout(30_000)
  });
  if (!response.ok) throw new RenavonError(`Renavon returned HTTP ${response.status}.`, "REQUEST_FAILED");
  const parsed = responseSchema.safeParse(await response.json().catch(() => null));
  if (!parsed.success) throw new RenavonError("Renavon returned an invalid response.", "INVALID_RESPONSE");
  if (parsed.data.truncated) throw new RenavonError("Renavon response was truncated; sync was stopped.", "TRUNCATED");
  const names = parsed.data.columns.map((column) => column.name);
  return parsed.data.data.map((row) => Array.isArray(row) ? Object.fromEntries(names.map((name, index) => [name, row[index]])) : row);
}
