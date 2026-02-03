// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vastucheck.in";

  const staticRoutes: Array<{
    path: string;
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },

    // Core money pages
    { path: "/check-vastu-online", changeFrequency: "weekly", priority: 0.95 },
    { path: "/free-vastu-check", changeFrequency: "weekly", priority: 0.95 },
    { path: "/vastu", changeFrequency: "weekly", priority: 0.95 },

    // Property types
    { path: "/vastu-for-flats", changeFrequency: "monthly", priority: 0.85 },
    { path: "/vastu-for-villas", changeFrequency: "monthly", priority: 0.85 },

    // Facing-direction SEO pages (HIGH ROI)
    { path: "/vastu-for-east-facing-house", changeFrequency: "monthly", priority: 0.8 },
    { path: "/vastu-for-north-facing-house", changeFrequency: "monthly", priority: 0.8 },
    { path: "/vastu-for-south-facing-house", changeFrequency: "monthly", priority: 0.8 },
    { path: "/vastu-for-west-facing-house", changeFrequency: "monthly", priority: 0.8 },

    // Trust / legal
    { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.4 },
    { path: "/shipping-policy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/cancellations-and-refunds", changeFrequency: "yearly", priority: 0.4 },
  ];

  const now = new Date();

  return staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}