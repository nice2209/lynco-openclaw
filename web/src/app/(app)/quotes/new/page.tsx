"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";

type LineItem = {
  description: string;
  quantity: number;
  unitPriceCents: number;
  discountPercent: number;
  sortOrder: number;
};

export default function NewQuotePage() {
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [taxCents, setTaxCents] = useState(0);

  const [items, setItems] = useState<LineItem[]>([
    {
      description: "",
      quantity: 1,
      unitPriceCents: 0,
      discountPercent: 0,
      sortOrder: 0,
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    | null
    | { id: string; quoteUrl: string; approvalUrl: string; customerUrl: string }
  >(null);

  const totals = useMemo(() => {
    const lineTotals = items.map((it) => {
      const qty = Number(it.quantity || 0);
      const unit = Number(it.unitPriceCents || 0);
      const d = Math.min(100, Math.max(0, Number(it.discountPercent || 0)));
      return Math.round(qty * unit * (1 - d / 100));
    });
    const subtotal = lineTotals.reduce((a, b) => a + b, 0);
    const total = subtotal + (taxCents || 0);
    return { subtotal, total };
  }, [items, taxCents]);

  async function onSubmit() {
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerCompany,
          customerName,
          customerEmail,
          currency,
          taxCents,
          lineItems: items,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create quote");

      setResult(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">New Quote</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create a quote, then share the approval link.
        </p>
      </div>

      {error ? (
        <div className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mb-10 rounded-[2rem] border border-border bg-card p-8">
          <div className="text-sm font-bold">Quote created</div>
          <div className="mt-4 grid gap-2 text-sm">
            <a className="text-primary underline" href={result.quoteUrl}>
              View internal quote page
            </a>
            <a className="text-primary underline" href={result.approvalUrl}>
              Approval link (manager)
            </a>
            <a className="text-primary underline" href={result.customerUrl}>
              Customer link
            </a>
          </div>
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="rounded-[2rem] border border-border bg-card p-8">
            <h2 className="mb-6 text-lg font-bold">Customer</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Company
                <input
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                />
              </label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Contact name
                <input
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Email
                <input
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </label>
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Currency
                <select
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="KRW">KRW</option>
                  <option value="JPY">JPY</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold">Line items</h2>
              <button
                type="button"
                className="rounded-full border border-border bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
                onClick={() =>
                  setItems((prev) => [
                    ...prev,
                    {
                      description: "",
                      quantity: 1,
                      unitPriceCents: 0,
                      discountPercent: 0,
                      sortOrder: prev.length,
                    },
                  ])
                }
              >
                Add
              </button>
            </div>

            <div className="grid gap-4">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="grid gap-3 rounded-2xl bg-secondary p-4 md:grid-cols-[1fr_90px_140px_110px_auto]"
                >
                  <input
                    placeholder="Description"
                    className="rounded-xl bg-card px-4 py-2 text-sm outline-none"
                    value={it.description}
                    onChange={(e) =>
                      setItems((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], description: e.target.value };
                        return next;
                      })
                    }
                  />
                  <input
                    type="number"
                    min={1}
                    className="rounded-xl bg-card px-4 py-2 text-sm outline-none"
                    value={it.quantity}
                    onChange={(e) =>
                      setItems((prev) => {
                        const next = [...prev];
                        next[idx] = {
                          ...next[idx],
                          quantity: Number(e.target.value || 0),
                        };
                        return next;
                      })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    className="rounded-xl bg-card px-4 py-2 text-sm outline-none"
                    value={it.unitPriceCents}
                    onChange={(e) =>
                      setItems((prev) => {
                        const next = [...prev];
                        next[idx] = {
                          ...next[idx],
                          unitPriceCents: Number(e.target.value || 0),
                        };
                        return next;
                      })
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="rounded-xl bg-card px-4 py-2 text-sm outline-none"
                    value={it.discountPercent}
                    onChange={(e) =>
                      setItems((prev) => {
                        const next = [...prev];
                        next[idx] = {
                          ...next[idx],
                          discountPercent: Number(e.target.value || 0),
                        };
                        return next;
                      })
                    }
                  />
                  <button
                    type="button"
                    className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]"
                    onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={items.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Tax (cents)
                <input
                  type="number"
                  min={0}
                  className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary"
                  value={taxCents}
                  onChange={(e) => setTaxCents(Number(e.target.value || 0))}
                />
              </label>
            </div>
          </section>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="rounded-2xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 disabled:opacity-60"
              disabled={submitting}
              onClick={onSubmit}
            >
              {submitting ? "Creating…" : "Create Quote"}
            </button>
          </div>
        </div>

        <aside className="h-fit rounded-[2rem] border border-border bg-card p-8 shadow-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Summary
          </div>
          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">
                {formatMoney(totals.subtotal, currency)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-semibold">{formatMoney(taxCents, currency)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-bold">Total</span>
              <span className="text-lg font-bold">
                {formatMoney(totals.total, currency)}
              </span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-secondary p-4 text-xs text-muted-foreground">
            Unit price input is <b>cents</b> for MVP speed.
          </div>
        </aside>
      </div>
    </div>
  );
}
