"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import ProAccountControls from "@/components/vastu/ProAccountControls";
import { vastuProFaqs } from "@/lib/vastuProContent";

type Account = { name: string; phone: string; email: string; credits: number; status: string };

const RAZORPAY_PRO_BUTTON_ID = "pl_Tcc8NVF7hRYK6a";
const benefits = [
  ["10", "complete PDF reports"],
  ["₹79.90", "effective cost per report"],
  ["Anytime", "free re-downloads"],
] as const;

export default function VastuProPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [mode, setMode] = useState<"register" | "login">("register");
  const [checkoutReady, setCheckoutReady] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", pin: "", confirmPin: "" });
  const paymentForm = useRef<HTMLFormElement>(null);
  const accessCard = useRef<HTMLElement>(null);
  const buttonId = process.env.NEXT_PUBLIC_RAZORPAY_PRO_BUTTON_ID || RAZORPAY_PRO_BUTTON_ID;

  const loadAccount = async () => {
    const res = await fetch("/api/pro/me", { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      setAccount(json.account);
      if (json.account) setMode("login");
    }
  };

  useEffect(() => { loadAccount(); }, []);

  useEffect(() => {
    const target = accessCard.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowMobileCta(!entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!checkoutReady || !paymentForm.current || !buttonId) return;
    const target = paymentForm.current;
    target.innerHTML = "";
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.async = true;
    script.setAttribute("data-payment_button_id", buttonId);
    if (account?.phone) script.setAttribute("data-prefill.contact", account.phone);
    if (account?.email) script.setAttribute("data-prefill.email", account.email);
    target.appendChild(script);
    return () => { target.innerHTML = ""; };
  }, [checkoutReady, buttonId, account]);

  const scrollToAccess = () => accessCard.current?.scrollIntoView({ behavior: "smooth", block: "center" });

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage("");
    if (mode === "register" && form.pin !== form.confirmPin) {
      setMessage("PIN and confirmation do not match.");
      return;
    }
    setBusy(true);
    try {
      const endpoint = mode === "register" ? "/api/pro/register" : "/api/pro/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage(json.error || "Please try again.");
        if (json.existing) setMode("login");
        return;
      }
      await loadAccount();
      if (mode === "login") window.location.href = "/my-reports";
      else {
        sessionStorage.setItem("vastu_pro_credits_before_payment", "0");
        setCheckoutReady(true);
        setMessage("Account created. Now complete the secure Razorpay payment.");
      }
    } finally {
      setBusy(false);
    }
  };

  const prepareExistingPurchase = async () => {
    setBusy(true);
    const res = await fetch("/api/pro/prepare-purchase", { method: "POST" });
    setBusy(false);
    if (res.ok) {
      sessionStorage.setItem("vastu_pro_credits_before_payment", String(account?.credits ?? 0));
      setCheckoutReady(true);
    }
    else setMessage("Please sign in again before purchasing.");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf7ef] pb-20 text-[#2b1b10] sm:pb-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_12%_10%,rgba(245,158,11,.22),transparent_32%),radial-gradient(circle_at_88%_5%,rgba(16,185,129,.16),transparent_28%)]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:py-10 lg:px-8">
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2" aria-label="VastuCheck home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-emerald-200 font-semibold text-amber-900 shadow-sm">ॐ</span>
            <span className="text-sm font-bold tracking-[.14em] text-amber-900">VASTUCHECK.IN</span>
          </Link>
          <ProAccountControls tone="light" />
        </header>

        <section className="grid gap-8 pb-12 pt-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12 lg:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> VastuCheck Pro · Save ₹191
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Check more floor plans. <span className="text-amber-700">Choose with clarity.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#705942] sm:text-lg">
              Get <strong className="text-[#2b1b10]">10 complete online Vastu reports for ₹799</strong>. Built for families comparing homes and professionals reviewing several layouts.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-2 sm:max-w-xl sm:gap-3">
              {benefits.map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-amber-200/80 bg-white/85 p-3 shadow-sm sm:p-4">
                  <p className="text-lg font-extrabold text-amber-800 sm:text-2xl">{value}</p>
                  <p className="mt-1 text-[10px] leading-4 text-[#80684f] sm:text-xs">{label}</p>
                </div>
              ))}
            </div>
            <button onClick={scrollToAccess} className="mt-7 w-full rounded-2xl bg-[#2b1b10] px-6 py-4 text-base font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#432b19] sm:w-auto">
              Get 10 reports for ₹799 <span aria-hidden="true">→</span>
            </button>
            <p className="mt-3 flex items-center gap-2 text-xs text-[#80684f]"><span className="text-emerald-700">●</span> Secure Razorpay checkout · Credits added after confirmation</p>
          </div>

          <section ref={accessCard} id="get-pro" className="scroll-mt-5 rounded-[28px] border border-amber-200 bg-white p-5 shadow-[0_24px_70px_rgba(91,61,29,.15)] sm:p-7">
            {account && !checkoutReady ? (
              <div>
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Signed in</span>
                <h2 className="mt-4 text-2xl font-bold">Welcome back, {account.name}</h2>
                <div className="mt-4 rounded-2xl bg-[#fbf7ef] p-4">
                  <p className="text-xs uppercase tracking-[.15em] text-[#8b7357]">Available now</p>
                  <p className="mt-1 text-3xl font-extrabold">{account.credits} <span className="text-sm font-medium text-[#735b43]">report credits</span></p>
                </div>
                <button onClick={prepareExistingPurchase} disabled={busy} className="mt-5 w-full rounded-xl bg-amber-600 px-4 py-3.5 font-bold text-white transition hover:bg-amber-700 disabled:opacity-50">
                  {busy ? "Preparing secure checkout…" : "Buy 10 more credits — ₹799"}
                </button>
                <Link href="/my-reports" className="mt-3 block rounded-xl border border-amber-200 px-4 py-3 text-center text-sm font-semibold text-amber-800">Open My Reports</Link>
              </div>
            ) : checkoutReady ? (
              <div aria-live="polite">
                <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">Final step</span>
                <h2 className="mt-4 text-2xl font-bold">Complete secure payment</h2>
                <p className="mt-2 text-sm leading-6 text-[#735b43]">Pay ₹799 through Razorpay. Use <strong>the same mobile number</strong> as your VastuCheck account so the 10 credits can be matched automatically.</p>
                <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm">
                  <div className="flex justify-between"><span>10 Vastu report credits</span><strong>₹799</strong></div>
                  <div className="mt-2 flex justify-between border-t border-amber-200 pt-2 text-xs text-[#735b43]"><span>Digital delivery</span><span>₹0</span></div>
                </div>
                {message && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
                {buttonId ? <form ref={paymentForm} className="mt-5 flex min-h-14 justify-center" /> : (
                  <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">The Pro payment button is not configured yet.</div>
                )}
                <Link href="/pro/payment-status" className="mt-4 block text-center text-sm font-semibold text-amber-800 underline underline-offset-4">Already paid? Check payment status</Link>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-amber-700">Your private Pro access</p>
                <h2 className="mt-2 text-2xl font-bold">{mode === "register" ? "Create your account" : "Welcome back"}</h2>
                <p className="mt-2 text-sm leading-6 text-[#735b43]">{mode === "register" ? "No OTP or app needed. Your mobile number and a private 6-digit PIN keep your reports together." : "Enter your registered mobile number and PIN to open your reports."}</p>
                <div className="my-5 grid grid-cols-2 rounded-xl bg-amber-50 p-1 text-sm" role="tablist" aria-label="Account access">
                  <button type="button" onClick={() => { setMode("register"); setMessage(""); }} className={`rounded-lg px-3 py-2.5 font-semibold ${mode === "register" ? "bg-white text-amber-900 shadow-sm" : "text-[#80684f]"}`}>New customer</button>
                  <button type="button" onClick={() => { setMode("login"); setMessage(""); }} className={`rounded-lg px-3 py-2.5 font-semibold ${mode === "login" ? "bg-white text-amber-900 shadow-sm" : "text-[#80684f]"}`}>Sign in</button>
                </div>
                <form onSubmit={submit} className="space-y-3">
                  {mode === "register" && <>
                    <label className="block"><span className="mb-1.5 block text-xs font-semibold">Full name</span><input required autoComplete="name" placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label>
                    <label className="block"><span className="mb-1.5 block text-xs font-semibold">Email</span><input required type="email" autoComplete="email" placeholder="For account recovery" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label>
                  </>}
                  <label className="block"><span className="mb-1.5 block text-xs font-semibold">Mobile number</span><input required inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-base outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label>
                  <label className="block"><span className="mb-1.5 block text-xs font-semibold">6-digit PIN</span><input required type="password" inputMode="numeric" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={6} maxLength={6} placeholder="••••••" value={form.pin} onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })} className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-base tracking-[.35em] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label>
                  {mode === "register" && <label className="block"><span className="mb-1.5 block text-xs font-semibold">Confirm PIN</span><input required type="password" inputMode="numeric" autoComplete="new-password" minLength={6} maxLength={6} placeholder="••••••" value={form.confirmPin} onChange={e => setForm({ ...form, confirmPin: e.target.value.replace(/\D/g, "") })} className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-3 text-base tracking-[.35em] outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100" /></label>}
                  {message && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">{message}</p>}
                  <button disabled={busy} className="w-full rounded-xl bg-[#2b1b10] px-4 py-3.5 font-bold text-white transition hover:bg-[#432b19] disabled:opacity-50">{busy ? "Please wait…" : mode === "register" ? "Create account & continue" : "Open My Reports"}</button>
                </form>
                <p className="mt-3 text-center text-[11px] leading-4 text-[#8b7357]">Keep your PIN private. We will never ask for it during Razorpay payment.</p>
              </div>
            )}
          </section>
        </section>

        <section className="border-y border-amber-200 py-8">
          <p className="text-center text-xs font-bold uppercase tracking-[.2em] text-[#8b7357]">Made for people checking more than one plan</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[["🏠","Home buyers","Compare shortlisted flats or villas before booking."],["✏️","Architects","Review alternate layouts with a clear report."],["🛋️","Interior designers","Plan rooms, usage and practical remedies."],["📋","Property professionals","Keep multiple client reports organised."]].map(([icon,title,copy]) => <article key={title} className="rounded-2xl border border-amber-100 bg-white p-4"><span className="text-xl">{icon}</span><h2 className="mt-3 font-bold">{title}</h2><p className="mt-1 text-sm leading-5 text-[#735b43]">{copy}</p></article>)}
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">Simple from start to finish</p><h2 className="mt-3 font-serif text-3xl font-bold">How the 10-report plan works</h2></div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[["1","Create Pro access","Register once with your mobile number and a private 6-digit PIN."],["2","Pay securely","Complete the ₹799 payment through the official Razorpay checkout."],["3","Use reports anytime","Upload a plan, use one credit and find every completed PDF in My Reports."]].map(([number,title,copy]) => <article key={number} className="relative rounded-3xl border border-amber-200 bg-white p-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 font-bold text-white">{number}</span><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#735b43]">{copy}</p></article>)}
          </div>
        </section>

        <section className="rounded-[28px] bg-[#2b1b10] px-5 py-8 text-amber-50 sm:px-8 sm:py-10">
          <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr] md:gap-10">
            <div><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-300">What stays included</p><h2 className="mt-3 font-serif text-3xl font-bold">Every report is complete.</h2><p className="mt-3 text-sm leading-6 text-amber-100/75">The Pro plan changes the price per report—not the quality or detail of your Vastu analysis.</p></div>
            <ul className="grid gap-3 text-sm sm:grid-cols-2">
              {["Overall Vastu score and verdict","Room-by-room direction analysis","Priority issues clearly highlighted","Practical non-demolition remedies","Secure report history","Free PDF re-downloads","Credit returned if generation fails","Works on mobile and desktop"].map(item => <li key={item} className="flex gap-2 rounded-xl bg-white/7 p-3"><span className="text-emerald-300">✓</span><span>{item}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-3xl py-12 sm:py-16">
          <div className="text-center"><p className="text-xs font-bold uppercase tracking-[.2em] text-amber-700">Questions answered</p><h2 className="mt-3 font-serif text-3xl font-bold">VastuCheck Pro FAQ</h2></div>
          <div className="mt-7 space-y-3">
            {vastuProFaqs.map(({ question, answer }) => <details key={question} className="group rounded-2xl border border-amber-200 bg-white px-4 py-4 open:shadow-sm"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold"><span>{question}</span><span className="text-xl text-amber-700 transition group-open:rotate-45">+</span></summary><p className="mt-3 pr-6 text-sm leading-6 text-[#735b43]">{answer}</p></details>)}
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-100 to-emerald-50 px-5 py-8 text-center sm:px-8">
          <h2 className="font-serif text-3xl font-bold">Ready to compare your floor plans?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#735b43]">Create one simple account, get 10 report credits and keep every completed Vastu PDF organised.</p>
          <button onClick={scrollToAccess} className="mt-5 rounded-xl bg-[#2b1b10] px-6 py-3.5 font-bold text-white">Get VastuCheck Pro — ₹799</button>
        </section>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200 pt-5 text-xs text-[#80684f]">
          <Link href="/">← Back to VastuCheck.in</Link><div className="flex gap-4"><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms</Link><Link href="/contact">Support</Link></div>
        </footer>
      </div>

      <div className={`fixed inset-x-0 bottom-0 z-30 border-t border-amber-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(43,27,16,.12)] backdrop-blur transition-transform sm:hidden ${showMobileCta ? "translate-y-0" : "translate-y-full"}`}>
        <button onClick={scrollToAccess} className="w-full rounded-xl bg-[#2b1b10] px-4 py-3.5 font-bold text-white">Get 10 reports for ₹799</button>
      </div>
    </main>
  );
}
