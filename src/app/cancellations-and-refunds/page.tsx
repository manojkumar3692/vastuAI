// src/app/cancellations-and-refunds/page.tsx

export default function CancellationsRefundsPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-300">
            Cancellations & Refunds
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Please read this policy carefully before placing an order for a
            VastuCheck report.
          </p>
  
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm sm:text-[15px] text-slate-200">
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Digital product – no cancellation / no replacement
              </h2>
              <p className="mt-1">
                VastuCheck reports are{" "}
                <span className="font-semibold">digital products</span> generated
                specifically for your floor plan.{" "}
                <span className="font-semibold">
                  Once payment is completed and the report generation has started,
                  there is no cancellation, no refund and no replacement.
                </span>
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                When we may consider support
              </h2>
              <p className="mt-1">
                In rare cases where there is a{" "}
                <span className="font-semibold">
                  clear technical issue on our side
                </span>{" "}
                (for example, you paid but did not receive any report and we are unable
                to resolve it), you can email{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="text-emerald-300 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>{" "}
                and we will review on a case-by-case basis. This is not a general refund
                policy and is only for genuine technical failures.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Change of mind
              </h2>
              <p className="mt-1">
                Change of mind, disagreement with Vastu suggestions, or expectation of a
                particular outcome are{" "}
                <span className="font-semibold">not valid reasons</span> for refund or
                cancellation.
              </p>
            </section>
          </div>
  
          <footer className="mt-8 border-t border-slate-900/80 pt-4 text-[11px] sm:text-[12px] text-slate-500">
            © {year} VastuCheck.in
          </footer>
        </div>
      </main>
    );
  }