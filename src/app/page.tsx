// src/app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Vastu Check for Flats & Villas | VastuCheck.in – Traditional Vastu, Tech-Enabled Report",
  description:
  "Upload your floor plan and get a Vastu report based on traditional Vastu rules. VastuCheck.in supports flats, villas and plots with a hybrid engine – tech to read your plan, Vastu rules to score it.",  
  keywords: [
    "vastu check online",
    "online vastu check",
    "vastu for home",
    "vastu for flat",
    "vastu plan checker",
    "vastu floor plan",
    "vastu consultant online",
    "vastu for apartments",
    "vastu for villas",
    "vastu for plots",
    "AI vastu report",
    "VastuCheck.in",
  ],
  openGraph: {
    title: "VastuCheck.in – Online Vastu Check for Your Home Floor Plan",
    description:
      "Upload your floor plan and get an AI-backed, room-by-room Vastu report with score, verdict and practical non-demolition remedies.",
    url: "https://vastucheck.in",
    siteName: "VastuCheck.in",
    type: "website",
  },
  alternates: {
    canonical: "https://vastucheck.in",
  },
};

export default function HomePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does VastuCheck work for flats and villas?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "You upload your 2D floor plan, mark key rooms on a simple grid and our hybrid engine maps each room to its direction. The recommendations are based on traditional Vastu rules, while technology only helps read and organise your plan.",
        },
      },
      {
        "@type": "Question",
        name: "Is VastuCheck based on AI or traditional Vastu shastra?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "VastuCheck uses AI only to read your drawing and generate a clear report. The actual Vastu verdicts, scores and suggestions follow classical Vastu principles – not AI opinions.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use VastuCheck for under-construction properties?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. Many users upload builder floor plans for new flats and villas. You can understand the directional placement of bedrooms, kitchen, toilets and entrance before you do interiors or civil changes.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a site visit for using VastuCheck?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No site visit is required. You just need a clear 2D floor plan image or PDF. VastuCheck is a digital guidance tool and does not replace in-person consultation where it is needed.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-amber-50 text-slate-800">
      {/* soft background aura */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(52,211,153,0.18),_transparent_60%)]" />

      {/* FAQ JSON-LD for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* NAVBAR */}
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            {/* Logo mark – simple mandala / sun */}
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-emerald-200 shadow-md shadow-amber-300/60">
              <span className="text-lg font-semibold text-amber-900">ॐ</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold tracking-[0.22em] text-amber-800 uppercase">
                VastuCheck.in
              </span>
              <span className="text-[12px] text-amber-700/80">
                Traditional Vastu rules • Tech-enabled report
              </span>
            </div>
          </div>

          {/* Right nav – trust & quick links */}
          <div className="hidden items-center gap-5 text-xs sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-50/80 px-3 py-1 shadow-sm shadow-emerald-200/70">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-emerald-900">
                Hybrid engine – tech to read, Vastu to decide
              </span>
            </div>
            <nav className="flex items-center gap-3 text-[11px] text-amber-800/80">
              <a
                href="/vastu-for-flats"
                className="hover:text-emerald-700 underline-offset-4 hover:underline"
              >
                Vastu for Flats
              </a>
              <a
                href="/vastu-for-villas"
                className="hover:text-emerald-700 underline-offset-4 hover:underline"
              >
                Vastu for Villas
              </a>
              <a
                href="/contact"
                className="hover:text-emerald-700 underline-offset-4 hover:underline"
              >
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
          {/* Left: main copy */}
          <div className="space-y-7">
            {/* small badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/80 px-4 py-1.5 text-xs sm:text-sm text-amber-800 shadow-sm shadow-amber-200">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Upload your floor plan – get a{" "}
                <span className="font-semibold">Vastu scoring report</span> in
                minutes
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl lg:text-5xl">
                Online{" "}
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-600 bg-clip-text text-transparent">
                  Vastu check for flats & villas
                </span>{" "}
                using traditional rules.
              </h1>
              <p className="max-w-xl text-[15px] leading-relaxed text-amber-900/90 sm:text-base">
                <span className="font-semibold text-amber-800">
                  VastuCheck.in
                </span>{" "}
                reads your 2D floor plan with technology, then applies{" "}
                <span className="font-semibold">
                  classical Vastu shastra rules
                </span>{" "}
                to each room. You receive a{" "}
                <span className="font-semibold text-emerald-700">
                  room-by-room Vastu guidance PDF
                </span>{" "}
                with practical, non-demolition suggestions that you can discuss
                with family, architect or your personal Vastu consultant.
              </p>
            </div>

            {/* Trust highlights */}
            <div className="grid gap-4 text-xs sm:text-sm text-amber-900 sm:grid-cols-3">
              <div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm shadow-amber-100">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-amber-600">
                  Vastu scoring engine
                </p>
                <p className="text-xl font-semibold text-amber-800">
                  0–100 home score
                </p>
                <p className="mt-1 text-[12px] text-amber-800/80">
                  Weighted importance for entrance, master bedroom, kitchen,
                  toilets and centre area.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 shadow-sm shadow-emerald-100">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-emerald-700">
                  Traditional Vastu rules
                </p>
                <p className="text-xl font-semibold text-emerald-800">
                  Rules first, tech later
                </p>
                <p className="mt-1 text-[12px] text-emerald-900/80">
                  The engine follows classical Vastu directions; AI is used only
                  to read the drawing and write clear explanations.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm shadow-amber-100">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-amber-600">
                  Practical remedies
                </p>
                <p className="text-xl font-semibold text-amber-800">
                  Non-demolition focus
                </p>
                <p className="mt-1 text-[12px] text-amber-800/80">
                  Usage changes, colours, placements and zoning. Structural
                  changes are suggested only if absolutely required.
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-amber-400/70 transition hover:brightness-110"
              >
                Upload floor plan & start VastuCheck
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] text-amber-700 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white/80 px-5 py-2.5 text-xs sm:text-sm font-medium text-amber-800 hover:border-emerald-400 hover:text-emerald-800 transition"
              >
                See how the hybrid engine works
              </a>
            </div>

            {/* Mini trust bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] sm:text-[12px] text-amber-800/80">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-500 bg-emerald-50 text-[9px] text-emerald-800">
                  AI
                </span>
                <span>
                  AI-assisted reading •{" "}
                  <span className="font-semibold">
                    Vastu decisions from fixed rules
                  </span>
                </span>
              </div>
              <span className="h-3 w-px bg-amber-300" />
              <span>No login required • Digital PDF delivery</span>
            </div>
          </div>

          {/* Right: visual card */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/60 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white/90 p-5 shadow-xl shadow-amber-200/80">
              {/* Badge row */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex h-7 items-center rounded-full bg-amber-50 px-3 text-[11px] font-medium text-amber-800 ring-1 ring-amber-300/80">
                    VastuCheck hybrid engine • v1.0
                  </span>
                  <span className="text-[11px] text-amber-700/90">
                    Designed for Indian apartments, villas & plots
                  </span>
                </div>
                <div className="text-right text-[11px] text-amber-700/90">
                  <p>Traditional grid & directions</p>
                  <p>Explained in simple language</p>
                </div>
              </div>

              {/* Illustration block */}
              <div className="space-y-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-amber-600">
                      Sample home Vastu score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-amber-900">
                      82 / 100
                    </p>
                    <p className="text-[11px] text-amber-800/90">
                      Mostly favourable with a few important corrections in the
                      South-East & North-West zones.
                    </p>
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-emerald-200 shadow-inner">
                    <div className="h-14 w-14 rounded-full border border-amber-500/50 bg-white/90" />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] sm:text-[11px]">
                  <span className="rounded-full bg-white px-2 py-1 text-emerald-800 border border-emerald-300">
                    ✅ NE kept light & open
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-amber-800 border border-amber-300">
                    ⚠ SE toilet – copper & colour remedies suggested
                  </span>
                  <span className="rounded-full bg-white px-2 py-1 text-amber-800 border border-amber-300">
                    ✨ SW master bedroom supports stability
                  </span>
                </div>
              </div>

              {/* “What’s in the report” */}
              <div className="mt-4 space-y-2 rounded-2xl border border-amber-100 bg-white/80 p-3 text-[11px] sm:text-[12px]">
                <p className="font-medium text-amber-900 mb-1.5">
                  What your VastuCheck PDF includes
                </p>
                <ul className="space-y-1.5 text-amber-800/90">
                  <li>• Overall home Vastu score & verdict</li>
                  <li>• Room-wise explanation with direction and zone</li>
                  <li>• Non-demolition remedies prioritised before civil work</li>
                  <li>• Top 3–5 priority corrections for your layout</li>
                  <li>• Notes your family or Vastu expert can review together</li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] sm:text-[12px] text-amber-800/80">
                <span>Secure online payment • Instant PDF download</span>
                <span className="font-semibold text-emerald-700">
                  First see free preview, then decide to buy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="mt-10 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-amber-900">
                How the VastuCheck hybrid engine works
              </h2>
              <p className="mt-1 text-[12px] sm:text-[13px] text-amber-800/90 max-w-xl">
                We use technology to read your plan, but{" "}
                <span className="font-semibold">
                  the core decisions follow traditional Vastu rules
                </span>
                . This gives you clarity + speed without replacing human
                wisdom.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-[12px] text-emerald-800">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-200">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Works for flats, villas & plotted homes</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-[12px] text-amber-900 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                Step 1
              </p>
              <p className="font-medium text-amber-900">Upload your floor plan</p>
              <p className="mt-1 text-amber-800/90">
                A clear 2D plan (builder brochure, architect drawing or hand
                sketch) is enough. JPG, PNG or PDF are supported.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                Step 2
              </p>
              <p className="font-medium text-amber-900">
                Mark rooms & directions
              </p>
              <p className="mt-1 text-amber-800/90">
                Our interface helps you tag master bedroom, kitchen, toilets,
                living room and more on a North–East grid. The hybrid engine
                uses tech to detect and verify positions.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-emerald-50/80 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Step 3
              </p>
              <p className="font-medium text-emerald-900">
                Get your Vastu report PDF
              </p>
              <p className="mt-1 text-emerald-900/80">
                Download a structured PDF with Vastu score, room-wise verdicts
                and practical corrections you can act on step by step.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md shadow-amber-400/70 hover:brightness-110 transition"
            >
              Start my online Vastu check
            </a>
            <p className="text-[10px] sm:text-[11px] text-amber-700/90">
              Disclaimer: VastuCheck is a digital guidance tool. Do not take
              major financial, legal or medical decisions based only on this
              report.
            </p>
          </div>
        </section>

        {/* SEO CONTENT – Vastu for flats & villas */}
        <section className="mt-10 grid gap-6 rounded-3xl border border-amber-100 bg-white/80 px-4 py-6 text-[13px] text-amber-900 shadow-sm shadow-amber-100 sm:grid-cols-2 sm:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-amber-900 mb-2">
              Online Vastu check for flats (apartments)
            </h2>
            <p className="mb-2">
              Many buyers feel that{" "}
              <strong>Vastu for flats and apartments</strong> is confusing
              because the entrance, lift and common areas are shared. VastuCheck
              focuses on what you can actually control – the{" "}
              <strong>main door of your flat, master bedroom, kitchen, toilets</strong>{" "}
              and the centre of your built-up area.
            </p>
            <p className="mb-2">
              By mapping each room to{" "}
              <strong>North, South, East, West, NE, SE, SW, NW</strong>, the
              scoring engine highlights strengths and weak zones. You can then
              prioritise interiors, colours and usage patterns to support your
              family’s health, finances and relationships.
            </p>
            <a
              href="/vastu-for-flats"
              className="mt-1 inline-flex text-[12px] font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
            >
              Learn more about Vastu for flats →
            </a>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-amber-900 mb-2">
              Vastu for independent houses & villas
            </h2>
            <p className="mb-2">
              For <strong>villas and independent houses</strong>, both the plot
              orientation and the internal room placement matter. VastuCheck
              helps you see how your bedrooms, staircase, water tank, kitchen
              and puja room sit inside the grid before or after construction.
            </p>
            <p className="mb-2">
              The report is useful while finalising a builder plan or planning
              interiors for an existing home. You can take the{" "}
              <strong>VastuCheck PDF</strong> to your architect or trusted Vastu
              expert and discuss changes with a clear visual map.
            </p>
            <a
              href="/vastu-for-villas"
              className="mt-1 inline-flex text-[12px] font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
            >
              Learn more about Vastu for villas →
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 rounded-3xl border border-amber-100 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6">
          <h2 className="font-display text-lg font-semibold text-amber-900 mb-3">
            Frequently asked questions about online Vastu check
          </h2>
          <div className="space-y-3 text-[13px] text-amber-900">
            <details className="rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                Is this a replacement for a human Vastu consultant?
              </summary>
              <p className="mt-2 text-amber-800/90">
                No. VastuCheck is a{" "}
                <strong>digital guidance and documentation tool</strong>. It
                helps you understand your layout, highlight key issues and store
                them in a PDF. You can still consult your trusted Vastu expert
                or family priest, now with a clear visual reference.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-white px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                What role does AI play in VastuCheck?
              </summary>
              <p className="mt-2 text-amber-800/90">
                AI is used to{" "}
                <strong>read your uploaded plan and draft explanations</strong>.
                The actual scoring, verdicts and zone definitions follow{" "}
                <strong>fixed, human-defined Vastu rules</strong>. Think of AI
                as a fast assistant that organises information – not as a guru.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                Do you store my floor plan permanently?
              </summary>
              <p className="mt-2 text-amber-800/90">
                Floor plans are processed for generating your report. Long-term
                storage and deletion policies are covered in our{" "}
                <a
                  href="/privacy-policy"
                  className="font-semibold text-emerald-700 underline underline-offset-4"
                >
                  Privacy Policy
                </a>
                . We aim to keep only what is needed for support and legal
                compliance.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-white px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                Can I check Vastu before buying a new flat or plot?
              </summary>
              <p className="mt-2 text-amber-800/90">
                Yes. Many users upload{" "}
                <strong>builder brochures or sample plans</strong> before
                booking. This gives a clear view of entrances, kitchen position,
                toilets and bedrooms so you can choose wisely.
              </p>
            </details>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200 pt-4 text-[11px] sm:text-[12px] text-amber-800/90">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-300 sm:inline" />
            <span>Built in India • Respecting traditional Vastu shastra</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/shipping-policy"
              className="hover:text-emerald-700 underline-offset-4 hover:underline"
            >
              Shipping Policy
            </a>
            <a
              href="/cancellations-and-refunds"
              className="hover:text-emerald-700 underline-offset-4 hover:underline"
            >
              Cancellations &amp; Refunds
            </a>
            <a
              href="/privacy-policy"
              className="hover:text-emerald-700 underline-offset-4 hover:underline"
            >
              Privacy
            </a>
            <a
              href="/terms-and-conditions"
              className="hover:text-emerald-700 underline-offset-4 hover:underline"
            >
              Terms
            </a>
            <a
              href="/contact"
              className="hover:text-emerald-700 underline-offset-4 hover:underline"
            >
              Contact Us
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}