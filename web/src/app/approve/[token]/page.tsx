"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/money";

type Quote = {
  id: string;
  customer_company: string;
  customer_name: string;
  customer_email: string;
  currency: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  status: string;
};

export default function ApprovePage({ params }: { params: { token: string } }) {
  const token = params.token;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<
    Array<{
      description: string;
      quantity: number;
      unit_price_cents: number;
      discount_percent: number;
      line_total_cents: number;
    }>
  >([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [doneStatus, setDoneStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/approve/${token}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Invalid token");
        if (!mounted) return;
        setQuote(json.quote);
        setItems(json.items || []);
      } catch (e: unknown) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  async function decide(decision: "approved" | "rejected") {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/approve/${token}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ decision, name, email: email || undefined, comment }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      setDoneStatus(json.status);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <div className="rounded-[2rem] border border-border bg-card p-10">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        <div className="rounded-[2rem] border border-red-500/30 bg-red-500/10 p-10 text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-[0.35em] text-muted-foreground">
          Approval
        </div>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          {quote.customer_company}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {quote.customer_name} · {quote.customer_email}
        </p>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-10 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-bold">Quote summary</div>
          <div className="rounded-full bg-secondary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
            {doneStatus || quote.status}
          </div>
        </div>

        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-start justify-between rounded-2xl bg-secondary px-5 py-4">
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

        <div className="mt-8 grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{formatMoney(quote.subtotal_cents, quote.currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span className="font-semibold">{formatMoney(quote.tax_cents, quote.currency)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-bold">Total</span>
            <span className="text-lg font-bold">{formatMoney(quote.total_cents, quote.currency)}</span>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Your name
            <input className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary" value={name} onChange={(e)=>setName(e.target.value)} />
          </label>
          <label className="space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Email (optional)
            <input className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </label>
        </div>

        <label className="mt-4 block space-y-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Comment (optional)
          <textarea className="w-full rounded-2xl bg-secondary px-5 py-3 text-sm font-medium text-foreground outline-none focus:bg-card focus:ring-2 focus:ring-primary" rows={3} value={comment} onChange={(e)=>setComment(e.target.value)} />
        </label>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm">
            {error}
          </div>
        ) : null}

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          <button
            className="rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground disabled:opacity-60"
            disabled={busy || !name || !!doneStatus}
            onClick={() => decide("approved")}
          >
            {busy ? "Submitting…" : "Approve"}
          </button>
          <button
            className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-bold disabled:opacity-60"
            disabled={busy || !name || !!doneStatus}
            onClick={() => decide("rejected")}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
