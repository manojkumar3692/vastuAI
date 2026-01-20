"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function PaymentSuccessPage() {
  const [msg, setMsg] = useState("Your Vastu report is downloading…");
  const [seconds, setSeconds] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const startedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------- Timer (UI only) ---------------- */
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const timeLabel = useMemo(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [seconds]);

  /* ---------------- Core download logic ---------------- */
  const downloadPdf = async () => {
    const raw = sessionStorage.getItem("vastu_report_payload");
    if (!raw) {
      setMsg("Missing report data. Please go back and regenerate.");
      return;
    }

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch {
      setMsg("Invalid report data. Please go back and regenerate.");
      return;
    }

    abortRef.current = new AbortController();

    try {
      setMsg("Preparing your PDF report… please stay on this page.");
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          customerName: payload.customerName || "Customer",
          summary: payload.summary,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate report");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "vastu-report.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Allow browser to start download before revoking
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      setMsg("Download started. You may safely close this page after completion.");
    } catch (e: any) {
      if (e?.name === "AbortError") return;

      console.error(e);
      setMsg(
        "Could not generate the PDF. Please click ‘Refresh & Try Again’."
      );
    } finally {
      setIsRetrying(false);
    }
  };

  /* ---------------- Auto-run once on page load ---------------- */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    downloadPdf();

    return () => abortRef.current?.abort();
  }, []);

  const progressWidth = Math.min(95, 18 + seconds * 0.7); // visual only

  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#2b1b10]">
      {/* soft glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_#f973161a,_transparent_60%),radial-gradient(circle_at_bottom,_#16a34a1a,_transparent_60%)]" />

      <div className="mx-auto max-w-xl px-4 py-14">
        <div className="rounded-3xl border border-amber-100 bg-white/95 p-5 shadow-md shadow-amber-100/70">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow">
              ✓
            </div>

            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                Payment Successful ✅
              </h1>
              <p className="mt-1 text-[12px] text-[#8b7357]">
                Please do not leave this page until your PDF download completes.
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#8b7357]">Timer</div>
              <div className="text-[12px] font-semibold">{timeLabel}</div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 rounded-2xl border border-amber-200 bg-[#fff8ea] p-4">
            <p className="text-[12px] font-semibold text-[#7a4b12]">
              Download in progress
            </p>
            <p className="mt-1 text-[11px] text-[#8b7357]">{msg}</p>

            <div className="mt-3 h-2 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <p className="mt-2 text-[10px] text-[#a58b6e]">
              On mobile, check your browser’s Downloads folder.
            </p>
          </div>

          {/* Support */}
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-[12px] font-semibold text-rose-800">
              If PDF not received within 2 minutes
            </p>
            <p className="mt-1 text-[11px] text-rose-800/80">
              Please share your payment screenshot to:
            </p>

            <div className="mt-2 rounded-xl bg-white px-3 py-2 text-[12px] font-semibold ring-1 ring-rose-200">
              houseofeonindia@gmail.com
            </div>

            <p className="mt-2 text-[11px] text-rose-800/80">
              We will verify and email your PDF within{" "}
              <span className="font-semibold">24 hours</span>.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setIsRetrying(true);
                downloadPdf();
              }}
              disabled={isRetrying}
              className="w-full rounded-xl bg-[#2b1b10] px-4 py-2 text-[12px] font-semibold text-amber-50 hover:bg-black disabled:opacity-50"
            >
              {isRetrying ? "Retrying…" : "Refresh & Try Again"}
            </button>

            <button
              type="button"
              onClick={() => (window.location.href = "/vastu")}
              className="w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-[12px] font-semibold text-[#5f4630] hover:bg-amber-50"
            >
              Go back to VastuCheck
            </button>

            <p className="text-center text-[10px] text-[#8b7357]">
              You may close this page after the download completes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}