"use client";

export default function VastuCTA({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href="/vastu"
      onClick={() => {
        if (typeof window !== "undefined" && window.fbq) {
          window.fbq("track", "InitiateCheckout");
        }
      }}
      className={className}
    >
      {children}
    </a>
  );
}