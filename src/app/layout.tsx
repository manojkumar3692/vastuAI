// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vastucheck.in"),
  title: {
    default: "VastuCheck.in – Online Vastu Check by Floor Plan",
    template: "%s | VastuCheck.in",
  },
  description:
    "Upload your floor plan and get a traditional Vastu report with room-wise verdicts, score and practical remedies. Works for flats & villas.",
  alternates: { canonical: "https://vastucheck.in" },
  openGraph: {
    title: "VastuCheck.in – Online Vastu Check by Floor Plan",
    description:
      "Traditional Vastu rules + tech-enabled floor plan reading. Get room-wise verdicts and remedies in minutes.",
    url: "https://vastucheck.in",
    siteName: "VastuCheck.in",
    type: "website",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/om.png",
    apple: "/om.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-slate-950 text-slate-100`}
      >
        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "v4mwpd9r5u");
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}