"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

type LeadFormState = {
  name: string;
  company: string;
  email: string;
  message: string;
};

const initialState: LeadFormState = {
  name: "",
  company: "",
  email: "",
  message: "",
};

export default function LeadCaptureForm() {
  const [form, setForm] = useState<LeadFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : "Request failed. Please try again.";
        setStatus("error");
        setErrorMessage(message);
        return;
      }

      setForm(initialState);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="node-care is-static w-full max-w-xl bg-card p-10 shadow-2xl">
      <div className="mb-7">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">Initialize Access</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us about your team and we will map the first workflow with you.
        </p>
      </div>

      <div className="mb-5 space-y-3" aria-live="polite">
        {status === "success" && (
          <div role="status" className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            Request received. We will contact you shortly.
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
      </div>

      <form
        className="grid gap-5"
        onSubmit={handleSubmit}
        aria-label="Lead capture form"
        data-testid="lead-capture-form"
      >
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            disabled={isSubmitting}
            placeholder="Jane Smith"
            className="w-full rounded-2xl border border-transparent bg-secondary px-6 py-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-card disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="company"
            className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            autoComplete="organization"
            disabled={isSubmitting}
            placeholder="Acme Inc."
            className="w-full rounded-2xl border border-transparent bg-secondary px-6 py-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-card disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Corporate Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={isSubmitting}
            placeholder="name@company.com"
            className="w-full rounded-2xl border border-transparent bg-secondary px-6 py-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-card disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="ml-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
          >
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            disabled={isSubmitting}
            placeholder="Tell us about your workflow goals..."
            className="w-full resize-y rounded-2xl border border-transparent bg-secondary px-6 py-4 text-sm font-medium outline-none transition-all focus:border-primary focus:bg-card disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-2xl bg-primary px-5 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
