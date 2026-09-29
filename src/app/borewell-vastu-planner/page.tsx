import type { Metadata } from "next";
import Link from "next/link";
import BorewellPlanner from "./BorewellPlanner";
import styles from "./seo.module.css";

export const metadata: Metadata = {
  title: "Borewell Location as per Vastu – Online Planner",
  description: "Find a Vastu-preferred borewell location on your plot. Set North and compare North-East, North, East and other zones. Vastu guidance only—not groundwater detection.",
  keywords: [
    "borewell location as per vastu",
    "borewell direction as per vastu",
    "best direction for borewell",
    "best place for borewell as per vastu",
    "borewell vastu calculator",
    "borewell vastu checker",
    "borewell placement vastu",
    "borewell in north east",
    "well location as per vastu",
    "tube well direction as per vastu",
    "boring location as per vastu",
  ],
  alternates: { canonical: "https://vastucheck.in/borewell-vastu-planner" },
  openGraph: {
    title: "Borewell Location as per Vastu – Interactive Planner",
    description: "Set North, mark your plot and compare Vastu-preferred borewell zones. This tool provides Vastu placement guidance, not groundwater detection.",
    url: "https://vastucheck.in/borewell-vastu-planner",
    siteName: "VastuCheck.in",
    type: "website",
    images: ["https://vastucheck.in/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Borewell Location as per Vastu – Interactive Planner",
    description: "Compare Vastu-preferred borewell directions on your plot. Vastu guidance only—not groundwater detection.",
    images: ["https://vastucheck.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const faqItems = [
  {
    question: "Which direction is best for a borewell as per Vastu?",
    answer: "North-East (Ishanya) is traditionally the most preferred borewell zone. North and East are commonly considered favourable alternatives. The exact centre and South-West are generally avoided in traditional Vastu planning.",
  },
  {
    question: "Does this planner find groundwater or water-bearing spots?",
    answer: "No. The planner does not detect groundwater, predict drilling depth, estimate yield or test water quality. It only compares possible positions using traditional Vastu direction preferences. Confirm the final drilling point with qualified groundwater and site professionals.",
  },
  {
    question: "How does the borewell Vastu calculator choose a location?",
    answer: "You outline the plot, align its actual North direction and confirm the plot centre. The planner then uses a transparent rule-based score across 16 compass zones and shows how the score changes as you move the borewell marker.",
  },
  {
    question: "Can I upload my house or plot plan?",
    answer: "Yes. You can upload a JPG, PNG or WEBP plan as a visual guide, adjust the plot corners, set North and compare positions. The uploaded image is not analysed for groundwater and is not an engineering survey.",
  },
  {
    question: "Does the facing direction of the house change the borewell zone?",
    answer: "The planner measures every position from the North direction you set and from the plot centre. This lets you compare the same compass-based Vastu zones for north-, south-, east- or west-facing properties.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://vastucheck.in/borewell-vastu-planner#app",
      name: "Borewell Vastu Planner",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      url: "https://vastucheck.in/borewell-vastu-planner",
      image: "https://vastucheck.in/og-image.png",
      description: "An interactive, rule-based tool for comparing borewell locations using traditional Vastu direction preferences. It does not detect groundwater.",
      featureList: [
        "16-direction Vastu suitability map",
        "Adjustable North alignment",
        "Plot outline and plan upload",
        "Live borewell position score",
      ],
      offers: {
        "@type": "Offer",
        price: "99",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: "https://vastucheck.in/borewell-vastu-planner",
      },
      provider: {
        "@type": "Organization",
        name: "VastuCheck.in",
        url: "https://vastucheck.in",
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://vastucheck.in/borewell-vastu-planner#faq",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

const directionRows = [
  ["North-East (Ishanya)", "Most preferred", "Traditionally the strongest zone for underground water placement."],
  ["North and East", "Favourable", "Common alternatives when the North-East area is unavailable."],
  ["North-West and West", "Conditional", "Compare the exact angle and nearby points before selecting."],
  ["South-East, South and South-West", "Generally avoided", "Traditionally lower-preference zones for a borewell."],
  ["Plot centre (Brahmasthan)", "Avoid", "Keep the central zone clear and confirm practical site constraints."],
];

export default function BorewellVastuPlannerPage() {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <BorewellPlanner />
      <article className={styles.guide}>
        <div className={styles.inner}>
          <header className={styles.intro}>
            <span>BOREWELL VASTU GUIDE</span>
            <h2>Find the best borewell location as per Vastu</h2>
            <p>Use the interactive planner to compare possible borewell points on your own plot. It converts the direction and distance of each point into a clear, rule-based Vastu suitability score.</p>
          </header>

          <section className={styles.answerGrid} aria-labelledby="quick-answer-title">
            <div className={styles.answerCard}>
              <small>QUICK ANSWER</small>
              <h3 id="quick-answer-title">Which borewell direction is preferred?</h3>
              <p><strong>North-East is traditionally preferred.</strong> North and East are commonly used alternatives. The exact centre and South-West are generally treated as lower-preference positions.</p>
            </div>
            <div className={styles.limitCard}>
              <small>IMPORTANT DISTINCTION</small>
              <h3>Vastu placement—not water detection</h3>
              <p>This tool does not locate groundwater, predict borewell depth or guarantee water yield. Use a hydrogeological survey, an experienced local driller and the required local approvals before drilling.</p>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="direction-guide-title">
            <div className={styles.sectionHeading}>
              <span>16-DIRECTION COMPARISON</span>
              <h2 id="direction-guide-title">Borewell direction guide for your plot</h2>
              <p>The planner measures from the plot centre and the actual North direction you set. These broad bands explain the traditional preference behind the live score.</p>
            </div>
            <div className={styles.tableWrap}>
              <table>
                <caption>Traditional Vastu preference by borewell direction</caption>
                <thead><tr><th>Plot zone</th><th>Vastu preference</th><th>Planner guidance</th></tr></thead>
                <tbody>{directionRows.map(([zone, preference, guidance]) => <tr key={zone}><th scope="row">{zone}</th><td>{preference}</td><td>{guidance}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="how-it-works-title">
            <div className={styles.sectionHeading}>
              <span>TRANSPARENT METHOD</span>
              <h2 id="how-it-works-title">How the borewell Vastu calculator works</h2>
            </div>
            <div className={styles.methodGrid}>
              <div><b>01</b><h3>Add your plot</h3><p>Choose a basic plot shape or upload a plan as a visual guide, then adjust the boundary.</p></div>
              <div><b>02</b><h3>Align North</h3><p>Match the compass to the actual North shown on your plan or site reference.</p></div>
              <div><b>03</b><h3>Confirm the centre</h3><p>The centre becomes the reference point for calculating direction, angle and distance.</p></div>
              <div><b>04</b><h3>Compare locations</h3><p>Move the marker to compare Vastu scores and identify the preferred North-East band.</p></div>
            </div>
            <p className={styles.methodNote}><strong>No AI guesswork:</strong> the result uses a consistent directional scoring system based on traditional Vastu preferences. It is a planning reference, not a geological or engineering result.</p>
          </section>

          <section className={styles.section} aria-labelledby="before-drilling-title">
            <div className={styles.sectionHeading}>
              <span>PRACTICAL CHECKS</span>
              <h2 id="before-drilling-title">What to confirm before drilling a borewell</h2>
            </div>
            <ul className={styles.checkList}>
              <li><b>Groundwater availability</b><span>Ask a qualified groundwater professional or experienced local driller to assess likely water-bearing points.</span></li>
              <li><b>Water safety</b><span>Maintain the required clearance from septic tanks, soak pits, drains and other contamination sources.</span></li>
              <li><b>Permissions and setbacks</b><span>Check local groundwater, municipal and plot-boundary requirements before drilling.</span></li>
              <li><b>Construction access</b><span>Confirm drilling-rig access, structural clearance, maintenance space and safe capping.</span></li>
            </ul>
          </section>

          <section className={styles.section} aria-labelledby="borewell-faq-title">
            <div className={styles.sectionHeading}>
              <span>COMMON QUESTIONS</span>
              <h2 id="borewell-faq-title">Borewell Vastu FAQs</h2>
            </div>
            <div className={styles.faqList}>{faqItems.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
          </section>

          <nav className={styles.related} aria-label="Related Vastu resources">
            <span>Continue your planning</span>
            <div><Link href="/check-vastu-online">Check complete home Vastu</Link><Link href="/upload-floor-plan-vastu-check">Upload a floor plan</Link><Link href="/vastu">Explore Vastu guidance</Link></div>
          </nav>
        </div>
      </article>
    </>
  );
}
