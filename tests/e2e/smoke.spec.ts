import { expect, test } from "@playwright/test";

test("loads the live Traditional Chinese dashboard", async ({ page }) => { await page.goto("/zh-HK"); await expect(page.getByRole("heading", { name: /用數據理解六合彩/ })).toBeVisible(); await expect(page.getByText("VERIFIED DATA", { exact: true })).toBeVisible(); await expect(page.getByText("DEMO DATA", { exact: true })).toHaveCount(0); });
test("shows the global responsible-use footer", async ({ page }) => { await page.goto("/zh-HK/methodology"); await expect(page.getByText(/本網站不接受投注/)).toBeVisible(); await expect(page.getByText(/只限 18 歲/)).toBeVisible(); });
