import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  message?: string;
};

const DEFAULT_NOTION_API_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

const emailRegex = /^\S+@\S+\.\S+$/;

const trimString = (value: string | null | undefined) =>
  typeof value === "string" ? value.trim() : "";

const normalizeOptional = (value: string | null | undefined) => {
  const trimmed = trimString(value);
  return trimmed.length > 0 ? trimmed : undefined;
};

const sanitizeDatabaseId = (value: string) =>
  value.replace(/[^a-fA-F0-9]/g, "").toLowerCase();

const resolveNotionApiUrl = () => {
  const envUrl = trimString(process.env.NOTION_API_URL);
  return envUrl || DEFAULT_NOTION_API_URL;
};

const resolveNotionConfig = (request: Request) => {
  const allowTestOverrides = process.env.NOTION_TEST_OVERRIDE === "true";
  const headerKey = allowTestOverrides
    ? trimString(request.headers.get("x-notion-key"))
    : "";
  const headerDatabaseId = allowTestOverrides
    ? trimString(request.headers.get("x-notion-database-id"))
    : "";

  const notionKey = trimString(process.env.NOTION_KEY) || headerKey;
  const rawDatabaseId =
    trimString(process.env.NOTION_DATABASE_ID) || headerDatabaseId;
  const databaseId = sanitizeDatabaseId(rawDatabaseId);

  if (!notionKey || !rawDatabaseId) {
    return { ok: false, reason: "missing" } as const;
  }

  if (!databaseId || databaseId.length !== 32) {
    return { ok: false, reason: "invalid" } as const;
  }

  return { ok: true, notionKey, databaseId } as const;
};

const buildBaseProperties = (data: {
  name: string;
  email: string;
  message?: string;
}) => {
  const properties: Record<string, unknown> = {
    Name: {
      title: [{ text: { content: data.name } }],
    },
    Email: {
      email: data.email,
    },
  };

  if (data.message) {
    properties.Message = {
      rich_text: [{ text: { content: data.message } }],
    };
  }

  return properties;
};

const buildFullProperties = (data: {
  name: string;
  company: string;
  email: string;
  message?: string;
}) => ({
  ...buildBaseProperties(data),
  Company: {
    rich_text: [{ text: { content: data.company } }],
  },
  Source: {
    select: { name: "Landing" },
  },
  "Created At": {
    date: { start: new Date().toISOString() },
  },
  Status: {
    select: { name: "New" },
  },
});

async function createNotionPage(options: {
  apiUrl: string;
  databaseId: string;
  apiKey: string;
  properties: Record<string, unknown>;
  requestId?: string;
}) {
  const { apiUrl, databaseId, apiKey, properties, requestId } = options;
  const bodyJson = JSON.stringify({
    parent: { database_id: databaseId },
    properties,
  });
  const bodyBytes = new TextEncoder().encode(bodyJson);

  const headers: HeadersInit = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
    "Notion-Version": NOTION_VERSION,
  };

  if (requestId) {
    headers["X-Lead-Request-Id"] = requestId;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: bodyBytes,
    });

    const payload = await response.json().catch(() => ({}));

    return { response, payload } as const;
  } catch {
    return {
      response: null,
      payload: { message: "Notion request failed to send." },
    } as const;
  }
}

export async function POST(request: Request) {
  let data: LeadPayload = {};

  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name = trimString(data.name);
  const company = trimString(data.company);
  const email = trimString(data.email);
  const message = normalizeOptional(data.message);

  if (!name || !company || !email) {
    return NextResponse.json(
      { error: "Name, company, and email are required." },
      { status: 400 }
    );
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email." },
      { status: 400 }
    );
  }

  const notionConfig = resolveNotionConfig(request);

  if (!notionConfig.ok) {
    return NextResponse.json(
      {
        error:
          notionConfig.reason === "invalid"
            ? "Notion integration is not configured. Check NOTION_DATABASE_ID."
            : "Notion integration is not configured. Set NOTION_KEY and NOTION_DATABASE_ID.",
      },
      { status: 503 }
    );
  }

  const notionApiUrl = resolveNotionApiUrl();
  const requestId =
    process.env.NOTION_MOCK_ENABLED === "true"
      ? trimString(request.headers.get("x-lead-request-id"))
      : "";

  const baseProperties = buildBaseProperties({ name, email, message });
  const fullProperties = buildFullProperties({
    name,
    company,
    email,
    message,
  });

  const { response: fullResponse, payload: fullPayload } =
    await createNotionPage({
      apiUrl: notionApiUrl,
      databaseId: notionConfig.databaseId,
      apiKey: notionConfig.notionKey,
      properties: fullProperties,
      requestId: requestId || undefined,
    });

  if (!fullResponse) {
    return NextResponse.json(
      {
        error:
          fullPayload?.message ??
          "Notion request failed while creating a lead.",
      },
      { status: 502 }
    );
  }

  if (fullResponse.ok) {
    return NextResponse.json({ ok: true });
  }

  if (fullPayload?.code === "validation_error") {
    const { response: fallbackResponse, payload: fallbackPayload } =
      await createNotionPage({
        apiUrl: notionApiUrl,
        databaseId: notionConfig.databaseId,
        apiKey: notionConfig.notionKey,
        properties: baseProperties,
        requestId: requestId || undefined,
      });

    if (!fallbackResponse) {
      return NextResponse.json(
        {
          error:
            fallbackPayload?.message ??
            "Notion request failed while using fallback properties.",
        },
        { status: 502 }
      );
    }

    if (fallbackResponse.ok) {
      return NextResponse.json({ ok: true, fallback: true });
    }

    return NextResponse.json(
      {
        error:
          fallbackPayload?.message ??
          "Notion request failed while using fallback properties.",
      },
      { status: fallbackResponse.status || 502 }
    );
  }

  return NextResponse.json(
    {
      error:
        fullPayload?.message ?? "Notion request failed while creating a lead.",
    },
    { status: fullResponse.status || 502 }
  );
}
