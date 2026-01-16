// src/app/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Vastu Check for Home Floor Plans | VastuCheck.in",
  description:
    "Upload your house or flat floor plan and get an AI-powered Vastu report online. VastuCheck.in scores each room, shows direction-wise Vastu verdicts and gives simple, non-demolition remedies for Indian apartments, villas and plots.",
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top glow */}
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

          {/* Right nav – trust & quick links */}
          <div className="hidden items-center gap-4 text-xs sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/40 bg-slate-900/70 px-3 py-1 shadow-sm shadow-emerald-400/20">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-medium text-emerald-100">
                Instant AI Vastu Summary
              </span>
            </div>
            <nav className="flex items-center gap-3 text-[11px] text-slate-400">
              <a
                href="/terms-and-conditions"
                className="hover:text-emerald-200 transition"
              >
                Terms
              </a>
              <a
                href="/privacy-policy"
                className="hover:text-emerald-200 transition"
              >
                Privacy
              </a>
              <a href="/contact" className="hover:text-emerald-200 transition">
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
          {/* Left: copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-900/70 px-4 py-1.5 text-xs sm:text-sm text-emerald-100 shadow shadow-emerald-500/20">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              <span>
                Upload your floor plan • Get an AI-backed online Vastu check in
                minutes
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Check your{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  home’s Vastu online
                </span>{" "}
                with an AI-powered report.
              </h1>
              <p className="max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base">
                <span className="font-semibold text-emerald-200">
                  VastuCheck.in
                </span>{" "}
                lets you do a complete{" "}
                <strong className="font-semibold text-emerald-200">
                  online Vastu check for your flat, villa or independent house
                </strong>
                . Upload your floor plan, and our engine scores every room and
                generates a{" "}
                <span className="font-semibold text-emerald-200">
                  room-by-room Vastu guidance PDF
                </span>{" "}
                — focused on practical, non-demolition remedies based on
                classical Vastu logic plus AI.
              </p>
            </div>

            {/* Trust highlights */}
            <div className="grid gap-4 text-xs sm:text-sm text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 px-4 py-3">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-emerald-300/80">
                  VastuCheck Index
                </p>
                <p className="text-xl font-semibold text-emerald-300">
                  0–100 Score
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Direction-wise Vastu score for entrance, bedrooms, kitchen,
                  toilets & more.
                </p>
              </div>
              <div className="rounded-2xl border border-sky-500/20 bg-slate-900/80 px-4 py-3">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-sky-300/80">
                  Remedies First
                </p>
                <p className="text-xl font-semibold text-sky-200">
                  Non-demolition focus
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Colours, furniture, usage patterns — civil changes only if
                  truly needed.
                </p>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/80 px-4 py-3">
                <p className="mb-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-emerald-300/80">
                  PDF Report
                </p>
                <p className="text-xl font-semibold text-emerald-200">
                  10+ pages
                </p>
                <p className="mt-1 text-[12px] text-slate-400">
                  Room-wise notes, priority fixes & lifestyle tips in a clean,
                  shareable Vastu report PDF.
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 px-7 py-3 text-sm sm:text-base font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:brightness-110"
              >
                Upload floor plan & start VastuCheck
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/80 text-[11px] text-emerald-200 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 px-5 py-2.5 text-xs sm:text-sm font-medium text-slate-100 hover:border-emerald-400/60 hover:text-emerald-100 transition"
              >
                See how VastuCheck works
              </a>
            </div>

            {/* Mini trust bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] sm:text-[12px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400/60 bg-slate-900/70 text-[9px] text-emerald-200">
                  AI
                </span>
                <span>Hybrid engine – rule-based Vastu + OpenAI</span>
              </div>
              <span className="h-3 w-px bg-slate-700" />
              <span>No login required • Digital Vastu report as PDF</span>
            </div>
          </div>

          {/* Right: AI card */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-sky-400/15 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-emerald-500/25 backdrop-blur">
              {/* Badge row */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="inline-flex h-6 items-center rounded-full bg-emerald-500/10 px-2.5 text-[11px] font-medium text-emerald-200 ring-1 ring-emerald-500/40">
                    VastuCheck Engine • v1.0
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Built for Indian apartments & villas
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 text-right">
                  <p>Aligned with classical Vastu</p>
                  <p>Clarified by AI narratives</p>
                </div>
              </div>

              {/* Fake "analysis" block */}
              <div className="space-y-3 rounded-2xl bg-slate-950/80 p-3 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-slate-300">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      Sample layout score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-emerald-300">
                      78 / 100
                    </p>
                    <p className="text-[11px] text-emerald-200/90">
                      Generally favourable with a few priority corrections.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-emerald-400/40">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-sky-300 opacity-80" />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] sm:text-[11px]">
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-emerald-200 border border-emerald-500/40">
                    ✅ NE kept light & clean
                  </span>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-amber-200 border border-amber-400/40">
                    ⚠ SE toilet – remedy suggested
                  </span>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-sky-200 border border-sky-400/40">
                    ✨ SW bedroom supports stability
                  </span>
                </div>
              </div>

              {/* Mini “report preview” */}
              <div className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] sm:text-[12px]">
                <p className="text-slate-200 font-medium mb-1.5">
                  What your VastuCheck PDF includes:
                </p>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Overall VastuCheck score & verdict</li>
                  <li>• Room-wise explanation with direction + verdict</li>
                  <li>• Simple non-demolition remedies you can start this week</li>
                  <li>• Priority checklist: top 3–5 fixes that matter most</li>
                  <li>• Lifestyle tips for sleep, focus & harmony</li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] sm:text-[12px] text-slate-400">
                <span>Secure online payment • Instant PDF download</span>
                <span className="text-emerald-300 font-medium">
                  Launch phase: AI report in minutes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-6 sm:px-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                How VastuCheck works
              </h2>
              <p className="mt-1 text-[12px] sm:text-[13px] text-slate-400 max-w-xl">
                3 simple steps: upload your floor plan, mark the rooms on our
                North–East–South–West grid and let the hybrid engine (rule-based
                Vastu + OpenAI) generate a personalised Vastu report for your
                home.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] sm:text-[12px] text-slate-300">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>Designed for Indian flats, villas & plots</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-[12px] text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step 1
              </p>
              <p className="font-medium text-slate-100">Upload your floor plan</p>
              <p className="mt-1 text-slate-400">
                A clear image or PDF is enough. No site visit, no complicated
                forms—perfect for online Vastu checking.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step 2
              </p>
              <p className="font-medium text-slate-100">Mark rooms & directions</p>
              <p className="mt-1 text-slate-400">
                Our UI helps you tag master bedroom, kitchen, toilets & more on
                the Vastu grid quickly.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3.5">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step 3
              </p>
              <p className="font-medium text-slate-100">
                Download your AI Vastu report
              </p>
              <p className="mt-1 text-slate-400">
                Get a polished PDF with scoring, insights and remedies you can
                actually use with family.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-300 transition"
            >
              Start my VastuCheck now
            </a>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Disclaimer: VastuCheck is a digital guidance tool. Do not take
              major financial, legal or medical decisions based only on this
              report.
            </p>
          </div>
        </section>

        {/* 🔍 SEO Content Block – long-form, keyword rich */}
        <section className="mt-10 space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 px-4 py-6 sm:px-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              Online Vastu Check for Indian Flats, Villas & Plots
            </h2>
            <p className="mt-2 text-[12px] sm:text-[13px] leading-relaxed text-slate-300">
              VastuCheck.in is built for modern Indian homes that are already
              constructed or under construction. Instead of guessing whether a
              plan is Vastu compliant, you can{" "}
              <strong className="font-semibold text-emerald-200">
                upload your floor plan and do a complete online Vastu check
              </strong>{" "}
              within a few minutes. The tool maps every room to its direction
              (North, North-East, East, South-East, South, South-West, West,
              North-West) and then calculates a{" "}
              <strong className="font-semibold text-emerald-200">
                Vastu score out of 100
              </strong>{" "}
              with clear explanations.
            </p>
            <p className="mt-2 text-[12px] sm:text-[13px] leading-relaxed text-slate-300">
              Whether you have a{" "}
              <strong>2BHK flat, 3BHK apartment, duplex villa or independent
              house</strong>, VastuCheck helps you understand how the placement
              of your master bedroom, kitchen, toilets, pooja room and main
              door is affecting energy flow according to traditional Vastu
              Shastra principles.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Why use VastuCheck instead of a random Vastu app?
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] sm:text-[13px] text-slate-300">
                <li>• Works directly on your real floor plan layout</li>
                <li>• Direction-wise scoring instead of vague “yes / no”</li>
                <li>• Focus on non-demolition remedies first</li>
                <li>• Room-by-room notes you can share with architect or family</li>
                <li>• Online Vastu check that you can repeat any time</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Who is VastuCheck.in ideal for?
              </h3>
              <ul className="mt-2 space-y-1.5 text-[12px] sm:text-[13px] text-slate-300">
                <li>• Buyers checking Vastu before booking a flat</li>
                <li>• Owners planning interior changes without breaking walls</li>
                <li>• NRIs evaluating Indian properties remotely</li>
                <li>• Architects and designers needing a quick Vastu lens</li>
              </ul>
            </div>
          </div>

          {/* FAQ-style content for rich snippets */}
          <div className="border-t border-slate-800 pt-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              VastuCheck.in – Frequently Asked Questions
            </h2>

            <div className="mt-3 space-y-3 text-[12px] sm:text-[13px] text-slate-300">
              <div>
                <h3 className="font-semibold text-slate-100">
                  1. How does the online Vastu check work?
                </h3>
                <p className="mt-1">
                  You upload a clear top-view floor plan image, mark the main
                  rooms and directions, and VastuCheck’s engine maps each room
                  to its Vastu zone. Based on classical rules, the tool assigns
                  a score and generates an{" "}
                  <strong>AI-backed Vastu report PDF</strong> with explanations
                  and remedies.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100">
                  2. Is this a replacement for a human Vastu consultant?
                </h3>
                <p className="mt-1">
                  No. VastuCheck is a{" "}
                  <strong>digital guidance tool</strong>. It gives you a clear
                  starting point using standard Vastu principles and AI
                  explanations. For complex cases, you can still consult a
                  trusted Vastu expert and use this report as a structured
                  reference.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100">
                  3. Can I use VastuCheck for apartments in cities like Chennai,
                  Bengaluru, Mumbai or Hyderabad?
                </h3>
                <p className="mt-1">
                  Yes. VastuCheck is designed for{" "}
                  <strong>urban Indian apartments and villas</strong>. You can
                  use it for projects in Chennai, Bengaluru, Coimbatore,
                  Mumbai, Hyderabad, Delhi NCR and other cities – the logic is
                  based on direction and room placement, not on city name.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-100">
                  4. What do I get in the paid Vastu report?
                </h3>
                <p className="mt-1">
                  The paid report includes{" "}
                  <strong>
                    full room-by-room verdicts, priority list of fixes, and
                    detailed non-demolition remedies
                  </strong>{" "}
                  in a downloadable PDF that you can share over email or
                  WhatsApp.
                </p>
              </div>
            </div>
          </div>

          {/* City / intent links for future landing pages */}
          <div className="border-t border-slate-800 pt-4">
            <h2 className="text-base sm:text-lg font-semibold text-slate-100">
              Popular use cases: Vastu check for different property types
            </h2>
            <p className="mt-2 text-[12px] sm:text-[13px] text-slate-300">
              Many users search for phrases like{" "}
              <em>“Vastu for 2BHK flat in Chennai”</em>,{" "}
              <em>“Vastu for villa in Bengaluru”</em> or{" "}
              <em>“online Vastu check for ready-to-move apartment”</em>. You can
              run VastuCheck on:
            </p>
            <ul className="mt-2 flex flex-wrap gap-2 text-[12px] sm:text-[13px] text-slate-200">
              <li className="rounded-full bg-slate-900/80 px-3 py-1">
                Vastu for 1BHK, 2BHK, 3BHK flats
              </li>
              <li className="rounded-full bg-slate-900/80 px-3 py-1">
                Vastu for duplex & villa layouts
              </li>
              <li className="rounded-full bg-slate-900/80 px-3 py-1">
                Vastu for independent house plans
              </li>
              <li className="rounded-full bg-slate-900/80 px-3 py-1">
                Vastu for corner plots & gated communities
              </li>
            </ul>
          </div>
        </section>

        {/* Footer with policy links */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/80 pt-4 text-[11px] sm:text-[12px] text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-slate-800 sm:inline" />
            <span>Built in India • Powered by AI</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/shipping-policy"
              className="hover:text-emerald-200 transition"
            >
              Shipping Policy
            </a>
            <a
              href="/cancellations-and-refunds"
              className="hover:text-emerald-200 transition"
            >
              Cancellations & Refunds
            </a>
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
            <a
              href="/contact"
              className="hover:text-emerald-200 transition"
            >
              Contact Us
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}