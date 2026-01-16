// src/app/vastu-for-villas/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for Villas & Independent Houses | Online Vastu Check",
  description:
    "Get Vastu guidance for villas, duplex houses and independent homes. Upload your floor plan and receive an AI-powered Vastu report with room-wise verdicts, zone mapping and remedies.",
  keywords: [
    "vastu for villa",
    "vastu for independent house",
    "vastu for duplex house",
    "vastu for bungalow",
    "vastu for corner villa",
    "vastu for house plan",
    "online vastu for villa",
    "vastu for east facing house",
    "vastu for north facing house",
    "vastu for west facing house",
  ],
  openGraph: {
    title: "Vastu for Villas & Independent Houses | VastuCheck.in",
    description:
      "Upload your villa or independent house floor plan and get an AI-backed Vastu report with score, room-wise verdicts and Vastu remedies.",
    url: "https://vastucheck.in/vastu-for-villas",
    siteName: "VastuCheck.in",
    type: "website",
  },
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-villas",
  },
};

export default function VastuForVillasPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/25 via-slate-900/40 to-transparent blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* Nav */}
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-500 shadow-lg shadow-emerald-500/40">
              <span className="text-sm font-semibold tracking-tight text-slate-950">
                VC
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-[0.18em] text-emerald-300 uppercase">
                VastuCheck
              </span>
              <span className="text-[12px] text-slate-300/80">
                AI Vastu Report • Floor Plan Scanner
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-4 text-xs sm:flex">
            <nav className="flex items-center gap-3 text-[11px] text-slate-400">
              <a href="/" className="hover:text-emerald-200 transition">
                Home
              </a>
              <a href="/vastu" className="hover:text-emerald-200 transition">
                Start VastuCheck
              </a>
              <a
                href="/contact"
                className="hover:text-emerald-200 transition"
              >
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          {/* Left */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-900/70 px-4 py-1.5 text-xs sm:text-sm text-emerald-100 shadow shadow-emerald-500/20">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              <span>
                Vastu for villas, duplex & independent houses • Direction-wise
                zone analysis
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Vastu for{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  villas & independent houses
                </span>{" "}
                using your floor plan.
              </h1>
              <p className="max-w-xl text-[14px] sm:text-[15px] leading-relaxed text-slate-300">
                If you own a villa, duplex or independent house, your plot and
                built-up area give more flexibility.{" "}
                <span className="font-semibold text-emerald-200">
                  VastuCheck.in
                </span>{" "}
                helps you run a{" "}
                <strong className="font-semibold text-emerald-200">
                  complete Vastu check for your villa plan
                </strong>{" "}
                – covering entrance, bedrooms, kitchen, pooja, staircase,
                water bodies and more – with an AI-backed{" "}
                <strong className="font-semibold text-emerald-200">
                  Vastu report PDF
                </strong>
                .
              </p>
            </div>

            {/* Highlights */}
            <div className="grid gap-4 text-xs sm:text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 px-4 py-3">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
                  Property types
                </p>
                <p className="text-lg font-semibold text-emerald-300">
                  Villas & plots
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Works for gated community villas, corner plots & farmhouses.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-500/20 bg-slate-900/80 px-4 py-3">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-sky-300/80">
                  Facing directions
                </p>
                <p className="text-lg font-semibold text-sky-200">
                  East • North • West • South
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Check Vastu for east-facing, north-facing, west & south
                  facing houses.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 px-4 py-3">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
                  Deep analysis
                </p>
                <p className="text-lg font-semibold text-emerald-200">
                  Zones & elements
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Focus on Brahmasthan, water bodies, staircase, borewell,
                  septic tank, etc.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 px-7 py-3 text-sm sm:text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:brightness-110"
              >
                Upload my villa / house plan & start
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-[11px] text-emerald-200 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>

              <a
                href="#villa-faq"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-100 hover:border-emerald-400/60 hover:text-emerald-100 transition"
              >
                See villa Vastu FAQs
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] sm:text-[12px] text-slate-400">
              <span>Useful before construction or renovation</span>
              <span className="h-3 w-px bg-slate-700" />
              <span>Digital Vastu blueprint • Shareable PDF</span>
            </div>
          </div>

          {/* Right: analysis preview */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-sky-400/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-emerald-500/25 backdrop-blur">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Example – villa Vastu snapshot
              </p>
              <div className="mt-3 space-y-2 rounded-2xl bg-slate-950/80 p-3 border border-slate-800/80 text-[12px] text-slate-200">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-slate-400">
                      Overall house Vastu score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-emerald-300">
                      76 / 100
                    </p>
                    <p className="text-[11px] text-emerald-200/90">
                      Strong core zones, a few structural & usage changes
                      recommended.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-emerald-400/40">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-sky-300 opacity-80" />
                  </div>
                </div>

                <ul className="mt-2 space-y-1.5 text-[11px] text-slate-300">
                  <li>• Main entrance in North-East – favourable</li>
                  <li>• Pooja in exact North-East – strong spiritual zone</li>
                  <li>• Staircase in Brahmasthan – highlighted as concern</li>
                  <li>• Underground water tank in North – positive</li>
                  <li>• Septic tank in South-West – remedies suggested</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-slate-400">
                <p>Use the same engine on your full villa or house layout.</p>
                <p className="text-emerald-300">
                  Ideal before starting interiors or major renovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO / FAQ block */}
        <section
          id="villa-faq"
          className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-6 sm:px-6"
        >
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              Vastu for villas, duplex & independent houses – what VastuCheck
              covers
            </h2>
            <p className="mt-2 text-[12px] sm:text-[13px] leading-relaxed text-slate-300">
              When you are dealing with a villa or independent house, Vastu is
              not only about rooms – it is also about{" "}
              <strong className="font-semibold text-emerald-200">
                plot orientation, Brahmasthan, water bodies, staircase, car
                parking, septic tank and overhead tank
              </strong>
              . VastuCheck reads your plan, maps every room and key element to
              its direction and generates a structured{" "}
              <strong className="font-semibold text-emerald-200">
                Vastu report PDF
              </strong>{" "}
              for your architect and family.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Key items checked for villas & houses
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] sm:text-[13px] text-slate-300">
                <li>• Plot facing and main entrance location</li>
                <li>• Master bedroom, children’s bedroom, guest bedroom</li>
                <li>• Kitchen, dining, living and family lounge</li>
                <li>• Pooja room location and orientation</li>
                <li>• Staircase position & direction of climb</li>
                <li>• Underground & overhead water tanks</li>
                <li>• Borewell, sump, septic tank & car parking</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                When to use VastuCheck for villas & houses
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] sm:text-[13px] text-slate-300">
                <li>• Before finalising an architect’s floor plan</li>
                <li>• Before buying a resale independent house</li>
                <li>• While planning a major renovation</li>
                <li>• When converting a plot design into G+1 or G+2 villa</li>
                <li>• For NRI owners evaluating from abroad</li>
              </ul>
            </div>
          </div>

          {/* Q&A */}
          <div className="border-t border-slate-800 pt-4 space-y-3 text-[12px] sm:text-[13px] text-slate-300">
            <div>
              <h3 className="font-semibold text-slate-100">
                Does VastuCheck support east-facing / north-facing / west-
                facing houses?
              </h3>
              <p className="mt-1">
                Yes. The engine is direction-based. It works with{" "}
                <strong>east-facing, north-facing, west-facing and south-facing
                houses</strong>. You rotate your plan so that North is correct,
                and the zones are calculated from there.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">
                Can I change plans based on the report before construction?
              </h3>
              <p className="mt-1">
                That is one of the best uses of VastuCheck. You can run the
                layout through the engine, see which rooms or elements are
                problematic and then work with your architect to{" "}
                <strong>refine the design before pouring concrete</strong>.
                This avoids costly corrections later.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">
                Is the report enough without meeting a Vastu consultant?
              </h3>
              <p className="mt-1">
                For many straightforward homes, the report is strong guidance.
                But Vastu is a traditional system – if you feel the need, you
                can still consult a trusted expert and use{" "}
                <strong>this structured PDF as a base document</strong> for
                deeper discussion.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/80 pt-4 text-[11px] sm:text-[12px] text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-slate-800 sm:inline" />
            <span>Vastu for villas & houses • Powered by AI</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/privacy-policy"
              className="hover:text-emerald-200 transition"
            >
              Privacy
            </a>
            <a
              href="/terms-and-conditions"
              className="hover:text-emerald-200 transition"
            >
              Terms
            </a>
            <a href="/contact" className="hover:text-emerald-200 transition">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}