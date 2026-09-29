"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RequestStatus = "idle" | "pending" | "success" | "error";

export default function PaymentSuccessPage() {
  const [msg, setMsg] = useState("Your Vastu report is downloading…");
  const [seconds, setSeconds] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle");

  const startedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------- Live wait-time estimate ---------------- */
  useEffect(() => {
    if (requestStatus !== "pending") return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [requestStatus]);

  /* Warn only while the report API request is still running. */
  useEffect(() => {
    if (requestStatus !== "pending") return;

    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [requestStatus]);

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
      setRequestStatus("error");
      return;
    }

    let payload: any;
    try {
      payload = JSON.parse(raw);
    } catch {
      setMsg("Invalid report data. Please go back and regenerate.");
      setRequestStatus("error");
      return;
    }

    abortRef.current = new AbortController();
    setSeconds(0);
    setRequestStatus("pending");

    try {
      setMsg("Preparing your PDF report… please stay on this page.");
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          customerName: payload.customerName || undefined,
          summary: payload.summary,
          planImageDataUrl: payload.planImageDataUrl || undefined,
          roomPoints: payload.roomPoints || undefined,
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
      setRequestStatus("success");
    } catch (e: any) {
      if (e?.name === "AbortError") return;

      console.error(e);
      setMsg(
        "Could not generate the PDF. Please click ‘Refresh & Try Again’."
      );
      setRequestStatus("error");
    } finally {
      setIsRetrying(false);
    }
  };

  /* ---------------- Auto-run once on page load ---------------- */
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
     // 🔥 TRACK PURCHASE EVENT
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: 99,
      currency: "INR",
    });
  }
    downloadPdf();

    

    return () => abortRef.current?.abort();
  }, []);

  const estimatedTotalSeconds = 60;
  const estimatedRemaining = Math.max(0, estimatedTotalSeconds - seconds);
  const progressWidth = requestStatus === "success"
    ? 100
    : requestStatus === "error"
      ? 100
      : Math.min(94, 14 + seconds * 1.3);

  const stageLabel = requestStatus === "success"
    ? "Report ready"
    : requestStatus === "error"
      ? "Generation stopped"
      : seconds < 8
        ? "Sending your floor plan securely"
        : seconds < 30
          ? "Building your detailed report"
          : "Finalising your PDF";

  const estimateLabel = requestStatus === "success"
    ? `Completed in ${timeLabel}`
    : requestStatus === "error"
      ? "Please retry"
      : estimatedRemaining > 0
        ? `About ${estimatedRemaining}s remaining`
        : "Almost ready — please keep this page open";

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
                {requestStatus === "success"
                  ? "Your report download has started successfully."
                  : requestStatus === "error"
                    ? "Your payment is safe. Please retry the report download."
                    : "Please keep this page open while we prepare your PDF."}
              </p>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#8b7357]">Elapsed</div>
              <div className="text-[12px] font-semibold">{timeLabel}</div>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 rounded-2xl border border-amber-200 bg-[#fff8ea] p-4">
            <p className="text-[12px] font-semibold text-[#7a4b12]">
              {requestStatus === "success"
                ? "Download ready"
                : requestStatus === "error"
                  ? "Download interrupted"
                  : "Report generation in progress"}
            </p>
            <p className="mt-1 text-[11px] text-[#8b7357]">{msg}</p>

            <div className="mt-3 flex items-start justify-between gap-3 text-[10px]">
              <span className="font-semibold text-[#7a4b12]">{stageLabel}</span>
              <span className="shrink-0 text-right text-[#8b7357]">{estimateLabel}</span>
            </div>

            <div
              className="mt-2 h-2 overflow-hidden rounded-full bg-amber-100"
              role="progressbar"
              aria-label="Vastu report generation progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressWidth)}
            >
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${
                  requestStatus === "success"
                    ? "bg-emerald-500"
                    : requestStatus === "error"
                      ? "bg-rose-400"
                      : "bg-amber-500"
                }`}
                style={{ width: `${progressWidth}%` }}
              />
            </div>

            <p className="mt-2 text-[10px] text-[#a58b6e]">
              {requestStatus === "pending"
                ? "If you try to close or reload now, your browser will ask you to wait."
                : requestStatus === "success"
                  ? "On mobile, check your browser’s Downloads folder."
                  : "You do not need to pay again—use the retry button below."}
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
              disabled={isRetrying || requestStatus === "pending"}
              className="w-full rounded-xl bg-[#2b1b10] px-4 py-2 text-[12px] font-semibold text-amber-50 hover:bg-black disabled:opacity-50"
            >
              {requestStatus === "pending"
                ? "Preparing Your Report…"
                : isRetrying
                  ? "Retrying…"
                  : requestStatus === "success"
                    ? "Download Again"
                    : "Refresh & Try Again"}
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

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <a
            href="/vastu-pro"
            className="group relative overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-br from-amber-300 via-amber-200 to-orange-100 p-5 shadow-lg shadow-amber-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2"
          >
            <span className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/35 blur-2xl" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#2b1b10] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-100">
                  VastuCheck Pro
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-xs font-extrabold text-amber-900 shadow-sm">
                  10×
                </span>
              </div>
              <p className="mt-4 text-base font-bold leading-5 text-[#2b1b10]">
                Checking multiple floor plans?
              </p>
              <p className="mt-2 text-[11px] leading-5 text-amber-950/75">
                Get 10 complete Vastu reports and keep every PDF organised.
              </p>
              <span className="mt-4 inline-flex w-fit items-center rounded-xl bg-white/80 px-3 py-2 text-[11px] font-bold text-amber-900 shadow-sm transition group-hover:bg-white">
                Explore bulk reports <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </span>
            </div>
          </a>

          <a
            href="mailto:houseofeonindia@gmail.com?subject=Advertising%20on%20VastuCheck.in"
            className="group relative overflow-hidden rounded-3xl border border-[#503b2b] bg-gradient-to-br from-[#2b1b10] via-[#3b281a] to-[#59402b] p-5 text-white shadow-lg shadow-stone-300/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-stone-300/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            <span className="pointer-events-none absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-amber-200/20 bg-white/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-200">
                  Partner with us
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-[10px] font-extrabold text-[#2b1b10] shadow-sm">
                  AD
                </span>
              </div>
              <p className="mt-4 text-base font-bold leading-5">
                Want to advertise here?
              </p>
              <p className="mt-2 text-[11px] leading-5 text-amber-50/70">
                Reach people actively planning, buying and improving their homes.
              </p>
              <p className="mt-2 break-all text-[10px] font-semibold text-amber-200">
                houseofeonindia@gmail.com
              </p>
              <span className="mt-4 inline-flex w-fit items-center rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-bold text-amber-100 transition group-hover:bg-white/15">
                Contact us <span className="ml-1 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </span>
            </div>
          </a>
        </div>
      </div>
    </main>
  );
}
