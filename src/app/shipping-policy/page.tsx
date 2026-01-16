// src/app/shipping-policy/page.tsx

export default function ShippingPolicyPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-300">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            VastuCheck reports are delivered digitally. There is no physical shipping.
          </p>
  
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm sm:text-[15px] text-slate-200">
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Digital delivery
              </h2>
              <p className="mt-1">
                After successful payment, your VastuCheck report is generated and made
                available as a digital PDF for download. In some cases, a copy may also
                be sent to your registered email ID.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Delivery time
              </h2>
              <p className="mt-1">
                In most cases, the report is generated within a few minutes after you
                complete the floor plan tagging and payment steps. During high load or
                maintenance, it may take slightly longer.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Non-receipt of report
              </h2>
              <p className="mt-1">
                If you have completed payment but are unable to access or download your
                report, please email{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="text-emerald-300 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>{" "}
                with your transaction details and registered email.
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