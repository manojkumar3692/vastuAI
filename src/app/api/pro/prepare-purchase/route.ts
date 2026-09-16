import { NextResponse } from "next/server";
import { getProAccount } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST() {
  const account = await getProAccount();
  if (!account) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { error } = await getSupabaseAdmin()
    .from("vastu_accounts")
    .update({ checkout_pending_until: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() })
    .eq("id", account.id);
  if (error) return NextResponse.json({ error: "Could not prepare checkout." }, { status: 500 });
  return NextResponse.json({ success: true, phone: account.phone, email: account.email });
}

