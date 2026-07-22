import { describe, expect, it } from "vitest";
import { drawListQuerySchema } from "@/lib/draws/repository";

describe("drawListQuerySchema", () => {
  it("applies safe pagination defaults", () => { expect(drawListQuerySchema.parse({})).toMatchObject({ page: 1, pageSize: 20, sort: "date_desc" }); });
  it("caps invalid pagination and rejects wildcard searches safely", () => { const value = drawListQuerySchema.parse({ page: "-2", pageSize: "999", search: "2026%", sort: "unknown" }); expect(value).toMatchObject({ page: 1, pageSize: 20, sort: "date_desc" }); expect(value.search).toBeUndefined(); });
  it("accepts dates, draw search, and ascending order", () => { expect(drawListQuerySchema.parse({ from: "2026-01-01", to: "2026-07-22", search: "202677N", sort: "date_asc" })).toMatchObject({ from: "2026-01-01", to: "2026-07-22", search: "202677N", sort: "date_asc" }); });
});
