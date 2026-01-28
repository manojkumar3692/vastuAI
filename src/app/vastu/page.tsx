// src/app/vastu/page.tsx
"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import Script from "next/script";
import { directionForPoint } from "@/lib/vastuGeometry";
import { evaluateVastu, type VastuSummary } from "@/lib/vastuRules";
import type { RoomPoint, RoomType } from "@/types/vastu";
import PaymentStep from "@/components/vastu/PaymentStep";
import VastuSummaryPanel from "@/components/vastu/VastuSummaryPanel";
import { ROOM_TYPE_OPTIONS } from "@/lib/vastuRoomOptions";

/**
 * ✅ SEO additions in this client page:
 * - HowTo + FAQ schema via next/script
 * - Visible "Free Vastu Check (2 rooms free)" copy in hero
 *
 * ✅ Razorpay CSS:
 * - Put it INSIDE the component return so it actually applies.
 *   (Best practice is globals.css, but you asked to update this file fully.)
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const STEPS = [
  "Upload Floor Plan",
  "Set Orientation",
  "Set Centre",
  "Verify Rooms",
  "Vastu Summary",
  "Payment",
] as const;

type CentrePoint = { x: number; y: number };

type DetectRoomsApiResponse = {
  rooms: { name?: string; type?: RoomType; x: number; y: number }[];
};

export default function VastuPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = STEPS[stepIndex];

  // Core state
  const [imageUrl, setImageUrl]: any = useState("");
  const [planImageDataUrl, setPlanImageDataUrl] = useState<string | null>(null);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [centre, setCentre] = useState<CentrePoint>({ x: 0.5, y: 0.5 });
  const [rooms, setRooms] = useState<RoomPoint[]>([]);

  const centreOverlayRef = useRef<HTMLDivElement | null>(null);
  const roomsOverlayRef = useRef<HTMLDivElement | null>(null);
  const [draggingRoomId, setDraggingRoomId] = useState<string | null>(null);

  const isOrientationStep = currentStep === "Set Orientation";
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [autoDetectTriggered, setAutoDetectTriggered] = useState(false);
  const [showRoomsList, setShowRoomsList] = useState(false);
  const razorpayFormRef = useRef<HTMLFormElement | null>(null);
  const [paymentStage, setPaymentStage] = useState<
    "idle" | "processing" | "success"
  >("idle");

  // ✅ Vastu Summary (Step 5)
  const vastuSummary: VastuSummary | null = useMemo(() => {
    if (!imageUrl || rooms.length === 0) return null;
    const withDirections = rooms.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      direction: directionForPoint(r.x, r.y, centre, rotationDeg),
    }));
    return evaluateVastu(withDirections);
  }, [imageUrl, rooms, centre, rotationDeg]);

  // ✅ Razorpay button injection (if you still use razorpayFormRef somewhere)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentStep !== "Payment") return;

    const form = razorpayFormRef.current;
    if (!form) return;

    form.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", "pl_S6HHQm0InTxYG0");

    script.onerror = () => {
      console.error("Razorpay script failed to load");
    };

    form.appendChild(script);
  }, [currentStep]);

  // ✅ Store payload for report generation (Payment step can use it)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (currentStep !== "Payment") return;
    if (!vastuSummary) return;

    sessionStorage.setItem(
      "vastu_report_payload",
      JSON.stringify({
        customerName: "Customer",
        summary: vastuSummary,
      })
    );
  }, [currentStep, vastuSummary]);

  useEffect(() => {
    if (currentStep === "Payment") setPaymentStage("idle");
  }, [currentStep]);

  const getImageRect = () => {
    if (imageRef.current) return imageRef.current.getBoundingClientRect();
    return null;
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // AI + PDF states
  const [isDetectingRooms, setIsDetectingRooms] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canGoBack = stepIndex > 0;
  const canGoNext =
  stepIndex < STEPS.length - 1 &&
  !isDetectingRooms &&
  !(currentStep === "Upload Floor Plan" && !imageUrl) &&
  !(currentStep === "Verify Rooms" && rooms.length === 0);

  const goNext = () => {
    if (currentStep === "Upload Floor Plan" && !imageUrl) return;

    // ✅ When user finishes Set Centre -> Next, auto-trigger room detection
    if (currentStep === "Set Centre") {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));

      // Trigger AI detect only if we have image data and rooms are empty
      if (!autoDetectTriggered && planImageDataUrl && rooms.length === 0) {
        setAutoDetectTriggered(true);
        // Let UI change step first, then call detect
        setTimeout(() => {
          handleAutoDetectRooms();
        }, 50);
      }
      return;
    }

    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const clampNorm = (val: number) => Math.min(0.98, Math.max(0.02, val));

  const handleFileSelected = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    const url = URL.createObjectURL(file);
    setImageUrl((prev: any) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") setPlanImageDataUrl(result);
    };
    reader.readAsDataURL(file);

    setRotationDeg(0);
    setCentre({ x: 0.5, y: 0.5 });
    setRooms([]);
    setDraggingRoomId(null);
    setIsDetectingRooms(false);
    setAutoDetectTriggered(false);
  }, []);

  const clearImage = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setPlanImageDataUrl(null);
    setRotationDeg(0);
    setCentre({ x: 0.5, y: 0.5 });
    setRooms([]);
    setDraggingRoomId(null);
    setIsDetectingRooms(false);
    setStepIndex(0);
    setAutoDetectTriggered(false);
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    handleFileSelected(file);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    handleFileSelected(file);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
  };

  const rotateLeft = () => setRotationDeg((deg) => (deg - 22.5 + 360) % 360);
  const rotateRight = () => setRotationDeg((deg) => (deg + 22.5) % 360);

  // Centre selection
  const handleCentrePointer: React.PointerEventHandler<HTMLDivElement> = (
    e
  ) => {
    const rect = getImageRect();
    if (!rect) return;

    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;
    setCentre({ x: clampNorm(rawX), y: clampNorm(rawY) });
  };

  // Rooms (add + drag)
  const addRoomAt = (x: number, y: number) => {
    const idx = rooms.length + 1;
    const newRoom: RoomPoint = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: `Room ${idx}`,
      type: "bedroom",
      x: clampNorm(x),
      y: clampNorm(y),
    };
    setRooms((prev) => [...prev, newRoom]);
  };

  const updateRoomPosition = (id: string, x: number, y: number) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, x: clampNorm(x), y: clampNorm(y) } : r
      )
    );
  };

  const updateRoomType = (id: string, type: RoomType) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, type } : r)));
  };

  const updateRoomName = (id: string, name: string) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, name } : r)));
  };

  const removeRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    if (draggingRoomId === id) setDraggingRoomId(null);
  };

  const handleRoomsBackgroundPointerDown: React.PointerEventHandler<
    HTMLDivElement
  > = (e) => {
    if (e.currentTarget !== e.target) return;

    const rect = getImageRect();
    if (!rect) return;

    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;
    addRoomAt(rawX, rawY);
  };

  const handleRoomsPointerMove: React.PointerEventHandler<HTMLDivElement> = (
    e
  ) => {
    if (!draggingRoomId) return;

    const rect = getImageRect();
    if (!rect) return;

    const rawX = (e.clientX - rect.left) / rect.width;
    const rawY = (e.clientY - rect.top) / rect.height;
    updateRoomPosition(draggingRoomId, rawX, rawY);
  };

  const stopDraggingRoom = () => setDraggingRoomId(null);

  const FREE_ROOMS_COUNT = 2;

  const badRoomsCount = useMemo(() => {
    if (!vastuSummary) return 0;
    return vastuSummary.rooms.filter(
      (r) => r.verdict === "Unfavourable" || r.verdict === "Critical"
    ).length;
  }, [vastuSummary]);

  const visibleRooms = useMemo(
    () => (vastuSummary ? vastuSummary.rooms.slice(0, FREE_ROOMS_COUNT) : []),
    [vastuSummary]
  );

  const lockedRooms = useMemo(
    () => (vastuSummary ? vastuSummary.rooms.slice(FREE_ROOMS_COUNT) : []),
    [vastuSummary]
  );

  const imbalanceCopy = useMemo(() => {
    if (!badRoomsCount) {
      return "Good overall balance. The detailed report still helps you optimise placements and enhance positive zones.";
    }
    if (badRoomsCount === 1) {
      return "A single weak zone can still disturb energy flow over time. Simple, non-structural corrections are usually enough to fix it.";
    }
    if (badRoomsCount <= 3) {
      return "Multiple rooms are sitting in weaker Vastu zones. A structured remedy plan helps you prioritise what to fix first.";
    }
    return "Several rooms fall in unfavourable zones. A full Vastu blueprint with room-wise corrections is strongly recommended.";
  }, [badRoomsCount]);

  // AI: detect rooms from image
  const handleAutoDetectRooms = async () => {
    if (!planImageDataUrl) {
      alert("Please upload the floor plan again to use AI-assisted detection.");
      return;
    }

    setIsDetectingRooms(true);
    try {
      const res = await fetch("/api/detect-rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageDataUrl: planImageDataUrl }),
      });

      if (!res.ok) throw new Error("AI detection failed");

      const data: DetectRoomsApiResponse = await res.json();
      if (!Array.isArray(data.rooms) || data.rooms.length === 0) {
        alert(
          "Our helper engine could not confidently detect rooms. Please place them manually."
        );
        return;
      }

      const newRooms: RoomPoint[] = data.rooms.map((r, idx) => ({
        id: `${Date.now()}-${idx}-${Math.random().toString(16).slice(2)}`,
        name: r.name || `Room ${idx + 1}`,
        type: (r.type as RoomType) || "bedroom",
        x: clampNorm(r.x),
        y: clampNorm(r.y),
      }));

      setRooms(newRooms);
    } catch (err) {
      console.error(err);
      alert("Sorry, something went wrong while detecting rooms.");
    } finally {
      setIsDetectingRooms(false);
    }
  };

  // Sample PDF download
  const handleDownloadPdf = async () => {
    if (!vastuSummary) {
      alert("No summary available. Please complete the previous steps.");
      return;
    }

    setIsDownloading(true);
    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Customer",
          summary: vastuSummary,
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
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Sorry, an error occurred while generating the report.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ✅ JSON-LD for /vastu page (calculator-style)
  const howToSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "How to do a free Vastu check using your floor plan",
      description:
        "Upload a floor plan, set orientation and centre, tag rooms, then view a free 2-room Vastu preview. Unlock the full PDF report for ₹49.",
      step: [
        {
          "@type": "HowToStep",
          name: "Upload floor plan",
          text: "Upload a clear 2D floor plan image (JPG/PNG).",
        },
        {
          "@type": "HowToStep",
          name: "Set orientation",
          text: "Rotate the plan so the north direction matches your property.",
        },
        {
          "@type": "HowToStep",
          name: "Set centre",
          text: "Tap the centre of the built-up area (Brahmasthan).",
        },
        {
          "@type": "HowToStep",
          name: "Verify rooms",
          text: "Auto-detect or manually tag rooms (kitchen, bedrooms, toilets, entrance).",
        },
        {
          "@type": "HowToStep",
          name: "Get free preview",
          text: "See the first 2 rooms fully unlocked for free.",
        },
        {
          "@type": "HowToStep",
          name: "Unlock full report",
          text: "Pay ₹49 securely and download the full PDF report.",
        },
      ],
    }),
    []
  );

  const vastuFaqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is VastuCheck free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. You get a free Vastu preview for the first 2 rooms. The complete room-by-room PDF report can be unlocked for ₹49.",
          },
        },
        {
          "@type": "Question",
          name: "Does this work for flats and villas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. VastuCheck works for apartments, villas and independent houses as long as you upload a clear 2D floor plan.",
          },
        },
        {
          "@type": "Question",
          name: "Is AI deciding the Vastu?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. AI only assists in reading the floor plan and writing the report. The scoring and verdict follow fixed traditional Vastu rules.",
          },
        },
      ],
    }),
    []
  );

  // ---------- UI ----------
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#1b2430]">
      {/* ✅ Razorpay button styles (best in globals.css, but included here as requested) */}
      <style jsx global>{`
        .rzp-wrap .razorpay-payment-button {
          width: 100% !important;
          display: block !important;
          border-radius: 12px !important;
          padding: 12px 14px !important;
          font-weight: 700 !important;
          font-size: 12px !important;
        }
        .rzp-wrap form {
          width: 100%;
        }
      `}</style>

      {/* ✅ JSON-LD */}
      <Script
        id="vastu-howto"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <Script
        id="vastu-faq"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vastuFaqSchema) }}
      />

      {/* soft saffron / green glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_#f973161a,_transparent_60%),radial-gradient(circle_at_bottom,_#16a34a1a,_transparent_60%)]" />

      {/* HEADER */}
      <header className="border-b border-amber-100/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 shadow-sm shadow-amber-300/70">
              <span className="text-lg font-semibold text-white">ॐ</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-[#2b1b10]">
                VastuCheck
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-amber-700/80">
                Traditional Vastu · AI-assisted layout reading
              </div>
            </div>
          </div>

          <div className="hidden flex-col items-end text-[11px] sm:flex">
            <span className="rounded-full bg-emerald-100/80 px-3 py-0.5 text-[10px] font-medium text-emerald-800 ring-1 ring-emerald-400/60">
              Free preview: 2 rooms · Full report ₹49
            </span>
            <span className="mt-1 text-[10px] text-amber-800/70">
              We don’t store your plan • Payments handled securely
            </span>
          </div>
        </div>
      </header>

      {/* MAIN SECTION */}
      <section className="mx-auto max-w-6xl px-4 pt-5 pb-10 sm:pt-7 sm:pb-14">
        {/* Hero band */}
        <div className="mb-5 rounded-2xl border border-amber-100/80 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1.5">
              {/* ✅ Updated for SEO + conversion */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-amber-800 ring-1 ring-amber-300/70">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Free Vastu Check (2 rooms free) · Unlock full PDF for ₹49
              </div>

              <h1 className="text-[20px] font-semibold tracking-tight text-[#2b1b10] sm:text-[24px]">
                Check your home’s Vastu using your floor plan — without a site
                visit.
              </h1>
              <p className="max-w-2xl text-[12px] leading-relaxed text-[#5f4630] sm:text-[13px]">
                Upload your plan, set North and the centre, then tag rooms. We
                map each room to the{" "}
                <span className="font-semibold">
                  North–East–South–West energy grid
                </span>{" "}
                and show a free preview first. AI is used only to assist with
                reading the drawing and writing the report —{" "}
                <span className="font-semibold">
                  Vastu verdicts follow fixed traditional rules.
                </span>
              </p>
            </div>

            <div className="flex flex-col items-start gap-1.5 text-[11px] text-[#5f4630] sm:items-end">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px]">
                  ✓
                </span>
                <span>No login, no consultant booking</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px]">
                  📄
                </span>
                <span>Sharable PDF for family / architect</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-5 rounded-2xl border border-amber-100 bg-white/90 px-3 py-2.5 shadow-sm shadow-amber-100/60 sm:px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-1 flex-wrap gap-2 sm:gap-3">
              {STEPS.map((label, i) => {
                const active = i === stepIndex;
                const done = i < stepIndex;
                return (
                  <div
                    key={label}
                    className="flex items-center gap-1.5 text-[10px] sm:text-[11px]"
                  >
                    <span
                      className={[
                        "flex h-5 w-5 items-center justify-center rounded-full border text-[10px]",
                        active
                          ? "border-amber-500 bg-amber-500 text-white"
                          : done
                          ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                          : "border-amber-200 bg-amber-50 text-amber-700",
                      ].join(" ")}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={[
                        "max-w-[90px] truncate sm:max-w-none",
                        active
                          ? "font-medium text-[#2b1b10]"
                          : done
                          ? "text-[#3f3a34]"
                          : "text-[#8b7357]",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="hidden text-[10px] text-[#8b7357] sm:block">
              Step {stepIndex + 1} of {STEPS.length}
            </div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-[minmax(0,13fr)_minmax(0,7fr)] md:items-start">
          {/* LEFT: Plan viewer */}
          <div className="relative">
            <div className="rounded-3xl border border-amber-100 bg-white/95 px-3 py-3 shadow-sm shadow-amber-100/60 sm:px-4 sm:py-4">
              <div className="mb-2 flex items-center justify-between text-[11px] text-[#8b7357]">
                <span className="font-medium text-[#5f4630]">Floor plan</span>
                {imageUrl && (
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-[#8b7357] ring-1 ring-amber-100">
                    Rotation {rotationDeg.toFixed(1)}°
                  </span>
                )}
              </div>

              {/* White sheet with plan */}
              <div className="relative w-full rounded-2xl border border-amber-100 bg-[#fdfaf4] px-2 py-2 sm:px-4 sm:py-4">
                <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow">
                  <div className="relative aspect-[16/9] w-full">
                    {/* STEP 1: upload */}
                    {currentStep === "Upload Floor Plan" ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-[#fdfaf4]"
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                      >
                        {!imageUrl ? (
                          <div className="w-full max-w-md rounded-2xl border border-dashed border-amber-200 bg-white px-5 py-7 text-center shadow-sm shadow-amber-100/70">
                            <p className="text-sm font-medium text-[#2b1b10]">
                              Upload your floor plan
                            </p>
                            <p className="mt-1 text-[11px] text-[#8b7357]">
                              Drag &amp; drop a JPG/PNG floor plan, or use the
                              button below. A clear 2D top view gives the best
                              results.
                            </p>
                            <button
                              type="button"
                              onClick={handleChooseFileClick}
                              className="mt-4 w-full rounded-lg bg-amber-600 px-4 py-2 text-[12px] font-semibold text-white shadow-sm shadow-amber-400/70 hover:bg-amber-700"
                            >
                              Choose image
                            </button>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={onFileChange}
                              className="hidden"
                            />
                            <p className="mt-2 text-[10px] text-[#a58b6e]">
                              Supported: JPG, PNG • Ideal size up to ~5 MB
                            </p>
                          </div>
                        ) : (
                          <div className="relative h-full w-full bg-white">
                            <img
                              ref={imageRef}
                              src={imageUrl}
                              alt="Uploaded floor plan"
                              className="absolute inset-0 m-auto max-h-full max-w-full select-none object-contain"
                            />

                            <div className="absolute right-3 top-3 flex gap-2">
                              <button
                                type="button"
                                onClick={handleChooseFileClick}
                                className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-medium text-[#5f4630] shadow-sm shadow-amber-200/70 ring-1 ring-amber-200 hover:bg-amber-50"
                              >
                                Change plan
                              </button>
                              <button
                                type="button"
                                onClick={clearImage}
                                className="rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm shadow-rose-900/60 hover:bg-rose-700"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // STEPS 2–6: same canvas, with overlays
                      <div className="absolute inset-0 bg-white">
                        {/* Orientation ring */}
                        {isOrientationStep && (
                          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                            <img
                              src="/orientation-img-new.png"
                              alt="Vastu orientation ring"
                              style={{
                                transform: `rotate(${rotationDeg}deg)`,
                                transformOrigin: "center center",
                                transition: "transform 0.2s ease-out",
                              }}
                              className="w-[52%] max-w-[520px] object-contain"
                              draggable={false}
                            />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#5f4630] shadow">
                              {rotationDeg.toFixed(1)}°
                            </div>
                          </div>
                        )}

                        {/* Plan image */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                          <img
                            ref={imageRef}
                            src={imageUrl!}
                            alt="Floor plan"
                            className={
                              "absolute inset-0 m-auto select-none object-contain " +
                              (isOrientationStep
                                ? "max-h-[55%] max-w-[30%]"
                                : "max-h-full max-w-full")
                            }
                          />
                        </div>

                        {/* Centre selection */}
                        {currentStep === "Set Centre" && (
                          <div
                            ref={centreOverlayRef}
                            className="absolute inset-0 z-30"
                            onPointerDown={handleCentrePointer}
                          >
                            <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-[#2b1b10]/90 px-3 py-1 text-[10px] text-amber-50 shadow">
                              Tap on the built-up area to set the centre
                            </div>

                            <div
                              className="absolute h-4 w-4 rounded-full border-2 border-amber-500 bg-white shadow shadow-amber-500/60"
                              style={{
                                left: `${centre.x * 100}%`,
                                top: `${centre.y * 100}%`,
                                transform: "translate(-50%, -50%)",
                              }}
                            >
                              <div className="m-[3px] h-1.5 w-1.5 rounded-full bg-amber-600" />
                            </div>

                            <div
                              className="pointer-events-none absolute border border-dashed border-amber-400/70"
                              style={{
                                left: `${centre.x * 100}%`,
                                top: `${centre.y * 100}%`,
                                width: "72px",
                                height: "72px",
                                transform: "translate(-50%, -50%)",
                              }}
                            />
                          </div>
                        )}

                        {/* Rooms overlay */}
                        {currentStep === "Verify Rooms" && (
                          <div
                            ref={roomsOverlayRef}
                            className={[
                              "absolute inset-0 z-30 touch-none",
                              isDetectingRooms ? "pointer-events-none opacity-60" : "",
                            ].join(" ")}
                            onPointerDown={handleRoomsBackgroundPointerDown}
                            onPointerMove={handleRoomsPointerMove}
                            onPointerUp={stopDraggingRoom}
                            onPointerLeave={stopDraggingRoom}
                            onPointerCancel={stopDraggingRoom}
                          >
                            <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-[#2b1b10]/90 px-3 py-1 text-[10px] text-amber-50 shadow">
                              Tap to add rooms · drag the coloured dots
                            </div>

                            {rooms.map((room) => {
                              const label =
                                ROOM_TYPE_OPTIONS.find(
                                  (o) => o.value === room.type
                                )?.label ?? "Room";

                              return (
                                <div
                                  key={room.id}
                                  className="absolute"
                                  style={{
                                    left: `${room.x * 100}%`,
                                    top: `${room.y * 100}%`,
                                    transform: "translate(-50%, -50%)",
                                  }}
                                >
                                  <div
                                    className={[
                                      "h-4 w-4 cursor-pointer rounded-full border-2 shadow-sm shadow-amber-900/40",
                                      room.type === "toilet"
                                        ? "border-rose-400 bg-rose-200/90"
                                        : room.type === "kitchen"
                                        ? "border-amber-400 bg-amber-200/90"
                                        : "border-emerald-400 bg-emerald-200/90",
                                    ].join(" ")}
                                    onPointerDown={(e) => {
                                      e.stopPropagation();
                                      setDraggingRoomId(room.id);
                                    }}
                                    onPointerUp={(e) => {
                                      e.stopPropagation();
                                      setDraggingRoomId(null);
                                    }}
                                  />
                                  <div className="mt-1 rounded-full bg-[#2b1b10]/90 px-2 py-0.5 text-[9px] text-amber-50 shadow">
                                    {room.name || label}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Status & clear */}
                        <div className="pointer-events-none absolute left-3 bottom-3 z-40 rounded-full bg-[#2b1b10]/90 px-3 py-1 text-[10px] text-amber-50 shadow">
                          {currentStep} · rotation {rotationDeg.toFixed(1)}°
                        </div>

                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute right-3 top-3 z-40 rounded-full bg-rose-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm shadow-rose-900/60 hover:bg-rose-700"
                        >
                          Clear plan
                        </button>
                        {/* ✅ Detecting overlay (authentic "system working" feel) */}
{isDetectingRooms && currentStep === "Verify Rooms" && (
  <div className="absolute inset-0 z-[80] flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="w-[92%] max-w-xl rounded-2xl border border-amber-200 bg-white px-6 py-10 text-center shadow-xl">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-emerald-500 shadow-md">
        <span className="text-2xl text-white">⌁</span>
      </div>

      <h3 className="text-[20px] font-semibold tracking-tight text-[#2b1b10]">
        Detecting Room Labels on Floor Plan
      </h3>

      <p className="mt-2 text-[13px] leading-relaxed text-[#6b5340]">
        Finding and matching room labels so we can analyse your Vastu layout accurately.
      </p>

      {/* tiny loader */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-500 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-500" />
      </div>

      <div className="mt-6 text-[11px] text-[#8b7357]">
        Tip: Clear room names in the plan image improves detection accuracy.
      </div>
    </div>
  </div>
)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Step panel */}
          <div className="flex flex-col rounded-2xl border border-amber-100 bg-white/95 p-3 shadow-md shadow-amber-100/80 sm:p-4">
            {/* Step Title */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-[#2b1b10] sm:text-base">
                  {currentStep}
                </h2>
                <p className="mt-0.5 text-[11px] text-[#8b7357]">
                  {currentStep === "Upload Floor Plan" &&
                    "Start by uploading a clear 2D floor plan image of your home, flat or villa."}
                  {currentStep === "Set Orientation" &&
                    "Rotate the plan so that North on the drawing matches the real-life North of your property."}
                  {currentStep === "Set Centre" &&
                    "Tap the Brahmasthan – the approximate centre of your built-up structure. This helps map each room to its Vastu zone."}
                  {currentStep === "Verify Rooms" &&
                    "Use AI-assisted detection or place rooms manually. You can rename rooms and adjust positions easily."}
                  {currentStep === "Vastu Summary" &&
                    "See the free preview (2 rooms) before unlocking the full Vastu blueprint."}
                  {currentStep === "Payment" &&
                    "Complete payment securely to download the full PDF report."}
                </p>
              </div>
              {imageUrl && (
                <span className="mt-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-800 ring-1 ring-emerald-200">
                  Plan loaded
                </span>
              )}
            </div>

            {/* Step content */}
            <div className="mt-2 flex-1 overflow-auto pr-1 text-[11px] text-[#3f3a34] sm:text-[12px]">
              {/* Orientation controls */}
              {currentStep === "Set Orientation" && (
                <div className="space-y-3">
                  <p className="text-[#8b7357]">
                    Use the buttons below to rotate your plan until any North
                    arrow or text matches the compass overlay.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={rotateLeft}
                      disabled={!imageUrl}
                      className="flex-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-[#5f4630] hover:bg-amber-100 disabled:opacity-40"
                    >
                      ⟲ Rotate Left (22.5°)
                    </button>
                    <button
                      type="button"
                      onClick={rotateRight}
                      disabled={!imageUrl}
                      className="flex-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] font-medium text-[#5f4630] hover:bg-amber-100 disabled:opacity-40"
                    >
                      ⟳ Rotate Right (22.5°)
                    </button>
                  </div>
                  <div className="text-[11px] text-[#8b7357]">
                    Current rotation:{" "}
                    <span className="font-semibold text-[#2b1b10]">
                      {rotationDeg.toFixed(1)}°
                    </span>
                  </div>
                </div>
              )}

              {/* Set Centre */}
              {currentStep === "Set Centre" && (
                <div className="space-y-2">
                  <p className="text-[#8b7357]">
                    Tap roughly at the physical centre of your main built-up
                    area (ignore separate garden / open land). You can adjust
                    until it visually feels right.
                  </p>
                  <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-[11px] text-[#5f4630]">
                    Approx centre:{" "}
                    <span className="font-semibold">
                      x {(centre.x * 100).toFixed(0)}%, y{" "}
                      {(centre.y * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-[#a58b6e]">
                    The centre helps us know which rooms are in NE, SE, SW, NW
                    etc according to classical Vastu mandala.
                  </p>
                </div>
              )}

              {/* Verify Rooms */}
              {currentStep === "Verify Rooms" && (
                <div className="flex h-full flex-col gap-3">
                  <p className="text-[#8b7357]">
                    Rooms will be auto-detected. You can drag dots on the plan
                    to correct positions. Edit room names/types only if needed.
                  </p>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAutoDetectRooms}
                      disabled={!planImageDataUrl || isDetectingRooms}
                      className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-[11px] font-semibold text-white shadow-sm shadow-emerald-500/60 hover:bg-emerald-700 disabled:opacity-40"
                    >
                      {isDetectingRooms
                        ? "Detecting rooms..."
                        : "Re-run auto-detect"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRooms([]);
                        setShowRoomsList(true);
                        setAutoDetectTriggered(false);
                      }}
                      disabled={rooms.length === 0}
                      className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[11px] font-medium text-[#5f4630] hover:bg-amber-50 disabled:opacity-40"
                    >
                      Clear all rooms
                    </button>
                  </div>

                  {/* ✅ Compact summary */}
                  {rooms.length > 0 && (
                    <div className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-[11px] text-[#5f4630] flex items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[#2b1b10]">
                          Rooms added: {rooms.length}
                        </span>
                        <span className="ml-2 text-[10px] text-[#8b7357]">
                          Drag dots on plan to adjust
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRoomsList((v) => !v)}
                        className="rounded-md border border-amber-200 bg-white px-2 py-1 text-[10px] font-medium text-[#5f4630] hover:bg-amber-100"
                      >
                        {showRoomsList ? "Hide list" : "Edit list"}
                      </button>
                    </div>
                  )}

                  {/* ✅ Show list only when needed */}
                  {(rooms.length === 0 || showRoomsList) && (
                    <div className="mt-1 flex-1 space-y-2 overflow-auto pr-1">
                      {rooms.length === 0 && (
                        <p className="text-[11px] text-[#a58b6e]">
                          No rooms added yet. Tap on the floor plan to add a
                          room or use auto-detect.
                        </p>
                      )}

                      {rooms.map((room, index) => (
                        <div
                          key={room.id}
                          className="rounded-lg border border-amber-100 bg-[#fdf7ee] px-2 py-2"
                        >
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-[#2b1b10]">
                              Room {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeRoom(room.id)}
                              className="text-[10px] text-rose-500 hover:text-rose-600"
                            >
                              Remove
                            </button>
                          </div>

                          <input
                            type="text"
                            value={room.name}
                            onChange={(e) =>
                              updateRoomName(room.id, e.target.value)
                            }
                            placeholder="Room name (e.g., Master Bedroom)"
                            className="mt-1 w-full rounded-md border border-amber-200 bg-white px-2 py-1 text-[11px] text-[#2b1b10] placeholder:text-[#b39b7e] focus:outline-none focus:ring-1 focus:ring-amber-500"
                          />

                          <select
                            value={room.type}
                            onChange={(e) =>
                              updateRoomType(
                                room.id,
                                e.target.value as RoomType
                              )
                            }
                            className="mt-1 w-full rounded-md border border-amber-200 bg-white px-2 py-1 text-[11px] text-[#2b1b10] focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            {ROOM_TYPE_OPTIONS.map((opt) => (
                              <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-white"
                              >
                                {opt.label}
                              </option>
                            ))}
                          </select>

                          <div className="mt-1 text-[10px] text-[#a58b6e]">
                            Position: x {(room.x * 100).toFixed(0)}%, y{" "}
                            {(room.y * 100).toFixed(0)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Vastu Summary */}
              {currentStep === "Vastu Summary" && (
                <VastuSummaryPanel
                  roomsCount={rooms.length}
                  vastuSummary={vastuSummary}
                  badRoomsCount={badRoomsCount}
                  imbalanceCopy={imbalanceCopy}
                  visibleRooms={visibleRooms}
                  lockedRooms={lockedRooms}
                  onGetFullReport={goNext}
                />
              )}

              {/* Payment */}
              {currentStep === "Payment" && (
                <PaymentStep
                  visible={currentStep === "Payment"}
                  summary={vastuSummary!}
                />
              )}

              {/* Upload step extra text */}
              {currentStep === "Upload Floor Plan" && (
                <div className="mt-2 space-y-2">
                  <p className="text-[#8b7357]">
                    Accepted formats: clear 2D floor plans (top view). Avoid
                    perspective 3D renders or mobile photos of paper drawings
                    where text is not visible.
                  </p>
                  <p className="text-[10px] text-[#a58b6e]">
                    Your drawing is used only to generate this report. We do not
                    publicly share or list your plan anywhere.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={!canGoBack}
                className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-[11px] font-medium text-[#5f4630] hover:bg-amber-50 disabled:opacity-40 sm:w-auto"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="w-full rounded-lg bg-[#2b1b10] px-4 py-2 text-[11px] font-semibold text-amber-50 shadow-sm shadow-amber-500/40 hover:bg-black disabled:opacity-40 sm:w-auto"
              >
                Next
              </button>
            </div>

            {/* Optional SEO text block at bottom of right panel (helps relevance) */}
            <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-[10px] text-[#7a6046]">
              <span className="font-semibold text-[#2b1b10]">
                Free Vastu Check Online:
              </span>{" "}
              Upload a floor plan to preview 2 rooms free, then unlock the full
              Vastu report PDF for flats and villas.
            </div>
          </div>
        </div>
      </section>

      {/* If you still inject Razorpay into a form somewhere, keep this ref around.
          If PaymentStep handles it internally, you can delete razorpayFormRef + its effect. */}
      <form ref={razorpayFormRef} className="hidden" />
    </main>
  );
}
