import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  message?: string;
};

const NOTION_API_URL = "https://api.notion.com/v1/pages";
const NOTION_VERSION = "2022-06-28";

const emailRegex = /^\S+@\S+\.\S+$/;

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

async function createNotionPage(
  databaseId: string,
  apiKey: string,
  properties: Record<string, unknown>
) {
  const response = await fetch(NOTION_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  return { response, payload } as const;
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

  const name = data.name?.trim() ?? "";
  const company = data.company?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() || undefined;

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

  const notionKey = process.env.NOTION_KEY?.trim();
  const notionDatabaseId = process.env.NOTION_DATABASE_ID?.trim();

  if (!notionKey || !notionDatabaseId) {
    return NextResponse.json(
      {
        error:
          "Notion integration is not configured. Set NOTION_KEY and NOTION_DATABASE_ID.",
      },
      { status: 503 }
    );
  }

  const baseProperties = buildBaseProperties({ name, email, message });
  const fullProperties = buildFullProperties({
    name,
    company,
    email,
    message,
  });

  const { response: fullResponse, payload: fullPayload } =
    await createNotionPage(notionDatabaseId, notionKey, fullProperties);

  if (fullResponse.ok) {
    return NextResponse.json({ ok: true });
  }

  if (fullPayload?.code === "validation_error") {
    const { response: fallbackResponse, payload: fallbackPayload } =
      await createNotionPage(notionDatabaseId, notionKey, baseProperties);

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
