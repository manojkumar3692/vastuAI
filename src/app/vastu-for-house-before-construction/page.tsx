// src/app/vastu-for-house-before-construction/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu Check Before Construction | Verify House Plan & Get PDF Report",
  description:
    "Run a Vastu check before construction. Upload your house plan, set North + centre, tag rooms, and get a Vastu score with room-wise verdicts and remedies in a shareable PDF report.",
  keywords: [
    "vastu before construction",
    "house plan vastu check before construction",
    "vastu for house plan before building",
    "online vastu check before construction",
    "vastu report pdf before construction",
    "architect vastu guidance",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-house-before-construction",
  },
  openGraph: {
    title: "Vastu Check Before Construction | VastuCheck.in",
    description:
      "Upload your plan and get Vastu guidance before construction—room-wise verdicts, zone mapping and remedies in a PDF report.",
    url: "https://vastucheck.in/vastu-for-house-before-construction",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "VastuCheck - Vastu Check Before Construction",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu Check Before Construction | Online Vastu Check",
    description:
      "Check your house plan’s Vastu before building. Get room-wise verdicts and a downloadable PDF report.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuBeforeConstructionPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why is Vastu checking before construction important?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Before construction, room placement and key elements are still flexible. A Vastu report helps you correct placements early, saving cost and avoiding major rework after building begins.",
        },
      },
      {
        "@type": "Question",
        name: "What should I check first in a house plan before building?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Most people start with plot orientation, main entrance location, kitchen zone, master bedroom zone, toilets placement and keeping the centre (Brahmasthan) light and open.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share this report with my architect or civil engineer?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The PDF is designed to be a structured blueprint you can share with your architect and use during plan revisions.",
        },
      },
      {
        "@type": "Question",
        name: "Does this replace a full Vastu consultant visit?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "For many plans, the report is enough to make practical decisions. If you want deeper consultation, you can use the PDF as a base document when speaking to a Vastu expert.",
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
              <span>Best time: before construction • Fix early, save cost • PDF blueprint</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Vastu check{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  before construction
                </span>{" "}
                for your house plan.
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                The highest ROI moment to do Vastu is before you build—when room placement is still flexible.
                Upload your plan, set North + centre, tag rooms, and get a{" "}
                <strong className="font-semibold text-[#b45309]">score + room-wise verdicts</strong>{" "}
                with practical corrections to discuss with your architect.
              </p>
            </div>

            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Helps you avoid
                </p>
                <p className="text-lg font-semibold text-[#166534]">Costly changes</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Fix placements before walls are built.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  Covers
                </p>
                <p className="text-lg font-semibold text-[#15803d]">Key zones</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Entrance, kitchen, bedrooms, toilets, centre.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Output
                </p>
                <p className="text-lg font-semibold text-[#b45309]">PDF blueprint</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Share with architect for plan revision.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Upload my plan & start check
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                See FAQs
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[#7a5d3a] sm:text-[12px]">
              <span>Recommended for new house plans</span>
              <span className="h-3 w-px bg-amber-200" />
              <span>Direction-wise corrections • Practical remedies</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                What you usually fix early
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <ul className="space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• Move kitchen closer to SE (if possible)</li>
                  <li>• Keep master bedroom towards SW</li>
                  <li>• Avoid toilets in NE zone</li>
                  <li>• Keep centre open (avoid staircase/store)</li>
                  <li>• Optimise entrance zone and door direction</li>
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
                <a
                  href="/vastu-for-new-house-plan"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  New house plans
                </a>
                <a
                  href="/vastu-for-independent-house-plan"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  Independent house
                </a>
                <a
                  href="/vastu-for-duplex-house"
                  className="rounded-full border border-amber-200 bg-white/80 px-3 py-1 text-[#6b5340] hover:text-[#b65c10]"
                >
                  Duplex
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
              Vastu check before construction – quick guide
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              Use the report to make early decisions. Even 1–2 corrections before construction
              can save time and money compared to later structural changes.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-[#fff7ea] p-4">
            <p className="text-[12px] text-[#5a4a36] sm:text-[13px]">
              Start now:{" "}
              <a href="/vastu" className="font-semibold text-[#b45309] underline">
                upload your plan
              </a>{" "}
              and get your preview + full PDF report.
            </p>
          </div>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Vastu check before construction • AI-assisted guidance</span>
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