// src/app/vastu-for-flats/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Vastu for Flats & Apartments | Online Vastu Check for 1BHK, 2BHK, 3BHK",
  description:
    "Check Vastu for your flat or apartment online. Upload your floor plan and get an AI-assisted Vastu report for 1BHK, 2BHK, 3BHK flats – with room-wise verdicts and practical, non-demolition remedies.",
  keywords: [
    "vastu for flats",
    "vastu for apartment",
    "vastu for 2BHK flat",
    "vastu for 3BHK flat",
    "online vastu check for flats",
    "vastu for rented flat",
    "vastu for 1BHK flat",
    "vastu for Indian apartments",
    "vastu for high rise flats",
    "vastu for flat main door",
  ],
  openGraph: {
    title: "Vastu for Flats & Apartments | Online Vastu Check",
    description:
      "Upload your flat or apartment floor plan and get an AI-assisted, room-by-room Vastu report with score, verdict and practical remedies.",
    url: "https://vastucheck.in/vastu-for-flats",
    siteName: "VastuCheck.in",
    type: "website",
  },
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-flats",
  },
  icons: {
    icon: "/om.png",
    apple: "/om.png",
  }
};

export default function VastuForFlatsPage() {
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

        {/* HERO SECTION */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          {/* LEFT: Copy */}
          <div className="space-y-7">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm shadow-amber-100 sm:text-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>
                Vastu for 1BHK, 2BHK, 3BHK flats • Online Vastu check using your
                real floor plan
              </span>
            </div>

            {/* Heading + intro */}
            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-[#2b1b10] sm:text-4xl lg:text-5xl">
                Vastu for{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  flats & apartments
                </span>{" "}
                – check your plan online.
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                Most Indian apartments are already constructed – demolition
                isn&apos;t practical.{" "}
                <span className="font-semibold text-[#b45309]">
                  VastuCheck.in
                </span>{" "}
                helps you run a full{" "}
                <strong className="font-semibold text-[#b45309]">
                  Vastu check for your flat
                </strong>{" "}
                by reading your floor plan, mapping each room to its direction
                and generating a{" "}
                <strong className="font-semibold text-[#b45309]">
                  room-wise Vastu report PDF
                </strong>{" "}
                focused on simple, non-structural remedies.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Built for flats
                </p>
                <p className="text-lg font-semibold text-[#166534]">
                  1BHK–3BHK
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Optimised for typical Indian tower and gated community
                  layouts.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  Key areas
                </p>
                <p className="text-lg font-semibold text-[#15803d]">
                  Door • Kitchen • Bed
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Focus on main door, kitchen, master bedroom & toilets in
                  flats.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  Online report
                </p>
                <p className="text-lg font-semibold text-[#b45309]">
                  10+ pages PDF
                </p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Direction-wise score, verdicts & remedies – ready to share
                  with family.
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                Upload my flat plan & start VastuCheck
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                Read Vastu for flats FAQs
              </a>
            </div>

            {/* Mini trust line */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[#7a5d3a] sm:text-[12px]">
              <span>
                Suitable for Chennai, Bengaluru, Mumbai, Hyderabad & more
              </span>
              <span className="h-3 w-px bg-amber-200" />
              <span>No login required • Digital Vastu report</span>
            </div>
          </div>

          {/* RIGHT: Example card */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                Example – 2BHK flat Vastu snapshot
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#7c5b2e]">
                      Overall flat Vastu score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-[#15803d]">
                      82 / 100
                    </p>
                    <p className="text-[11px] text-[#166534]">
                      Generally favourable flat – a few easy corrections
                      recommended.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300 bg-[#f0fdf4]">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#22c55e] via-[#fbbf24] to-[#f97316] opacity-90" />
                  </div>
                </div>

                <ul className="mt-2 space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• Main door in North-East – strong positive indicator</li>
                  <li>• Kitchen in South-East – favourable fire zone</li>
                  <li>• One toilet in North – simple remedies suggested</li>
                  <li>• Master bedroom in South-West – supports stability</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-[#7c5b2e]">
                <p>Run the same analysis on your real flat plan in minutes.</p>
                <p className="font-medium text-[#166534]">
                  Upload, mark rooms & download your Vastu report PDF.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO / FAQ SECTION */}
        <section
          id="faq"
          className="mt-10 space-y-6 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <div>
            <h2 className="text-base font-semibold text-[#2b1b10] sm:text-lg">
              How VastuCheck helps with Vastu for flats & apartments
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              In high-rise towers and gated community projects, you usually
              cannot move the kitchen or bedroom. Instead of forcing structural
              changes, VastuCheck focuses on{" "}
              <strong className="font-semibold text-[#b45309]">
                direction-wise understanding and non-demolition remedies
              </strong>{" "}
              for your flat. The tool is ideal if you are buying a new flat,
              living in a rented apartment or planning interiors for a ready
              home.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-[#2b1b10]">
                Common Vastu questions for flats
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• Is my flat main door in an auspicious zone?</li>
                <li>• Is the kitchen in the right Vastu direction?</li>
                <li>• What if toilet is in North-East or South-West?</li>
                <li>• Where should I place bed in a compact bedroom?</li>
                <li>• How to balance Vastu in a rented flat?</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#2b1b10]">
                What you get in the flat Vastu report
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• Flat-level Vastu score and verdict</li>
                <li>• Room-wise direction and Vastu verdict</li>
                <li>• Remedies for difficult toilet / door placements</li>
                <li>• Priority list – 3–5 changes that matter most</li>
                <li>• Lifestyle tips you can apply in a flat setting</li>
              </ul>
            </div>
          </div>

          {/* Q&A for SEO snippets */}
          <div className="space-y-3 border-t border-amber-100 pt-4 text-[12px] text-[#5a4a36] sm:text-[13px]">
            <div>
              <h3 className="font-semibold text-[#2b1b10]">
                Is Vastu different for flats vs independent houses?
              </h3>
              <p className="mt-1">
                Base principles are the same – directions, elements and room
                placement. The difference is practicality. In flats you cannot
                move walls, so{" "}
                <strong>
                  Vastu for flats focuses more on usage, furniture and subtle
                  corrections
                </strong>{" "}
                instead of demolition. VastuCheck is designed with this reality
                in mind.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#2b1b10]">
                Can I use VastuCheck for a rented apartment?
              </h3>
              <p className="mt-1">
                Yes. Many users are tenants who want peace of mind without major
                changes. The report highlights{" "}
                <strong>what you can change easily today</strong> – bed
                placement, storage, colours, usage of certain corners, etc.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>Vastu for flats • AI-assisted guidance</span>
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