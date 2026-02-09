import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StoredRequest = {
  id: string;
  receivedAt: string;
  bodyText: string;
  parsedBody: unknown;
  headers: Record<string, string>;
};

const requestStore = new Map<string, StoredRequest>();

const isMockEnabled = () => process.env.NOTION_MOCK_ENABLED === "true";

const normalizeHeaders = (headers: Headers) =>
  Object.fromEntries(
    Array.from(headers.entries()).map(([key, value]) => [
      key.toLowerCase(),
      value,
    ])
  );

export async function POST(request: Request) {
  if (!isMockEnabled()) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const requestId = request.headers.get("x-lead-request-id")?.trim() || "default";
  const bodyText = await request.text();
  let parsedBody: unknown = null;

  try {
    parsedBody = JSON.parse(bodyText);
  } catch {
    parsedBody = null;
  }

  const entry: StoredRequest = {
    id: requestId,
    receivedAt: new Date().toISOString(),
    bodyText,
    parsedBody,
    headers: normalizeHeaders(request.headers),
  };

  requestStore.set(requestId, entry);

  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  if (!isMockEnabled()) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id") || "default";
  const entry = requestStore.get(id);

  if (!entry) {
    return NextResponse.json(
      { error: "No captured Notion request." },
      { status: 404 }
    );
  }

  return NextResponse.json(entry);
}
