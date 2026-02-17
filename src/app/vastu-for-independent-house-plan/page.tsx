// src/app/vastu-for-independent-house-plan/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for Independent House Plan | Online Vastu Check & PDF Report",
  description:
    "Check Vastu for your independent house plan online. Upload your floor plan, set North + centre, tag rooms, and get room-wise verdicts, zone mapping and remedies in a PDF report.",
  keywords: [
    "vastu for independent house",
    "independent house plan vastu",
    "house plan vastu check online",
    "vastu report pdf for house",
    "online vastu check independent house",
    "vastu for bungalow plan",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/vastu-for-independent-house-plan" },
  openGraph: {
    title: "Vastu for Independent House Plan | VastuCheck.in",
    description:
      "Upload your independent house plan and get a Vastu score with room-wise verdicts and remedies in a sharable PDF report.",
    url: "https://vastucheck.in/vastu-for-independent-house-plan",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "VastuCheck - Vastu for Independent House Plan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu for Independent House Plan | Online Vastu Check",
    description:
      "Check your independent house plan Vastu with room-wise verdicts and a downloadable PDF report.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuForIndependentHousePlanPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does VastuCheck cover for independent houses?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "VastuCheck covers entrance, bedrooms, kitchen, pooja, toilets, staircase (if any), Brahmasthan centre and direction-wise zone mapping for the overall layout.",
        },
      },
      {
        "@type": "Question",
        name: "Is this useful if my house is already built?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The report helps you identify which rooms are in weaker zones and suggests practical, non-structural remedies where possible.",
        },
      },
      {
        "@type": "Question",
        name: "Does it work for all facing directions (east/north/west/south)?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You rotate your plan to set correct North, and the analysis is calculated from that. It works for east, north, west and south facing houses.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share the report with my architect?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The PDF is designed for sharing and discussion so you can revise a plan or decide remedies with clarity.",
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
              <span>Independent house Vastu • Zone mapping • Shareable PDF report</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Vastu for{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  independent house plans
                </span>{" "}
                using your floor plan.
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                Independent homes often have more flexibility. Use VastuCheck to map your plan into
                NE/SE/SW/NW zones and get a{" "}
                <strong className="font-semibold text-[#b45309]">room-wise verdict</strong>{" "}
                with practical remedies in a shareable PDF report.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Upload my house plan & start
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="/vastu-for-house-before-construction"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                Checking before construction?
              </a>
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

          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                Independent house checklist
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <ul className="space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• Entrance location and door direction</li>
                  <li>• Kitchen and fire zone alignment</li>
                  <li>• Bedroom zone placements</li>
                  <li>• Toilets placement and remedies</li>
                  <li>• Centre openness (Brahmasthan)</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-[#7c5b2e]">
                <p>Upload your plan to get a full zone mapping + PDF report.</p>
                <p className="font-medium text-[#166534]">Great for NRIs reviewing from abroad.</p>
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
              Independent house plan Vastu – FAQs
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              Use the report to understand strengths/weaknesses and apply practical remedies.
              For new builds, run it before construction for best results.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-[#fff7ea] p-4">
            <p className="text-[12px] text-[#5a4a36] sm:text-[13px]">
              Start now:{" "}
              <a href="/vastu" className="font-semibold text-[#b45309] underline">
                upload your independent house plan
              </a>{" "}
              and get your preview + full PDF report.
            </p>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Vastu for independent house plans • AI-assisted guidance</span>
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