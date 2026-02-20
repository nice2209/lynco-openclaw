import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const AcceptSchema = z.object({
  signerName: z.string().min(1),
  signerCompany: z.string().optional(),
  poNumber: z.string().optional(),
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
      .eq("customer_view_token", token)
      .limit(1)
      .maybeSingle();

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 500 });
    }
    if (!quote) {
      return NextResponse.json({ error: "Invalid customer link" }, { status: 404 });
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
    const body = AcceptSchema.parse(await req.json());
    const supabase = getSupabaseAdmin();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("id, status")
      .eq("customer_view_token", token)
      .limit(1)
      .maybeSingle();

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 500 });
    }
    if (!quote) {
      return NextResponse.json({ error: "Invalid customer link" }, { status: 404 });
    }

    if (quote.status === "customer_approved") {
      return NextResponse.json({ ok: true, status: quote.status });
    }

    const ip = req.headers.get("x-forwarded-for") || null;
    const ua = req.headers.get("user-agent") || null;

    const { error: acceptanceError } = await supabase
      .from("customer_acceptances")
      .insert({
        quote_id: quote.id,
        signer_name: body.signerName,
        signer_company: body.signerCompany ?? null,
        po_number: body.poNumber ?? null,
        comment: body.comment ?? null,
        ip,
        user_agent: ua,
      });

    if (acceptanceError) {
      return NextResponse.json({ error: acceptanceError.message }, { status: 500 });
    }

    const nextStatus = "customer_approved";

    const { error: updateError } = await supabase
      .from("quotes")
      .update({
        status: nextStatus,
        customer_approved_at: new Date().toISOString(),
      })
      .eq("id", quote.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    const { error: eventError } = await supabase.from("quote_events").insert({
      quote_id: quote.id,
      type: "customer_accepted",
      actor_type: "customer",
      actor_name: body.signerName,
      metadata: { poNumber: body.poNumber ?? null },
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
