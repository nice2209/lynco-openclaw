import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const PatchSchema = z.object({
  status: z
    .enum([
      "draft",
      "pending_approval",
      "approved",
      "rejected",
      "sent",
      "customer_approved",
      "cancelled",
    ])
    .optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseAdmin();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabase
      .from("quote_line_items")
      .select("*")
      .eq("quote_id", id)
      .order("sort_order", { ascending: true });

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    const { data: events } = await supabase
      .from("quote_events")
      .select("*")
      .eq("quote_id", id)
      .order("created_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ quote, items, events: events ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = PatchSchema.parse(await req.json());
    const supabase = getSupabaseAdmin();

    const { data: existing, error: existingError } = await supabase
      .from("quotes")
      .select("status")
      .eq("id", id)
      .single();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 404 });
    }

    if (!body.status) {
      return NextResponse.json({ ok: true });
    }

    const { error: updError } = await supabase
      .from("quotes")
      .update({
        status: body.status,
        sent_at: body.status === "sent" ? new Date().toISOString() : undefined,
      })
      .eq("id", id);

    if (updError) {
      return NextResponse.json({ error: updError.message }, { status: 500 });
    }

    await supabase.from("quote_events").insert({
      quote_id: id,
      type: "status_changed",
      actor_type: "system",
      metadata: { from: existing.status, to: body.status },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
