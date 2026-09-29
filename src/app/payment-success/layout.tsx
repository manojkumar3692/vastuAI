import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function PaymentSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
