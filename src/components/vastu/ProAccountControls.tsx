"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProAccount = {
  name: string;
  credits: number;
};

type Props = {
  tone?: "light" | "warm";
};

export default function ProAccountControls({ tone = "warm" }: Props) {
  const [account, setAccount] = useState<ProAccount | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/pro/me", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) return;
      const body = await response.json();
      if (body.account) {
        setAccount({
          name: String(body.account.name || "Customer"),
          credits: Number(body.account.credits || 0),
        });
      }
    });
  }, []);

  if (!account) return null;

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/pro/logout", { method: "POST" });
    } finally {
      window.location.href = "/vastu-pro";
    }
  };

  const light = tone === "light";
  return (
    <div
      className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-2 py-1.5 text-[10px] shadow-sm sm:gap-2 sm:px-2.5 ${
        light
          ? "border-amber-200 bg-white text-[#5f4630]"
          : "border-amber-300/70 bg-amber-50/90 text-amber-900"
      }`}
      aria-label={`Signed in as ${account.name}`}
    >
      <Link href="/my-reports" className="font-semibold hover:underline">
        <span className="sm:hidden">Reports</span>
        <span className="hidden sm:inline">My Reports</span>
        <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-800">
          {account.credits}
        </span>
      </Link>
      <span className="h-4 w-px bg-amber-200" aria-hidden="true" />
      <button
        type="button"
        onClick={logout}
        disabled={loggingOut}
        className="font-semibold text-rose-700 hover:underline disabled:opacity-50"
      >
        {loggingOut ? "Leaving…" : "Logout"}
      </button>
    </div>
  );
}
