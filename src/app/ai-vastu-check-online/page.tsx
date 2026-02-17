import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Vastu Check Online | Floor Plan Scanner + Vastu Report PDF",
  description:
    "AI-assisted Vastu check online using your floor plan. AI helps read the layout; Vastu verdicts follow fixed traditional rules. Free 2-room preview.",
  keywords: [
    "ai vastu check online",
    "ai vastu report",
    "floor plan scanner vastu",
    "online vastu check ai",
    "vastu check by floor plan",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/ai-vastu-check-online" },
  openGraph: {
    title: "AI Vastu Check Online | VastuCheck.in",
    description:
      "AI-assisted layout reading + traditional Vastu rules. Upload plan, tag rooms, get report PDF.",
    url: "https://vastucheck.in/ai-vastu-check-online",
    siteName: "VastuCheck.in",
    type: "website",
    images: [{ url: "https://vastucheck.in/og-image.png", width: 1200, height: 630, alt: "AI Vastu Check Online" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Vastu Check Online | VastuCheck.in",
    description:
      "AI helps detect layout — verdicts follow fixed Vastu rules. Free preview included.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function AIVastuCheckOnlinePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is AI deciding the Vastu verdict?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "No. AI only helps read the floor plan and assist report writing. The verdicts and scoring follow fixed traditional Vastu rules based on directions.",
        },
      },
      {
        "@type": "Question",
        name: "How does the AI-assisted part help?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It helps detect room labels/placement faster so you spend less time manually tagging. You can still adjust rooms anytime before generating the report.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#c05621] shadow-lg shadow-amber-300/40">
              <span className="text-sm font-semibold tracking-tight text-[#2b1b10]">VC</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-[0.18em] text-[#b65c10] uppercase">VastuCheck</div>
              <div className="text-[12px] text-[#7c5b2e]">AI-assisted, rule-based Vastu</div>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Home</a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Start</a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Contact</a>
          </nav>
        </header>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              AI helps speed • Rules stay traditional
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Vastu check{" "}
              <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#16a34a] bg-clip-text text-transparent">
                online
              </span>{" "}
              — but verdicts are rule-based.
            </h1>

            <p className="max-w-2xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
              We use AI only to assist reading your plan faster (like room labels/placement).
              The Vastu verdicts follow fixed, traditional rules based on directions, centre and zone mapping.
            </p>

            <div className="rounded-3xl border border-amber-200 bg-white/95 p-6 shadow-sm">
              <div className="font-semibold text-[#2b1b10]">Why this increases accuracy</div>
              <ul className="mt-3 space-y-2 text-[13px] text-[#5a4a36]">
                <li>• Faster room tagging → fewer user mistakes</li>
                <li>• You can still edit everything before summary</li>
                <li>• Direction mapping stays consistent & explainable</li>
              </ul>

              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/vastu"
                  className="inline-flex items-center justify-center rounded-full bg-[#2b1b10] px-7 py-3 text-sm font-semibold text-amber-50 shadow hover:bg-black"
                >
                  Try AI-assisted check →
                </a>
                <a
                  href="/upload-floor-plan-vastu-check"
                  className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-6 py-3 text-sm font-medium text-[#5a4a36] hover:border-[#b65c10] hover:text-[#b65c10]"
                >
                  Upload floor plan page
                </a>
              </div>
            </div>
          </div>

          <aside className="rounded-3xl border border-emerald-200 bg-white/90 p-6 shadow-xl shadow-emerald-200/50">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#15803d]">Clarity builds trust</div>
            <div className="mt-3 text-[13px] text-[#14532d]">
              Saying “AI-assisted” is powerful — but only if you explain it clearly.
              This page does that, so more visitors convert.
            </div>
            <a
              href="/vastu"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-4 py-3 text-[13px] font-semibold text-[#2b1b10] shadow hover:brightness-110"
            >
              Start now
            </a>
          </aside>
        </section>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357]">
          <div>© {year} VastuCheck.in</div>
          <div className="flex gap-3">
            <a href="/privacy-policy" className="hover:text-[#b65c10]">Privacy</a>
            <a href="/terms-and-conditions" className="hover:text-[#b65c10]">Terms</a>
            <a href="/contact" className="hover:text-[#b65c10]">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}