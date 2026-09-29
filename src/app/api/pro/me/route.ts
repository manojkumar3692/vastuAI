import { NextResponse } from "next/server";
import { getProAccount } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const account = await getProAccount();
    if (!account) return NextResponse.json({ account: null }, { status: 401 });
    const { data: reports } = await getSupabaseAdmin()
      .from("vastu_reports")
      .select("id, title, status, created_at")
      .eq("account_id", account.id)
      .eq("status", "ready")
      .order("created_at", { ascending: false })
      .limit(50);
    const { data: latestPurchase } = await getSupabaseAdmin()
      .from("vastu_purchases")
      .select("created_at, credits_awarded")
      .eq("account_id", account.id)
      .eq("status", "captured")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return NextResponse.json({
      account,
      reports: reports || [],
      latestPurchase: latestPurchase || null,
    });
  } catch (error) {
    console.error("pro me error", error);
    return NextResponse.json({ error: "Account unavailable" }, { status: 500 });
  }
}
