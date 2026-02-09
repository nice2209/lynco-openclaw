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

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
            : "요청 처리 중 문제가 발생했습니다. 다시 시도해주세요.";
        setStatus("error");
        setErrorMessage(message);
        return;
      }

      setForm(initialState);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-emerald-500/20 bg-[#0f1d18] p-6 shadow-xl shadow-emerald-900/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-200">Lead Capture</p>
          <h3 className="mt-2 text-xl font-semibold text-white">
            데모 요청 정보를 남겨주세요.
          </h3>
          <p className="mt-2 text-sm text-emerald-100/70">
            문의 주시면 1영업일 내에 연락드립니다.
          </p>
        </div>
        <span className="hidden rounded-full border border-emerald-400/40 px-3 py-1 text-xs text-emerald-100 md:inline-flex">
          Landing Form
        </span>
      </div>

      <div className="mt-4 space-y-3" aria-live="polite">
        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            요청이 접수되었습니다. 데모 일정 확인을 위해 곧 연락드리겠습니다.
          </div>
        ) : null}
        {status === "error" ? (
          <div
            role="alert"
            className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
          >
            {errorMessage}
          </div>
        ) : null}
      </div>

      <form
        className="mt-6 grid gap-4"
        aria-label="Lead capture form"
        onSubmit={handleSubmit}
      >
        <label className="grid gap-2 text-sm text-emerald-100/80">
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            autoComplete="name"
            className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:outline-none"
            placeholder="홍길동"
          />
        </label>
        <label className="grid gap-2 text-sm text-emerald-100/80">
          Company
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            autoComplete="organization"
            className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:outline-none"
            placeholder="회사명을 입력해주세요"
          />
        </label>
        <label className="grid gap-2 text-sm text-emerald-100/80">
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={isSubmitting}
            required
            autoComplete="email"
            className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:outline-none"
            placeholder="name@company.com"
          />
        </label>
        <label className="grid gap-2 text-sm text-emerald-100/80">
          Message (optional)
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            disabled={isSubmitting}
            rows={4}
            className="rounded-2xl border border-emerald-500/20 bg-[#0b1512] px-4 py-3 text-sm text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:outline-none"
            placeholder="현재 운영 중인 프로세스에서 가장 답답한 지점을 알려주세요."
          />
        </label>
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            데모 요청 보내기
          </button>
          {isSubmitting ? (
            <span className="text-xs text-emerald-100/70">전송 중...</span>
          ) : null}
        </div>
      </form>
    </div>
  );
}
