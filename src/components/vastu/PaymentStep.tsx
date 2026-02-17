"use client";

import { useEffect, useRef } from "react";
import type { VastuSummary } from "@/lib/vastuRules";

type Props = {
  visible: boolean;
  summary: VastuSummary;
};

export default function PaymentStep({ visible, summary }: Props) {
  const razorpayFormRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (!visible) return;
    const form = razorpayFormRef.current;
    if (!form) return;

    // 🔐 Save summary BEFORE Razorpay redirect
    sessionStorage.setItem(
      "vastu_report_payload",
      JSON.stringify({
        customerName: "Customer",
        summary,
      })
    );

    // Clean slate (prevents duplicate embedded buttons)
    form.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", "pl_S6HHQm0InTxYG0");

    form.appendChild(script);

    return () => {
      // cleanup if component unmounts / rerenders
      try {
        form.innerHTML = "";
      } catch {}
    };
  }, [visible, summary]);

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