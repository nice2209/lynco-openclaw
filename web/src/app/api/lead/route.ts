import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type LeadPayload = {
  name?: string;
  company?: string;
  email?: string;
  message?: string;
};

const emailRegex = /^\S+@\S+\.\S+$/;

const trimString = (value: string | null | undefined) =>
  typeof value === "string" ? value.trim() : "";

const normalizeOptional = (value: string | null | undefined) => {
  const trimmed = trimString(value);
  return trimmed.length > 0 ? trimmed : undefined;
};

function getSupabaseClient() {
  const supabaseUrl = trimString(process.env.NEXT_PUBLIC_SUPABASE_URL);

  // Server-side only: use Service Role key to bypass RLS for lead capture inserts.
  // Do NOT expose this key to the client.
  const serviceRoleKey = trimString(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function POST(request: Request) {
  let data: LeadPayload = {};

  // Parse JSON body
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  // Validate required fields
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

  // Validate email format
  if (!emailRegex.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email." },
      { status: 400 }
    );
  }

  // Get Supabase client
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      {
        error:
          "Database is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 503 }
    );
  }

  // Insert lead into database
  const { data: insertedLead, error: insertError } = await supabase
    .from("leads")
    .insert({
      name,
      company,
      email,
      message,
      source: "Landing",
      status: "New",
    })
    .select()
    .single();

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json(
      {
        error: "Failed to save lead. Please try again later.",
        details:
          process.env.NODE_ENV === "development" ? insertError.message : undefined,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: insertedLead.id,
  });
}
