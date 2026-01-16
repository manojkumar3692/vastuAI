// src/app/cancellations-and-refunds/page.tsx

export default function CancellationsRefundsPage() {
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
              Cancellations &amp; Refunds
            </h1>
            <p className="mt-2 text-sm text-[#6d5741] sm:text-[15px]">
              Please read this{" "}
              <span className="font-semibold text-[#8a5b16]">
                cancellations &amp; refunds policy
              </span>{" "}
              carefully before placing an order for a VastuCheck report.
            </p>
  
            {/* Soft notice tag */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff7ea] px-3 py-1 text-[11px] text-[#7a4b12] ring-1 ring-amber-200">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Digital Vastu guidance report • No physical shipping</span>
            </div>
          </header>
  
          {/* Content card */}
          <div className="mt-5 space-y-5 rounded-3xl border border-amber-200 bg-white/95 p-5 text-sm text-[#3f3a34] shadow-sm shadow-amber-100/70 sm:p-6 sm:text-[15px]">
            {/* Digital product – strict policy */}
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                1. Digital product – no cancellation / no replacement
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                VastuCheck reports are{" "}
                <span className="font-semibold text-[#2b1b10]">
                  personalised digital products
                </span>{" "}
                generated specifically for the{" "}
                <span className="font-semibold">floor plan and details</span> you
                submit. Once payment is completed and the report generation has
                started:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#5a4a36] sm:text-[14px]">
                <li>No cancellation of the order</li>
                <li>No refund of the amount paid</li>
                <li>No replacement of the report</li>
              </ul>
              <p className="mt-2 text-[12px] text-[#7a4b12] sm:text-[13px]">
                This is because the system begins processing and generating your
                one-time, layout-specific report immediately after payment.
              </p>
            </section>
  
            {/* When we may support */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                2. When we may consider support
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                In{" "}
                <span className="font-semibold">
                  rare and genuine technical failure cases
                </span>{" "}
                (for example, you have successfully paid but:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#5a4a36] sm:text-[14px]">
                <li>You are not able to view or download any report, and</li>
                <li>
                  Our team is unable to resolve the issue after checking from our
                  side,
                </li>
              </ul>
              <p className="mt-2 text-[13px] text-[#5a4a36] sm:text-[14px]">
                you can write to us at{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="font-semibold text-emerald-700 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>{" "}
                with your{" "}
                <span className="font-semibold">
                  transaction ID, email ID and date/time of purchase
                </span>
                . We will review each such case{" "}
                <span className="font-semibold">individually</span> and may offer
                a resolution at our discretion.
              </p>
              <p className="mt-2 text-[12px] text-[#7a4b12] sm:text-[13px]">
                Please note: this is{" "}
                <span className="font-semibold">
                  not a general refund policy
                </span>{" "}
                and applies only to clear technical issues from our side.
              </p>
            </section>
  
            {/* Change of mind */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                3. Change of mind or expectations
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                The following are{" "}
                <span className="font-semibold">
                  not valid reasons for refund or cancellation
                </span>
                :
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#5a4a36] sm:text-[14px]">
                <li>Change of mind after placing the order</li>
                <li>
                  Disagreement with the Vastu suggestions or remedies given in
                  the report
                </li>
                <li>
                  Expectation of a particular type of{" "}
                  <span className="font-semibold">outcome or result</span> in your
                  life after applying the guidance
                </li>
                <li>
                  Buying the report only to “see how it looks” and then requesting
                  a refund
                </li>
              </ul>
              <p className="mt-2 text-[12px] text-[#7a4b12] sm:text-[13px]">
                VastuCheck is a{" "}
                <span className="font-semibold">
                  guidance and awareness tool
                </span>
                , not a guarantee of any specific life event.
              </p>
            </section>
  
            {/* Contact note */}
            <section className="rounded-2xl bg-[#e4f5ea] px-4 py-3 text-[12px] text-[#14532d] sm:text-[13px]">
              <p className="font-semibold">Need help with a transaction?</p>
              <p className="mt-1">
                If you face a genuine technical problem with access to your
                report, please contact us with complete details. Our goal is to
                make sure you receive the{" "}
                <span className="font-semibold">
                  VastuCheck report you have paid for
                </span>
                .
              </p>
            </section>
          </div>
  
          {/* Footer */}
          <footer className="mt-8 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
            © {year} VastuCheck.in • Cancellations &amp; Refunds Policy
          </footer>
        </div>
      </main>
    );
  }