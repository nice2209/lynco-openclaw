import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { computeLineTotalCents, computeTotals } from "@/lib/quoteMath";
import { randomToken } from "@/lib/tokens";

const LineItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  discountPercent: z.number().min(0).max(100).default(0),
  sortOrder: z.number().int().default(0),
});

const CreateQuoteSchema = z.object({
  customerCompany: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  currency: z.string().min(3).max(3).default("USD"),
  validUntil: z.string().optional(),
  taxCents: z.number().int().nonnegative().default(0),
  lineItems: z.array(LineItemSchema).min(1),
});

export async function POST(req: Request) {
  try {
    const body = CreateQuoteSchema.parse(await req.json());

    const items = body.lineItems.map((li) => ({
      description: li.description,
      quantity: li.quantity,
      unitPriceCents: li.unitPriceCents,
      discountPercent: li.discountPercent,
      sortOrder: li.sortOrder,
    }));

    const computedItems = items.map((li) => ({
      ...li,
      lineTotalCents: computeLineTotalCents(li),
    }));

    const totals = computeTotals(computedItems, body.taxCents);

    const supabase = getSupabaseAdmin();

    const approvalToken = randomToken();
    const customerViewToken = randomToken();

    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .insert({
        customer_company: body.customerCompany,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        currency: body.currency,
        valid_until: body.validUntil ? body.validUntil : null,
        subtotal_cents: totals.subtotalCents,
        tax_cents: totals.taxCents,
        total_cents: totals.totalCents,
        status: "draft",
        approval_token: approvalToken,
        customer_view_token: customerViewToken,
      })
      .select("*")
      .single();

    if (quoteError) {
      return NextResponse.json({ error: quoteError.message }, { status: 500 });
    }

    const { error: itemsError } = await supabase.from("quote_line_items").insert(
      computedItems.map((li) => ({
        quote_id: quote.id,
        description: li.description,
        quantity: li.quantity,
        unit_price_cents: li.unitPriceCents,
        discount_percent: li.discountPercent,
        line_total_cents: li.lineTotalCents,
        sort_order: li.sortOrder,
      }))
    );

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    await supabase.from("quote_events").insert({
      quote_id: quote.id,
      type: "created",
      actor_type: "system",
      metadata: { source: "api" },
    });

    return NextResponse.json({
      id: quote.id,
      quoteUrl: `/quote/${quote.id}`,
      approvalUrl: `/approve/${approvalToken}`,
      customerUrl: `/q/${customerViewToken}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("quotes")
      .select(
        "id, customer_company, customer_name, customer_email, currency, total_cents, status, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ quotes: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
