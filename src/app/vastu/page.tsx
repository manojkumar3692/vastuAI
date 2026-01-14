// src/app/vastu/page.tsx
"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import type { RoomPoint, RoomType } from "@/types/vastu";
import { directionForPoint } from "@/lib/vastuGeometry";
import { evaluateVastu, type VastuSummary } from "@/lib/vastuRules";

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

type CentrePoint = {
  x: number;
  y: number;
};

const ROOM_TYPE_OPTIONS: { value: RoomType; label: string }[] = [
  { value: "master_bedroom", label: "Master Bedroom" },
  { value: "bedroom", label: "Bedroom" },
  { value: "living", label: "Living Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "toilet", label: "Toilet / Bath" },
  { value: "dining", label: "Dining" },
  { value: "pooja", label: "Pooja Room" },
  { value: "balcony", label: "Balcony" },
  { value: "staircase", label: "Staircase" },
  { value: "store", label: "Store / Utility" },
  { value: "other", label: "Other" },
];

type DetectRoomsApiResponse = {
  rooms: {
    name?: string;
    type?: RoomType;
    x: number;
    y: number;
  }[];
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
  // 👇 add
  const imageRef = useRef<HTMLImageElement | null>(null);

  const getImageRect = () => {
    if (imageRef.current) {
      return imageRef.current.getBoundingClientRect();
    }
    return null;
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Payment + PDF
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fakeOrderId, setFakeOrderId] = useState<string | null>(null);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);

  // AI + PDF states
  const [isDetectingRooms, setIsDetectingRooms] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canGoBack = stepIndex > 0;
  const canGoNext =
    stepIndex < STEPS.length - 1 &&
    !(currentStep === "Upload Floor Plan" && !imageUrl) &&
    !(currentStep === "Verify Rooms" && rooms.length === 0);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayReady(true);
    script.onerror = () => console.error("Failed to load Razorpay script");
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const goNext = () => {
    if (currentStep === "Upload Floor Plan" && !imageUrl) return;
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

    // Preview URL
    const url = URL.createObjectURL(file);
    setImageUrl((prev: any) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

    // Base64 for AI
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPlanImageDataUrl(result);
      }
    };
    reader.readAsDataURL(file);

    // Reset geometry + rooms
    setRotationDeg(0);
    setCentre({ x: 0.5, y: 0.5 });
    setRooms([]);
    setDraggingRoomId(null);
    setIsDetectingRooms(false);

    // setStepIndex(1); // jump to Set Orientation
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

  const rotateLeft = () => {
    setRotationDeg((deg) => (deg - 22.5 + 360) % 360);
  };

  const rotateRight = () => {
    setRotationDeg((deg) => (deg + 22.5) % 360);
  };

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
    // ignore if clicking on a dot/label
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

  const stopDraggingRoom = () => {
    setDraggingRoomId(null);
  };

  // Vastu Summary (Step 5)
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

  // AI: detect rooms from image
  const handleAutoDetectRooms = async () => {
    if (!planImageDataUrl) {
      alert("Please upload the floor plan again to use AI detection.");
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
          "AI could not confidently detect rooms. Please place them manually."
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

  // PDF download from summary
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
          customerName: customerName || undefined,
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

  // Razorpay payment
  const handlePayWithRazorpay = async () => {
    if (!customerName || !customerEmail) {
      alert("Please enter at least your name and email.");
      return;
    }
    if (!vastuSummary) {
      alert("Please review the Vastu Summary before payment.");
      return;
    }
    if (!window.Razorpay || !isRazorpayReady) {
      alert("Payment system not ready yet. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderRes = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 49900, currency: "INR" }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create order");
      }

      const orderData = await orderRes.json();
      const { orderId, amount, currency, keyId } = orderData;

      setFakeOrderId(orderId);

      const options = {
        key: keyId,
        amount,
        currency,
        name: "Vastu Layout Report",
        description: "AI-assisted Vastu analysis PDF report",
        order_id: orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone || undefined,
        },
        notes: {
          city: customerCity || "",
        },
        theme: {
          color: "#4f46e5",
        },
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer: {
                  name: customerName,
                  email: customerEmail,
                  phone: customerPhone,
                  city: customerCity,
                },
                summary: vastuSummary,
              }),
            });

            const verifyJson = await verifyRes.json();
            if (!verifyRes.ok || !verifyJson.success) {
              console.error("Verify failed:", verifyJson);
              alert(
                "Payment captured but verification failed. Please contact support."
              );
              return;
            }

            alert(
              "Payment successful! Your report will be emailed once mailing is wired, and you can also download it from the Summary step."
            );
          } catch (err) {
            console.error("Error verifying payment", err);
            alert("Payment succeeded but verification error occurred.");
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Razorpay modal closed by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        console.error("Payment failed:", resp.error);
        alert("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Unable to start payment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- UI ----------

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Gradient header background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#1d9bf044,_transparent_55%),radial-gradient(circle_at_bottom,_#4f46e533,_transparent_55%)]" />

      <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/60">
              <span className="font-display text-lg leading-none text-indigo-300">
                V
              </span>
            </div>
            <div>
              <div className="font-display text-base font-semibold tracking-tight text-slate-50">
                VastuSense AI
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Floor Plan Vastu Analyzer
              </div>
            </div>
          </div>
          <div className="hidden text-[11px] text-emerald-300/90 sm:block">
            🔒 Secure payments via Razorpay • AI-assisted, rule-based Vastu
          </div>
        </div>
      </header>

      {/* Hero + wizard */}
      <section className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:pt-8 sm:pb-14">
        {/* Hero band */}
        <div className="mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-[10px] font-medium text-indigo-100">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI-assisted Vastu • Upload your floor plan, get a PDF report
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Modern Vastu analysis for your home layout.
              </h1>
              <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-slate-300 sm:text-[13px]">
                Upload your 2D floor plan and let our AI assist with room
                detection, direction mapping, and Vastu scoring. Download a
                structured PDF and optionally upgrade to a paid, email-delivered
                report.
              </p>
            </div>
            <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800/80 text-[10px]">
                  ✓
                </span>
                <span>No login required</span>
              </div>
              <div className="hidden h-4 w-px bg-slate-700 sm:block" />
              <div className="hidden items-center gap-1.5 sm:flex">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800/80 text-[10px]">
                  ₹
                </span>
                <span>Pay only when you want full PDF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-4 rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2 sm:px-4 sm:py-3">
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
                          ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                          : done
                          ? "border-emerald-400 bg-emerald-500/15 text-emerald-100"
                          : "border-slate-600 bg-slate-800 text-slate-300",
                      ].join(" ")}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={[
                        "max-w-[80px] truncate sm:max-w-none",
                        active
                          ? "font-medium text-slate-50"
                          : done
                          ? "text-slate-200"
                          : "text-slate-500",
                      ].join(" ")}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="hidden text-[10px] text-slate-400 sm:block">
              Step {stepIndex + 1} of {STEPS.length}
            </div>
          </div>
        </div>

        {/* Main layout: Plan + details */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[1.7fr,1.3fr]">
          {/* Left: Plan viewer */}
          {/* Plan / placeholder */}
          {/* PLAN VIEWER – SquareYards style */}
          <div className="relative mt-1 w-full">
            <div className="mx-auto max-w-4xl rounded-3xl bg-slate-900/5 px-3 py-3 sm:px-4 sm:py-4">
              <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>Floor plan</span>
                {imageUrl && (
                  <span className="rounded-full bg-slate-900/10 px-2 py-0.5 text-[10px] text-slate-500">
                    rotation {rotationDeg.toFixed(1)}°
                  </span>
                )}
              </div>

              {/* White sheet with plan */}
              <div className="relative w-full rounded-2xl border border-slate-800 bg-slate-950/90 px-2 py-2 sm:px-4 sm:py-4">
                <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-lg">
                  {/* Fixed aspect so canvas is stable */}
                  <div className="relative aspect-[16/9] w-full">
                    {/* STEP 1: upload */}
                    {currentStep === "Upload Floor Plan" ? (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-slate-100"
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                      >
                        {!imageUrl ? (
                          <div className="w-full max-w-md rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-7 text-center">
                            <p className="text-sm font-medium text-slate-900">
                              Upload your floor plan
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              Drag &amp; drop a JPG/PNG floor plan, or tap the
                              button below. A clear 2D top view gives the best
                              results.
                            </p>
                            <button
                              type="button"
                              onClick={handleChooseFileClick}
                              className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-[12px] font-semibold text-white shadow-sm shadow-indigo-300/60 hover:bg-indigo-700"
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
                            <p className="mt-2 text-[10px] text-slate-400">
                              Supported: JPG, PNG • Max ~5 MB
                            </p>
                          </div>
                        ) : (
                          <div className="relative h-full w-full bg-white">
                            <img
                              ref={imageRef}
                              src={imageUrl}
                              alt="Uploaded floor plan"
                              className="absolute inset-0 m-auto max-h-full max-w-full object-contain touch-none select-none"
                            />

                            <div className="absolute right-3 top-3 flex gap-2">
                              <button
                                type="button"
                                onClick={handleChooseFileClick}
                                className="rounded-full bg-slate-900/85 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm shadow-black/30 ring-1 ring-slate-700 hover:bg-slate-800"
                              >
                                Change plan
                              </button>
                              <button
                                type="button"
                                onClick={clearImage}
                                className="rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm shadow-red-900/50 hover:bg-red-700"
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
                        {/* 🔵 Orientation ring – only on Set Orientation, sits behind plan */}
{/* ORIENTATION RING using PNG */}
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
      className="w-[50%] max-w-[520px] object-contain"
      draggable={false}
    />

    {/* Rotation chip fixed in center */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow">
      {rotationDeg.toFixed(1)}°
    </div>
  </div>
)}

                        {/* 🧱 Plan image – sits ON TOP of ring */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <img
                            ref={imageRef}
                            src={imageUrl!}
                            alt="Floor plan"
                            className={
                              "absolute inset-0 m-auto object-contain touch-none select-none " +
                              (isOrientationStep
                                ? "max-h-[55%] max-w-[30%]"
                                : "max-h-full max-w-full")
                            }
                          />
                        </div>

                        {/* centre / rooms overlays below, but give them higher z so they appear above plan */}
                        {currentStep === "Set Centre" && (
  <div
    ref={centreOverlayRef}
    className="absolute inset-0 z-30"
    onPointerDown={handleCentrePointer}
  >
    {/* Instruction pill */}
    <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-slate-900/85 px-3 py-1 text-[10px] text-slate-100 shadow-sm shadow-black/60">
      Tap on the built-up area to set the centre
    </div>

    {/* Centre dot */}
    <div
      className="absolute h-4 w-4 rounded-full border-2 border-amber-400 bg-white shadow shadow-black/60"
      style={{
        left: `${centre.x * 100}%`,
        top: `${centre.y * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="m-[3px] h-1.5 w-1.5 rounded-full bg-amber-500" />
    </div>

    {/* Dashed focus box */}
    <div
      className="pointer-events-none absolute border border-dashed border-amber-300/70"
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

{currentStep === "Verify Rooms" && (
  <div
    ref={roomsOverlayRef}
    className="absolute inset-0 z-30"
    onPointerDown={handleRoomsBackgroundPointerDown}
    onPointerMove={handleRoomsPointerMove}
    onPointerUp={stopDraggingRoom}
    onPointerLeave={stopDraggingRoom}
  >
    {/* Instruction pill */}
    <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full bg-slate-900/85 px-3 py-1 text-[10px] text-slate-100 shadow-sm shadow-black/60">
      Tap to add rooms • drag the coloured dots
    </div>

    {/* Room dots */}
    {rooms.map((room) => {
      const label =
        ROOM_TYPE_OPTIONS.find((o) => o.value === room.type)?.label ?? "Room";

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
              "h-4 w-4 rounded-full border-2 shadow-sm shadow-black/60 cursor-pointer touch-none",
              room.type === "toilet"
                ? "border-red-400 bg-red-200/90"
                : room.type === "kitchen"
                ? "border-amber-400 bg-amber-200/90"
                : "border-sky-400 bg-sky-200/90",
            ].join(" ")}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggingRoomId(room.id);
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              setDraggingRoomId(null);
              (e.currentTarget as HTMLElement).releasePointerCapture(
                e.pointerId,
              );
            }}
          />
          <div className="mt-1 rounded-full bg-slate-900/85 px-2 py-0.5 text-[9px] text-slate-100 shadow-sm shadow-black/60">
            {room.name || label}
          </div>
        </div>
      );
    })}
  </div>
)}

                        {/* Status + Clear (unchanged) */}
                        <div className="pointer-events-none absolute left-3 bottom-3 z-40 rounded-full bg-slate-900/85 px-3 py-1 text-[10px] text-slate-200 shadow-sm shadow-black/40">
                          {currentStep} · rotation {rotationDeg.toFixed(1)}°
                        </div>

                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute right-3 top-3 z-40 rounded-full bg-red-600 px-3 py-1.5 text-[10px] font-medium text-white shadow-sm shadow-red-900/60 hover:bg-red-700"
                        >
                          Clear plan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Step panel */}
          <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-3 sm:p-4 shadow-xl shadow-slate-950/60">
            {/* Step Title */}
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h2 className="font-display text-sm font-semibold tracking-tight text-slate-50 sm:text-base">
                  {currentStep}
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {currentStep === "Upload Floor Plan" &&
                    "Start by uploading a clear 2D floor plan image of your home or apartment."}
                  {currentStep === "Set Orientation" &&
                    "Rotate the plan so the North direction matches your actual property orientation."}
                  {currentStep === "Set Centre" &&
                    "Mark the Brahmasthan (centre of the built-up area). This helps map each room to its Vastu zone."}
                  {currentStep === "Verify Rooms" &&
                    "Use AI to detect rooms or place them manually. Fine-tune positions and labels as needed."}
                  {currentStep === "Vastu Summary" &&
                    "Review direction-wise Vastu verdicts for each room and your overall score."}
                  {currentStep === "Payment" &&
                    "Complete payment securely to get your detailed PDF report delivered to your inbox."}
                </p>
              </div>
              {imageUrl && (
                <span className="mt-0.5 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                  Plan loaded
                </span>
              )}
            </div>

            {/* Step content */}
            <div className="mt-2 flex-1 overflow-auto pr-1 text-[11px] text-slate-200 sm:text-[12px]">
              {/* Orientation controls */}
              {currentStep === "Set Orientation" && (
                <div className="space-y-3">
                  <p className="text-slate-400">
                    Use the buttons below to rotate your plan until the North
                    arrow (if any) aligns with the compass overlay.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={rotateLeft}
                      disabled={!imageUrl}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-100 hover:border-indigo-500 hover:bg-slate-800 disabled:opacity-40"
                    >
                      ⟲ Rotate Left (22.5°)
                    </button>
                    <button
                      type="button"
                      onClick={rotateRight}
                      disabled={!imageUrl}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-100 hover:border-indigo-500 hover:bg-slate-800 disabled:opacity-40"
                    >
                      ⟳ Rotate Right (22.5°)
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Current rotation:{" "}
                    <span className="font-semibold text-slate-100">
                      {rotationDeg.toFixed(1)}°
                    </span>
                  </div>
                </div>
              )}

              {/* Set Centre content */}
              {currentStep === "Set Centre" && (
                <div className="space-y-2">
                  <p className="text-slate-400">
                    Tap roughly at the physical centre of your main built-up
                    structure (ignore open terraces or garden if separate).
                  </p>
                  <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] text-slate-300">
                    Approx centre:{" "}
                    <span className="font-semibold text-slate-100">
                      x {(centre.x * 100).toFixed(0)}%, y{" "}
                      {(centre.y * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    You can tap multiple times until the dot visually matches
                    the centre of the structure.
                  </p>
                </div>
              )}

              {/* Verify Rooms */}
              {currentStep === "Verify Rooms" && (
                <div className="flex h-full flex-col gap-3">
                  <p className="text-slate-400">
                    Use{" "}
                    <span className="font-semibold text-slate-100">
                      AI auto-detect
                    </span>{" "}
                    first, then adjust names, types and positions. You can also
                    tap on the plan to add extra rooms.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleAutoDetectRooms}
                      disabled={!planImageDataUrl || isDetectingRooms}
                      className="flex-1 rounded-lg bg-indigo-500 px-3 py-2 text-[11px] font-semibold text-white shadow-sm shadow-indigo-500/40 hover:bg-indigo-600 disabled:opacity-40"
                    >
                      {isDetectingRooms
                        ? "Detecting rooms..."
                        : "Auto-detect rooms (AI beta)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRooms([])}
                      disabled={rooms.length === 0}
                      className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-100 hover:border-red-500 hover:bg-slate-800 disabled:opacity-40"
                    >
                      Clear all rooms
                    </button>
                  </div>

                  <div className="mt-1 flex-1 space-y-2 overflow-auto pr-1">
                    {rooms.length === 0 && (
                      <p className="text-[11px] text-slate-500">
                        No rooms added yet. Tap on the floor plan, or try{" "}
                        <span className="font-semibold text-slate-100">
                          Auto-detect rooms
                        </span>
                        .
                      </p>
                    )}
                    {rooms.map((room, index) => (
                      <div
                        key={room.id}
                        className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-2"
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-slate-100">
                            Room {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeRoom(room.id)}
                            className="text-[10px] text-red-400 hover:text-red-300"
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
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <select
                          value={room.type}
                          onChange={(e) =>
                            updateRoomType(room.id, e.target.value as RoomType)
                          }
                          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {ROOM_TYPE_OPTIONS.map((opt) => (
                            <option
                              key={opt.value}
                              value={opt.value}
                              className="bg-slate-900"
                            >
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <div className="mt-1 text-[10px] text-slate-500">
                          Position: x {(room.x * 100).toFixed(0)}%, y{" "}
                          {(room.y * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vastu Summary */}
              {currentStep === "Vastu Summary" && (
                <>
                  {rooms.length === 0 ? (
                    <p className="text-[11px] text-red-400">
                      No rooms defined. Go back to{" "}
                      <span className="font-semibold">Verify Rooms</span> to add
                      them before viewing the Vastu summary.
                    </p>
                  ) : !vastuSummary ? (
                    <p className="text-[11px] text-slate-400">
                      Preparing your Vastu summary...
                    </p>
                  ) : (
                    <div className="flex h-full flex-col gap-3">
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5">
                        <div className="text-[11px] font-semibold text-emerald-200">
                          Overall Vastu Score
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="font-display text-2xl font-semibold text-emerald-300">
                            {vastuSummary.score}
                          </span>
                          <span className="text-[11px] text-emerald-200">
                            / 100
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-emerald-100">
                          {vastuSummary.verdict}
                        </div>
                      </div>

                      <div className="flex-1 overflow-auto pr-1">
                        <div className="mb-1 grid grid-cols-[1.3fr,0.6fr,0.9fr] gap-x-2 text-[10px] font-semibold text-slate-300">
                          <div>Room</div>
                          <div>Direction</div>
                          <div>Vastu Verdict</div>
                        </div>
                        <div className="max-h-64 space-y-1 overflow-auto">
                          {vastuSummary.rooms.map((r) => {
                            const verdictColor =
                              r.verdict === "Auspicious"
                                ? "text-emerald-300"
                                : r.verdict === "Favourable"
                                ? "text-emerald-200"
                                : r.verdict === "Average"
                                ? "text-slate-200"
                                : r.verdict === "Unfavourable"
                                ? "text-amber-200"
                                : "text-red-300";

                            return (
                              <div
                                key={r.id}
                                className="grid grid-cols-[1.3fr,0.6fr,0.9fr] gap-x-2 gap-y-0.5 rounded-md border border-slate-800 bg-slate-950/60 px-2 py-1.5 text-[10px]"
                              >
                                <div>
                                  <div className="font-semibold text-slate-100">
                                    {r.name}
                                  </div>
                                  <div className="text-[9px] capitalize text-slate-400">
                                    {r.type.replace("_", " ")}
                                  </div>
                                </div>
                                <div className="text-slate-200">
                                  {r.direction}
                                </div>
                                <div className={verdictColor}>
                                  {r.verdict}
                                  {r.notes && (
                                    <div className="mt-0.5 text-[9px] text-slate-400">
                                      {r.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={handleDownloadPdf}
                          disabled={isDownloading}
                          className="w-full rounded-lg bg-slate-50 px-4 py-2 text-[11px] font-semibold text-slate-900 shadow-sm shadow-slate-50/50 hover:bg-white disabled:opacity-40"
                        >
                          {isDownloading
                            ? "Generating PDF..."
                            : "Download Sample Vastu Report (PDF)"}
                        </button>
                        <p className="mt-1 text-[10px] text-slate-500">
                          After payment, the same report will also be generated
                          on the server and emailed with your details.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Payment */}
              {currentStep === "Payment" && (
                <div className="flex h-full flex-col gap-3">
                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-100">
                          Comprehensive Vastu Report
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Orientation, room-wise verdicts & remedies in a
                          structured PDF.
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-bold text-indigo-300">
                          ₹ 499
                        </div>
                        <div className="text-[9px] text-slate-500">
                          One-time • per layout
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email (for sending PDF)"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile (optional)"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="City / Location"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />

                    <p className="text-[10px] text-slate-500">
                      Once payment is successful and verified, we will generate
                      your report on the server and email it to you (after we
                      plug in the mailer).
                    </p>

                    {fakeOrderId && (
                      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1.5 text-[10px] text-emerald-100">
                        Razorpay Order ID:{" "}
                        <span className="font-semibold">{fakeOrderId}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={handlePayWithRazorpay}
                      disabled={
                        isSubmitting ||
                        !customerName ||
                        !customerEmail ||
                        !isRazorpayReady
                      }
                      className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-[11px] font-semibold text-white shadow-sm shadow-indigo-500/50 hover:bg-indigo-600 disabled:opacity-40"
                    >
                      {isSubmitting
                        ? "Starting Razorpay..."
                        : "Pay ₹499 securely with Razorpay"}
                    </button>
                    <p className="mt-1 text-center text-[10px] text-slate-500">
                      Powered by Razorpay • Test mode keys currently in use.
                    </p>
                  </div>
                </div>
              )}

              {/* Upload step extra text (right panel) */}
              {currentStep === "Upload Floor Plan" && (
                <div className="mt-2 space-y-2">
                  <p className="text-slate-400">
                    Accepted formats: clear 2D floor plans (top view). Avoid
                    perspective 3D images or photographs of printed drawings for
                    best AI detection.
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Your plan is processed in memory for this session only.
                    Payment is handled via Razorpay on secure servers.
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
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] font-medium text-slate-100 hover:border-slate-500 hover:bg-slate-800 disabled:opacity-40 sm:w-auto"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="w-full rounded-lg bg-slate-50 px-4 py-2 text-[11px] font-semibold text-slate-900 shadow-sm shadow-slate-50/40 hover:bg-white disabled:opacity-40 sm:w-auto"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
