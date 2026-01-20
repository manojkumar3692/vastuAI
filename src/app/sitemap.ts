// src/app/sitemap.ts
import type { MetadataRoute } from "next";

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vastucheck.in";
  const now = new Date();

  const routes: Array<{
    path: string;
    priority: number;
    changeFrequency: ChangeFreq;
  }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },

    // 🔥 Core intent pages
    { path: "/check-vastu-online", priority: 0.95, changeFrequency: "weekly" },
    { path: "/vastu", priority: 0.9, changeFrequency: "monthly" },

    // Supporting SEO pages
    { path: "/vastu-for-flats", priority: 0.8, changeFrequency: "monthly" },
    { path: "/vastu-for-villas", priority: 0.8, changeFrequency: "monthly" },

    // Trust / legal pages
    { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms-and-conditions", priority: 0.4, changeFrequency: "yearly" },
    { path: "/shipping-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/cancellations-and-refunds", priority: 0.4, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}