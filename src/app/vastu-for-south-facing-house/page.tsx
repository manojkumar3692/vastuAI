// src/app/vastu-for-south-facing-house/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for South Facing House | Check Your Plan Online",
  description:
    "Check Vastu for south facing house using your floor plan. Get room-wise Vastu verdicts for entrance, kitchen, bedrooms, pooja and toilets. Free preview available.",
  keywords: [
    "vastu for south facing house",
    "south facing house vastu",
    "south facing house plan vastu",
    "south facing home vastu tips",
    "south facing house vastu report",
    "main door vastu south facing house",
    "south facing house vastu remedies",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-south-facing-house",
  },
  openGraph: {
    title: "Vastu for South Facing House | VastuCheck.in",
    description:
      "Upload your south facing house plan and get a structured Vastu report with room-wise verdicts and remedies.",
    url: "https://vastucheck.in/vastu-for-south-facing-house",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vastu for South Facing House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu for South Facing House | Online Vastu Check",
    description:
      "Upload your south-facing house plan and get room-wise Vastu verdicts with practical remedies.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: {
    icon: "/om.png",
    apple: "/om.png",
  },
};

export default function SouthFacingHousePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is a south facing house bad according to Vastu?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Not necessarily. A south facing house can be good if the entrance and room placements follow Vastu zones. The problem usually comes from incorrect main door placement or imbalance of heavy zones in the wrong corners.",
        },
      },
      {
        "@type": "Question",
        name: "Where should the main entrance be in a south facing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "In a south facing house, the exact entrance location (pada/zone) matters more than just facing direction. Certain south zones are considered acceptable, while others are avoided. VastuCheck maps your door position into the zone grid and gives a clear verdict.",
        },
      },
      {
        "@type": "Question",
        name: "Which rooms should be avoided in South-West for a south facing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "South-West is a heavy zone. It is ideal for master bedroom and storage. Toilets, kitchens and water elements in South-West are often flagged as unfavourable and may need remedies or layout changes.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fee2e2] via-[#fb7185] to-[#be123c] shadow-lg">
              <span className="text-sm font-semibold text-[#0f172a]">VC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-widest text-[#a11d2f] uppercase">
                VastuCheck
              </span>
              <span className="text-[12px] text-[#6b5340]">
                Online Vastu by Floor Plan
              </span>
            </div>
          </div>

          <nav className="hidden sm:flex gap-4 text-xs text-[#6b5340]">
            <a href="/" className="hover:text-[#a11d2f]">Home</a>
            <a href="/vastu" className="hover:text-[#a11d2f]">Check my plan</a>
            <a href="/contact" className="hover:text-[#a11d2f]">Contact</a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-xs text-[#7f1d1d] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
              South-facing homes can be good — door zone + room placement decides everything
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold">
              Vastu for{" "}
              <span className="text-[#a11d2f]">South Facing House</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              A <strong>south facing house</strong> is often misunderstood. In
              real Vastu, south is not “bad” by default — what matters is the{" "}
              <strong>exact main door zone</strong> and whether key rooms sit in
              the correct corners.
            </p>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              Use <strong>VastuCheck.in</strong> to upload your plan and get a{" "}
              <strong>room-by-room Vastu verdict</strong> with practical
              corrections.
            </p>

            <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
              <li>Entrance zone check (exact south zone matters)</li>
              <li>Kitchen placement (SE preferred, NW second option)</li>
              <li>Master bedroom position (SW ideal for stability)</li>
              <li>Toilet/staircase red-flags (common issues)</li>
              <li>Remedies you can share with architect/family</li>
            </ul>

            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb7185] via-[#facc15] to-[#86efac] px-8 py-3 text-sm font-semibold shadow-lg"
            >
              Upload my south facing house plan →
            </a>

            <div className="text-[12px] text-[#7c5b2e]">
              Free preview: 2 rooms • Full report ₹49
            </div>
          </div>

          {/* INFO CARD */}
          <div className="rounded-3xl border border-rose-200 bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-[#a11d2f]">
              Example – South Facing House Check
            </p>

            <div className="mt-4 space-y-2 text-sm text-[#3f3a34]">
              <p>✔ Master bedroom in South-West – stable</p>
              <p>✔ Kitchen in South-East – favourable</p>
              <p>⚠ Main door in a weak south zone – correction suggested</p>
              <p>⚠ Toilet in North-East – remedies required</p>
            </div>

            <p className="mt-4 text-xs text-[#6b5340]">
              The “south facing” label is not enough. Door zone + room placement
              decides the real outcome. A report helps you avoid costly mistakes.
            </p>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-12 space-y-6 rounded-3xl border border-rose-200 bg-white px-6 py-8">
          <h2 className="text-xl font-semibold">
            South facing house Vastu — what VastuCheck analyses
          </h2>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            For south facing homes, the main entrance needs extra attention
            because different segments of the south side have different Vastu
            outcomes. VastuCheck maps your plan into a zone grid and gives a
            clear verdict (favourable / unfavourable / critical).
          </p>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            You also get room-wise guidance for bedrooms, kitchen, toilets,
            pooja, staircase, Brahmasthan and major elements.
          </p>

          <h3 className="font-semibold mt-4">
            When should you check south facing house Vastu?
          </h3>

          <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
            <li>Before buying a south facing plot/house</li>
            <li>Before finalising construction drawings</li>
            <li>Before renovation or interiors</li>
            <li>When you want “door-zone clarity” instead of generic tips</li>
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t pt-4 text-xs text-[#8b7357] flex justify-between flex-wrap gap-2">
          <span>© {year} VastuCheck.in</span>
          <div className="flex gap-4">
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms-and-conditions">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}