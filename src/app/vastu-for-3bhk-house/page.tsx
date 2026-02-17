// src/app/vastu-for-3bhk-house/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for 3BHK House Plan | Online Vastu Check & PDF Report",
  description:
    "Check Vastu for your 3BHK house plan online. Upload your floor plan, set North and centre, tag rooms, and get room-wise verdicts with a shareable PDF report.",
  keywords: [
    "vastu for 3bhk",
    "3bhk house vastu",
    "3bhk plan vastu check",
    "online vastu check 3bhk",
    "3bhk vastu report pdf",
    "vastu for 3 bedroom house",
    "3bhk vastu tips",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/vastu-for-3bhk-house" },
  openGraph: {
    title: "Vastu for 3BHK House Plan | VastuCheck.in",
    description:
      "Upload your 3BHK floor plan and get an AI-assisted Vastu report with room-wise verdicts, zone mapping and remedies.",
    url: "https://vastucheck.in/vastu-for-3bhk-house",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "VastuCheck - Vastu for 3BHK House Plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu for 3BHK House Plan | Online Vastu Check",
    description:
      "Check your 3BHK plan’s Vastu with room-wise verdicts and a downloadable PDF report.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuFor3BHKPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What extra checks matter in a 3BHK Vastu plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "In a 3BHK, room placement balance matters more: master bedroom (SW), children’s/guest bedroom zones, kitchen (SE), toilets placement, and whether the centre stays light and open.",
        },
      },
      {
        "@type": "Question",
        name: "Can the report help prioritise fixes in a 3BHK?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The report flags unfavourable/critical placements first and suggests practical remedies so you can prioritise what to fix or adjust with your architect.",
        },
      },
      {
        "@type": "Question",
        name: "Does this work for 3BHK flats and 3BHK villas?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. As long as you upload a clear 2D plan and set correct North + centre, VastuCheck works for apartments, villas and independent houses.",
        },
      },
      {
        "@type": "Question",
        name: "How long does it take to check a 3BHK plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Most users finish in a few minutes: upload plan, set orientation, set centre, and verify rooms. Then you can view the preview and download the full report PDF.",
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

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#c05621] shadow-lg shadow-amber-300/40">
              <span className="text-sm font-semibold tracking-tight text-[#2b1b10]">
                VC
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-[0.18em] text-[#b65c10] uppercase">
                VastuCheck
              </span>
              <span className="text-[12px] text-[#7c5b2e]">
                AI-assisted Vastu report • Floor plan scanner
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">
              Home
            </a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">
              Start VastuCheck
            </a>
            <a
              href="/vastu-for-flats"
              className="text-[11px] text-[#6b5340] hover:text-[#b65c10]"
            >
              Vastu for Flats
            </a>
            <a
              href="/vastu-for-villas"
              className="text-[11px] text-[#6b5340] hover:text-[#b65c10]"
            >
              Vastu for Villas
            </a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">
              Contact
            </a>
          </nav>
        </header>

        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm shadow-amber-100 sm:text-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>3BHK Vastu check • Room balance & priority fixes • PDF report</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Vastu for{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  3BHK house plans
                </span>{" "}
                using your floor plan.
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                A 3BHK layout has more rooms to balance—master bedroom, children’s/guest rooms,
                kitchen, toilets and the centre. Upload your plan, tag rooms, and get
                a <strong className="font-semibold text-[#b45309]">room-wise verdict + priority fixes</strong>{" "}
                in a sharable PDF report.
              </p>
            </div>

            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Best for
                </p>
                <p className="text-lg font-semibold text-[#166534]">3 bedrooms</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Works for flats and independent homes.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  Output
                </p>
                <p className="text-lg font-semibold text-[#15803d]">Score + verdicts</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Identify what to fix first (critical items).
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Share
                </p>
                <p className="text-lg font-semibold text-[#b45309]">PDF report</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Send to architect / family for faster decisions.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Upload my 3BHK plan & start
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                See 3BHK Vastu FAQs
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[#7a5d3a] sm:text-[12px]">
              <span>Ideal before interiors / renovation</span>
              <span className="h-3 w-px bg-amber-200" />
              <span>Room priority list • Remedies included</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                Example – 3BHK snapshot
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#7c5b2e]">Overall Vastu score</p>
                    <p className="mt-1 text-xl font-semibold text-[#15803d]">71 / 100</p>
                    <p className="text-[11px] text-[#166534]">
                      Most rooms good; 1–2 items need attention.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300 bg-[#f0fdf4]">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#22c55e] via-[#fbbf24] to-[#f97316] opacity-90" />
                  </div>
                </div>

                <ul className="mt-2 space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• Master bedroom (SW) – favourable</li>
                  <li>• Kitchen (SE) – favourable</li>
                  <li>• Toilet (NE) – flagged (remedies suggested)</li>
                  <li>• Centre heavy storage – suggested to declutter</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-[#7c5b2e]">
                <p>Get a room-by-room verdict for your actual plan.</p>
                <p className="font-medium text-[#166534]">Use the PDF to decide changes fast.</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <a
                  href="/vastu-for-flats"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  Flats
                </a>
                <a
                  href="/vastu-for-villas"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  Villas
                </a>
                <a
                  href="/vastu-for-house-before-construction"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  Before construction
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="mt-10 space-y-6 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <div>
            <h2 className="text-base font-semibold sm:text-lg">
              3BHK Vastu check – common focus areas
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              With a 3BHK, Vastu is often about balance across rooms. The report helps you
              see which placements are favourable and which ones should be corrected first.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">What we check</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• Master bedroom + other bedrooms</li>
                <li>• Kitchen + dining/living</li>
                <li>• Toilets + staircase (if present)</li>
                <li>• Main entrance + centre</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Best time to use</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• Before interiors are finalised</li>
                <li>• Before buying a resale 3BHK</li>
                <li>• While planning a renovation</li>
                <li>• To coordinate with architect</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-[#fff7ea] p-4">
            <p className="text-[12px] text-[#5a4a36] sm:text-[13px]">
              Start now:{" "}
              <a href="/vastu" className="font-semibold text-[#b45309] underline">
                upload your 3BHK plan
              </a>{" "}
              and get your preview + full PDF report.
            </p>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Vastu for 3BHK house plans • AI-assisted guidance</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/privacy-policy" className="hover:text-[#b65c10]">
              Privacy
            </a>
            <a href="/terms-and-conditions" className="hover:text-[#b65c10]">
              Terms
            </a>
            <a href="/contact" className="hover:text-[#b65c10]">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}