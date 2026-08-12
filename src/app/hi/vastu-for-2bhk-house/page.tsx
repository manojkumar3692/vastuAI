// src/app/hi/vastu-for-2bhk-house/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2BHK घर के लिए वास्तु टिप्स | ऑनलाइन वास्तु चेक और PDF रिपोर्ट",
  description:
    "अपने 2BHK फ्लोर प्लान का वास्तु चेक करें। North और centre सेट करें, कमरे टैग करें और वास्तु स्कोर के साथ room-wise सलाह पाएं। शेयर करने लायक PDF रिपोर्ट डाउनलोड करें।",
  keywords: [
    "2bhk ghar vastu",
    "2bhk flat vastu tips",
    "2bhk makan vastu",
    "vastu shastra 2bhk ghar ke liye",
    "ghar ka vastu check online",
    "2bhk vastu report pdf",
    "vastu for 2bhk in hindi",
    "2bhk vastu tips hindi mein",
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://vastucheck.in/hi/vastu-for-2bhk-house",
    languages: {
      en: "https://vastucheck.in/vastu-for-2bhk-house",
      hi: "https://vastucheck.in/hi/vastu-for-2bhk-house",
      "x-default": "https://vastucheck.in/vastu-for-2bhk-house",
    },
  },
  openGraph: {
    title: "2BHK घर के लिए वास्तु टिप्स | VastuCheck.in",
    description:
      "अपना 2BHK फ्लोर प्लान अपलोड करें और room-wise verdicts, zone mapping व उपाय के साथ AI-सहायता प्राप्त वास्तु रिपोर्ट पाएं।",
    url: "https://vastucheck.in/hi/vastu-for-2bhk-house",
    siteName: "VastuCheck.in",
    type: "website",
    locale: "hi_IN",
    images: ["https://vastucheck.in/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "2BHK घर के लिए वास्तु टिप्स | ऑनलाइन वास्तु चेक",
    description:
      "अपने 2BHK प्लान का वास्तु room-wise verdicts और डाउनलोड करने योग्य PDF रिपोर्ट के साथ चेक करें।",
    images: ["https://vastucheck.in/og-image.png"],
  },
  icons: { icon: "/om.png", apple: "/om.png" },
};

