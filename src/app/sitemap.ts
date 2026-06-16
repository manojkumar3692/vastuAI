// src/app/sitemap.ts
import type { MetadataRoute } from "next";

type SitemapRoute = {
  path: string;
  lastModified: string;
  changeFrequency: NonNullable<
    MetadataRoute.Sitemap[number]["changeFrequency"]
  >;
  priority: number;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vastucheck.in";

  const staticRoutes: SitemapRoute[] = [
    { path: "", lastModified: "2026-04-09", changeFrequency: "weekly", priority: 1.0 },

    // Core money pages
    { path: "/check-vastu-online", lastModified: "2026-03-29", changeFrequency: "weekly", priority: 0.95 },
    { path: "/free-vastu-check", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.95 },
    { path: "/vastu", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.95 },

    // Tier-1 buying intent pages
    { path: "/upload-floor-plan-vastu-check", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.92 },
    { path: "/online-vastu-report-for-home", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.9 },
    { path: "/vastu-report-pdf-for-home", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.9 },
    { path: "/vastu-check-for-house-plan", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.9 },
    { path: "/ai-vastu-check-online", lastModified: "2026-03-26", changeFrequency: "weekly", priority: 0.9 },

    // Property types
    { path: "/vastu-for-flats", lastModified: "2026-03-29", changeFrequency: "monthly", priority: 0.85 },
    { path: "/vastu-for-villas", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.85 },

    // Facing-direction SEO pages
    { path: "/vastu-for-east-facing-house", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.8 },
    { path: "/vastu-for-north-facing-house", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.8 },
    { path: "/vastu-for-south-facing-house", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.8 },
    { path: "/vastu-for-west-facing-house", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.8 },

    // Tier-2 property-specific buyers
    { path: "/vastu-for-2bhk-house", lastModified: "2026-03-29", changeFrequency: "monthly", priority: 0.82 },
    { path: "/vastu-for-3bhk-house", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.82 },
    { path: "/vastu-for-apartment-plan", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.82 },
    { path: "/vastu-for-house-before-construction", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.82 },
    { path: "/vastu-for-independent-house-plan", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.82 },
    { path: "/vastu-for-duplex-house", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.82 },
    { path: "/vastu-for-new-house-plan", lastModified: "2026-03-26", changeFrequency: "monthly", priority: 0.82 },

    // Trust / legal
    { path: "/contact", lastModified: "2026-06-16", changeFrequency: "yearly", priority: 0.6 },
    { path: "/privacy-policy", lastModified: "2026-06-16", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms-and-conditions", lastModified: "2026-03-26", changeFrequency: "yearly", priority: 0.4 },
    { path: "/shipping-policy", lastModified: "2026-06-16", changeFrequency: "yearly", priority: 0.4 },
    { path: "/cancellations-and-refunds", lastModified: "2026-06-16", changeFrequency: "yearly", priority: 0.4 },
  ];

  return staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: new Date(r.lastModified),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}