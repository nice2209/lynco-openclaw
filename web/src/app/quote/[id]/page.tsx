import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

async function getData(id: string) {
  const res = await fetch(`/api/quotes/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getData(id);
  const quote = data.quote;
  const items = data.items as Array<{
    id: string;
    description: string;
    quantity: number;
    unit_price_cents: number;
    discount_percent: number;
    line_total_cents: number;
  }>;
  const events = data.events as Array<{
    id: number;
    type: string;
    actor_type: string;
    actor_name: string | null;
    created_at: string;
  }>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-12">
      <div className="mb-10 flex flex-col gap-2">
        <div className="text-xs font-bold uppercase tracking-[0.35em] text-muted-foreground">
          Quote Status
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{quote.customer_company}</h1>
        <div className="text-sm text-muted-foreground">
          {quote.customer_name} · {quote.customer_email}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <section className="rounded-[2rem] border border-border bg-card p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-lg font-bold">Line items</div>
            <div className="rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
              {quote.status}
            </div>
          </div>

          <div className="space-y-3">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex items-start justify-between rounded-2xl bg-secondary px-5 py-4"
              >
                <div>
                  <div className="font-semibold">{it.description}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    qty {it.quantity} · unit {it.unit_price_cents}c · discount {it.discount_percent}%
                  </div>
                </div>
                <div className="text-sm font-bold">
                  {formatMoney(it.line_total_cents, quote.currency)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <div className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
              Timeline
            </div>
            <div className="space-y-2 text-sm">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-3"
                >
                  <div>
                    <div className="font-semibold">{e.type}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.actor_name || e.actor_type}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-[2rem] border border-border bg-card p-8 shadow-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Totals
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">
                {formatMoney(quote.subtotal_cents, quote.currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-semibold">
                {formatMoney(quote.tax_cents, quote.currency)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-bold">Total</span>
              <span className="text-lg font-bold">
                {formatMoney(quote.total_cents, quote.currency)}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <a
              className="block w-full rounded-2xl bg-primary px-5 py-4 text-center text-sm font-bold text-primary-foreground"
              href={`/approve/${quote.approval_token}`}
            >
              Open approval page
            </a>
            <a
              className="block w-full rounded-2xl border border-border bg-card px-5 py-4 text-center text-sm font-bold"
              href={`/q/${quote.customer_view_token}`}
            >
              Open customer page
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
