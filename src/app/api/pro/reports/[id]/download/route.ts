import { NextResponse } from "next/server";
import { getProAccount } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const account = await getProAccount();
  if (!account) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { id } = await context.params;
  const supabase = getSupabaseAdmin();
  const { data: report } = await supabase
    .from("vastu_reports")
    .select("storage_path, status")
    .eq("id", id)
    .eq("account_id", account.id)
    .maybeSingle();
  if (!report || report.status !== "ready" || !report.storage_path) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }
  const { data, error } = await supabase.storage.from("vastu-reports").download(report.storage_path);
  if (error || !data) return NextResponse.json({ error: "Download unavailable." }, { status: 500 });
  return new Response(await data.arrayBuffer(), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="vastu-report.pdf"',
      "Cache-Control": "private, no-store",
    },
  });
}

