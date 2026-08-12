"use client";

import { useEffect, useRef } from "react";
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

  // Keep the sessionStorage payload fresh (e.g. as the user types their name)
  // WITHOUT touching the embedded Razorpay button — that's handled by its
  // own effect below so typing doesn't re-mount/flicker the payment button.
  useEffect(() => {
    if (!visible) return;

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
  }, [visible, summary, customerName, planImageDataUrl, roomPoints]);

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
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="rzp-wrap">
      {/* Razorpay embed */}
      <form
        ref={razorpayFormRef}
        className="min-h-[52px] w-full"
      />
    </div>
  );
}