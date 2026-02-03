// src/app/vastu-for-north-facing-house/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for North Facing House | Check Your Plan Online",
  description:
    "Check Vastu for north facing house using your floor plan. Get room-wise Vastu verdicts for entrance, kitchen, bedrooms, pooja and toilets. Free preview available.",
  keywords: [
    "vastu for north facing house",
    "north facing house vastu",
    "north facing house plan vastu",
    "north facing home vastu",
    "north facing house vastu tips",
    "north facing house vastu report",
  ],
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-north-facing-house",
  },
  openGraph: {
    title: "Vastu for North Facing House | VastuCheck.in",
    description:
      "Upload your north facing house plan and get a structured Vastu report with room-wise verdicts and remedies.",
    url: "https://vastucheck.in/vastu-for-north-facing-house",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vastu for North Facing House",
      },
    ],
  },
};

export default function NorthFacingHousePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is north facing house good according to Vastu?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. North is associated with wealth and opportunities (Kubera direction). A north facing house is considered favourable when entrance and key rooms are placed correctly in Vastu zones.",
        },
      },
      {
        "@type": "Question",
        name: "Where should the main entrance be in a north facing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "For a north facing house, the main entrance is considered favourable when it falls in the North or North-East zone. Exact placement matters more than simply facing north.",
        },
      },
      {
        "@type": "Question",
        name: "Where should kitchen be in a north facing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The kitchen should ideally be in the South-East zone (Agni corner). North-West is the second option. Kitchen in North or North-East is generally considered unfavourable.",
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dcfce7] via-[#86efac] to-[#16a34a] shadow-lg">
              <span className="text-sm font-semibold text-[#0f172a]">VC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-widest text-[#166534] uppercase">
                VastuCheck
              </span>
              <span className="text-[12px] text-[#49643d]">
                Online Vastu by Floor Plan
              </span>
            </div>
          </div>
          <nav className="hidden sm:flex gap-4 text-xs">
            <a href="/" className="hover:text-[#166534]">Home</a>
            <a href="/vastu" className="hover:text-[#166534]">Check my plan</a>
            <a href="/contact" className="hover:text-[#166534]">Contact</a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Vastu for{" "}
              <span className="text-[#166534]">North Facing House</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              A north facing house is often considered favourable in Vastu
              because North is linked to{" "}
              <strong>wealth, growth and opportunities</strong> (Kubera
              direction). But the real benefit depends on whether your{" "}
              <strong>entrance, kitchen, bedrooms and toilets</strong> are in
              the correct Vastu zones.
            </p>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              With <strong>VastuCheck.in</strong>, you can upload your north
              facing house plan and instantly get:
            </p>

            <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
              <li>Main entrance zone check (North / North-East)</li>
              <li>Kitchen placement check (South-East preferred)</li>
              <li>Bedroom zone mapping (South-West ideal for master)</li>
              <li>Toilet/staircase red-flags (common Vastu issues)</li>
              <li>Room-wise remedies you can share with your architect</li>
            </ul>

            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#86efac] via-[#facc15] to-[#fb923c] px-8 py-3 text-sm font-semibold shadow-lg"
            >
              Upload my north facing house plan →
            </a>

            <div className="text-[12px] text-[#7c5b2e]">
              Free preview: 2 rooms • Full report ₹49
            </div>
          </div>

          {/* INFO CARD */}
          <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-[#166534]">
              Example – North Facing House Check
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <p>✔ Main door in North-East – favourable</p>
              <p>✔ Living room in North – good for openness</p>
              <p>⚠ Kitchen in North-East – correction suggested</p>
              <p>⚠ Toilet in South-West – remedies required</p>
            </div>

            <p className="mt-4 text-xs text-[#49643d]">
              Even if a house faces north, wrong room placement can reduce the
              benefits. A structured report helps you fix issues early.
            </p>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-12 space-y-6 rounded-3xl border border-emerald-200 bg-white px-6 py-8">
          <h2 className="text-xl font-semibold">
            North facing house Vastu — what VastuCheck analyses
          </h2>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            Many people only check “north facing” and assume everything is
            perfect. But Vastu depends on <strong>zone balance</strong>. A north
            facing entrance is helpful, but placing the kitchen in North-East or
            bedroom in North can disturb energy flow.
          </p>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            VastuCheck maps your plan into North / South / East / West and
            corners (NE, SE, SW, NW). Then it generates a room-wise verdict and
            practical remedies.
          </p>

          <h3 className="font-semibold mt-4">
            When should you check north facing house Vastu?
          </h3>

          <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
            <li>Before finalising architect plan</li>
            <li>Before buying a north facing house</li>
            <li>Before renovation or interiors</li>
            <li>When facing money blocks / stress / stagnation</li>
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