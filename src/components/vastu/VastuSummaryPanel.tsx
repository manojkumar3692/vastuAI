"use client";

import React, { useMemo } from "react";
import { ROOM_TYPE_LABEL } from "@/lib/templates";
import type { VastuSummary } from "@/lib/vastuRules";

type Props = {
  roomsCount: number;
  vastuSummary: VastuSummary | null;

  // already computed in your page
  badRoomsCount: number;
  imbalanceCopy: string;
  visibleRooms: VastuSummary["rooms"];
  lockedRooms: VastuSummary["rooms"];

  // navigation
  onGetFullReport: () => void; // typically goNext
};

export default function VastuSummaryPanel({
  roomsCount,
  vastuSummary,
  badRoomsCount,
  imbalanceCopy,
  visibleRooms,
  lockedRooms,
  onGetFullReport,
}: Props) {
  if (roomsCount === 0) {
    return (
      <p className="text-[11px] text-rose-500">
        No rooms defined. Go back to{" "}
        <span className="font-semibold">Verify Rooms</span> to add them before
        viewing the Vastu summary.
      </p>
    );
  }

  if (!vastuSummary) {
    return (
      <p className="text-[11px] text-[#8b7357]">Preparing your Vastu summary…</p>
    );
  }

  return (
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
          <span className="text-[11px] text-emerald-900">/ 100</span>
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
        <p className="mt-1 text-[10px] text-[#8b5b1a]">{imbalanceCopy}</p>
      </div>

      {/* Free preview */}
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
              See how our Vastu scoring engine reads your layout before unlocking
              the complete blueprint.
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
              r.verdict === "Auspicious" || r.verdict === "Favourable"
                ? "text-emerald-800"
                : r.verdict === "Average"
                ? "text-amber-800"
                : "text-rose-700";

            const accentBar =
              r.verdict === "Auspicious" || r.verdict === "Favourable"
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
                    "absolute inset-y-0 left-0 w-1 bg-gradient-to-b " + accentBar
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
                      <span className="font-semibold">{r.direction}</span>
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-900">
                      Free insight
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 pl-2">
                  <div className={verdictTone + " text-[11px] font-semibold"}>
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

      {/* FULL REPORT OFFER */}
      <section className="mt-4 rounded-3xl border border-amber-100 bg-white/95 shadow-md shadow-amber-100/70">
        <div className="grid gap-4 md:grid-cols-[1.7fr,1.3fr] md:items-center">
          {/* Right: price card + timer */}
          <div className="flex flex-col justify-between rounded-2xl bg-[#fff8ea] p-3 ring-1 ring-amber-200 sm:p-4">
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

            <div className="mt-3 rounded-2xl bg-[#2b1b10] px-3 py-2 text-[10px] text-amber-50 sm:text-[11px]">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-semibold">Offer active on this device now</p>
                  <p className="text-[10px] text-[#f4d9a4]">
                    Use the launch price before it goes back to regular pricing.
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex flex-col items-center rounded-md bg-[#3b2b1a] px-2 py-1">
                    <span className="text-[11px] font-semibold">00</span>
                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#f4d9a4]">
                      hrs
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-[#3b2b1a] px-2 py-1">
                    <span className="text-[11px] font-semibold">14</span>
                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#f4d9a4]">
                      min
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-md bg-[#3b2b1a] px-2 py-1">
                    <span className="text-[11px] font-semibold">32</span>
                    <span className="text-[8px] uppercase tracking-[0.18em] text-[#f4d9a4]">
                      sec
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onGetFullReport}
              className="mt-3 w-full rounded-full bg-[#d97706] px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm shadow-amber-500/70 hover:bg-[#c25f02]"
            >
              Get my full VastuCheck report for ₹49
            </button>

            <p className="mt-1 text-center text-[10px] text-[#8b7357]">
              Secure PhonePe payment • AI-assisted reading • Based on traditional
              Vastu rules.
            </p>
          </div>

          {/* Left: copy */}
          <div className="space-y-2 p-2">
            <h3 className="text-base font-semibold text-[#2b1b10] sm:text-lg">
              Fix your home’s Vastu issues before they become costly mistakes.
            </h3>
            <p className="text-[12px] text-[#8b7357] sm:text-[13px]">
              Unlock your complete{" "}
              <span className="font-semibold text-[#2b1b10]">VastuCheck report</span>{" "}
              prepared using{" "}
              <span className="font-semibold">traditional Vastu rules</span>{" "}
              with AI only assisting in reading your floor plan and writing.
              Perfect to share with your family, architect or builder before you
              finalise construction or interiors.
            </p>

            <ul className="mt-2 space-y-1.5 text-[11px] text-[#5f4630] sm:text-[12px]">
              <li>• <span className="font-semibold">Room-by-room verdicts</span> for bedrooms, kitchen, toilets, puja, living, balcony, staircase and more.</li>
              <li>• <span className="font-semibold">Direction-wise mapping</span> to NE / SE / SW / NW / East / West / North / South.</li>
              <li>• <span className="font-semibold">Simple non-demolition remedies</span> – colours, usage tips, placements and only small civil changes if truly needed.</li>
              <li>• <span className="font-semibold">Top 5 “must-fix” items</span> so you know what to correct first.</li>
              <li>• Notes for <span className="font-semibold">money, career, relationships, sleep and children’s study zones</span>.</li>
              <li>• <span className="font-semibold">Printable 10–15 page PDF</span> you can save and reuse anytime.</li>
            </ul>

            <p className="mt-2 text-[11px] text-[#a05819]">
              Launch phase: pricing kept low so more families can check their
              layouts before spending lakhs on construction and interiors.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}