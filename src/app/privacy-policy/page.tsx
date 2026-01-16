// src/app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-12 pt-10 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#b5832b]">
              VastuCheck • Policies
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2b1b10] sm:text-3xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-[#6d5741] sm:text-[15px]">
              How VastuCheck.in handles and protects your data when you upload a floor
              plan and generate a Vastu report.
            </p>
          </header>
  
          {/* Body Card */}
          <div className="mt-6 space-y-5 rounded-3xl border border-amber-200 bg-white/95 p-5 text-sm text-[#3f3a34] shadow-sm shadow-amber-100/70 sm:p-6 sm:text-[15px]">
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Information We Collect
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5a4a36]">
                <li>Name, email and (optional) phone number shared during checkout.</li>
                <li>Floor plans and tags used to generate your VastuCheck report.</li>
                <li>
                  Basic technical information such as browser, IP, device and usage patterns
                  to improve performance and reliability.
                </li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                How We Use Your Information
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5a4a36]">
                <li>Generate, personalise and deliver your VastuCheck report.</li>
                <li>Respond to support queries and notify you about your order.</li>
                <li>
                  Analyse anonymised usage patterns to improve accuracy, logic and UI.
                </li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Data Sharing
              </h2>
              <p className="mt-1 text-[#5a4a36]">
                We do not sell or rent your personal data. Limited information may be
                shared only with trusted partners necessary to provide the service:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5a4a36]">
                <li>
                  Secure payment processors (e.g., PhonePe) for payment and receipt
                </li>
                <li>
                  AI service providers used to generate room-wise explanations
                </li>
                <li>
                  Backend storage to let you re-download your report temporarily
                </li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Data Retention
              </h2>
              <p className="mt-1 text-[#5a4a36]">
                Uploaded plans and reports may be stored securely for a limited duration to
                support:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5a4a36]">
                <li>Re-downloads</li>
                <li>Bug resolution</li>
                <li>Product improvements</li>
              </ul>
  
              <p className="mt-2 text-[#5a4a36]">
                To request deletion, email{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="font-semibold text-emerald-700 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>
                .
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Your Control & Rights
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[#5a4a36]">
                <li>Request deletion of stored data</li>
                <li>Update your contact information</li>
                <li>Withdraw future communications</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                Contact
              </h2>
              <p className="mt-1 text-[#5a4a36]">
                For any privacy or data protection questions, write to{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="font-semibold text-emerald-700 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
  
          {/* Footer */}
          <footer className="mt-10 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
            © {year} VastuCheck.in • All rights reserved
          </footer>
        </div>
      </main>
    );
  }