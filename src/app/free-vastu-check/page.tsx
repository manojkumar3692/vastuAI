// src/app/free-vastu-check/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Vastu Check Online (Plan-Based) | VastuCheck.in",
  description:
    "Free Vastu check online: understand directions, key do’s & don’ts, and see what a full room-wise report includes. Works for flats, villas & independent houses.",
  keywords: [
    "free vastu check",
    "free vastu check online",
    "free vastu report",
    "free vastu calculator online",
    "check vastu online free",
    "free vastu shastra evaluation",
    "vastu check for home free",
    "vastu check by floor plan",
  ],
  openGraph: {
    title: "Free Vastu Check Online | VastuCheck.in",
    description:
      "Start with a free Vastu check and see what a full room-wise report includes.",
    url: "https://vastucheck.in/free-vastu-check",
    siteName: "VastuCheck.in",
    type: "website",
  },
  alternates: { canonical: "https://vastucheck.in/free-vastu-check" },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function FreeVastuCheckPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is VastuCheck really free?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You can start with a free Vastu check experience to understand direction basics and what to look for. A full downloadable room-wise PDF report is a paid feature.",
        },
      },
      {
        "@type": "Question",
        name: "What do I get in a free Vastu check?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You get a quick understanding of major zones (NE/SE/SW/NW), common do’s and don’ts for entrances, kitchen and toilets, and a preview of what the detailed report covers.",
        },
      },
      {
        "@type": "Question",
        name: "Does this work for flats and villas?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The same direction-based logic applies. Flats focus on practical, non-demolition remedies while villas/independent houses include more elements like stairs and water bodies.",
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
                Free Vastu check • See what the full report includes
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a
              href="/"
              className="text-[11px] text-[#6b5340] transition hover:text-[#b65c10]"
            >
              Home
            </a>
            <a
              href="/check-vastu-online"
              className="text-[11px] text-[#6b5340] transition hover:text-[#b65c10]"
            >
              Check Vastu Online
            </a>
            <a
              href="/vastu"
              className="text-[11px] text-[#6b5340] transition hover:text-[#b65c10]"
            >
              Start VastuCheck
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm shadow-amber-100 sm:text-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Free Vastu check online • Understand zones + preview the full
                PDF report
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#2b1b10] sm:text-4xl lg:text-5xl">
                Free{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  Vastu check
                </span>{" "}
                online (start here).
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                People search for “free vastu check” or “free vastu calculator”
                when they want quick clarity. This page helps you understand the
                basics and then move to a full plan-based report when you are
                ready.
              </p>
            </div>

            {/* Cards */}
            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Free preview
                </p>
                <p className="text-lg font-semibold text-[#166534]">
                  Zone basics
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Learn NE/SE/SW/NW priorities and simple do’s & don’ts.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  Best for
                </p>
                <p className="text-lg font-semibold text-[#15803d]">
                  Flats + rentals
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Quick remedies that don’t require demolition.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Upgrade when ready
                </p>
                <p className="text-lg font-semibold text-[#b45309]">
                  Full PDF report
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Score + room-wise verdicts + priority fixes + shareable PDF.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Start free preview (then download report)
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                Read FAQs
              </a>
            </div>

            <div className="text-[11px] text-[#7a5d3a] sm:text-[12px]">
              Also see:{" "}
              <a
                href="/check-vastu-online"
                className="font-semibold text-[#15803d] underline underline-offset-4"
              >
                Check Vastu Online (2D plan)
              </a>
            </div>
          </div>

          {/* Right column */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                Free vs Full report (simple)
              </p>

              <div className="mt-3 space-y-3 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-3">
                  <p className="font-semibold text-[#2b1b10]">Free preview</p>
                  <ul className="mt-2 space-y-1 text-[11px] text-[#5a4a36]">
                    <li>• Zone basics + common do’s & don’ts</li>
                    <li>• What to check in entrance/kitchen/toilets</li>
                    <li>• See what the full report includes</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3">
                  <p className="font-semibold text-[#166534]">Full PDF report</p>
                  <ul className="mt-2 space-y-1 text-[11px] text-[#166534]">
                    <li>• 0–100 score + verdict</li>
                    <li>• Room-wise direction + impact</li>
                    <li>• Priority fixes (top 3–5)</li>
                    <li>• Practical remedies + renovation guidance</li>
                    <li>• Share with architect/family</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-[#7c5b2e]">
                If you want the most accurate result, use your actual floor plan
                (not guesswork).
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mt-10 rounded-3xl border border-amber-100 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <h2 className="text-base font-semibold text-[#2b1b10] sm:text-lg">
            Free Vastu check – FAQs
          </h2>

          <div className="mt-4 space-y-3 text-[12px] text-[#5a4a36] sm:text-[13px]">
            <details className="rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
              <summary className="cursor-pointer font-semibold text-[#2b1b10]">
                Will free tools replace a Vastu consultant?
              </summary>
              <p className="mt-2">
                Free tools help with basics. A structured plan-based report is
                much better for real decisions. If you need deeper site factors,
                you can still consult an expert.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-white px-3 py-2.5">
              <summary className="cursor-pointer font-semibold text-[#2b1b10]">
                What if I only know the facing direction (east/west)?
              </summary>
              <p className="mt-2">
                Facing helps, but a floor plan gives accurate room mapping. If
                you have a brochure/PDF, you will get more reliable results.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
              <summary className="cursor-pointer font-semibold text-[#2b1b10]">
                Does it work for villas and independent houses?
              </summary>
              <p className="mt-2">
                Yes. We support villas too. See{" "}
                <a
                  href="/vastu-for-villas"
                  className="font-semibold text-[#15803d] underline underline-offset-4"
                >
                  Vastu for Villas
                </a>
                .
              </p>
            </details>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Free Vastu check • Start here</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/privacy-policy" className="transition hover:text-[#b65c10]">
              Privacy
            </a>
            <a
              href="/terms-and-conditions"
              className="transition hover:text-[#b65c10]"
            >
              Terms
            </a>
            <a href="/contact" className="transition hover:text-[#b65c10]">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}