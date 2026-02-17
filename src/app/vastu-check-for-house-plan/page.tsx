import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu Check for House Plan | Check Vastu Before Construction",
  description:
    "Run a Vastu check for your house plan before construction or renovation. Upload a floor plan, map zones, get room-wise verdicts and remedies.",
  keywords: [
    "vastu check for house plan",
    "house plan vastu check",
    "vastu check before construction",
    "vastu for house plan online",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/vastu-check-for-house-plan" },
  openGraph: {
    title: "Vastu Check for House Plan | VastuCheck.in",
    description:
      "Upload your house plan and get room-wise Vastu verdicts, zones and remedies in a PDF.",
    url: "https://vastucheck.in/vastu-check-for-house-plan",
    siteName: "VastuCheck.in",
    type: "website",
    images: [{ url: "https://vastucheck.in/og-image.png", width: 1200, height: 630, alt: "Vastu Check for House Plan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu Check for House Plan | VastuCheck.in",
    description:
      "Check your house plan Vastu before construction with zone mapping and room-wise report PDF.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuCheckForHousePlanPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When should I do a Vastu check for my house plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Ideally before construction begins or before finalising interiors. Early checks allow room and element placement corrections with minimal cost.",
        },
      },
      {
        "@type": "Question",
        name: "Does it work for G+1 or duplex plans?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You can evaluate a floor plan for villas, G+1/G+2 house plans and duplex layouts as long as you upload a clear 2D plan.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#c05621] shadow-lg shadow-amber-300/40">
              <span className="text-sm font-semibold tracking-tight text-[#2b1b10]">VC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.18em] text-[#b65c10] uppercase">VastuCheck</div>
              <div className="text-[12px] text-[#7c5b2e]">House plan Vastu check</div>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Home</a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Start</a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Contact</a>
          </nav>
        </header>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Best time: before construction / renovation
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Vastu check for{" "}
              <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#16a34a] bg-clip-text text-transparent">
                house plan
              </span>{" "}
              (before you build).
            </h1>

            <p className="max-w-2xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
              Once construction starts, changes become expensive.
              A quick check now can highlight risky placements early — entrance, kitchen,
              toilets, staircase, Brahmasthan — based on your plan’s directions.
            </p>

            <div className="rounded-3xl border border-amber-200 bg-white/95 p-6 shadow-sm">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">What you’ll see</div>
              <ul className="mt-4 space-y-2 text-[13px] text-[#5a4a36]">
                <li>• Which rooms fall in NE/SE/SW/NW</li>
                <li>• Which placements are favourable vs critical</li>
                <li>• What to fix first (priority list)</li>
                <li>• Remedies where relocation isn’t possible</li>
              </ul>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/vastu"
                  className="inline-flex items-center justify-center rounded-full bg-[#2b1b10] px-7 py-3 text-sm font-semibold text-amber-50 shadow hover:bg-black"
                >
                  Check my house plan →
                </a>
                <a
                  href="/vastu-for-villas"
                  className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-6 py-3 text-sm font-medium text-[#5a4a36] hover:border-[#b65c10] hover:text-[#b65c10]"
                >
                  Villa / independent house guide
                </a>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-xl shadow-emerald-200/50">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#15803d]">Mini urgency (ethical)</div>
            <div className="mt-3 text-[13px] text-[#14532d]">
              If you’re within <span className="font-semibold">30–45 days</span> of starting construction or finalising interiors,
              doing this check now gives you maximum flexibility.
            </div>
            <a
              href="/vastu"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-4 py-3 text-[13px] font-semibold text-[#2b1b10] shadow hover:brightness-110"
            >
              Start the check
            </a>
          </aside>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357]">
          <div>© {year} VastuCheck.in</div>
          <div className="flex gap-3">
            <a href="/privacy-policy" className="hover:text-[#b65c10]">Privacy</a>
            <a href="/terms-and-conditions" className="hover:text-[#b65c10]">Terms</a>
            <a href="/contact" className="hover:text-[#b65c10]">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}