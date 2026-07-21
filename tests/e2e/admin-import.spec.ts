import { expect, test } from "@playwright/test";

test("redirects an anonymous visitor to the admin login", async ({ page }) => {
  await page.goto("/zh-HK/admin/imports");
  await expect(page).toHaveURL(/\/zh-HK\/login/);
  await expect(page.getByRole("heading", { name: "管理員登入" })).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("請先登入管理員帳戶");
});

test("renders a secure email and password form", async ({ page }) => {
  await page.goto("/zh-HK/login");
  await expect(page.getByLabel("電郵")).toHaveAttribute("type", "email");
  await expect(page.getByLabel("密碼")).toHaveAttribute("type", "password");
  await expect(page.getByRole("button", { name: "安全登入" })).toBeVisible();
});