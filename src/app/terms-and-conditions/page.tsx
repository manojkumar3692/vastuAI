// src/app/terms-and-conditions/page.tsx

export default function TermsPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-300">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            By using VastuCheck.in and purchasing a VastuCheck report, you agree to the
            following terms and conditions.
          </p>
  
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm sm:text-[15px] text-slate-200">
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Nature of service
              </h2>
              <p className="mt-1">
                VastuCheck provides a{" "}
                <span className="font-semibold">
                  digital Vastu guidance report
                </span>{" "}
                based on the floor plan and details you submit. It combines traditional
                Vastu principles with an AI-powered explanation.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                No guaranteed outcomes
              </h2>
              <p className="mt-1">
                The report is{" "}
                <span className="font-semibold">
                  not a promise or guarantee
                </span>{" "}
                of specific results in health, wealth, relationships or any other
                personal outcomes. Vastu is a traditional belief system and individual
                results can vary.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Do not take critical decisions based only on this
              </h2>
              <p className="mt-1">
                Please{" "}
                <span className="font-semibold">
                  do not take major financial, legal, medical or life decisions
                  solely based on this VastuCheck report
                </span>
                . It is generated using traditional Vastu concepts and general
                information available on the internet, combined with AI. Always consult
                appropriate professionals (doctors, lawyers, financial advisors, etc.)
                before making critical decisions.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Accuracy of information provided by you
              </h2>
              <p className="mt-1">
                The quality of the report depends on the accuracy of the floor plan and
                details you upload. VastuCheck cannot be held responsible for any
                incorrect analysis caused by inaccurate or incomplete information
                provided by you.
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Digital product
              </h2>
              <p className="mt-1">
                The VastuCheck report is a{" "}
                <span className="font-semibold">digital good</span> delivered as a PDF
                (and/or on-screen summary). Once generated and delivered, it is
                considered consumed.
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