import { test, expect } from "@playwright/test";

test("landing renders key sections and CTA", async ({ page }) => {
  const resp = await page.goto("/");
  const headers = resp?.headers() || {};
  // Basic security headers
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");

  await expect(page.getByRole("heading", { name: /흩어진 업무를.*10분|10분/ })).toBeVisible();

  // Section headings (mixed KR/EN)
  await expect(
    page.getByRole("heading", { name: /흐름만 연결하면/i })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /속도는 기능이 아니라/i })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /리드 → 매출까지/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /^Lynco Lab:/i })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /보안과 분리는 기본값/i })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /가장 자주 묻는 질문/i })).toBeVisible();

  await page.getByRole("link", { name: /데모 요청하기/i }).first().click();
  await expect(page).toHaveURL(/#cta/);
});

test("lead capture shows error when Notion is not configured", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Name").fill("Taylor Kim");
  await page.getByLabel("Company").fill("Lynco Labs");
  await page.getByLabel("Email").fill("taylor@lynco.io");
  await page.getByLabel("Message (optional)").fill("Playwright test lead.");

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/lead") &&
      response.request().method() === "POST"
  );

  await page.getByRole("button", { name: "데모 요청 보내기" }).click();

  const response = await responsePromise;
  expect(response.status()).toBe(503);

  const appAlert = page
    .locator('div[role="alert"]')
    .filter({ hasText: /Notion integration is not configured/i });
  await expect(appAlert).toBeVisible();
});

test("lead capture form handles Korean text correctly", async ({ page }) => {
  await page.goto("/");

  // Fill form with Korean text
  await page.getByLabel("Name").fill("홍길동");
  await page.getByLabel("Company").fill("린코 랩스");
  await page.getByLabel("Email").fill("hong@lynco.io");
  await page
    .getByLabel("Message (optional)")
    .fill("안녕하세요. 데모를 요청합니다.");

  const requestPromise = page.waitForRequest(
    (request) => request.url().includes("/api/lead") && request.method() === "POST"
  );

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/lead") &&
      response.request().method() === "POST"
  );

  await page.getByRole("button", { name: "데모 요청 보내기" }).click();

  // Verify the request contains properly encoded Korean text
  const request = await requestPromise;
  const requestBody = request.postDataJSON();
  expect(requestBody.name).toBe("홍길동");
  expect(requestBody.company).toBe("린코 랩스");
  expect(requestBody.message).toBe("안녕하세요. 데모를 요청합니다.");

  const response = await responsePromise;

  // Should return 503 if Notion is not configured, or 200 if it is
  expect([200, 503]).toContain(response.status());
});
