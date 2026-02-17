import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Floor Plan for Vastu Check | Free Preview + PDF Report",
  description:
    "Upload your home floor plan and get a Vastu check online. Free preview for 2 rooms, then unlock the full room-wise Vastu report PDF with remedies.",
  keywords: [
    "upload floor plan vastu check",
    "upload house plan vastu",
    "floor plan vastu check online",
    "upload plan vastu report",
    "vastu check by floor plan",
    "vastu report pdf",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://vastucheck.in/upload-floor-plan-vastu-check",
  },
  openGraph: {
    title: "Upload Floor Plan for Vastu Check | VastuCheck.in",
    description:
      "Upload your floor plan, set North + centre, tag rooms and get a Vastu report. Free 2-room preview, full PDF unlock available.",
    url: "https://vastucheck.in/upload-floor-plan-vastu-check",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Upload Floor Plan for Vastu Check",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload Floor Plan for Vastu Check | VastuCheck.in",
    description:
      "Upload your plan and get a room-wise Vastu report PDF. Free preview included.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function UploadFloorPlanVastuCheckPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What kind of floor plan should I upload?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Upload a clear 2D top-view floor plan (PNG/JPG). Plans with readable room labels work best. Avoid perspective 3D renders or blurry photos.",
        },
      },
      {
        "@type": "Question",
        name: "Is the Vastu check free after uploading?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You get a free preview for the first 2 rooms. You can unlock the full PDF report for the entire layout afterward.",
        },
      },
      {
        "@type": "Question",
        name: "Do you store my floor plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Your plan is used only to generate your report. We do not publicly publish it. (You can also clear the plan anytime from the tool.)",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#c05621] shadow-lg shadow-amber-300/40">
              <span className="text-sm font-semibold tracking-tight text-[#2b1b10]">
                VC
              </span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.18em] text-[#b65c10] uppercase">
                VastuCheck
              </div>
              <div className="text-[12px] text-[#7c5b2e]">
                Upload plan → get Vastu report PDF
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Home</a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Start</a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Contact</a>
          </nav>
        </header>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Free preview: 2 rooms • Full PDF available
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Upload your floor plan for a{" "}
              <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#16a34a] bg-clip-text text-transparent">
                Vastu check
              </span>{" "}
              (online).
            </h1>

            <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
              If you’re building, renovating, or buying a home, a quick Vastu scan
              can prevent costly mistakes. Upload your plan, set North and centre,
              tag rooms — get a structured report you can share with family/architect.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/vastu"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 hover:brightness-110"
              >
                Upload my plan now →
              </a>
              <a
                href="/free-vastu-check"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-6 py-3 text-sm font-medium text-[#5a4a36] hover:border-[#b65c10] hover:text-[#b65c10]"
              >
                See free preview details
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 pt-4 text-[12px] text-[#6b5340]">
              <div className="rounded-2xl border border-amber-200 bg-white/95 p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#b65c10]/80">Step 1</div>
                <div className="mt-1 font-semibold text-[#2b1b10]">Upload plan</div>
                <div className="mt-1">JPG/PNG top view</div>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white/95 p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#b65c10]/80">Step 2</div>
                <div className="mt-1 font-semibold text-[#2b1b10]">Set North + centre</div>
                <div className="mt-1">Correct zone mapping</div>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/95 p-4 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#15803d]/80">Result</div>
                <div className="mt-1 font-semibold text-[#2b1b10]">PDF report</div>
                <div className="mt-1">Room-wise verdicts</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-amber-200 bg-white/90 p-6 shadow-xl shadow-amber-200/60">
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                What you get
              </div>
              <ul className="mt-4 space-y-2 text-[13px] text-[#5a4a36]">
                <li>• Room-wise favourable/unfavourable zones</li>
                <li>• Practical non-structural remedies (where possible)</li>
                <li>• Easy-to-share PDF for architect & family</li>
                <li>• Works for flats, villas, independent houses</li>
              </ul>

              <div className="mt-6 rounded-2xl border border-amber-200 bg-[#fff7ed] p-4">
                <div className="font-semibold text-[#2b1b10]">Small price. Big peace of mind.</div>
                <div className="mt-1 text-[12px] text-[#6b5340]">
                  People usually check Vastu when a plan is still adjustable — that’s when it saves money.
                </div>
                <a
                  href="/vastu"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[#2b1b10] px-4 py-3 text-[13px] font-semibold text-amber-50 hover:bg-black"
                >
                  Start with my floor plan
                </a>
              </div>
            </div>
          </div>
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