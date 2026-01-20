// src/app/check-vastu-online/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check Vastu Online Using Your 2D Floor Plan | VastuCheck.in",
  description:
    "Check Vastu online using your 2D floor plan (PDF/JPG/PNG). Get a room-wise Vastu score, direction mapping and practical non-demolition remedies. Works for flats & villas.",
  keywords: [
    "check vastu online",
    "online vastu check",
    "check vastu for my home",
    "check vastu for my house",
    "check vastu for my 2d plan",
    "vastu check by floor plan",
    "vastu check online free",
    "vastu plan checker",
    "vastu floor plan check",
    "ai vastu report",
    "vastu report pdf",
    "vastucheck.in",
  ],
  alternates: { canonical: "https://vastucheck.in/check-vastu-online" },
  openGraph: {
    title: "Check Vastu Online Using Your 2D Floor Plan | VastuCheck.in",
    description:
      "Upload your 2D floor plan and get a room-wise Vastu score, direction mapping and practical remedies in a PDF report.",
    url: "https://vastucheck.in/check-vastu-online",
    siteName: "VastuCheck.in",
    type: "website",
  },
  icons: {
    icon: "/om.png",
    apple: "/om.png",
  },
};

export default function CheckVastuOnlinePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How can I check Vastu online using my 2D floor plan?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Upload your 2D floor plan (PDF/JPG/PNG), align North, and mark key rooms on the grid. VastuCheck maps rooms to directions and generates a room-wise Vastu score, verdicts and remedies in a PDF report.",
        },
      },
      {
        "@type": "Question",
        name: "Does online Vastu check work for flats and apartments?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. VastuCheck is designed for flats and apartments where structural changes are difficult. It focuses on what you can control: main door, kitchen, bedrooms, toilets and the centre area, and suggests practical non-demolition remedies.",
        },
      },
      {
        "@type": "Question",
        name: "Can I check Vastu online before buying a flat or villa?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. You can upload a builder brochure plan or an architect drawing before you book. The report helps you understand directional strengths, weak zones and priority corrections so you can choose wisely.",
        },
      },
      {
        "@type": "Question",
        name: "Is this a free Vastu check online?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "VastuCheck provides a free preview so you can see how the scoring and room mapping works. Full room-by-room PDF reporting may require purchase depending on your chosen plan.",
        },
      },
      {
        "@type": "Question",
        name: "Is VastuCheck based on AI or traditional Vastu rules?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "VastuCheck uses technology to read and organise your plan, but the scoring and verdicts follow fixed, traditional Vastu rules defined by humans. AI helps explain clearly — it does not invent rules.",
        },
      },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Online Vastu Check by Floor Plan",
    provider: {
      "@type": "Organization",
      name: "VastuCheck.in",
      url: "https://vastucheck.in",
    },
    areaServed: "IN",
    serviceType: "Digital Vastu Report",
    description:
      "Upload your floor plan and get a room-wise Vastu score, direction mapping and non-demolition remedies in a downloadable PDF.",
    offers: {
      "@type": "Offer",
      url: "https://vastucheck.in/vastu",
      price: "49",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
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

      {/* Service JSON-LD for SEO */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* NAVBAR */}
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
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

          <nav className="hidden items-center gap-3 text-[11px] text-amber-800/80 sm:flex">
            <a
              href="/"
              className="hover:text-emerald-700 underline-offset-4 hover:underline"
            >
              Home
            </a>
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
        </header>

        {/* HERO */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
          {/* Left */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/80 bg-white/80 px-4 py-1.5 text-xs sm:text-sm text-amber-800 shadow-sm shadow-amber-200">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Check Vastu online using your{" "}
                <span className="font-semibold">2D floor plan</span> (PDF/JPG/PNG)
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-display text-balance text-3xl font-semibold tracking-tight text-amber-950 sm:text-4xl lg:text-5xl">
                Check{" "}
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-emerald-600 bg-clip-text text-transparent">
                  Vastu online
                </span>{" "}
                for your home plan in minutes.
              </h1>
              <p className="max-w-xl text-[15px] leading-relaxed text-amber-900/90 sm:text-base">
                Upload your plan, align North, and mark key rooms on the grid.
                VastuCheck maps each room to its direction and generates a{" "}
                <span className="font-semibold text-emerald-700">
                  room-wise Vastu score + remedies PDF
                </span>
                . Works for flats, villas, duplex houses and independent homes.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid gap-4 text-xs sm:text-sm text-amber-900 sm:grid-cols-3">
              <div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm shadow-amber-100">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-amber-600">
                  Inputs supported
                </p>
                <p className="text-xl font-semibold text-amber-800">
                  PDF • JPG • PNG
                </p>
                <p className="mt-1 text-[12px] text-amber-800/80">
                  Builder plan, architect drawing or clean hand sketch.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 shadow-sm shadow-emerald-100">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-emerald-700">
                  What you get
                </p>
                <p className="text-xl font-semibold text-emerald-800">
                  Score + Verdicts
                </p>
                <p className="mt-1 text-[12px] text-emerald-900/80">
                  Direction mapping + priority fixes for your layout.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white/90 px-4 py-3 shadow-sm shadow-amber-100">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-amber-600">
                  Practical focus
                </p>
                <p className="text-xl font-semibold text-amber-800">
                  Non-demolition
                </p>
                <p className="mt-1 text-[12px] text-amber-800/80">
                  Usage, placement, colours and zoning before civil changes.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 px-7 py-3 text-sm sm:text-base font-semibold text-white shadow-md shadow-amber-400/70 transition hover:brightness-110"
              >
                Upload my plan & check Vastu online
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] text-amber-700 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-white/80 px-5 py-2.5 text-xs sm:text-sm font-medium text-amber-800 hover:border-emerald-400 hover:text-emerald-800 transition"
              >
                How it works
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] sm:text-[12px] text-amber-800/80">
              <span>Works for flats • villas • duplex • independent houses</span>
              <span className="h-3 w-px bg-amber-300" />
              <span>No login required • Digital PDF delivery</span>
            </div>
          </div>

          {/* Right: sample card */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/70 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/60 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-white/90 p-5 shadow-xl shadow-amber-200/80">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-amber-600">
                    Sample result
                  </p>
                  <p className="mt-1 text-xl font-semibold text-amber-900">
                    82 / 100
                  </p>
                  <p className="text-[11px] text-amber-800/90">
                    Mostly favourable with a few priority corrections.
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-orange-200 to-emerald-200 shadow-inner">
                  <div className="h-11 w-11 rounded-full border border-amber-500/50 bg-white/90" />
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-amber-100 bg-amber-50/70 p-3 text-[11px] text-amber-900">
                <p className="font-medium">In your PDF report:</p>
                <ul className="space-y-1.5 text-amber-800/90">
                  <li>• Overall Vastu score & verdict</li>
                  <li>• Room-wise direction mapping</li>
                  <li>• Problem zones and why they matter</li>
                  <li>• Practical non-demolition remedies</li>
                  <li>• Top 3–5 priority actions</li>
                </ul>
              </div>

              <div className="mt-3 text-[11px] text-amber-800/80">
                Tip: Align North correctly for best accuracy.
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="mt-10 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <h2 className="font-display text-base font-semibold text-amber-900">
            How to check Vastu online with VastuCheck
          </h2>

          <div className="mt-4 grid gap-3 text-[12px] text-amber-900 sm:grid-cols-3">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                Step 1
              </p>
              <p className="font-medium text-amber-900">Upload your 2D plan</p>
              <p className="mt-1 text-amber-800/90">
                Use a clear builder brochure, architect drawing or neat sketch.
                PDF/JPG/PNG supported.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-white p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-600">
                Step 2
              </p>
              <p className="font-medium text-amber-900">
                Align North & mark rooms
              </p>
              <p className="mt-1 text-amber-800/90">
                Tag kitchen, bedrooms, toilets, pooja, staircase, tanks, etc.
                The engine maps each to directions.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-emerald-50/80 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Step 3
              </p>
              <p className="font-medium text-emerald-900">
                Download your Vastu PDF
              </p>
              <p className="mt-1 text-emerald-900/80">
                Get score, verdicts and a priority list of remedies for your
                family and architect.
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
              Disclaimer: VastuCheck is a digital guidance tool for general
              guidance. For major decisions, consult qualified professionals.
            </p>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-10 grid gap-6 rounded-3xl border border-amber-100 bg-white/80 px-4 py-6 text-[13px] text-amber-900 shadow-sm shadow-amber-100 sm:grid-cols-2 sm:px-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-amber-900 mb-2">
              Check Vastu for my home plan (2D)
            </h2>
            <p className="mb-2">
              If you searched for{" "}
              <strong>“check Vastu for my home”</strong> or{" "}
              <strong>“check Vastu for my 2D plan”</strong>, you are likely
              looking for a clear, direction-wise answer. VastuCheck converts
              your plan into a simple grid view and explains each zone in
              practical language.
            </p>
            <p className="mb-2">
              You get guidance on key rooms like{" "}
              <strong>main entrance, kitchen, bedrooms, toilets and pooja</strong>{" "}
              along with a priority list of remedies.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/vastu-for-flats"
                className="inline-flex rounded-full border border-amber-200 bg-white px-3 py-1 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 hover:border-emerald-300 transition"
              >
                Vastu for Flats →
              </a>
              <a
                href="/vastu-for-villas"
                className="inline-flex rounded-full border border-amber-200 bg-white px-3 py-1 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 hover:border-emerald-300 transition"
              >
                Vastu for Villas →
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-amber-900 mb-2">
              Online Vastu check using floor plan
            </h2>
            <p className="mb-2">
              An <strong>online Vastu check</strong> is most useful when you
              want speed + documentation. Instead of generic advice, a plan-based
              check gives room-wise clarity.
            </p>
            <p className="mb-2">
              The VastuCheck report is designed to be shareable with family and
              your architect, with a clear score, verdicts and practical
              non-demolition remedies.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-10 rounded-3xl border border-amber-100 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6">
          <h2 className="font-display text-lg font-semibold text-amber-900 mb-3">
            FAQs about checking Vastu online
          </h2>
          <div className="space-y-3 text-[13px] text-amber-900">
            <details className="rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                Do I need a compass direction to check Vastu online?
              </summary>
              <p className="mt-2 text-amber-800/90">
                You mainly need to ensure your plan is aligned correctly to
                North. If you’re unsure, use your building’s brochure direction
                or a phone compass while standing near your main door.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-white px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                Can I check Vastu online for an under-construction house?
              </summary>
              <p className="mt-2 text-amber-800/90">
                Yes — this is one of the best times to check Vastu, because you
                can adjust the plan before construction. The report can be
                shared with your architect for refinement.
              </p>
            </details>

            <details className="rounded-2xl border border-amber-100 bg-amber-50/60 px-3 py-2.5">
              <summary className="cursor-pointer text-sm font-semibold text-amber-900">
                Is an online Vastu check accurate?
              </summary>
              <p className="mt-2 text-amber-800/90">
                It’s direction-based. Accuracy depends on correct North
                alignment and correct room tagging. VastuCheck is designed for
                clarity and practical guidance, not superstition.
              </p>
            </details>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200 pt-4 text-[11px] sm:text-[12px] text-amber-800/90">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-300 sm:inline" />
            <span>Online Vastu check • Floor plan based report</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}