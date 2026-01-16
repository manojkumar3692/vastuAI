// src/app/contact/page.tsx

export default function ContactPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          {/* Page Title */}
          <header className="mb-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#b5832b]">
              VastuCheck • Support
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2b1b10] sm:text-3xl">
              Contact Us
            </h1>
            <p className="mt-2 text-sm text-[#6d5741] sm:text-[15px]">
              Have a question about your VastuCheck report, payment, or access?
              Reach us using the details below.
            </p>
  
            {/* Tag */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff7ea] px-3 py-1 text-[11px] text-[#7a4b12] ring-1 ring-amber-200">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>Digital-first support — no physical office visit required</span>
            </div>
          </header>
  
          {/* Content Card */}
          <div className="mt-5 rounded-3xl border border-amber-200 bg-white/95 p-5 text-sm text-[#3f3a34] shadow-sm shadow-amber-100/70 sm:p-6 sm:text-[15px]">
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Email Support
              </h2>
              <p className="mt-1 text-[13px] text-[#5a4a36] sm:text-[14px]">
                Write to us at{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="font-semibold text-emerald-700 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>{" "}
                for:
              </p>
  
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#5a4a36] sm:text-[14px]">
                <li>Help with downloading the PDF report</li>
                <li>Issues or delays after payment</li>
                <li>Questions about VastuCheck features</li>
                <li>Clarification regarding your generated Vastu layout analysis</li>
              </ul>
            </section>
  
            <section className="mt-5 border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Response time
              </h2>
              <p className="mt-1 text-[13px] text-[#5a4a36] sm:text-[14px] leading-relaxed">
                We usually respond within{" "}
                <span className="font-semibold">1–2 business days.</span>  
                VastuCheck is a{" "}
                <span className="font-semibold">digital-guidance platform</span>, and
                at present we do not provide offline visits or personalised phone calls.
              </p>
            </section>
  
            <section className="mt-5 rounded-2xl bg-[#e4f5ea] px-4 py-3 text-[12px] text-[#14532d] sm:text-[13px]">
              <p className="font-semibold">Quick Tip</p>
              <p className="mt-1">
                If you're writing to us about your report, include your name,
                email used for purchase, and transaction ID — this helps us assist
                you faster.
              </p>
            </section>
          </div>
  
          {/* Footer */}
          <footer className="mt-8 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
            © {year} VastuCheck.in • All rights reserved
          </footer>
        </div>
      </main>
    );
  }