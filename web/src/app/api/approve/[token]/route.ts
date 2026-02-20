import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const DecideSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  name: z.string().min(1),
  email: z.string().email().optional(),
  comment: z.string().max(2000).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = getSupabaseAdmin();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select(
        "id, customer_company, customer_name, customer_email, currency, subtotal_cents, discount_cents, tax_cents, total_cents, status, valid_until"
      )
      .eq("approval_token", token)
      .limit(1)
      .maybeSingle();

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 500 });
    }
    if (!quote) {
      return NextResponse.json({ error: "Invalid approval token" }, { status: 404 });
    }

    const { data: items, error: itemsError } = await supabase
      .from("quote_line_items")
      .select(
        "description, quantity, unit_price_cents, discount_percent, line_total_cents, sort_order"
      )
      .eq("quote_id", quote.id)
      .order("sort_order", { ascending: true });

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ quote, items: items ?? [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = DecideSchema.parse(await req.json());
    const supabase = getSupabaseAdmin();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("id, status")
      .eq("approval_token", token)
      .limit(1)
      .maybeSingle();

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 500 });
    }
    if (!quote) {
      return NextResponse.json({ error: "Invalid approval token" }, { status: 404 });
    }

    if (quote.status === "approved" || quote.status === "rejected") {
      return NextResponse.json({ ok: true, status: quote.status });
    }

    const { error: approvalError } = await supabase.from("quote_approvals").insert({
      quote_id: quote.id,
      decision: body.decision,
      comment: body.comment ?? null,
      actor_name: body.name,
      actor_email: body.email ?? null,
    });

    if (approvalError) {
      return NextResponse.json({ error: approvalError.message }, { status: 500 });
    }

    const nextStatus = body.decision;

    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        status: nextStatus,
        decided_at: new Date().toISOString(),
      })
      .eq("id", quote.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { error: eventError } = await supabase.from("quote_events").insert({
      quote_id: quote.id,
      type: nextStatus,
      actor_type: "user",
      actor_name: body.name,
      actor_email: body.email ?? null,
      metadata: { comment: body.comment ?? null },
    });

    if (eventError) {
      return NextResponse.json({ error: eventError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status: nextStatus });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
