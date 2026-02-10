import { test, expect } from "@playwright/test";

test("landing renders key sections and security headers", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};

  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");

  await expect(page.getByTestId("marketing-page")).toBeVisible();
  await expect(page.getByTestId("hero-heading")).toContainText("Logic and");
  await expect(page.locator("#canvas-stage")).toBeVisible();
  await expect(page.getByTestId("insights-chart")).toBeVisible();
  await expect(page.getByTestId("lead-capture-form")).toBeVisible();

  await page.getByRole("link", { name: "Insights" }).click();
  await expect(page).toHaveURL(/#insights$/);
});

test("lead form trims payload and shows success on successful API response", async ({
  page,
}) => {
  await page.route("**/api/lead", async (route) => {
    const body = route.request().postDataJSON();

    expect(body).toMatchObject({
      name: "Taylor Kim",
      company: "Lynco Labs",
      email: "taylor@lynco.io",
      message: "Need a revenue workflow audit",
    });

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, id: "lead_test_01" }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Name").fill("  Taylor Kim  ");
  await page.getByLabel("Company").fill("  Lynco Labs  ");
  await page.getByLabel("Corporate Email").fill("  taylor@lynco.io  ");
  await page.getByLabel("Message (optional)").fill("  Need a revenue workflow audit  ");
  await page.getByRole("button", { name: "Submit Request" }).click();

  await expect(page.getByRole("status")).toContainText("Request received");
});

test("lead form shows API errors returned by backend", async ({ page }) => {
  await page.route("**/api/lead", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Name").fill("Alex Rivera");
  await page.getByLabel("Company").fill("Kolibri Systems");
  await page.getByLabel("Corporate Email").fill("alex@kolibri.dev");
  await page.getByRole("button", { name: "Submit Request" }).click();

  const alert = page
    .getByRole("alert")
    .filter({ hasText: /Database is not configured/i });
  await expect(alert).toContainText("Database is not configured");
});
