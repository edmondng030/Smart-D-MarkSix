import { expect, test } from "@playwright/test";

test("renders the CSV import workbench without publishing data", async ({ page }) => {
  await page.goto("/zh-HK/admin/imports");
  await expect(page.getByRole("heading", { name: "CSV 資料匯入與審核" })).toBeVisible();
  await expect(page.getByText("選擇 CSV 並建立驗證預覽")).toBeVisible();
  await expect(page.getByText("上載不會自動公開資料")).toBeVisible();
});
