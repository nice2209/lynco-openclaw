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

    const { data: quote, error } = await supabase
      .from("quotes")
      .select(
        "id, customer_company, customer_name, customer_email, currency, subtotal_cents, discount_cents, tax_cents, total_cents, status, valid_until"
      )
      .eq("approval_token", token)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });

    const { data: items } = await supabase
      .from("quote_line_items")
      .select("description, quantity, unit_price_cents, discount_percent, line_total_cents, sort_order")
      .eq("quote_id", quote.id)
      .order("sort_order", { ascending: true });

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

    const { data: quote, error: qErr } = await supabase
      .from("quotes")
      .select("id, status")
      .eq("approval_token", token)
      .single();

    if (qErr) return NextResponse.json({ error: qErr.message }, { status: 404 });

    if (quote.status === "approved" || quote.status === "rejected") {
      return NextResponse.json({ ok: true, status: quote.status });
    }

    await supabase.from("quote_approvals").insert({
      quote_id: quote.id,
      decision: body.decision,
      comment: body.comment ?? null,
      actor_name: body.name,
      actor_email: body.email ?? null,
    });

    const nextStatus = body.decision === "approved" ? "approved" : "rejected";

    await supabase
      .from("quotes")
      .update({
        status: nextStatus,
        decided_at: new Date().toISOString(),
      })
      .eq("id", quote.id);

    await supabase.from("quote_events").insert({
      quote_id: quote.id,
      type: body.decision === "approved" ? "approved" : "rejected",
      actor_type: "user",
      actor_name: body.name,
      actor_email: body.email ?? null,
      metadata: { comment: body.comment ?? null },
    });

    return NextResponse.json({ ok: true, status: nextStatus });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
