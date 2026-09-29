"use client";

import { useEffect, useRef, useState } from "react";
import type { VastuSummary } from "@/lib/vastuRules";
import { resolveRegion } from "@/lib/region";

type Props = {
  visible: boolean;
  summary: VastuSummary;
  customerName?: string;
  planImageDataUrl?: string | null;
  roomPoints?: { id: string; x: number; y: number }[];
};

// Domestic (India) Razorpay Payment Button — unchanged, existing pricing.
const BUTTON_ID_DOMESTIC = "pl_S6HHQm0InTxYG0";

// International pricing button for visitors browsing from outside India
// (NRI/foreign traffic). Price (₹499) is set on this button inside the
// Razorpay dashboard, not here — this file only ever references the button
// ID, so changing the price again later is a dashboard-only edit, no code
// change needed.
const BUTTON_ID_INTERNATIONAL = "pl_TOqlK3yEhZp1mR";

function resolveButtonId(): string {
  const region = resolveRegion();
  if (region === "INTL") {
    return BUTTON_ID_INTERNATIONAL;
  }
  return BUTTON_ID_DOMESTIC;
}

export default function PaymentStep({
  visible,
  summary,
  customerName,
  planImageDataUrl,
  roomPoints,
}: Props) {
  const razorpayFormRef = useRef<HTMLFormElement | null>(null);
  const [proCredits, setProCredits] = useState<number | null>(null);
  const [proLoading, setProLoading] = useState(true);
  const [creditBusy, setCreditBusy] = useState(false);
  const [creditMessage, setCreditMessage] = useState("");

  useEffect(() => {
    if (!visible) return;
    fetch("/api/pro/me", { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) return;
        const json = await res.json();
        if (json.account) setProCredits(Number(json.account.credits || 0));
      })
      .finally(() => setProLoading(false));
  }, [visible]);

  // Keep the sessionStorage payload fresh (e.g. as the user types their name)
  // WITHOUT touching the embedded Razorpay button — that's handled by its
  // own effect below so typing doesn't re-mount/flicker the payment button.
  useEffect(() => {
    if (!visible || proLoading || (proCredits !== null && proCredits > 0)) return;

    sessionStorage.setItem(
      "vastu_report_payload",
      JSON.stringify({
        // Leave undefined when blank so the PDF's own "Client" fallback
        // (src/lib/reportPdf.ts) applies, instead of printing a generic
        // "Prepared for: Customer" on every report.
        customerName: customerName?.trim() || undefined,
        summary,
        planImageDataUrl: planImageDataUrl || null,
        roomPoints: roomPoints || [],
      })
    );
  }, [visible, summary, customerName, planImageDataUrl, roomPoints, proCredits, proLoading]);

  // Mount the Razorpay "Payment Button" embed once when this step becomes
  // visible. Intentionally does NOT depend on customerName/summary — this is
  // the client-side Razorpay button flow, kept as-is.
  useEffect(() => {
    if (!visible) return;
    const form = razorpayFormRef.current;
    if (!form) return;

    // Clean slate (prevents duplicate embedded buttons)
    form.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", resolveButtonId());

    form.appendChild(script);

    return () => {
      // cleanup if component unmounts / rerenders
      try {
        form.innerHTML = "";
      } catch {}
    };
  }, [visible, proCredits, proLoading]);

  const useCredit = async () => {
    setCreditBusy(true);
    setCreditMessage("Generating and saving your report…");
    try {
      const res = await fetch("/api/pro/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName?.trim() || undefined,
          summary,
          planImageDataUrl: planImageDataUrl || undefined,
          roomPoints: roomPoints || [],
        }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Could not generate the report.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "vastu-report.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setProCredits((value) => Math.max(0, Number(value || 1) - 1));
      setCreditMessage("Report saved to My Reports and download started.");
    } catch (error) {
      setCreditMessage(error instanceof Error ? error.message : "Could not generate the report.");
    } finally {
      setCreditBusy(false);
    }
  };

  if (!visible) return null;

  if (proLoading) {
    return <div className="mt-3 text-center text-[11px] text-[#8b7357]">Checking your VastuCheck credits…</div>;
  }

  if (proCredits !== null && proCredits > 0) {
    return (
      <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center justify-between gap-3 text-[11px]">
          <span className="font-semibold text-emerald-900">VastuCheck Pro</span>
          <span className="rounded-full bg-white px-2 py-1 font-semibold text-emerald-800">{proCredits} credits remaining</span>
        </div>
        <button type="button" onClick={useCredit} disabled={creditBusy} className="mt-3 w-full rounded-xl bg-emerald-700 px-4 py-3 text-[12px] font-semibold text-white disabled:opacity-50">
          {creditBusy ? "Generating your report…" : "Use 1 credit & download full report"}
        </button>
        {creditMessage && <p className="mt-2 text-center text-[10px] text-emerald-900">{creditMessage}</p>}
        <a href="/my-reports" className="mt-2 block text-center text-[10px] font-semibold text-emerald-800">Open My Reports</a>
      </div>
    );
  }

  return (
    <div className="rzp-wrap">
      {/* Razorpay embed */}
      <form
        ref={razorpayFormRef}
        className="min-h-[52px] w-full"
      />
      <a href="/vastu-pro" className="mt-2 block text-center text-[10px] font-semibold text-amber-700">
        Need more reports? Get 10 reports for ₹799
      </a>
    </div>
  );
}
