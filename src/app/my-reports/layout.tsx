import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Reports",
  robots: { index: false, follow: false },
};

export default function MyReportsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

