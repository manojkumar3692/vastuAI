import { NextRequest, NextResponse } from "next/server";
import { createProSession, hashPin, normalizeIndianPhone, setProSessionCookie, validatePin } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  try {
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();
    const phone = normalizeIndianPhone(String(body?.phone || ""));
    const pin = String(body?.pin || "");

    if (name.length < 2 || name.length > 80) {
      return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 160) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Enter a valid 10-digit Indian mobile number." }, { status: 400 });
    }
    if (!validatePin(pin)) {
      return NextResponse.json({ error: "Your PIN must contain exactly 6 digits." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: existing } = await supabase
      .from("vastu_accounts")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "This mobile number already has an account. Sign in to buy more credits.", existing: true },
        { status: 409 },
      );
    }

    const { data: account, error } = await supabase
      .from("vastu_accounts")
      .insert({
        name,
        email,
        phone,
        pin_hash: hashPin(pin),
        status: "pending",
        checkout_pending_until: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();
    if (error || !account) throw new Error(error?.message || "Could not create account");

    const token = await createProSession(account.id);
    await setProSessionCookie(token);
    return NextResponse.json({ success: true, phone });
  } catch (error) {
    console.error("pro register error", error);
    if (
      error instanceof Error &&
      error.message.includes("Supabase server environment is not configured")
    ) {
      return NextResponse.json(
        {
          error:
            "Supabase is not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY, then restart the server.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: "Could not create your account. Please try again." }, { status: 500 });
  }
}
