// src/app/vastu-for-west-facing-house/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vastu for West Facing House | Check Your Plan Online",
  description:
    "Check Vastu for west facing house using your floor plan. Get room-wise verdicts for entrance, kitchen, bedrooms, pooja and toilets with practical remedies. Free preview available.",
  keywords: [
    "vastu for west facing house",
    "west facing house vastu",
    "west facing house plan vastu",
    "west facing home vastu tips",
    "west facing house vastu report",
    "main door vastu west facing house",
    "west facing house vastu remedies",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://vastucheck.in/vastu-for-west-facing-house",
  },
  openGraph: {
    title: "Vastu for West Facing House | VastuCheck.in",
    description:
      "Upload your west facing house plan and get a structured Vastu report with room-wise verdicts and remedies.",
    url: "https://vastucheck.in/vastu-for-west-facing-house",
    siteName: "VastuCheck.in",
    type: "website",
    images: [
      {
        url: "https://vastucheck.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vastu for West Facing House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vastu for West Facing House | Online Vastu Check",
    description:
      "Upload your west-facing house plan and get room-wise Vastu verdicts with practical remedies.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: {
    icon: "/om.png",
    apple: "/om.png",
  },
};

export default function WestFacingHousePage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is a west facing house good as per Vastu?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A west facing house can be very good if the main door is placed in a favourable west zone and key rooms follow Vastu corner rules. Direction alone is not enough — the exact entrance zone and room locations decide the outcome.",
        },
      },
      {
        "@type": "Question",
        name: "Where should the main entrance be in a west facing house?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "In west facing houses, some portions of the west side are considered stronger for an entrance than others. VastuCheck maps your door position into the zone grid and returns a clear verdict and remedy suggestions if needed.",
        },
      },
      {
        "@type": "Question",
        name: "Where should kitchen and master bedroom be in a west facing home?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Kitchen is usually preferred in South-East (best) or North-West (second option). Master bedroom is preferred in South-West for stability. VastuCheck checks your exact room placements and highlights any conflicts.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 pb-10 pt-6">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#dbeafe] via-[#60a5fa] to-[#1d4ed8] shadow-lg">
              <span className="text-sm font-semibold text-[#0f172a]">VC</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-widest text-[#1d4ed8] uppercase">
                VastuCheck
              </span>
              <span className="text-[12px] text-[#6b5340]">
                Online Vastu by Floor Plan
              </span>
            </div>
          </div>

          <nav className="hidden sm:flex gap-4 text-xs text-[#6b5340]">
            <a href="/" className="hover:text-[#1d4ed8]">Home</a>
            <a href="/vastu" className="hover:text-[#1d4ed8]">Check my plan</a>
            <a href="/contact" className="hover:text-[#1d4ed8]">Contact</a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-1.5 text-xs text-[#1e3a8a] shadow-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              West-facing homes can be powerful — entrance zone + layout balance is key
            </div>

            <h1 className="text-3xl sm:text-4xl font-semibold">
              Vastu for{" "}
              <span className="text-[#1d4ed8]">West Facing House</span>
            </h1>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              A <strong>west facing house</strong> can work beautifully when the{" "}
              <strong>main door</strong> is in the right west zone and the home
              has a stable balance of heavy/light corners.
            </p>

            <p className="text-[15px] leading-relaxed text-[#5a4a36]">
              <strong>VastuCheck.in</strong> lets you upload your plan and get a{" "}
              <strong>room-wise Vastu verdict</strong> (favourable / unfavourable /
              critical) with practical remedies.
            </p>

            <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
              <li>Exact main entrance zone mapping (not generic tips)</li>
              <li>Kitchen, bedrooms, pooja & toilets checked by direction</li>
              <li>Brahmasthan balance and staircase red-flags</li>
              <li>Simple corrections you can share with architect</li>
              <li>Free 2-room preview before you unlock the full PDF</li>
            </ul>

            <a
              href="/vastu"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#60a5fa] via-[#facc15] to-[#86efac] px-8 py-3 text-sm font-semibold shadow-lg"
            >
              Upload my west facing house plan →
            </a>

            <div className="text-[12px] text-[#7c5b2e]">
              Free preview: 2 rooms • Full report ₹49
            </div>
          </div>

          {/* INFO CARD */}
          <div className="rounded-3xl border border-blue-200 bg-white p-6 shadow-xl">
            <p className="text-xs uppercase tracking-widest text-[#1d4ed8]">
              Example – West Facing House Check
            </p>

            <div className="mt-4 space-y-2 text-sm text-[#3f3a34]">
              <p>✔ Entrance in a favourable west zone – positive</p>
              <p>✔ Master bedroom in South-West – stable</p>
              <p>✔ Kitchen in South-East – favourable</p>
              <p>⚠ Toilet close to North-East – remedy suggested</p>
            </div>

            <p className="mt-4 text-xs text-[#6b5340]">
              “West facing” doesn’t decide luck. The report helps you confirm the
              exact door zone and fix layout conflicts early.
            </p>
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-12 space-y-6 rounded-3xl border border-blue-200 bg-white px-6 py-8">
          <h2 className="text-xl font-semibold">
            West facing house Vastu — what VastuCheck analyses
          </h2>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            For west facing houses, the most important factor is the{" "}
            <strong>main door zone</strong> (where exactly on the west side your
            entrance sits). VastuCheck maps the door and rooms into directional
            zones and gives clear verdicts and corrections.
          </p>

          <p className="text-[14px] leading-relaxed text-[#5a4a36]">
            You also get room-wise feedback for kitchen, bedrooms, toilets,
            pooja, staircase and Brahmasthan — so your architect can quickly
            adjust the plan before construction or renovation.
          </p>

          <h3 className="font-semibold mt-4">
            When should you check west facing house Vastu?
          </h3>

          <ul className="list-disc pl-5 text-[14px] text-[#5a4a36] space-y-1">
            <li>Before buying a west facing plot/house</li>
            <li>Before finalising construction drawings</li>
            <li>Before renovation or interiors</li>
            <li>When you want entrance-zone clarity instead of generic advice</li>
          </ul>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t pt-4 text-xs text-[#8b7357] flex justify-between flex-wrap gap-2">
          <span>© {year} VastuCheck.in</span>
          <div className="flex gap-4">
            <a href="/privacy-policy">Privacy</a>
            <a href="/terms-and-conditions">Terms</a>
            <a href="/contact">Contact</a>
          </div>
        </footer>
      </div>
    </main>
  );
}