export default function VastuFor2BHKHindiPage() {
  const year = new Date().getFullYear();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "2BHK वास्तु रिपोर्ट में कौन-से कमरे चेक होते हैं?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "2BHK वास्तु रिपोर्ट में मुख्य द्वार, लिविंग एरिया, किचन, मास्टर बेडरूम, दूसरा बेडरूम, टॉयलेट, पूजा स्थान (अगर हो) और ब्रह्मस्थान (सेंटर) को चेक किया जाता है।",
        },
      },
      {
        "@type": "Question",
        name: "क्या यह 2BHK फ्लैट और 2BHK इंडिपेंडेंट हाउस दोनों के लिए काम करता है?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "हाँ। एक साफ 2D फ्लोर प्लान अपलोड करें, सही North दिशा और centre सेट करें, फिर कमरे टैग करें। सिस्टम हर कमरे को NE/SE/SW/NW ज़ोन में मैप करके स्कोर और verdicts देता है।",
        },
      },
      {
        "@type": "Question",
        name: "क्या मैं आर्किटेक्ट से पहले अपना 2BHK प्लान यहाँ चेक कर सकता हूँ?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "हाँ, बल्कि यही सबसे सही समय है। निर्माण या बड़े रेनोवेशन से पहले वास्तु चेक करने से आप शुरुआत में ही कमरों की जगह एडजस्ट कर सकते हैं, जिससे बाद में महंगे बदलावों से बचा जा सकता है।",
        },
      },
      {
        "@type": "Question",
        name: "रिपोर्ट के बाद क्या वास्तु सलाहकार की ज़रूरत पड़ती है?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "बहुत से लोग PDF रिपोर्ट को एक practical guide की तरह इस्तेमाल करते हैं। अगर आपको और गहराई से सलाह चाहिए, तो यह structured PDF किसी वास्तु सलाहकार या आर्किटेक्ट के साथ शेयर करके चर्चा की जा सकती है।",
        },
      },
    ],
  };

  return (
    <main lang="hi" className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* NAV */}
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
                AI-सहायता प्राप्त वास्तु रिपोर्ट • फ्लोर प्लान स्कैनर
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-4 text-xs sm:flex">
            <a href="/" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">
              होम
            </a>
            <a href="/vastu" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">
              VastuCheck शुरू करें
            </a>
            <a
              href="/vastu-for-2bhk-house"
              className="text-[11px] text-[#6b5340] hover:text-[#b65c10]"
            >
              English
            </a>
            <a href="/contact" className="text-[11px] text-[#6b5340] hover:text-[#b65c10]">
              संपर्क करें
            </a>
          </nav>
        </header>

        {/* HERO */}
        <section className="mt-8 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-1.5 text-xs text-[#8b5a1b] shadow-sm shadow-amber-100 sm:text-sm">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span>2BHK वास्तु चेक • Room-wise verdicts • डाउनलोड करने योग्य PDF</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                अपने फ्लोर प्लान से{" "}
                <span className="bg-gradient-to-r from-[#ea580c] via-[#f59e0b] to-[#a16207] bg-clip-text text-transparent">
                  2BHK घर
                </span>{" "}
                का वास्तु चेक करें।
              </h1>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#5a4a36] sm:text-[15px]">
                अपना 2BHK फ्लोर प्लान अपलोड करें, North और centre सेट करें, फिर अपने
                कमरे टैग करें। VastuCheck हर कमरे को NE/SE/SW/NW ज़ोन में मैप करके
                <strong className="font-semibold text-[#b45309]">
                  {" "}
                  वास्तु स्कोर + room-wise verdicts
                </strong>{" "}
                और व्यावहारिक उपाय देता है। यह PDF अपने परिवार या आर्किटेक्ट के साथ
                शेयर करें।
              </p>
              <p className="max-w-xl text-[14px] text-[#5a4a36]">
                अगर आप <strong>2BHK फ्लैट का वास्तु</strong> या{" "}
                <strong>2BHK अपार्टमेंट वास्तु</strong> खोज रहे हैं, तो मुख्य बातें
                हैं — किचन की दिशा, मास्टर बेडरूम की जगह, टॉयलेट का ज़ोन और मुख्य
                द्वार की दिशा। फ्लोर-प्लान आधारित वास्तु चेक, सामान्य टिप्स से कहीं
                ज़्यादा स्पष्ट जवाब देता है, खासकर छोटे 2BHK लेआउट के लिए।
              </p>
            </div>

            <div className="grid gap-4 text-xs text-[#3f3a34] sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  किसके लिए बेहतर
                </p>
                <p className="text-lg font-semibold text-[#166534]">2BHK लेआउट</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  फ्लैट और इंडिपेंडेंट 2BHK घर दोनों के लिए काम करता है।
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-white/95 px-4 py-3 shadow-sm shadow-emerald-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#15803d]/80">
                  दिशा (Facing)
                </p>
                <p className="text-lg font-semibold text-[#15803d]">सभी दिशाएं</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  East / North / West / South facing — सभी सपोर्टेड।
                </p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-white/95 px-4 py-3 shadow-sm shadow-amber-100/70">
                <p className="mb-1 text-[10px] uppercase tracking-[0.18em] text-[#b65c10]/80">
                  आउटपुट
                </p>
                <p className="text-lg font-semibold text-[#b45309]">PDF रिपोर्ट</p>
                <p className="mt-1 text-[12px] text-[#6b5340]">
                  Room-wise verdicts + उपाय जिन पर आप अमल कर सकते हैं।
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="/vastu"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#fb923c] via-[#facc15] to-[#22c55e] px-7 py-3 text-sm font-semibold text-[#2b1b10] shadow-lg shadow-amber-300/50 transition hover:brightness-110 sm:text-base"
              >
                अपना 2BHK प्लान अपलोड करें
                <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2b1b10]/90 text-[11px] text-amber-100 transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#faq"
                className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white/80 px-5 py-2.5 text-xs font-medium text-[#5a4a36] transition hover:border-[#b65c10] hover:text-[#b65c10] sm:text-sm"
              >
                2BHK वास्तु FAQ देखें
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3 text-[11px] text-[#7a5d3a] sm:text-[12px]">
              <span>निर्माण या रेनोवेशन से पहले सबसे उपयोगी</span>
              <span className="h-3 w-px bg-amber-200" />
              <span>डिजिटल ब्लूप्रिंट • शेयर करने योग्य PDF</span>
            </div>
            <p className="text-[12px] text-[#7a5d3a]">
              सबसे ज़्यादा खोजा गया: East-facing, North-facing और अपार्टमेंट
              लेआउट के लिए 2BHK वास्तु।
            </p>
          </div>

          {/* RIGHT CARD */}
          <div className="relative">
            <div className="absolute -right-6 -top-10 h-32 w-32 rounded-full bg-amber-200/50 blur-3xl" />
            <div className="absolute -bottom-10 -left-4 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-[#fffaf3] p-5 shadow-xl shadow-amber-200/70">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#a16207]">
                उदाहरण — 2BHK वास्तु स्नैपशॉट
              </p>

              <div className="mt-3 space-y-2 rounded-2xl border border-amber-100 bg-white/95 p-3 text-[12px] text-[#3f3a34] shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-[#7c5b2e]">कुल वास्तु स्कोर</p>
                    <p className="mt-1 text-xl font-semibold text-[#15803d]">
                      74 / 100
                    </p>
                    <p className="text-[11px] text-[#166534]">
                      मजबूत ज़ोन, कुछ व्यावहारिक सुझाव भी दिए गए हैं।
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-300 bg-[#f0fdf4]">
                    <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#22c55e] via-[#fbbf24] to-[#f97316] opacity-90" />
                  </div>
                </div>

                <ul className="mt-2 space-y-1.5 text-[11px] text-[#5a4a36]">
                  <li>• किचन South-East में — शुभ</li>
                  <li>• मास्टर बेडरूम South-West में — मजबूत</li>
                  <li>• टॉयलेट North-East में — उपाय के साथ फ्लैग किया गया</li>
                  <li>• सेंटर (ब्रह्मस्थान) — खुला व हल्का रखा गया</li>
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[11px] text-[#7c5b2e]">
                <p>अपने असली 2BHK प्लान पर यही चेक 2–3 मिनट में करें।</p>
                <p className="font-medium text-[#166534]">
                  PDF अपने आर्किटेक्ट के साथ शेयर करें।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ / SEO */}
        <section
          id="faq"
          className="mt-10 space-y-6 rounded-3xl border border-amber-200 bg-white/90 px-4 py-6 shadow-sm shadow-amber-100 sm:px-6"
        >
          <div>
            <h2 className="text-base font-semibold sm:text-lg">
              2BHK वास्तु चेक — इस रिपोर्ट में क्या शामिल है
            </h2>
            <p className="mt-2 text-[12px] leading-relaxed text-[#5a4a36] sm:text-[13px]">
              आपके 2BHK प्लान को वास्तु ज़ोन (North, South, East, West और
              NE/SE/SW/NW) में मैप किया जाता है। रिपोर्ट बताती है कि कौन-सी जगह
              शुभ है, किस पर ध्यान देने की ज़रूरत है, और व्यावहारिक उपाय सुझाती
              है — खासकर किचन, बेडरूम, टॉयलेट और सेंटर (ब्रह्मस्थान) के लिए।
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold">आम 2BHK चेक</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• किचन ज़ोन, खासकर South-East उपयुक्तता</li>
                <li>• मास्टर बेडरूम ज़ोन, खासकर South-West प्लेसमेंट</li>
                <li>• टॉयलेट (NE से बचें; अगर मजबूरी हो तो उपाय)</li>
                <li>• मुख्य द्वार का ज़ोन</li>
                <li>• सेंटर (ब्रह्मस्थान) का खुलापन</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">इस्तेमाल का सही समय</h3>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5a4a36] sm:text-[13px]">
                <li>• निर्माण या रेनोवेशन से पहले</li>
                <li>• रीसेल 2BHK खरीदने से पहले</li>
                <li>• इंटीरियर लेआउट फाइनल करने से पहले</li>
                <li>• आर्किटेक्ट/परिवार के साथ सलाह शेयर करने के लिए</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-[#fff7ea] p-4">
            <p className="text-[12px] text-[#5a4a36] sm:text-[13px]">
              अपना प्लान चेक करने के लिए तैयार हैं?{" "}
              <a href="/vastu" className="font-semibold text-[#b45309] underline">
                यहाँ अपना 2BHK फ्लोर प्लान अपलोड करें
              </a>{" "}
              और अपना वास्तु प्रीव्यू + PDF रिपोर्ट पाएं।
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-amber-100 bg-white px-4 py-5">
          <h3 className="text-sm font-semibold text-[#2b1b10]">
            और वास्तु गाइड देखें
          </h3>

          <div className="mt-3 grid gap-2 text-[12px] text-[#5a4a36] sm:grid-cols-2">
            <a href="/vastu-for-flats" className="hover:underline">
              Vastu for flats &amp; apartments (English)
            </a>
            <a href="/vastu-for-3bhk-house" className="hover:underline">
              Vastu for 3BHK house (English)
            </a>
            <a href="/vastu-for-north-facing-house" className="hover:underline">
              North-facing house Vastu (English)
            </a>
            <a href="/vastu-check-for-house-plan" className="hover:underline">
              Vastu check by floor plan (English)
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} VastuCheck.in</span>
            <span className="hidden h-3 w-px bg-amber-200 sm:inline" />
            <span>2BHK घर के लिए वास्तु • AI-सहायता प्राप्त गाइडेंस</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/privacy-policy" className="hover:text-[#b65c10]">
              Privacy
            </a>
            <a href="/terms-and-conditions" className="hover:text-[#b65c10]">
              Terms
            </a>
            <a href="/contact" className="hover:text-[#b65c10]">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
