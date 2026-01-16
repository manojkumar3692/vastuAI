// src/app/shipping-policy/page.tsx

export default function ShippingPolicyPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          {/* Page heading */}
          <header className="mb-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#b5832b]">
              VastuCheck • Policy
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2b1b10] sm:text-3xl">
              Shipping &amp; Delivery Policy
            </h1>
            <p className="mt-2 text-sm text-[#6d5741] sm:text-[15px]">
              VastuCheck reports are{" "}
              <span className="font-semibold text-[#8a5b16]">
                delivered digitally as PDF
              </span>
              . There is no physical product or courier shipping involved.
            </p>
          </header>
  
          {/* Content card */}
          <div className="mt-5 space-y-5 rounded-3xl border border-amber-200 bg-white/95 p-5 text-sm text-[#3f3a34] shadow-sm shadow-amber-100/70 sm:p-6 sm:text-[15px]">
            {/* Digital delivery */}
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                1. Digital delivery only
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                After successful payment and completion of the floor plan steps,
                your VastuCheck report is{" "}
                <span className="font-semibold text-[#2b1b10]">
                  generated as a downloadable PDF
                </span>{" "}
                on the website. In many cases, a copy may also be shared to your
                registered email ID for convenience.
              </p>
            </section>
  
            {/* Delivery time */}
            <section className="border-y border-dashed border-amber-100 py-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                2. Report generation time
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                In normal conditions, the report is usually generated within{" "}
                <span className="font-semibold">a few minutes</span> after you
                submit your layout details and complete payment. During high
                traffic, server maintenance, or network issues, it may take
                slightly longer. If the report is not visible immediately, please
                wait for a short while and refresh the page.
              </p>
            </section>
  
            {/* Non-receipt of report */}
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                3. Non-receipt or download issues
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                If your payment is successful but you are unable to access,
                download, or view your VastuCheck report, please contact us with
                your:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#5a4a36] sm:text-[14px]">
                <li>Full name used while generating the report</li>
                <li>Registered email ID and mobile number</li>
                <li>Payment transaction ID / UPI reference / PhonePe reference</li>
                <li>Approximate date and time of payment</li>
              </ul>
              <p className="mt-2 text-[13px] text-[#5a4a36] sm:text-[14px]">
                You can email us at{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="font-semibold text-[#b05a12] underline underline-offset-2 hover:text-[#8a3f07]"
                >
                  manoj.officialmail@gmail.com
                </a>
                . We will verify your details and help you with a fresh download
                link or a copy of your report, wherever applicable.
              </p>
            </section>
  
            {/* No physical shipment */}
            <section className="rounded-2xl bg-[#fff7ea] px-4 py-3 text-[12px] text-[#7a4b12] sm:text-[13px]">
              <p className="font-semibold">Important note</p>
              <p className="mt-1">
                VastuCheck is a{" "}
                <span className="font-semibold">
                  digital guidance and report service
                </span>
                . We do not ship any physical books, CDs, printed reports, or
                products by courier or post as part of this service.
              </p>
            </section>
          </div>
  
          {/* Footer */}
          <footer className="mt-8 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
            © {year} VastuCheck.in • Digital Vastu report service
          </footer>
        </div>
      </main>
    );
  }