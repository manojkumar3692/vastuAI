// src/app/vastu/page.tsx
"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { directionForPoint } from "@/lib/vastuGeometry";
import { evaluateVastu, type VastuSummary } from "@/lib/vastuRules";
import type { RoomPoint, RoomType } from "@/types/vastu";
import { ROOM_TYPE_LABEL } from "@/lib/templates";

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

export const ROOM_TYPE_OPTIONS: {
  value: RoomType;
  label: string;
  group: string;
}[] = [
  // Amenities
  { value: "gym", label: ROOM_TYPE_LABEL.gym, group: "Amenities" },
  { value: "pool", label: ROOM_TYPE_LABEL.pool, group: "Amenities" },

  // Bathrooms
  { value: "toilet", label: ROOM_TYPE_LABEL.toilet, group: "Bathrooms" },
  {
    value: "powder_room",
    label: ROOM_TYPE_LABEL.powder_room,
    group: "Bathrooms",
  },
  { value: "bathroom", label: ROOM_TYPE_LABEL.bathroom, group: "Bathrooms" },

  // Bedrooms
  {
    value: "master_bedroom",
    label: ROOM_TYPE_LABEL.master_bedroom,
    group: "Bedrooms",
  },
  { value: "bedroom", label: ROOM_TYPE_LABEL.bedroom, group: "Bedrooms" },
  { value: "kids_room", label: ROOM_TYPE_LABEL.kids_room, group: "Bedrooms" },
  {
    value: "guest_room",
    label: ROOM_TYPE_LABEL.guest_room,
    group: "Bedrooms",
  },

  // Core rooms
  { value: "kitchen", label: ROOM_TYPE_LABEL.kitchen, group: "Core Rooms" },
  { value: "living", label: ROOM_TYPE_LABEL.living, group: "Core Rooms" },
  { value: "dining", label: ROOM_TYPE_LABEL.dining, group: "Core Rooms" },
  { value: "pooja", label: ROOM_TYPE_LABEL.pooja, group: "Core Rooms" },

  // Entertainment
  {
    value: "media_room",
    label: ROOM_TYPE_LABEL.media_room,
    group: "Entertainment",
  },
  {
    value: "home_theater",
    label: ROOM_TYPE_LABEL.home_theater,
    group: "Entertainment",
  },
  {
    value: "gaming_room",
    label: ROOM_TYPE_LABEL.gaming_room,
    group: "Entertainment",
  },
  {
    value: "music_room",
    label: ROOM_TYPE_LABEL.music_room,
    group: "Entertainment",
  },
  { value: "bar", label: ROOM_TYPE_LABEL.bar, group: "Entertainment" },

  // Entrance
  {
    value: "main_entrance",
    label: ROOM_TYPE_LABEL.main_entrance,
    group: "Entrance",
  },
  { value: "foyer", label: ROOM_TYPE_LABEL.foyer, group: "Entrance" },
  { value: "porch", label: ROOM_TYPE_LABEL.porch, group: "Entrance" },
  { value: "mud_room", label: ROOM_TYPE_LABEL.mud_room, group: "Entrance" },

  // Outdoor
  { value: "balcony", label: ROOM_TYPE_LABEL.balcony, group: "Outdoor" },
  { value: "terrace", label: ROOM_TYPE_LABEL.terrace, group: "Outdoor" },
  { value: "courtyard", label: ROOM_TYPE_LABEL.courtyard, group: "Outdoor" },
  { value: "verandah", label: ROOM_TYPE_LABEL.verandah, group: "Outdoor" },
  { value: "sit_out", label: ROOM_TYPE_LABEL.sit_out, group: "Outdoor" },
  { value: "deck", label: ROOM_TYPE_LABEL.deck, group: "Outdoor" },
  { value: "garden", label: ROOM_TYPE_LABEL.garden, group: "Outdoor" },
  { value: "gazebo", label: ROOM_TYPE_LABEL.gazebo, group: "Outdoor" },
  { value: "pergola", label: ROOM_TYPE_LABEL.pergola, group: "Outdoor" },

  // Parking
  { value: "parking", label: ROOM_TYPE_LABEL.parking, group: "Parking" },
  { value: "garage", label: ROOM_TYPE_LABEL.garage, group: "Parking" },

  // Personal spaces
  {
    value: "dressing_room",
    label: ROOM_TYPE_LABEL.dressing_room,
    group: "Personal Spaces",
  },

  // Service areas
  {
    value: "servant_room",
    label: ROOM_TYPE_LABEL.servant_room,
    group: "Service Areas",
  },
  {
    value: "maid_room",
    label: ROOM_TYPE_LABEL.maid_room,
    group: "Service Areas",
  },

  // Storage
  { value: "store_room", label: ROOM_TYPE_LABEL.store_room, group: "Storage" },
  {
    value: "shoe_closet",
    label: ROOM_TYPE_LABEL.shoe_closet,
    group: "Storage",
  },
  { value: "store", label: ROOM_TYPE_LABEL.store, group: "Storage" },

  // Structural
  {
    value: "staircase",
    label: ROOM_TYPE_LABEL.staircase,
    group: "Structural",
  },
  { value: "basement", label: ROOM_TYPE_LABEL.basement, group: "Structural" },

  // Utilities
  { value: "utility", label: ROOM_TYPE_LABEL.utility, group: "Utilities" },
  { value: "laundry", label: ROOM_TYPE_LABEL.laundry, group: "Utilities" },
  { value: "wash_area", label: ROOM_TYPE_LABEL.wash_area, group: "Utilities" },
  {
    value: "overhead_water_tank",
    label: ROOM_TYPE_LABEL.overhead_water_tank,
    group: "Utilities",
  },
  {
    value: "underground_water_tank",
    label: ROOM_TYPE_LABEL.underground_water_tank,
    group: "Utilities",
  },
  {
    value: "electrical_room",
    label: ROOM_TYPE_LABEL.electrical_room,
    group: "Utilities",
  },

  // Work spaces
  { value: "study", label: ROOM_TYPE_LABEL.study, group: "Work Spaces" },
  {
    value: "home_office",
    label: ROOM_TYPE_LABEL.home_office,
    group: "Work Spaces",
  },
  { value: "library", label: ROOM_TYPE_LABEL.library, group: "Work Spaces" },

  // Fallback
  { value: "other", label: ROOM_TYPE_LABEL.other, group: "Other" },
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

  // AI + PDF states
  const [isDetectingRooms, setIsDetectingRooms] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const canGoBack = stepIndex > 0;
  const canGoNext =
    stepIndex < STEPS.length - 1 &&
    !(currentStep === "Upload Floor Plan" && !imageUrl) &&
    !(currentStep === "Verify Rooms" && rooms.length === 0);

  const handlePayWithPhonePe = async () => {
    if (!customerName || !customerEmail) {
      alert("Please enter at least your name and email.");
      return;
    }
    if (!vastuSummary) {
      alert("Please review the Vastu Summary before payment.");
      return;
    }

    setIsSubmitting(true);
    try {
      // For now: directly generate & download the full PDF report (no payment)
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          summary: vastuSummary,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Generate-report failed:", err);
        alert("Unable to generate Vastu report. Please try again.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vastu-report-test.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Generate-report error:", err);
      alert("Unable to generate Vastu report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const FREE_ROOMS_COUNT = 3;

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

  // ---------- UI (saffron / ivory theme, logic unchanged) ----------
  return (
    <main className="min-h-screen bg-[#f8f4ec] text-[#1b2430]">
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
              Hybrid Vastu scoring engine (rules + AI assistance)
            </span>
            <span className="mt-1 text-[10px] text-amber-800/70">
              We don’t store your plan • Payments handled securely by PhonePe
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
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium text-amber-800 ring-1 ring-amber-300/70">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Upload your 2D plan · Get a Vastu scoring report in minutes
              </div>
              <h1 className="text-[20px] font-semibold tracking-tight text-[#2b1b10] sm:text-[24px]">
                Check your home’s Vastu using your floor plan — without a site
                visit.
              </h1>
              <p className="max-w-2xl text-[12px] leading-relaxed text-[#5f4630] sm:text-[13px]">
                VastuCheck reads your floor plan, maps every room to its{" "}
                <span className="font-semibold">
                  North–East–South–West energy grid
                </span>{" "}
                and prepares a{" "}
                <span className="font-semibold">
                  room-wise Vastu summary with practical remedies
                </span>{" "}
                based on traditional rules. AI is used only to assist with
                reading the drawing and writing the report.
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
                            className="absolute inset-0 z-30"
                            onPointerDown={handleRoomsBackgroundPointerDown}
                            onPointerMove={handleRoomsPointerMove}
                            onPointerUp={stopDraggingRoom}
                            onPointerLeave={stopDraggingRoom}
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
                                      (
                                        e.currentTarget as HTMLElement
                                      ).setPointerCapture(e.pointerId);
                                    }}
                                    onPointerUp={(e) => {
                                      e.stopPropagation();
                                      setDraggingRoomId(null);
                                      (
                                        e.currentTarget as HTMLElement
                                      ).releasePointerCapture(e.pointerId);
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
                    "See how each room scores direction-wise before unlocking the full Vastu blueprint."}
                  {currentStep === "Payment" &&
                    "Share your basic details and complete payment securely to receive the full PDF report."}
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
                    Use{" "}
                    <span className="font-semibold text-[#2b1b10]">
                      AI-assisted auto-detect
                    </span>{" "}
                    first, then fine-tune names and room types. You can also tap
                    on the plan to add extra rooms manually.
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
                        : "Auto-detect rooms (AI-assisted)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRooms([])}
                      disabled={rooms.length === 0}
                      className="flex-1 rounded-lg border border-amber-200 bg-white px-3 py-2 text-[11px] font-medium text-[#5f4630] hover:bg-amber-50 disabled:opacity-40"
                    >
                      Clear all rooms
                    </button>
                  </div>

                  <div className="mt-1 flex-1 space-y-2 overflow-auto pr-1">
                    {rooms.length === 0 && (
                      <p className="text-[11px] text-[#a58b6e]">
                        No rooms added yet. Tap on the floor plan, or click{" "}
                        <span className="font-semibold">Auto-detect rooms</span>{" "}
                        to let the helper engine place them for you.
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
                            updateRoomType(room.id, e.target.value as RoomType)
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
                </div>
              )}

              {/* Vastu Summary */}
              {currentStep === "Vastu Summary" && (
                <>
                  {rooms.length === 0 ? (
                    <p className="text-[11px] text-rose-500">
                      No rooms defined. Go back to{" "}
                      <span className="font-semibold">Verify Rooms</span> to add
                      them before viewing the Vastu summary.
                    </p>
                  ) : !vastuSummary ? (
                    <p className="text-[11px] text-[#8b7357]">
                      Preparing your Vastu summary…
                    </p>
                  ) : (
                    <div className="flex h-full flex-col gap-3">
                      {/* Overall score card */}
                      <div className="rounded-xl border border-emerald-300/70 bg-emerald-50/80 px-3 py-2.5">
                        <div className="text-[11px] font-semibold text-emerald-900">
                          Overall Vastu Score
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-semibold text-emerald-800">
                            {vastuSummary.score}
                          </span>
                          <span className="text-[11px] text-emerald-900">
                            / 100
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-emerald-900/90">
                          {vastuSummary.verdict}
                        </div>
                      </div>

                      {/* Imbalance highlight */}
                      <div className="rounded-lg border border-amber-300/70 bg-amber-50/80 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                            !
                          </span>
                          <div className="text-[11px] font-semibold text-[#7a4b12]">
                            {badRoomsCount === 0
                              ? "No major Vastu issues detected."
                              : badRoomsCount === 1
                              ? "1 room is in a weak Vastu zone."
                              : `${badRoomsCount} rooms are in weak Vastu zones.`}
                          </div>
                        </div>
                        <p className="mt-1 text-[10px] text-[#8b5b1a]">
                          {imbalanceCopy}
                        </p>
                      </div>

                      {/* Free 3-room preview */}
                      <div className="rounded-2xl border border-amber-200 bg-[#fdf7ee] px-3 py-3 shadow-sm">
                        <div className="flex items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-700">
                              Free preview
                            </div>
                            <div className="text-[12px] font-semibold text-[#2b1b10]">
                              First {visibleRooms.length} rooms fully unlocked
                            </div>
                            <p className="text-[10px] text-[#8b7357]">
                              See how our Vastu scoring engine reads your layout
                              before unlocking the complete blueprint.
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[9px] font-medium text-emerald-900 ring-1 ring-emerald-300/80">
                              ✅ Based on traditional Vastu rules
                            </span>
                            {lockedRooms.length > 0 && (
                              <span className="rounded-full bg-white px-2 py-0.5 text-[9px] text-[#8b7357] ring-1 ring-amber-100">
                                {lockedRooms.length} more rooms in full report
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          {visibleRooms.map((r, index) => {
                            const verdictTone =
                              r.verdict === "Auspicious" ||
                              r.verdict === "Favourable"
                                ? "text-emerald-800"
                                : r.verdict === "Average"
                                ? "text-amber-800"
                                : "text-rose-700";

                            const accentBar =
                              r.verdict === "Auspicious" ||
                              r.verdict === "Favourable"
                                ? "from-emerald-400 to-emerald-600"
                                : r.verdict === "Average"
                                ? "from-amber-400 to-amber-600"
                                : "from-rose-500 to-red-700";

                            return (
                              <div
                                key={r.id}
                                className="relative overflow-hidden rounded-xl border border-amber-100 bg-white px-3 py-2.5 text-[10px] shadow-sm"
                              >
                                <div
                                  className={
                                    "absolute inset-y-0 left-0 w-1 bg-gradient-to-b " +
                                    accentBar
                                  }
                                />

                                <div className="flex items-start justify-between gap-2 pl-2">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[11px] font-semibold text-[#2b1b10]">
                                        {r.name}
                                      </span>
                                      <span className="rounded-full bg-[#fdf7ee] px-2 py-0.5 text-[9px] uppercase tracking-[0.12em] text-[#a58b6e]">
                                        Room {index + 1}
                                      </span>
                                    </div>
                                    <div className="text-[9px] text-[#a58b6e]">
                                      {ROOM_TYPE_LABEL[r.type]}
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end gap-1">
                                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-medium text-[#7a4b12]">
                                      Direction:{" "}
                                      <span className="font-semibold">
                                        {r.direction}
                                      </span>
                                    </span>
                                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-900">
                                      Free insight
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between gap-2 pl-2">
                                  <div
                                    className={
                                      verdictTone + " text-[11px] font-semibold"
                                    }
                                  >
                                    {r.verdict}
                                  </div>
                                  {r.notes && (
                                    <div className="max-w-xs text-right text-[9px] text-[#8b7357]">
                                      {r.notes}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <p className="mt-3 text-[10px] text-[#a58b6e]">
                          The full report adds{" "}
                          <span className="font-semibold text-[#5f4630]">
                            room-wise priorities, corrections and a sharable PDF
                          </span>{" "}
                          you can keep for future reference.
                        </p>
                      </div>

                      {/* Locked breakdown */}
                      {lockedRooms.length > 0 && (
                        <div className="relative overflow-hidden rounded-xl border border-amber-100 bg-white px-3 py-2.5">
                          <div className="mb-1 text-[10px] font-semibold text-[#2b1b10]">
                            Complete room-by-room breakdown
                          </div>

                          <div className="space-y-1 opacity-80">
                            {lockedRooms.map((r) => {
                              const verdictColor =
                                r.verdict === "Auspicious"
                                  ? "text-emerald-800"
                                  : r.verdict === "Favourable"
                                  ? "text-emerald-700"
                                  : r.verdict === "Average"
                                  ? "text-[#3f3a34]"
                                  : r.verdict === "Unfavourable"
                                  ? "text-amber-800"
                                  : "text-rose-700";

                              return (
                                <div
                                  key={r.id}
                                  className="grid grid-cols-[1.3fr,0.6fr,0.9fr] gap-x-2 gap-y-0.5 rounded-md border border-amber-50 bg-[#fdf7ee] px-2 py-1.5 text-[10px]"
                                >
                                  <div>
                                    <div className="font-semibold text-[#2b1b10]">
                                      {r.name}
                                    </div>
                                    <div className="text-[9px] capitalize text-[#a58b6e]">
                                      {r.type.replace("_", " ")}
                                    </div>
                                  </div>
                                  <div className="text-[#5f4630]">
                                    {r.direction}
                                  </div>
                                  <div className={verdictColor}>
                                    {r.verdict}
                                    {r.notes && (
                                      <div className="mt-0.5 text-[9px] text-[#a58b6e]">
                                        {r.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* FULL REPORT OFFER SECTION */}
                      <section className="mt-4 rounded-3xl border border-amber-100 bg-white/95 shadow-md shadow-amber-100/70">
                        <div className="grid gap-4 md:grid-cols-[1.7fr,1.3fr] md:items-center">
                          {/* Right: price card + timer */}
                          <div className="flex flex-col justify-between rounded-2xl bg-[#fff8ea] p-3 ring-1 ring-amber-200 sm:p-4">
                            {/* Price badge */}
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#b16612]">
                                  Launch Offer
                                </p>
                                <p className="mt-1 text-sm font-semibold text-[#2b1b10]">
                                  Full VastuCheck blueprint for this floor plan
                                </p>
                                <p className="mt-1 text-[11px] text-[#8b7357]">
                                  One-time fee • per layout • no subscription
                                </p>
                              </div>
                              <div className="flex flex-col items-end">
                                <div className="rounded-full bg-white px-3 py-1 text-right shadow-sm shadow-amber-200/70">
                                  <div className="text-[10px] text-[#8b7357] line-through">
                                    ₹ 499
                                  </div>
                                  <div className="text-[18px] font-bold text-[#d97706] leading-tight">
                                    ₹ 49
                                  </div>
                                  <div className="text-[9px] text-[#8b7357]">
                                    Introductory price
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Timer row */}
                            <div className="mt-3 rounded-2xl bg-[#2b1b10] px-3 py-2 text-[10px] text-amber-50 sm:text-[11px]">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <p className="font-semibold">
                                    Offer active on this device now
                                  </p>
                                  <p className="text-[10px] text-[#f4d9a4]">
                                    Use the launch price before it goes back to
                                    regular pricing.
                                  </p>
                                </div>
                                {/* Timer placeholders – hook your real countdown here */}
                                <div className="flex items-center gap-1.5">
                                  <div className="flex flex-col items-center rounded-md bg-[#3b2b1a] px-2 py-1">
                                    <span className="text-[11px] font-semibold">
                                      00
                                    </span>
                                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#f4d9a4]">
                                      hrs
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center rounded-md bg-[#3b2b1a] px-2 py-1">
                                    <span className="text-[11px] font-semibold">
                                      14
                                    </span>
                                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#f4d9a4]">
                                      min
                                    </span>
                                  </div>
                                  <div className="flex flex-col items-center rounded-md bg-[#3b2b1a] px-2 py-1">
                                    <span className="text-[11px] font-semibold">
                                      32
                                    </span>
                                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#f4d9a4]">
                                      sec
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* CTA button */}
                            <button
                              type="button"
                              onClick={goNext} // or handlePayWithPhonePe when on Payment step
                              className="mt-3 w-full rounded-full bg-[#d97706] px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm shadow-amber-500/70 hover:bg-[#c25f02]"
                            >
                              Get my full VastuCheck report for ₹49
                            </button>

                            <p className="mt-1 text-center text-[10px] text-[#8b7357]">
                              Secure PhonePe payment • AI-assisted reading •
                              Based on traditional Vastu rules.
                            </p>
                          </div>

                          {/* Left: copy */}
                          <div className="space-y-2 p-2">
                            <h3 className="text-base font-semibold text-[#2b1b10] sm:text-lg">
                              Fix your home’s Vastu issues before they become
                              costly mistakes.
                            </h3>
                            <p className="text-[12px] text-[#8b7357] sm:text-[13px]">
                              Unlock your complete{" "}
                              <span className="font-semibold text-[#2b1b10]">
                                VastuCheck report
                              </span>{" "}
                              prepared using{" "}
                              <span className="font-semibold">
                                traditional Vastu rules
                              </span>{" "}
                              with AI only assisting in reading your floor plan
                              and writing. Perfect to share with your family,
                              architect or builder before you finalise
                              construction or interiors.
                            </p>

                            <ul className="mt-2 space-y-1.5 text-[11px] text-[#5f4630] sm:text-[12px]">
                              <li>
                                •{" "}
                                <span className="font-semibold">
                                  Room-by-room verdicts
                                </span>{" "}
                                for bedrooms, kitchen, toilets, puja, living,
                                balcony, staircase and more.
                              </li>
                              <li>
                                •{" "}
                                <span className="font-semibold">
                                  Direction-wise mapping
                                </span>{" "}
                                to NE / SE / SW / NW / East / West / North /
                                South.
                              </li>
                              <li>
                                •{" "}
                                <span className="font-semibold">
                                  Simple non-demolition remedies
                                </span>{" "}
                                – colours, usage tips, placements and only small
                                civil changes if truly needed.
                              </li>
                              <li>
                                •{" "}
                                <span className="font-semibold">
                                  Top 5 “must-fix” items
                                </span>{" "}
                                so you know what to correct first for stability,
                                health and finances.
                              </li>
                              <li>
                                • Notes for{" "}
                                <span className="font-semibold">
                                  money, career, relationships, sleep and
                                  children’s study zones
                                </span>
                                .
                              </li>
                              <li>
                                •{" "}
                                <span className="font-semibold">
                                  Printable 10–15 page PDF
                                </span>{" "}
                                you can save and reuse whenever you discuss
                                Vastu for this property.
                              </li>
                            </ul>

                            <p className="mt-2 text-[11px] text-[#a05819]">
                              Launch phase: pricing kept low so more families
                              can check their layouts before spending lakhs on
                              construction and interiors.
                            </p>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}
                </>
              )}

              {/* Payment */}
              {currentStep === "Payment" && (
                <div className="flex h-full flex-col gap-3">
                  <div className="rounded-xl border border-amber-100 bg-[#fdf7ee] px-3 py-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-semibold text-[#2b1b10]">
                          Comprehensive Vastu Report
                        </div>
                        <div className="text-[10px] text-[#8b7357]">
                          Orientation, room-wise verdicts & remedies in a
                          structured PDF.
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-bold text-amber-700">
                          ₹ 499
                        </div>
                        <div className="text-[9px] text-[#8b7357]">
                          One-time · per layout
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
                      className="w-full rounded-md border border-amber-200 bg-white px-2 py-1.5 text-[11px] text-[#2b1b10] placeholder:text-[#b39b7e] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email (for sending PDF)"
                      className="w-full rounded-md border border-amber-200 bg-white px-2 py-1.5 text-[11px] text-[#2b1b10] placeholder:text-[#b39b7e] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile (optional)"
                      className="w-full rounded-md border border-amber-200 bg-white px-2 py-1.5 text-[11px] text-[#2b1b10] placeholder:text-[#b39b7e] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      placeholder="City / Location"
                      className="w-full rounded-md border border-amber-200 bg-white px-2 py-1.5 text-[11px] text-[#2b1b10] placeholder:text-[#b39b7e] focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />

                    <p className="text-[10px] text-[#a58b6e]">
                      Once payment is enabled, your report will be generated on
                      the server and emailed to you. For now, this button
                      directly downloads the report for testing.
                    </p>

                    {fakeOrderId && (
                      <div className="rounded-md border border-emerald-400/60 bg-emerald-50 px-2 py-1.5 text-[10px] text-emerald-900">
                        Transaction ID:{" "}
                        <span className="font-semibold">{fakeOrderId}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto">
                    <button
                      type="button"
                      onClick={handlePayWithPhonePe}
                      disabled={isSubmitting || !customerName || !customerEmail}
                      className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-[11px] font-semibold text-white shadow-sm shadow-emerald-500/70 hover:bg-emerald-700 disabled:opacity-40"
                    >
                      {isSubmitting
                        ? "Processing…"
                        : "Pay ₹499 securely with PhonePe (test mode)"}
                    </button>
                    <p className="mt-1 text-center text-[10px] text-[#a58b6e]">
                      You will be redirected to PhonePe’s secure UPI / card /
                      wallet page when live.
                    </p>
                  </div>
                </div>
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
          </div>
        </div>
      </section>
    </main>
  );
}
