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
    if (!razorpayFormRef.current) return;

    // 🔐 Save summary BEFORE Razorpay redirect
    sessionStorage.setItem(
      "vastu_report_payload",
      JSON.stringify({
        customerName: "Customer",
        summary,
      })
    );

    const form = razorpayFormRef.current;
    form.innerHTML = ""; // important if user navigates back/next

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute(
      "data-payment_button_id",
      "pl_S6HHQm0InTxYG0" // ✅ your button ID
    );

    form.appendChild(script);
  }, [visible, summary]);

  if (!visible) return null;

  return (
    <div className="flex h-full flex-col gap-3">
      {/* Product summary */}
      <div className="rounded-xl border border-amber-100 bg-[#fdf7ee] px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] font-semibold text-[#2b1b10]">
              Comprehensive Vastu Report (PDF)
            </div>
            <div className="text-[10px] text-[#8b7357]">
              Full room-wise verdicts + remedies
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-bold text-amber-700">₹ 49</div>
            <div className="text-[9px] text-[#8b7357]">One-time</div>
          </div>
        </div>
      </div>

      {/* Razorpay */}
      <div className="rounded-xl border border-amber-100 bg-[#fff8ea] p-3">
        <p className="text-[11px] font-semibold text-[#2b1b10]">
          Pay securely via Razorpay
        </p>
        <p className="text-[10px] text-[#8b7357]">
          UPI / Card / NetBanking supported
        </p>

        {/* ⚠️ Razorpay requires SCRIPT inside FORM */}
        <form
          ref={razorpayFormRef}
          className="mt-3 min-h-[52px] w-full"
        />

        <p className="mt-2 text-center text-[10px] text-[#a58b6e]">
          After successful payment, you’ll be redirected to download your PDF.
        </p>
      </div>
    </div>
  );
}