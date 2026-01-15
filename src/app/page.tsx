// src/app/page.tsx

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-500/20 via-slate-900/40 to-transparent blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* Nav */}
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-300 to-sky-500 shadow-lg shadow-emerald-500/40">
              <span className="text-xs font-semibold tracking-tight text-slate-950">
                TG
              </span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-[0.18em] text-emerald-300 uppercase">
                TropicGlow
              </span>
              <span className="text-[11px] text-slate-300/80">
                Vastu Sense • AI Powered
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-3 text-xs sm:flex">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-900/60 px-3 py-1 shadow-sm shadow-emerald-400/20">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-medium text-emerald-100">
                Instant AI Vastu Summary
              </span>
            </div>
            <span className="hidden text-slate-400 sm:inline">
              No demolition • Practical remedies
            </span>
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center">
          {/* Left: copy */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-slate-900/70 px-3 py-1 text-xs text-emerald-100 shadow shadow-emerald-500/20">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              <span>Upload your floor plan • Get full Vastu report in minutes</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Luxury-grade
                <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent">
                  {" "}
                  Vastu report
                </span>{" "}
                powered by AI.
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-[15px]">
                TropicGlow Vastu Sense reads your floor plan, scores every room, and
                gives a{" "}
                <span className="font-semibold text-emerald-200">
                  room-by-room remedy guide
                </span>{" "}
                — without forcing you into major structural changes. Clear, practical,
                vastu-aligned insights that feel like a senior consultant spent hours
                on your home.
              </p>
            </div>

            {/* Trust highlights */}
            <div className="grid gap-4 text-xs text-slate-200 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-1.5">
                  Precision Score
                </p>
                <p className="text-lg font-semibold text-emerald-300">
                  0–100 Vastu Index
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Weighted scoring for entrance, bedrooms, kitchen, toilets & more.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-1.5">
                  Remedies
                </p>
                <p className="text-lg font-semibold text-emerald-300">
                  Non-demolition first
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Colours, usage tweaks & placement — civil changes only if unavoidable.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 mb-1.5">
                  Instant PDF
                </p>
                <p className="text-lg font-semibold text-emerald-300">
                  10+ page report
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Room-wise findings, priority fixes & lifestyle tips in a clean PDF.
                </p>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40 transition hover:brightness-110"
              >
                Upload Floor Plan
                <span className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-900/80 text-[10px] text-emerald-200 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </a>

              {/* Changed from button+onClick to normal anchor link */}
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-xs font-medium text-slate-100 hover:border-emerald-400/60 hover:text-emerald-100 transition"
              >
                See how AI reads your home
              </a>
            </div>

            {/* Mini trust bar */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400/60 bg-slate-900/70 text-[9px] text-emerald-200">
                  AI
                </span>
                <span>Hybrid engine — rules + OpenAI</span>
              </div>
              <span className="h-3 w-px bg-slate-700" />
              <span>No login required • PDF download included</span>
            </div>
          </div>

          {/* Right: AI card */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-sky-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-emerald-500/20 backdrop-blur">
              {/* Badge row */}
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-full bg-emerald-500/10 px-2 text-[10px] font-medium text-emerald-200 ring-1 ring-emerald-500/40">
                    Vastu AI Engine v1.0
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 text-right">
                  <p>Aligned to classic Vastu</p>
                  <p>Optimised for modern flats</p>
                </div>
              </div>

              {/* Fake "analysis" block */}
              <div className="space-y-3 rounded-2xl bg-slate-950/70 p-3 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-300">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                      Sample Home Score
                    </p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      78 / 100
                    </p>
                    <p className="text-[11px] text-emerald-200/90">
                      Generally favourable with a few priority fixes.
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 border border-emerald-400/40">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-emerald-400 via-emerald-300 to-sky-300 opacity-80" />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-emerald-200 border border-emerald-500/40">
                    ✅ Entrance aligned
                  </span>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-amber-200 border border-amber-400/40">
                    ⚠ SE toilet – remedy advised
                  </span>
                  <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] text-sky-200 border border-sky-400/40">
                    ✨ NE kept light & clean
                  </span>
                </div>
              </div>

              {/* Mini “report preview” */}
              <div className="mt-4 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/50 p-3 text-[11px]">
                <p className="text-slate-300 font-medium mb-1.5">
                  What your PDF includes:
                </p>
                <ul className="space-y-1.5 text-slate-400">
                  <li>• Room-wise Vastu verdict (Auspicious / Average / Critical)</li>
                  <li>• Simple non-demolition remedies you can start this week</li>
                  <li>• Priority checklist: 3–5 fixes that matter the most</li>
                  <li>• Lifestyle guidance for better sleep, focus & harmony</li>
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                <span>Secure payment • Instant download</span>
                <span className="text-emerald-300 font-medium">
                  Launch offer: AI report in minutes
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-10 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-5 sm:px-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                How TropicGlow Vastu Sense works
              </h2>
              <p className="mt-1 text-[11px] text-slate-400 max-w-xl">
                3 simple steps: upload floor plan, mark your rooms, and let our hybrid
                engine (classic Vastu rules + OpenAI) generate a detailed, personalised
                report for your home.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>Designed for Indian apartments & villas</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-[11px] text-slate-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step 1
              </p>
              <p className="font-medium text-slate-100">Upload your floor plan</p>
              <p className="mt-1 text-slate-400">
                Just a clear image or PDF is enough. No site visit, no long forms.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step 2
              </p>
              <p className="font-medium text-slate-100">Mark rooms & directions</p>
              <p className="mt-1 text-slate-400">
                Our tool helps you tag master bedroom, kitchen, toilets & more in minutes.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Step 3
              </p>
              <p className="font-medium text-slate-100">AI-crafted Vastu report</p>
              <p className="mt-1 text-slate-400">
                Get a polished PDF with scoring, insights & remedies you can actually
                implement.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400/90 px-5 py-2.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40 hover:bg-emerald-300 transition"
            >
              Start my Vastu analysis
            </a>
            <p className="text-[10px] text-slate-500">
              Disclaimer: This is a digital guidance tool and does not replace in-person
              consultation where needed.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/80 pt-4 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} TropicGlow • Vastu Sense</span>
          <span>Built with ❤️ in India • Powered by AI</span>
        </footer>
      </div>
    </main>
  );
}