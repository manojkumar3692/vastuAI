// src/app/contact/page.tsx

export default function ContactPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-300">
            Contact Us
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Have a question about your VastuCheck report or payment? You can reach us
            directly using the details below.
          </p>
  
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm sm:text-base text-slate-200">
            <div>
              <h2 className="text-sm font-semibold text-emerald-200">
                Email Support
              </h2>
              <p className="mt-1">
                Write to us at{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="text-emerald-300 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>{" "}
                for any support related to:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
                <li>Questions about how the tool works</li>
                <li>Issues with PDF download or payment</li>
                <li>Clarification related to your existing VastuCheck report</li>
              </ul>
            </div>
  
            <div className="border-t border-slate-800 pt-4 text-[12px] sm:text-[13px] text-slate-400">
              <p>
                Response time: We usually respond within 1–2 business days. This is a
                digital guidance tool and we currently do not offer on-site visits.
              </p>
            </div>
          </div>
  
          <footer className="mt-8 border-t border-slate-900/80 pt-4 text-[11px] sm:text-[12px] text-slate-500">
            © {year} VastuCheck.in
          </footer>
        </div>
      </main>
    );
  }