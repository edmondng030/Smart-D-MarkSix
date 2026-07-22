import { expect, test } from "@playwright/test";

test("renders verified analytics on desktop and mobile", async ({ page }) => {
  await page.goto("/zh-HK/analytics?window=30");
  await expect(page.getByRole("heading", { name: "歷史數據分析" })).toBeVisible();
  await expect(page.getByText("樣本期數").locator("..").getByText("30", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "1–49 號碼統計" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "常見號碼 Pair" })).toBeVisible();
});
