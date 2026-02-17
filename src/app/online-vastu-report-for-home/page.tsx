import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Vastu Report for Home | Room-wise Score + Remedies (PDF)",
  description:
    "Get an online Vastu report for your home using your floor plan. Room-wise verdicts, zone mapping, and practical remedies. Free 2-room preview.",
  keywords: [
    "online vastu report for home",
    "vastu report online",
    "vastu report pdf",
    "home vastu report",
    "room wise vastu report",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/online-vastu-report-for-home" },
  openGraph: {
    title: "Online Vastu Report for Home | VastuCheck.in",
    description:
      "Upload your floor plan and get a structured Vastu report: room-wise verdicts, zones and remedies.",
    url: "https://vastucheck.in/online-vastu-report-for-home",
    siteName: "VastuCheck.in",
    type: "website",
    images: [{ url: "https://vastucheck.in/og-image.png", width: 1200, height: 630, alt: "Online Vastu Report for Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Vastu Report for Home | VastuCheck.in",
    description:
      "Room-wise Vastu verdicts, zone mapping and remedies — generated from your floor plan.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function OnlineVastuReportForHomePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is included in the online Vastu report?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "It includes room-wise verdicts, zone mapping (NE/SE/SW/NW), key placement checks and practical remedies wherever possible. You can download it as a PDF.",
        },
      },
      {
        "@type": "Question",
        name: "Is the report useful before construction?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes — that’s when it’s most useful. If the plan is flexible, you can adjust placements early and avoid expensive changes later.",
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
              <div className="text-[12px] text-[#7c5b2e]">Online Vastu report PDF</div>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Home</a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Start</a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Contact</a>
          </nav>
        </header>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Free 2-room preview • Unlock full report anytime
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Get an{" "}
              <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#16a34a] bg-clip-text text-transparent">
                online Vastu report
              </span>{" "}
              for your home.
            </h1>

            <p className="max-w-2xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
              A proper Vastu report is not “general tips”. It’s room-wise, direction-wise,
              and connected to your actual layout. Upload your plan, set North + centre,
              tag rooms — and download a structured PDF you can act on.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 text-[13px] text-[#5a4a36]">
              <div className="rounded-2xl border border-amber-200 bg-white/95 p-5 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#b65c10]/80">Included</div>
                <ul className="mt-3 space-y-2">
                  <li>• Room-wise verdicts</li>
                  <li>• Zone mapping (NE/SE/SW/NW)</li>
                  <li>• Priority fixes list</li>
                  <li>• Practical remedies</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/95 p-5 shadow-sm">
                <div className="text-[11px] uppercase tracking-[0.18em] text-[#15803d]/80">Best for</div>
                <ul className="mt-3 space-y-2">
                  <li>• Before construction</li>
                  <li>• Before renovation</li>
                  <li>• Before buying resale</li>
                  <li>• NRI plan checks</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/vastu"
                className="inline-flex items-center justify-center rounded-full bg-[#2b1b10] px-7 py-3 text-sm font-semibold text-amber-50 shadow hover:bg-black"
              >
                Generate my report →
              </a>
              <a
                href="/free-vastu-check"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-6 py-3 text-sm font-medium text-[#5a4a36] hover:border-[#b65c10] hover:text-[#b65c10]"
              >
                See free preview
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-white/90 p-6 shadow-xl shadow-amber-200/60">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">Quick trust</div>
            <div className="mt-3 space-y-2 text-[13px] text-[#5a4a36]">
              <div className="rounded-2xl border border-amber-100 bg-[#fff7ed] p-4">
                <div className="font-semibold text-[#2b1b10]">Why people pay for the PDF</div>
                <div className="mt-1 text-[12px] text-[#6b5340]">
                  The report is structured, room-wise and easy to share — it helps you align family + architect on changes.
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-[#f0fdf4] p-4">
                <div className="font-semibold text-[#2b1b10]">Fast to finish</div>
                <div className="mt-1 text-[12px] text-[#166534]">
                  Most users finish in a few minutes with a clear plan image.
                </div>
              </div>
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