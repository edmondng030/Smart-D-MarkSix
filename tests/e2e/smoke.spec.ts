import { expect, test } from "@playwright/test";

test("loads the Traditional Chinese dashboard", async ({ page }) => { await page.goto("/zh-HK"); await expect(page.getByRole("heading", { name: /看清每一個號碼背後/ })).toBeVisible(); await expect(page.getByText("DEMO DATA")).toBeVisible(); });
test("shows the global responsible-use footer", async ({ page }) => { await page.goto("/zh-HK/methodology"); await expect(page.getByText(/本網站不接受投注/)).toBeVisible(); await expect(page.getByText(/只限 18 歲/)).toBeVisible(); });
