import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirming Pro Payment",
  robots: { index: false, follow: false, noarchive: true },
};

export default function ProPaymentStatusLayout({ children }: { children: React.ReactNode }) {
  return children;
}
