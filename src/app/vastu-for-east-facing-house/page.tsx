import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for East Facing House | Check Your Plan Online",
  description:
    "Check Vastu for east facing house using your floor plan. Get room-wise Vastu verdicts for entrance, kitchen, bedrooms, pooja and toilets. Free preview available.",
  keywords: [
    "vastu for east facing house",
    "east facing house vastu",
    "east facing house plan vastu",
    "east facing home vastu",
    "east facing house vastu tips",
    "east facing house vastu report",
  ],
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-east-facing-house",
  },
  openGraph: {
    title: "Vastu for East Facing House | VastuCheck.in",
    description:
      "Upload your east facing house plan and get a structured Vastu report with room-wise verdicts and remedies.",
    url: "https://vastucheck.in/vastu-for-east-facing-house",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vastu for East Facing House",
      },
    ],
  },
};

export default function EastFacingHousePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is east facing house good according to Vastu?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. East facing houses are considered auspicious because they receive morning sunlight and positive energy. However, room placement inside the house must still follow proper Vastu zones.",
        },
      },
      {
        "@type": "Question",
        name: "Where should kitchen be in an east facing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The kitchen should ideally be in the South-East zone (Agni corner). North-West is the second option. Kitchen in North-East or South-West is considered unfavourable.",
        },
      },
      {
        "@type": "Question",
        name: "Can I check east facing house Vastu online?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You can upload your floor plan to VastuCheck.in and get an AI-assisted Vastu report with room-wise analysis and remedies.",
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#c05621] shadow-lg">
              <span className="text-sm font-semibold">VC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-widest text-[#b65c10] uppercase">
                VastuCheck
              </span>
              <span className="text-[12px] text-[#7c5b2e]">
                Online Vastu by Floor Plan
              </span>
            </div>
          </div>
          <nav className="hidden sm:flex gap-4 text-xs">
            <a href="/" className="hover:text-[#b65c10]">Home</a>
            <a href="/vastu" className="hover:text-[#b65c10]">Check my plan</a>
            <a href="/contact" className="hover:text-[#b65c10]">Contact</a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <h1 className="text-3xl sm:text-4xl font-semibold">
              Vastu for{" "}
              <span className="text-[#ea580c]">East Facing House</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              An east facing house is considered highly auspicious in Vastu
              Shastra because it welcomes the rising sun and positive energy.
              But the real results depend on where your{" "}
              <strong>kitchen, bedrooms, toilets, pooja room and staircase</strong>{" "}
              are placed inside the house.
            </p>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              With <strong>VastuCheck.in</strong>, you can upload your east
              facing house plan and get a structured Vastu analysis showing:
            </p>

            <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
              <li>Whether your main entrance is truly in the East zone</li>
              <li>If your kitchen is correctly placed in South-East</li>
              <li>If bedrooms fall in safe zones like South-West</li>
              <li>If toilets are in unfavourable directions</li>
              <li>Room-wise remedies and corrections</li>
            </ul>

            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-8 py-3 text-sm font-semibold shadow-lg"
            >
              Upload my east facing house plan →
            </a>
          </div>

          {/* INFO CARD */}
          <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-[#a16207]">
              Example – East Facing House Check
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <p>✔ Main door in East – favourable</p>
              <p>✔ Pooja room in North-East – very good</p>
              <p>⚠ Kitchen in North – correction suggested</p>
              <p>⚠ Toilet in South-West – remedies required</p>
            </div>

            <p className="mt-4 text-xs text-[#7c5b2e]">
              A digital Vastu report like this helps you correct mistakes before
              construction or renovation.
            </p>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-12 space-y-6 rounded-3xl border border-amber-200 bg-white px-6 py-8">
          <h2 className="text-xl font-semibold">
            How VastuCheck helps for east facing houses
          </h2>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            Many people assume that an east facing house is automatically good.
            But Vastu depends on **zone placement**, not just facing direction.
            Even in an east facing home, placing the kitchen in North-East or
            bedroom in North-East can disturb balance.
          </p>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            VastuCheck maps your floor plan into North, South, East, West and
            corner zones (NE, SE, SW, NW) and generates a room-wise verdict with
            practical remedies.
          </p>

          <h3 className="font-semibold mt-4">
            When should you check east facing house Vastu?
          </h3>

          <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
            <li>Before finalising architect plan</li>
            <li>Before buying an east facing house</li>
            <li>Before renovation or interiors</li>
            <li>When facing health, money or stress issues</li>
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