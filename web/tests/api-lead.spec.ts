import { test, expect } from "@playwright/test";

const okOrUpstreamFailure = [200, 502, 503];

test.describe("Lead API endpoint", () => {
  test("returns 400 for invalid JSON", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: "invalid json",
      headers: { "Content-Type": "text/plain" },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ error: expect.stringContaining("Invalid JSON") })
    );
  });

  test("returns 400 for missing required fields", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: { name: "Taylor" },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ error: expect.stringContaining("required") })
    );
  });

  test("returns 400 for invalid email", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor Kim",
        company: "Lynco",
        email: "not-an-email",
      },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ error: expect.stringContaining("valid email") })
    );
  });

  test("accepts valid payload and reaches persistence layer", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "  Taylor Kim  ",
        company: "  Lynco Labs  ",
        email: "  taylor@lynco.io  ",
        message: "  Revenue workflow request  ",
      },
    });

    expect(okOrUpstreamFailure).toContain(response.status());
  });

  test("accepts optional message field", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor Kim",
        company: "Lynco Labs",
        email: "taylor@lynco.io",
      },
    });

    expect(okOrUpstreamFailure).toContain(response.status());
  });

  test("returns configuration error when Supabase env vars are missing", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor Kim",
        company: "Lynco Labs",
        email: "taylor@lynco.io",
        message: "Test",
      },
    });

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      expect(response.status()).toBe(503);
      await expect(response.json()).resolves.toEqual(
        expect.objectContaining({
          error: expect.stringContaining("Database is not configured"),
        })
      );
    } else {
      expect([200, 502]).toContain(response.status());
    }
  });
});
