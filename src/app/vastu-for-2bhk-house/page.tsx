// src/app/vastu-for-2bhk-house/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for 2BHK House Plan | Online Vastu Check & PDF Report",
  description:
    "Check Vastu for your 2BHK house plan online. Upload your floor plan, set North and centre, tag rooms, and get a Vastu score + room-wise verdicts. Download a shareable PDF report.",
  keywords: [
    "vastu for 2bhk",
    "2bhk house vastu",
    "2bhk plan vastu check",
    "vastu for 2bhk house plan",
    "online vastu check 2bhk",
    "vastu report pdf 2bhk",
    "2bhk vastu tips",
    "2bhk east facing vastu",
    "2bhk north facing vastu",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/vastu-for-2bhk-house" },
  openGraph: {
    title: "Vastu for 2BHK House Plan | VastuCheck.in",
    description:
      "Upload your 2BHK floor plan and get an AI-assisted Vastu report with room-wise verdicts, zone mapping and remedies.",
    url: "https://vastucheck.in/vastu-for-2bhk-house",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "VastuCheck - Vastu for 2BHK House Plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu for 2BHK House Plan | Online Vastu Check",
    description:
      "Check your 2BHK plan’s Vastu with room-wise verdicts and a downloadable PDF report.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuFor2BHKPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What rooms are typically checked in a 2BHK Vastu report?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A 2BHK Vastu report typically checks the main entrance, living area, kitchen, master bedroom, second bedroom, toilets, pooja space (if any) and the Brahmasthan (centre).",
        },
      },
      {
        "@type": "Question",
        name: "Does this work for 2BHK flats and 2BHK independent houses?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Upload a clear 2D floor plan, set the correct North orientation and centre, then tag rooms. The engine maps each room into NE/SE/SW/NW zones and produces a score and verdicts.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this before finalising my 2BHK plan with an architect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The best time to run a Vastu check is before construction or major renovation so you can adjust room placements early and avoid costly changes later.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a Vastu consultant after this report?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Many people use the PDF report as a practical guide. If you want deeper consultation, you can share the structured PDF with a Vastu consultant or architect to discuss changes.",
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

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* NAV */}
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
            <a
              href="/"
              className="text-[11px] text-[#6b5340] hover:text-[#b65c10]"
            >
              Home
            </a>
            <a
              href="/vastu"
              className="text-[11px] text-[#6b5340] hover:text-[#b65c10]"
            >
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
            <a
              href="/contact"
              className="text-[11px] text-[#6b5340] hover:text-[#b65c10]"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm shadow-amber-100 sm:text-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>
                2BHK Vastu check • Room-wise verdicts • Downloadable PDF
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Vastu for{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  2BHK house plans
                </span>{" "}
                using your floor plan.
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                Upload your 2BHK floor plan, set North and the centre, then tag
                your rooms. VastuCheck maps each room into NE/SE/SW/NW zones and
                generates a
                <strong className="font-semibold text-[#b45309]">
                  {" "}
                  Vastu score + room-wise verdicts
                </strong>{" "}
                with practical remedies. Share the PDF with your family or
                architect.
              </p>
              <p className="max-w-xl text-[14px] text-[#5a4a36]">
                If you are searching for <strong>Vastu for 2BHK flat</strong> or
                <strong>2BHK apartment Vastu</strong>, the key factors include
                kitchen direction, master bedroom placement, toilet zones and
                entrance location. A floor-plan based Vastu check gives a
                clearer answer than general tips, especially for compact 2BHK
                layouts.
              </p>
            </div>

            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Best for
                </p>
                <p className="text-lg font-semibold text-[#166534]">
                  2BHK layout
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Works for flats and independent 2BHK houses.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  Facing
                </p>
                <p className="text-lg font-semibold text-[#15803d]">
                  All directions
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  East / North / West / South facing supported.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Output
                </p>
                <p className="text-lg font-semibold text-[#b45309]">
                  PDF report
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Room-wise verdicts + remedies you can act on.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Upload my 2BHK plan & start
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                See 2BHK Vastu FAQs
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[#7a5d3a] sm:text-[12px]">
              <span>Useful before construction or renovation</span>
              <span className="h-3 w-px bg-amber-200" />
              <span>Digital blueprint • Sharable PDF</span>
            </div>
            <p className="text-[12px] text-[#7a5d3a]">
              Most searched: 2BHK Vastu for east-facing, north-facing &
              apartment layouts.
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                Example – 2BHK Vastu snapshot
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#7c5b2e]">
                      Overall Vastu score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[#15803d]">
                      74 / 100
                    </p>
                    <p className="text-[11px] text-[#166534]">
                      Strong zones, a few practical fixes suggested.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300 bg-[#f0fdf4]">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#22c55e] via-[#fbbf24] to-[#f97316] opacity-90" />
                  </div>
                </div>

                <ul className="mt-2 space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• Kitchen in South-East – favourable</li>
                  <li>• Master bedroom in South-West – strong</li>
                  <li>• Toilet in North-East – flagged with remedies</li>
                  <li>• Centre (Brahmasthan) – kept light & open</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-[#7c5b2e]">
                <p>Run the same check on your real 2BHK plan in 2–3 minutes.</p>
                <p className="font-medium text-[#166534]">
                  Share the PDF with your architect.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <a
                  href="/vastu-for-east-facing-house"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  East-facing
                </a>
                <a
                  href="/vastu-for-north-facing-house"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  North-facing
                </a>
                <a
                  href="/vastu-for-south-facing-house"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  South-facing
                </a>
                <a
                  href="/vastu-for-west-facing-house"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  West-facing
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / SEO */}
        <section
          id="faq"
          className="mt-10 space-y-6 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <div>
            <h2 className="text-base font-semibold sm:text-lg">
              2BHK Vastu check – what this report covers
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              Your 2BHK plan is mapped into Vastu zones (North, South, East,
              West and NE/SE/SW/NW). The report highlights which placements are
              favourable, which need attention, and suggests practical
              remedies—especially for kitchen, bedrooms, toilets and the centre
              (Brahmasthan).
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">Common 2BHK checks</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
              <li>• Kitchen zone, especially South-East suitability</li>
              <li>• Master bedroom zone, especially South-West placement</li>
                <li>• Toilets (avoid NE; remedies if unavoidable)</li>
                <li>• Main entrance zone</li>
                <li>• Centre (Brahmasthan) openness</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Best time to use</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• Before construction or renovation</li>
                <li>• Before buying a resale 2BHK</li>
                <li>• Before finalising interior layout</li>
                <li>• To share guidance with architect/family</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-[#fff7ea] p-4">
            <p className="text-[12px] text-[#5a4a36] sm:text-[13px]">
              Ready to check your plan?{" "}
              <a
                href="/vastu"
                className="font-semibold text-[#b45309] underline"
              >
                Upload your 2BHK floor plan here
              </a>{" "}
              and get your Vastu preview + PDF report.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-100 bg-white px-4 py-5">
          <h3 className="text-sm font-semibold text-[#2b1b10]">
            Explore more Vastu guides
          </h3>

          <div className="mt-3 grid gap-2 text-[12px] text-[#5a4a36] sm:grid-cols-2">
            <a href="/vastu-for-flats" className="hover:underline">
              Vastu for flats & apartments
            </a>
            <a href="/vastu-for-3bhk-house" className="hover:underline">
              Vastu for 3BHK house
            </a>
            <a href="/vastu-for-north-facing-house" className="hover:underline">
              North-facing house Vastu
            </a>
            <a href="/vastu-check-for-house-plan" className="hover:underline">
              Vastu check by floor plan
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Vastu for 2BHK house plans • AI-assisted guidance</span>
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
