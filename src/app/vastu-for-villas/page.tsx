// src/app/vastu-for-villas/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for Villas & Independent Houses | Online Vastu Check",
  description:
    "Get Vastu guidance for villas, duplex houses and independent homes. Upload your floor plan and receive an AI-assisted Vastu report with room-wise verdicts, zone mapping and remedies.",
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
      "Upload your villa or independent house floor plan and get an AI-assisted Vastu report with score, room-wise verdicts and Vastu remedies.",
    url: "https://vastucheck.in/vastu-for-villas",
    siteName: "VastuCheck.in",
    type: "website",
  },
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-villas",
  },
  icons: {
    icon: "/om.png",
    apple: "/om.png",
  }
};

export default function VastuForVillasPage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* NAVBAR */}
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
              className="text-[11px] text-[#6b5340] transition hover:text-[#b65c10]"
            >
              Home
            </a>
            <a
              href="/vastu"
              className="text-[11px] text-[#6b5340] transition hover:text-[#b65c10]"
            >
              Start VastuCheck
            </a>
            <a
              href="/contact"
              className="text-[11px] text-[#6b5340] transition hover:text-[#b65c10]"
            >
              Contact
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          {/* LEFT */}
          <div className="space-y-7">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm shadow-amber-100 sm:text-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Vastu for villas, duplex & independent houses • Direction-wise
                zone analysis
              </span>
            </div>

            {/* Heading + intro */}
            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#2b1b10] sm:text-4xl lg:text-5xl">
                Vastu for{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  villas & independent houses
                </span>{" "}
                using your floor plan.
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                If you own a villa, duplex or independent house, your plot and
                built-up area give more flexibility.{" "}
                <span className="font-semibold text-[#b45309]">
                  VastuCheck.in
                </span>{" "}
                helps you run a{" "}
                <strong className="font-semibold text-[#b45309]">
                  complete Vastu check for your villa plan
                </strong>{" "}
                – covering entrance, bedrooms, kitchen, pooja, staircase, water
                bodies and more – with an AI-assisted{" "}
                <strong className="font-semibold text-[#b45309]">
                  Vastu report PDF
                </strong>
                .
              </p>
            </div>

            {/* Highlights */}
            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Property types
                </p>
                <p className="text-lg font-semibold text-[#166534]">
                  Villas & plots
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Works for gated community villas, corner plots & farmhouses.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  Facing directions
                </p>
                <p className="text-lg font-semibold text-[#15803d]">
                  East • North • West • South
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Check Vastu for east / north / west / south facing houses.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Deep analysis
                </p>
                <p className="text-lg font-semibold text-[#b45309]">
                  Zones & elements
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Focus on Brahmasthan, water bodies, staircase, borewell,
                  septic tank & more.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Upload my villa / house plan & start
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <a
                href="#villa-faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                See villa Vastu FAQs
              </a>
            </div>

            {/* Mini trust line */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[#7a5d3a] sm:text-[12px]">
              <span>Useful before construction or renovation</span>
              <span className="h-3 w-px bg-amber-200" />
              <span>Digital Vastu blueprint • Shareable PDF</span>
            </div>
          </div>

          {/* RIGHT: analysis preview card */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                Example – villa Vastu snapshot
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#7c5b2e]">
                      Overall house Vastu score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[#15803d]">
                      76 / 100
                    </p>
                    <p className="text-[11px] text-[#166534]">
                      Strong core zones, a few structural & usage changes
                      recommended.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300 bg-[#f0fdf4]">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#22c55e] via-[#fbbf24] to-[#f97316] opacity-90" />
                  </div>
                </div>

                <ul className="mt-2 space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• Main entrance in North-East – favourable</li>
                  <li>• Pooja in exact North-East – strong spiritual zone</li>
                  <li>• Staircase in Brahmasthan – highlighted as concern</li>
                  <li>• Underground water tank in North – positive</li>
                  <li>• Septic tank in South-West – remedies suggested</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-[#7c5b2e]">
                <p>Use the same engine on your full villa or house layout.</p>
                <p className="font-medium text-[#166534]">
                  Ideal before starting interiors or major renovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO / FAQ block */}
        <section
          id="villa-faq"
          className="mt-10 space-y-6 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <div>
            <h2 className="text-base font-semibold text-[#2b1b10] sm:text-lg">
              Vastu for villas, duplex & independent houses – what VastuCheck
              covers
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              When you are dealing with a villa or independent house, Vastu is
              not only about rooms – it is also about{" "}
              <strong className="font-semibold text-[#b45309]">
                plot orientation, Brahmasthan, water bodies, staircase, car
                parking, septic tank and overhead tank
              </strong>
              . VastuCheck reads your plan, maps every room and key element to
              its direction and generates a structured{" "}
              <strong className="font-semibold text-[#b45309]">
                Vastu report PDF
              </strong>{" "}
              for your architect and family.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[#2b1b10]">
                Key items checked for villas & houses
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
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
              <h3 className="text-sm font-semibold text-[#2b1b10]">
                When to use VastuCheck for villas & houses
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• Before finalising an architect’s floor plan</li>
                <li>• Before buying a resale independent house</li>
                <li>• While planning a major renovation</li>
                <li>• When converting a plot design into G+1 or G+2 villa</li>
                <li>• For NRI owners evaluating from abroad</li>
              </ul>
            </div>
          </div>

          {/* Q&A */}
          <div className="space-y-3 border-t border-amber-100 pt-4 text-[12px] text-[#5a4a36] sm:text-[13px]">
            <div>
              <h3 className="font-semibold text-[#2b1b10]">
                Does VastuCheck support east-facing / north-facing / west-facing
                houses?
              </h3>
              <p className="mt-1">
                Yes. The engine is direction-based. It works with{" "}
                <strong>
                  east-facing, north-facing, west-facing and south-facing
                  houses
                </strong>
                . You rotate your plan so that North is correct, and the zones
                are calculated from there.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#2b1b10]">
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
              <h3 className="font-semibold text-[#2b1b10]">
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

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Vastu for villas & houses • AI-assisted guidance</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/privacy-policy"
              className="transition hover:text-[#b65c10]"
            >
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