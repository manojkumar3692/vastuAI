"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentState = "checking" | "confirmed" | "delayed" | "signed-out";

export default function ProPaymentStatusPage() {
  const [state, setState] = useState<PaymentState>("checking");
  const [credits, setCredits] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(1);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const baselineRaw = sessionStorage.getItem("vastu_pro_credits_before_payment");
    const baseline = baselineRaw === null ? null : Number(baselineRaw);

    const check = async (currentAttempt: number) => {
      try {
        const res = await fetch("/api/pro/me", { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 401) {
          setState("signed-out");
          return;
        }
        if (res.ok) {
          const json = await res.json();
          const currentCredits = Number(json.account?.credits || 0);
          setCredits(currentCredits);
          const latestPurchaseTime = json.latestPurchase?.created_at
            ? new Date(json.latestPurchase.created_at).getTime()
            : 0;
          const hasRecentPurchase =
            Number(json.latestPurchase?.credits_awarded || 0) === 10 &&
            Date.now() - latestPurchaseTime < 2 * 60 * 60 * 1000;
          const paymentAddedCredits = baseline === null
            ? hasRecentPurchase
            : currentCredits >= baseline + 10;
          if (paymentAddedCredits) {
            setState("confirmed");
            sessionStorage.removeItem("vastu_pro_credits_before_payment");
            return;
          }
        }
      } catch {
        // A temporary network error is handled by the next polling attempt.
      }

      if (currentAttempt < 20) {
        setAttempt(currentAttempt + 1);
        timer = setTimeout(() => check(currentAttempt + 1), 3000);
      } else {
        setState("delayed");
      }
    };

    check(1);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, []);

  const confirmed = state === "confirmed";
  const checking = state === "checking";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf7ef] px-4 py-10 text-[#2b1b10]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,.2),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(16,185,129,.14),transparent_30%)]" />
      <div className="relative w-full max-w-xl">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-2 text-xs font-bold tracking-[.14em] text-amber-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-emerald-200">ॐ</span>
          VASTUCHECK.IN
        </Link>

        <section className="rounded-[28px] border border-amber-200 bg-white p-5 text-center shadow-[0_24px_70px_rgba(91,61,29,.15)] sm:p-8" aria-live="polite">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl ${confirmed ? "bg-emerald-100 text-emerald-700" : state === "delayed" ? "bg-amber-100 text-amber-800" : state === "signed-out" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800"}`}>
            {confirmed ? "✓" : state === "delayed" ? "!" : state === "signed-out" ? "↗" : <span className="h-7 w-7 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" />}
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-amber-700">
            {confirmed ? "Payment confirmed" : checking ? "Secure payment check" : state === "signed-out" ? "Sign-in required" : "Still processing"}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            {confirmed ? "Your 10 credits are ready" : checking ? "We’re confirming your payment" : state === "signed-out" ? "Open your Pro account" : "Razorpay is taking a little longer"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#735b43]">
            {confirmed
              ? "Everything is set. Upload your next floor plan or visit My Reports to manage completed PDFs."
              : checking
                ? "Keep this page open. Credits are added only after Razorpay securely confirms the successful payment."
                : state === "signed-out"
                  ? "Sign in with the mobile number and PIN used before payment, then return to your reports."
                  : "You do not need to pay again. Credits will appear automatically when the payment confirmation reaches us."}
          </p>

          {checking && (
            <div className="mt-6 rounded-2xl bg-[#fbf7ef] p-4 text-left">
              <div className="flex items-center justify-between text-xs"><span className="font-semibold">Waiting for Razorpay</span><span className="text-[#80684f]">Check {attempt}/20</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-100"><div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all" style={{ width: `${Math.max(8, attempt * 5)}%` }} /></div>
              <p className="mt-2 text-[11px] text-[#80684f]">Usually completed within a few seconds</p>
            </div>
          )}

          {confirmed && credits !== null && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-[.15em] text-emerald-800">Current balance</p>
              <p className="mt-1 text-4xl font-extrabold text-emerald-800">{credits}</p>
              <p className="text-xs text-emerald-800">report credits available</p>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href={state === "signed-out" ? "/vastu-pro" : "/my-reports"} className="rounded-xl bg-[#2b1b10] px-4 py-3.5 font-bold text-white">
              {state === "signed-out" ? "Sign in to Pro" : "Open My Reports"}
            </Link>
            <Link href={confirmed ? "/vastu?pro=1" : "/vastu-pro"} className="rounded-xl border border-amber-200 bg-white px-4 py-3.5 font-bold text-amber-900">
              {confirmed ? "Check a floor plan" : "Back to Pro"}
            </Link>
          </div>
          {state === "delayed" && <p className="mt-4 text-xs text-[#80684f]">Need help? <Link href="/contact" className="font-semibold text-amber-800 underline">Contact support</Link> with your Razorpay payment ID.</p>}
        </section>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] text-[#80684f] sm:text-xs">
          <span>🔒 Secure matching</span><span>↻ Auto refresh</span><span>✓ No second payment</span>
        </div>
      </div>
    </main>
  );
}
