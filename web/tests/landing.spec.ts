import { test, expect } from "@playwright/test";

test("landing renders key sections and CTA", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /흩어진 업무를.*10분|10분/ })
  ).toBeVisible();

  // Section headings (mixed KR/EN)
  await expect(page.getByRole("heading", { name: /흐름만 연결하면/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /속도는 기능이 아니라/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /리드 → 매출까지/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^Lynco Lab:/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /보안과 분리는 기본값/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /가장 자주 묻는 질문/i })).toBeVisible();

  await page.getByRole("link", { name: /데모 요청하기/i }).first().click();
  await expect(page).toHaveURL(/#cta/);
});
