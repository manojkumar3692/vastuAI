import { NextRequest, NextResponse } from "next/server";
import { createProSession, normalizeIndianPhone, setProSessionCookie, validatePin, verifyPin } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
const MAX_AUTH_REQUEST_BYTES = 16_384;

export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") || 0) > MAX_AUTH_REQUEST_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }
  try {
    let body: Record<string, unknown>;
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    const phone = normalizeIndianPhone(String(body?.phone || ""));
    const pin = String(body?.pin || "");
    if (!phone || !validatePin(pin)) {
      return NextResponse.json({ error: "Invalid mobile number or PIN." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: account } = await supabase
      .from("vastu_accounts")
      .select("id, pin_hash, failed_login_count, locked_until, status")
      .eq("phone", phone)
      .maybeSingle();

    const locked = account?.locked_until && new Date(account.locked_until).getTime() > Date.now();
    if (!account || account.status === "disabled" || locked || !verifyPin(pin, account.pin_hash)) {
      if (account && !locked) {
        const failures = Number(account.failed_login_count || 0) + 1;
        await supabase
          .from("vastu_accounts")
          .update({
            failed_login_count: failures,
            locked_until: failures >= 5 ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
          })
          .eq("id", account.id);
      }
      return NextResponse.json(
        { error: locked ? "Too many attempts. Try again in 15 minutes." : "Invalid mobile number or PIN." },
        { status: 401 },
      );
    }

    await supabase
      .from("vastu_accounts")
      .update({ failed_login_count: 0, locked_until: null })
      .eq("id", account.id);
    const token = await createProSession(account.id);
    await setProSessionCookie(token);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("pro login error", error);
    return NextResponse.json({ error: "Could not sign in. Please try again." }, { status: 500 });
  }
}
