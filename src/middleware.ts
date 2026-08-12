// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Detects whether a visitor to /vastu is browsing from outside India, purely
// so PaymentStep.tsx can decide which Razorpay Payment Button to show
// (domestic ₹ pricing vs an international price for NRI/foreign visitors).
// This is the ONLY thing this middleware does — no redirects, no content
// changes, nothing else about the request/response is touched, and it only
// runs on /vastu (see matcher below) so it can't affect any other route,
// including the SEO landing pages or sitemap/robots.
//
// Country comes from Vercel's edge geolocation header (x-vercel-ip-country),
// which is set automatically for apps hosted on Vercel — no extra config or
// third-party geo-IP service needed. If that header isn't present (e.g. not
// hosted on Vercel, or local dev), this falls back to "IN" so nobody is ever
// accidentally shown the wrong price by default.
export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") || // fallback if ever fronted by Cloudflare
    "IN";

  const region = country === "IN" ? "IN" : "INTL";

  res.cookies.set("vc_region", region, {
    maxAge: 60 * 60 * 24, // 1 day — re-detected on every fresh /vastu visit anyway
    path: "/",
    sameSite: "lax",
  });

  return res;
}

export const config = {
  matcher: ["/vastu"],
};
