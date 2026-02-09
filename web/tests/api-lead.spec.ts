import { test, expect } from "@playwright/test";

const mockNotionHeaders = {
  "x-notion-key": "test-notion-key",
  "x-notion-database-id": "11111111-1111-1111-1111-111111111111",
};

const createRequestId = () =>
  `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;

test.describe("Lead API Endpoint", () => {
  test("returns 400 for invalid JSON", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: "invalid json",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("Invalid JSON");
  });

  test("returns 400 for missing required fields", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor",
        // missing company and email
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("required");
  });

  test("returns 400 for invalid email format", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor Kim",
        company: "Lynco",
        email: "not-an-email",
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toContain("valid email");
  });

  test("trims whitespace from input fields", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "  Taylor Kim  ",
        company: "  Lynco Labs  ",
        email: "  taylor@lynco.io  ",
        message: "  Test message  ",
      },
    });

    // Should return 503 (Notion not configured) or 200 (Notion configured)
    // Either way, it means validation passed
    expect([200, 503]).toContain(response.status());
  });

  test("sends UTF-8 Korean payload to Notion mock", async ({ request }) => {
    const requestId = createRequestId();
    const leadPayload = {
      name: "홍길동",
      company: "린코 랩스",
      email: "hong@lynco.io",
      message: "안녕하세요. 데모를 요청합니다.",
    };

    const response = await request.post("/api/lead", {
      data: leadPayload,
      headers: {
        ...mockNotionHeaders,
        "x-lead-request-id": requestId,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.ok).toBe(true);

    const captureResponse = await request.get(
      `/api/notion-mock?id=${requestId}`
    );
    expect(captureResponse.status()).toBe(200);
    const captured = await captureResponse.json();

    expect(typeof captured.bodyText).toBe("string");
    expect(captured.bodyText).toContain("홍길동");

    expect(captured.headers["content-type"]).toContain("application/json");
    expect(captured.headers["content-type"]).toContain("charset=utf-8");

    const parsed = captured.parsedBody;
    expect(parsed.parent.database_id).toBe(
      "11111111111111111111111111111111"
    );
    expect(parsed.properties.Name.title[0].text.content).toBe(leadPayload.name);
    expect(parsed.properties.Company.rich_text[0].text.content).toBe(
      leadPayload.company
    );
    expect(parsed.properties.Email.email).toBe(leadPayload.email);
    expect(parsed.properties.Message.rich_text[0].text.content).toBe(
      leadPayload.message
    );
  });

  test("accepts empty message field", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor Kim",
        company: "Lynco Labs",
        email: "taylor@lynco.io",
        // message is optional
      },
    });

    expect([200, 503]).toContain(response.status());
  });

  test("returns 503 when Notion env vars are not set", async ({ request }) => {
    // This test assumes NOTION_KEY and NOTION_DATABASE_ID are NOT set in CI
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor Kim",
        company: "Lynco Labs",
        email: "taylor@lynco.io",
        message: "Test",
      },
    });

    // In CI without Notion credentials, should return 503
    if (!process.env.NOTION_KEY || !process.env.NOTION_DATABASE_ID) {
      expect(response.status()).toBe(503);
      const body = await response.json();
      expect(body.error).toContain("Notion integration is not configured");
    }
  });

  test("handles mixed Korean and English text", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor 김",
        company: "Lynco 린코",
        email: "taylor@lynco.io",
        message: "Hello 안녕하세요! I would like a demo 데모를 요청합니다.",
      },
    });

    expect([200, 503]).toContain(response.status());
  });

  test("handles special characters and emojis", async ({ request }) => {
    const response = await request.post("/api/lead", {
      data: {
        name: "Taylor O'Brien-Kim",
        company: "Lynco & Co. 🚀",
        email: "taylor@lynco.io",
        message: "Looking forward to seeing the demo! 기대됩니다 😊",
      },
    });

    expect([200, 503]).toContain(response.status());
  });
});
