// src/app/terms-and-conditions/page.tsx

export default function TermsPage() {
    const year = new Date().getFullYear();
  
    return (
      <main className="min-h-screen bg-[#fdf4e6] text-[#2b1b10]">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-4 pb-10 pt-10 sm:px-6 lg:px-8">
          {/* Page heading */}
          <header className="mb-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-[#b5832b]">
              VastuCheck • Terms
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-[#2b1b10] sm:text-3xl">
              Terms &amp; Conditions
            </h1>
            <p className="mt-2 text-sm text-[#6d5741] sm:text-[15px]">
              By using{" "}
              <span className="font-semibold text-[#8a5b16]">
                VastuCheck.in
              </span>{" "}
              and purchasing a VastuCheck report, you agree to the terms and
              conditions listed on this page.
            </p>
  
            {/* Trust tag */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e4f5ea] px-3 py-1 text-[11px] text-[#14532d] ring-1 ring-emerald-200">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Digital Vastu guidance • AI-assisted explanations</span>
            </div>
          </header>
  
          {/* Content card */}
          <div className="mt-5 space-y-5 rounded-3xl border border-amber-200 bg-white/95 p-5 text-sm text-[#3f3a34] shadow-sm shadow-amber-100/70 sm:p-6 sm:text-[15px]">
            {/* Nature of service */}
            <section>
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                1. Nature of service
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                VastuCheck provides a{" "}
                <span className="font-semibold text-[#2b1b10]">
                  digital Vastu guidance report
                </span>{" "}
                based on the floor plan and details you submit. The report follows{" "}
                <span className="font-semibold">
                  traditional Vastu principles
                </span>{" "}
                and uses an{" "}
                <span className="font-semibold">AI-assisted writing engine</span>{" "}
                to structure explanations and remedies in simple language.
              </p>
            </section>
  
            {/* No guaranteed outcomes */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                2. No guaranteed outcomes
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                The VastuCheck report is{" "}
                <span className="font-semibold">
                  not a promise or guarantee
                </span>{" "}
                of specific results in health, wealth, relationships, career, or
                any other personal outcomes. Vastu is a{" "}
                <span className="font-semibold">
                  traditional, belief-based system
                </span>
                , and individual experiences can vary from person to person.
              </p>
            </section>
  
            {/* Critical decisions */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                3. Do not take critical decisions based only on this report
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                You{" "}
                <span className="font-semibold">
                  should not take major financial, legal, medical, or life
                  decisions solely based on the VastuCheck report
                </span>
                . The report is prepared using traditional Vastu guidelines and
                general knowledge, explained with AI assistance. For any critical
                matter, you must consult qualified professionals such as doctors,
                lawyers, chartered accountants, financial advisors, or other
                licensed experts.
              </p>
            </section>
  
            {/* Accuracy of information */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                4. Accuracy of information you provide
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                The quality and relevance of the report depend heavily on the{" "}
                <span className="font-semibold">accuracy</span> of the floor plan,
                directions, and details you submit. VastuCheck{" "}
                <span className="font-semibold">
                  cannot be held responsible
                </span>{" "}
                for any incorrect analysis or recommendations that arise due to:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] text-[#5a4a36] sm:text-[14px]">
                <li>Distorted or unclear floor plan images</li>
                <li>Wrong orientation or North direction provided</li>
                <li>Incomplete or misleading room details</li>
                <li>Changes made to the property after the report is generated</li>
              </ul>
            </section>
  
            {/* Digital product */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                5. Digital product & consumption
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                The VastuCheck report is a{" "}
                <span className="font-semibold">digital product</span> delivered
                as a PDF file (and/or on-screen summary). Once the report is
                generated and made available to you, it is treated as{" "}
                <span className="font-semibold">consumed</span>, even if you
                choose not to download or read it immediately.
              </p>
            </section>
  
            {/* Limited liability */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                6. Limitation of liability
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                To the maximum extent permitted by law, VastuCheck and its owners
                shall{" "}
                <span className="font-semibold">
                  not be liable for any direct, indirect, incidental, or
                  consequential loss
                </span>{" "}
                arising out of the use of this report, including decisions taken
                by you based on the guidance provided.
              </p>
            </section>
  
            {/* Changes to terms */}
            <section className="border-t border-dashed border-amber-100 pt-4">
              <h2 className="text-sm font-semibold text-[#8a5b16] sm:text-[15px]">
                7. Updates to these terms
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#5a4a36] sm:text-[14px]">
                These terms and conditions may be{" "}
                <span className="font-semibold">updated from time to time</span>{" "}
                as the service evolves. The latest version will always be
                available on this page. Your continued use of VastuCheck.in after
                any changes indicates your acceptance of the updated terms.
              </p>
            </section>
  
            {/* Small note */}
            <section className="rounded-2xl bg-[#fff7ea] px-4 py-3 text-[12px] text-[#7a4b12] sm:text-[13px]">
              <p className="font-semibold">Important reminder</p>
              <p className="mt-1">
                VastuCheck is intended as a{" "}
                <span className="font-semibold">
                  supportive, spiritual–cultural guidance tool
                </span>
                . Please use it with faith, but also with practical wisdom and
                professional advice wherever required.
              </p>
            </section>
          </div>
  
          {/* Footer */}
          <footer className="mt-8 border-t border-amber-100 pt-4 text-[11px] text-[#8b7357] sm:text-[12px]">
            © {year} VastuCheck.in • Terms &amp; Conditions
          </footer>
        </div>
      </main>
    );
  }