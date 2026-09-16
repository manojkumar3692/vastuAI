import { NextRequest, NextResponse } from "next/server";
import type { VastuSummary } from "@/lib/vastuRules";
import { buildVastuReportPdf } from "@/lib/reportPdf";
import { getProAccount } from "@/lib/proAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  customerName?: string;
  customerCity?: string;
  summary: VastuSummary;
  planImageDataUrl?: string;
  roomPoints?: { id: string; x: number; y: number }[];
};

export async function POST(req: NextRequest) {
  const account = await getProAccount();
  if (!account) return NextResponse.json({ error: "Sign in to use a report credit." }, { status: 401 });

  let reportId: string | null = null;
  try {
    const body = (await req.json()) as Body;
    if (!body?.summary || !Array.isArray(body.summary.rooms)) {
      return NextResponse.json({ error: "Invalid report data." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const title = `${body.customerName?.trim() || "Client"} — Vastu report`;
    const { data: reservation, error: reserveError } = await supabase.rpc("reserve_vastu_report", {
      p_account_id: account.id,
      p_title: title,
    });
    if (reserveError || !reservation?.[0]?.report_id) {
      const noCredits = reserveError?.message?.includes("NO_CREDITS");
      return NextResponse.json(
        { error: noCredits ? "You have no report credits remaining." : "Could not reserve a report credit." },
        { status: noCredits ? 402 : 500 },
      );
    }
    reportId = reservation[0].report_id;

    const bytes = await buildVastuReportPdf(body.summary, body.customerName, body.customerCity, {
      planImageDataUrl: body.planImageDataUrl,
      roomPoints: body.roomPoints,
    });
    const uint8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes as ArrayBufferLike);
    const storagePath = `${account.id}/${reportId}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from("vastu-reports")
      .upload(storagePath, uint8, { contentType: "application/pdf", upsert: false });
    if (uploadError) throw new Error(`PDF storage failed: ${uploadError.message}`);

    const { error: updateError } = await supabase
      .from("vastu_reports")
      .update({ status: "ready", storage_path: storagePath, completed_at: new Date().toISOString() })
      .eq("id", reportId)
      .eq("account_id", account.id);
    if (updateError) throw new Error(`Report finalization failed: ${updateError.message}`);

    const buffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength) as ArrayBuffer;
    return new Response(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="vastu-report.pdf"',
        "X-Vastu-Report-Id": reportId!,
      },
    });
  } catch (error) {
    console.error("pro report generation error", error);
    if (reportId) {
      await getSupabaseAdmin().rpc("fail_vastu_report", {
        p_report_id: reportId,
        p_error: error instanceof Error ? error.message : "Unknown report error",
      });
    }
    return NextResponse.json(
      { error: "The report could not be generated. Your credit has been returned." },
      { status: 500 },
    );
  }
}
