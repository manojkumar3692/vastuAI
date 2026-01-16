// src/app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-emerald-300">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            This Privacy Policy explains how VastuCheck.in handles information when
            you use our website and purchase a VastuCheck report.
          </p>
  
          <div className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-sm sm:text-[15px] text-slate-200">
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Information we collect
              </h2>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>
                  Basic contact details: name, email and (optionally) phone number
                  shared during checkout or report generation.
                </li>
                <li>
                  Floor plan and layout information you upload to generate your
                  VastuCheck report.
                </li>
                <li>
                  Technical information such as IP address, browser type and basic
                  analytics to understand usage and improve the service.
                </li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                How we use your information
              </h2>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>To generate and deliver your VastuCheck report.</li>
                <li>To communicate with you about your order or support queries.</li>
                <li>To improve our product, scoring logic and user experience.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Data sharing
              </h2>
              <p className="mt-1">
                We do not sell your personal data. Your data may be processed through
                trusted third-party payment gateways and AI providers only for:
              </p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>Payment processing and fraud prevention.</li>
                <li>
                  AI text generation required to prepare a personalised VastuCheck
                  report.
                </li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Data retention
              </h2>
              <p className="mt-1">
                Floor plans and report data may be stored for a limited period to
                allow re-download, improvements and troubleshooting. You can request
                deletion by emailing{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="text-emerald-300 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>
                .
              </p>
            </section>
  
            <section>
              <h2 className="text-sm font-semibold text-emerald-200">
                Contact
              </h2>
              <p className="mt-1">
                For any privacy-related questions, please write to{" "}
                <a
                  href="mailto:manoj.officialmail@gmail.com"
                  className="text-emerald-300 underline underline-offset-2"
                >
                  manoj.officialmail@gmail.com
                </a>
                .
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