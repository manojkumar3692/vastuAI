import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu Report PDF for Home | Download Room-wise Vastu Report",
  description:
    "Download a Vastu report PDF for your home generated from your floor plan. Includes room-wise verdicts, zone mapping, and remedy suggestions.",
  keywords: [
    "vastu report pdf",
    "vastu pdf report for home",
    "download vastu report",
    "room wise vastu report pdf",
    "house vastu report pdf",
  ],
  robots: { index: true, follow: true },
  alternates: { canonical: "https://vastucheck.in/vastu-report-pdf-for-home" },
  openGraph: {
    title: "Vastu Report PDF for Home | VastuCheck.in",
    description:
      "Generate and download a room-wise Vastu report PDF from your floor plan.",
    url: "https://vastucheck.in/vastu-report-pdf-for-home",
    siteName: "VastuCheck.in",
    type: "website",
    images: [{ url: "https://vastucheck.in/og-image.png", width: 1200, height: 630, alt: "Vastu Report PDF for Home" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu Report PDF for Home | VastuCheck.in",
    description:
      "Room-wise verdicts + zones + remedies — in a sharable PDF report.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuReportPdfForHomePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does the PDF include?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "The PDF includes a room-wise verdict, direction/zone mapping, and practical remedy suggestions you can follow or share with your architect.",
        },
      },
      {
        "@type": "Question",
        name: "Can I share it with my architect or family?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Yes. The report is designed to be sharable and easy to discuss with family members, architects, and interior designers.",
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
              <div className="text-[12px] text-[#7c5b2e]">Sharable Vastu PDF report</div>
            </div>
          </div>
          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Home</a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Start</a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">Contact</a>
          </nav>
        </header>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Downloadable PDF • Room-wise & zone-wise
            </div>

            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Vastu report{" "}
              <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#16a34a] bg-clip-text text-transparent">
                PDF
              </span>{" "}
              for your home.
            </h1>

            <p className="max-w-2xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
              A PDF makes it real. You can share it, discuss it, and make decisions faster.
              Generate your report from your floor plan — then download it in one click.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 text-[13px] text-[#5a4a36]">
              <div className="rounded-2xl border border-amber-200 bg-white/95 p-5 shadow-sm">
                <div className="font-semibold text-[#2b1b10]">What’s inside</div>
                <ul className="mt-3 space-y-2">
                  <li>• Room-wise verdict & reasons</li>
                  <li>• Zone mapping (NE/SE/SW/NW)</li>
                  <li>• Priority fixes list</li>
                  <li>• Remedy suggestions</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-white/95 p-5 shadow-sm">
                <div className="font-semibold text-[#2b1b10]">Used by</div>
                <ul className="mt-3 space-y-2">
                  <li>• Home buyers</li>
                  <li>• Families finalising plans</li>
                  <li>• Architects & interiors</li>
                  <li>• NRIs reviewing remotely</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/vastu"
                className="inline-flex items-center justify-center rounded-full bg-[#2b1b10] px-7 py-3 text-sm font-semibold text-amber-50 shadow hover:bg-black"
              >
                Generate my PDF report →
              </a>
              <a
                href="/free-vastu-check"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-6 py-3 text-sm font-medium text-[#5a4a36] hover:border-[#b65c10] hover:text-[#b65c10]"
              >
                Start with free preview
              </a>
            </div>
          </div>

          <aside className="rounded-3xl border border-amber-200 bg-white/90 p-6 shadow-xl shadow-amber-200/60">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">Conversion helper</div>
            <div className="mt-3 rounded-2xl border border-amber-100 bg-[#fff7ed] p-4">
              <div className="font-semibold text-[#2b1b10]">Why this works</div>
              <div className="mt-1 text-[12px] text-[#6b5340]">
                People pay when the output looks professional and actionable.
                Your PDF becomes a decision tool — not just “tips”.
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