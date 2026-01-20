// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vastucheck.in";

  const staticRoutes = [
    "",
    "/vastu",
    "/vastu-for-flats",
    "/vastu-for-villas",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/shipping-policy",
    "/cancellations-and-refunds",
  ];

  const now = new Date();

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/vastu" ? 0.9 : 0.7,
  }));
}