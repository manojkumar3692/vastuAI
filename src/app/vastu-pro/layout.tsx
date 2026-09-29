import type { Metadata } from "next";
import { vastuProFaqs } from "@/lib/vastuProContent";

export const metadata: Metadata = {
  title: "10 Online Vastu Reports for ₹799 — VastuCheck Pro",
  description:
    "Get 10 complete online Vastu report PDFs for ₹799. Ideal for home buyers, architects, interior designers, brokers and families comparing floor plans.",
  alternates: { canonical: "https://vastucheck.in/vastu-pro" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "VastuCheck Pro — 10 Vastu Reports for ₹799",
    description:
      "Check multiple floor plans and keep every completed room-by-room Vastu report in one private account.",
    url: "https://vastucheck.in/vastu-pro",
    siteName: "VastuCheck.in",
    type: "website",
    images: ["https://vastucheck.in/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "10 Online Vastu Reports for ₹799",
    description: "A simple Vastu report package for comparing multiple home floor plans.",
    images: ["https://vastucheck.in/og-image.png"],
  },
};

export default function VastuProLayout({ children }: { children: React.ReactNode }) {
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "VastuCheck Pro — 10 Online Vastu Reports",
    description:
      "A package of 10 complete online Vastu report PDFs with room-wise analysis, Vastu score and practical non-demolition suggestions.",
    image: ["https://vastucheck.in/og-image.png", "https://vastucheck.in/om.png"],
    brand: { "@type": "Brand", name: "VastuCheck.in" },
    sku: "VASTUCHECK-PRO-10",
    category: "Digital Vastu Report Service",
    offers: {
      "@type": "Offer",
      url: "https://vastucheck.in/vastu-pro",
      price: "799",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      priceValidUntil: "2026-12-31",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: vastuProFaqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "VastuCheck", item: "https://vastucheck.in" },
      { "@type": "ListItem", position: 2, name: "VastuCheck Pro", item: "https://vastucheck.in/vastu-pro" },
    ],
  };

  return (
    <>
      {[productSchema, faqSchema, breadcrumbSchema].map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
