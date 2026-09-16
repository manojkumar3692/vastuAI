"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Account = { name: string; phone: string; email: string; credits: number; status: string };
type Report = { id: string; title: string; status: string; created_at: string };

export default function MyReportsPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/pro/me", { cache: "no-store" })
      .then(async res => {
        if (!res.ok) return;
        const json = await res.json();
        setAccount(json.account);
        setReports(json.reports || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    try { await fetch("/api/pro/logout", { method: "POST" }); }
    finally { window.location.href = "/vastu-pro"; }
  };

  if (loading) return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4 text-[#735b43]">
      <div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-2 border-amber-700 border-t-transparent" /><p className="mt-4 text-sm font-semibold">Opening your reports…</p></div>
    </main>
  );

  if (!account) return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbf7ef] px-4 text-[#2b1b10]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_5%,rgba(245,158,11,.2),transparent_38%)]" />
      <section className="relative w-full max-w-md rounded-[28px] border border-amber-200 bg-white p-6 text-center shadow-xl sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-emerald-200 text-xl">ॐ</span>
        <h1 className="mt-5 font-serif text-3xl font-bold">Your reports are private</h1>
        <p className="mt-3 text-sm leading-6 text-[#735b43]">Sign in with your registered mobile number and 6-digit PIN to view your credits and PDFs.</p>
        <Link href="/vastu-pro" className="mt-6 block rounded-xl bg-[#2b1b10] px-4 py-3.5 font-bold text-white">Sign in to VastuCheck Pro</Link>
        <Link href="/" className="mt-4 inline-block text-sm font-semibold text-amber-800">Back to home</Link>
      </section>
    </main>
  );

  const usedCredits = Math.min(10, reports.length);
  const balanceWidth = Math.min(100, Math.max(4, account.credits * 10));

  return (
    <main className="min-h-screen bg-[#fbf7ef] text-[#2b1b10]">
      <div className="border-b border-amber-200 bg-white/80 backdrop-blur">
        <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2" aria-label="VastuCheck home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-emerald-200 font-semibold text-amber-900">ॐ</span>
            <span className="hidden text-sm font-bold tracking-[.14em] text-amber-900 min-[360px]:inline">VASTUCHECK.IN</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/vastu-pro" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">Buy credits</Link>
            <button onClick={logout} disabled={loggingOut} className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-bold text-rose-700 disabled:opacity-50">{loggingOut ? "Leaving…" : "Logout"}</button>
          </div>
        </header>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">My VastuCheck Pro</p><h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Hello, {account.name}</h1><p className="mt-1 text-sm text-[#80684f]">Your credits and completed Vastu reports, in one place.</p></div>
          <p className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs text-[#80684f]">Signed in · {account.phone.replace("+91", "+91 ")}</p>
        </div>

        <section className="relative mt-7 overflow-hidden rounded-[28px] bg-[#2b1b10] p-5 text-amber-50 shadow-xl sm:p-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">Report balance</p>
              <div className="mt-2 flex items-end gap-2"><span className="text-6xl font-extrabold leading-none">{account.credits}</span><span className="pb-1 text-sm text-amber-100/75">credits available</span></div>
              <div className="mt-5 max-w-md"><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400" style={{ width: `${balanceWidth}%` }} /></div><div className="mt-2 flex justify-between text-[11px] text-amber-100/60"><span>{reports.length} completed report{reports.length === 1 ? "" : "s"}</span><span>{usedCredits}/10 recent plan usage</span></div></div>
            </div>
            <Link href={account.credits > 0 ? "/vastu?pro=1" : "/vastu-pro"} className="flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 font-extrabold text-[#2b1b10] shadow-lg transition hover:bg-amber-300 md:w-auto">
              {account.credits > 0 ? "Use 1 credit →" : "Get 10 credits →"}
            </Link>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-3"><div><h2 className="font-serif text-2xl font-bold">Your completed reports</h2><p className="mt-1 text-xs text-[#80684f]">Download a saved PDF again without using another credit.</p></div>{reports.length > 0 && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">{reports.length} total</span>}</div>

          {reports.length === 0 ? (
            <div className="mt-5 rounded-[28px] border border-dashed border-amber-300 bg-white px-5 py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-2xl">⌂</span>
              <h3 className="mt-4 text-lg font-bold">Your first report will appear here</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#735b43]">Upload a clear floor plan, complete the Vastu check and use one credit to create your downloadable PDF.</p>
              <Link href={account.credits > 0 ? "/vastu?pro=1" : "/vastu-pro"} className="mt-5 inline-flex rounded-xl bg-[#2b1b10] px-5 py-3 font-bold text-white">{account.credits > 0 ? "Check my first floor plan" : "Buy report credits"}</Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {reports.map((report, index) => (
                <article key={report.id} className="group rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:border-amber-300 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-800">PDF</span>
                    <div className="min-w-0 flex-1"><p className="truncate font-bold">{report.title || `Vastu report ${reports.length - index}`}</p><p className="mt-1 text-xs text-[#8b7357]">Created {new Date(report.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p><span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Ready to download</span></div>
                  </div>
                  <a href={`/api/pro/reports/${report.id}/download`} className="mt-4 flex w-full items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-800">Download PDF <span className="ml-2" aria-hidden="true">↓</span></a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          {[['1','Upload plan','Start a Vastu check with a clear floor plan.'],['2','Use a credit','One new completed report uses one credit.'],['3','Keep the PDF','Come back and download it again anytime.']].map(([n,title,copy]) => <div key={n} className="flex gap-3 rounded-2xl border border-amber-100 bg-white p-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-900">{n}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-[#80684f]">{copy}</p></div></div>)}
        </section>

        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-amber-200 py-5 text-xs text-[#80684f]"><span>VastuCheck Pro · Private account</span><div className="flex gap-4"><Link href="/contact">Get help</Link><Link href="/privacy-policy">Privacy</Link></div></footer>
      </div>
    </main>
  );
}
