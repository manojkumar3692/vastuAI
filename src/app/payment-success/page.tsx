"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

<<<<<<< Updated upstream
=======
type RequestStatus = "idle" | "pending" | "success" | "error";
type ReportPayload = {
  customerName?: string;
  summary: unknown;
  planImageDataUrl?: string;
  roomPoints?: unknown;
};

>>>>>>> Stashed changes
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

    let payload: ReportPayload;
    try {
      payload = JSON.parse(raw) as ReportPayload;
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
<<<<<<< Updated upstream
    } catch (e: any) {
      if (e?.name === "AbortError") return;
=======
      setRequestStatus("success");
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") return;
>>>>>>> Stashed changes

      console.error(error);
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

            <Link
              href="/vastu"
              className="block w-full rounded-xl border border-amber-200 bg-white px-4 py-2 text-center text-[12px] font-semibold text-[#5f4630] hover:bg-amber-50"
            >
              Go back to VastuCheck
            </Link>

            <p className="text-center text-[10px] text-[#8b7357]">
              You may close this page after the download completes.
            </p>
          </div>
        </div>
<<<<<<< Updated upstream
=======

        <section className="mt-5" aria-labelledby="borewell-offer-title">
          <p className="mb-2 px-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#8b7357]">
            One more tool for your property
          </p>
          <Link
            href="/borewell-vastu-planner?utm_source=payment-success&utm_medium=cross-sell&utm_campaign=borewell-planner"
            className="group relative grid overflow-hidden rounded-3xl border border-emerald-700/30 bg-gradient-to-br from-[#102f28] via-[#173e37] to-[#20295f] p-5 text-white shadow-xl shadow-emerald-950/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-950/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:grid-cols-[1.15fr_.85fr] sm:items-center sm:gap-5"
          >
            <span className="pointer-events-none absolute -left-10 -top-14 h-40 w-40 rounded-full bg-emerald-400/15 blur-3xl" />
            <span className="pointer-events-none absolute -bottom-16 right-10 h-36 w-36 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-emerald-200/20 bg-white/10 px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-100">
                  Borewell Vastu Planner
                </span>
                <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[9px] font-extrabold text-[#2b1b10]">
                  ₹99 one-time
                </span>
              </div>
              <h2 id="borewell-offer-title" className="mt-4 font-serif text-[22px] font-semibold leading-7 text-white">
                Planning a borewell too?
              </h2>
              <p className="mt-2 text-[11px] leading-5 text-emerald-50/80">
                Set North on your plot, move the marker and compare Vastu-preferred borewell zones on a live suitability map.
              </p>
              <p className="mt-2 text-[9px] leading-4 text-amber-100/75">
                Vastu placement guidance only — not groundwater detection.
              </p>
              <span className="mt-4 inline-flex items-center rounded-xl bg-white px-3.5 py-2.5 text-[11px] font-bold text-[#173e37] shadow-lg shadow-black/10 transition group-hover:bg-emerald-50">
                Open Borewell Planner <span className="ml-1.5 transition group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </span>
            </div>

            <div className="relative z-10 mt-5 sm:mt-0" aria-hidden="true">
              <div className="relative mx-auto aspect-square w-full max-w-[170px] rotate-2 rounded-[26px] border border-white/20 bg-white/95 p-3 shadow-2xl shadow-black/25 transition duration-300 group-hover:rotate-0 group-hover:scale-[1.02]">
                <div className="flex items-center justify-between pb-2 text-[7px] font-extrabold uppercase tracking-[0.1em] text-[#49645c]">
                  <span>Vastu map</span><span className="text-emerald-700">● Live</span>
                </div>
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-[conic-gradient(from_338deg,#25ad77_0deg_44deg,#83b64c_44deg_88deg,#e7b444_88deg_135deg,#ea793d_135deg_180deg,#d95259_180deg_268deg,#e79342_268deg_312deg,#8ab64b_312deg_338deg,#25ad77_338deg)]">
                  <span className="absolute left-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-[8px] font-extrabold text-[#173e37] shadow">N ↑</span>
                  <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#173e37]" />
                  <span className="absolute right-7 top-7 grid h-9 w-9 place-items-center rounded-full border-[3px] border-white bg-indigo-600 text-lg font-bold text-white shadow-lg">+</span>
                  <span className="absolute bottom-2 left-2 rounded bg-black/45 px-1.5 py-1 text-[6px] font-bold tracking-wide text-white">AVOID</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

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
>>>>>>> Stashed changes
      </div>
    </main>
  );
}