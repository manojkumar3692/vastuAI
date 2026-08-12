// src/lib/region.ts
//
// Shared client-side helper for deciding whether the current visitor should
// see domestic (India) or international pricing/checkout. The region is
// determined server-side by src/middleware.ts (via Vercel's edge geo
// header) and handed to the client as a cookie; this just reads it back on
// the client, with a manual override for QA (?region=intl / ?region=in)
// and a safe "IN" default when nothing is known yet (e.g. before mount, or
// if the app isn't hosted on Vercel).

import { useSyncExternalStore } from "react";

export type PricingRegion = "IN" | "INTL";

export function resolveRegion(): PricingRegion {
  if (typeof window === "undefined") return "IN";

  const override = new URLSearchParams(window.location.search).get("region");
  if (override === "intl") return "INTL";
  if (override === "in") return "IN";

  const match = document.cookie.match(/(?:^|;\s*)vc_region=([^;]+)/);
  return match?.[1] === "INTL" ? "INTL" : "IN";
}

// Pricing copy for each region, in one place so the display (strike-through
// + final price) and the actual Razorpay button always agree. Update the
// numbers here if pricing changes — nothing else needs to touch these.
export const PRICING = {
  IN: { strike: "₹ 499", price: "₹ 99" },
  INTL: { strike: "₹ 999", price: "₹ 499" },
} as const;

function noopSubscribe() {
  return () => {};
}

function getServerRegion(): PricingRegion {
  return "IN";
}

// React-render-safe version of resolveRegion() for use in JSX. Renders "IN"
// during SSR/hydration (matching the server-rendered HTML, so no hydration
// mismatch warning), then reads the real cookie/override on the client —
// via useSyncExternalStore rather than a useEffect+setState pair, since
// there's no actual external subscription needed, just a one-time
// client-only read.
export function usePricingRegion(): PricingRegion {
  return useSyncExternalStore(noopSubscribe, resolveRegion, getServerRegion);
}
