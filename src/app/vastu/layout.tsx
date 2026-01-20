// src/app/vastu/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://vastucheck.in"),
  title:
    "Free Vastu Check Online (2 Rooms Free) | VastuCheck.in – Floor Plan Vastu Report",
  description:
    "Upload your floor plan and get a free Vastu check preview (2 rooms). Unlock the full room-by-room Vastu report PDF for ₹49. Works for flats & villas.",
  alternates: { canonical: "/vastu" },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Free Vastu Check Online (2 Rooms Free) | VastuCheck.in",
    description:
      "Upload your floor plan, get a free Vastu preview (2 rooms), then unlock the full PDF report for ₹49.",
    url: "/vastu",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "/og/vastucheck-vastu.png", // ✅ create this file in /public/og/
        width: 1200,
        height: 630,
        alt: "VastuCheck – Free Vastu Check (2 rooms free) + PDF report",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Vastu Check Online (2 Rooms Free) | VastuCheck.in",
    description:
      "Upload your floor plan, get a free Vastu preview (2 rooms), then unlock the full PDF report for ₹49.",
    images: ["/og/vastucheck-vastu.png"],
  },

  icons: {
    icon: "/om.png",
    apple: "/om.png",
  },
};

export default function VastuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}