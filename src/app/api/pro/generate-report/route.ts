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

const MAX_REQUEST_BYTES = 8_000_000;
const MAX_PLAN_DATA_URL_LENGTH = 6_500_000;
const MAX_ROOMS = 64;

function boundedString(value: unknown, max: number) {
  return typeof value === "string" && value.length <= max;
}

function validateReportBody(body: Body): string | null {
  if (!body?.summary || !Array.isArray(body.summary.rooms)) return "Invalid report data.";
  if (!Number.isFinite(body.summary.score) || body.summary.score < 0 || body.summary.score > 100) {
    return "Invalid Vastu score.";
  }
  if (!boundedString(body.summary.verdict, 120)) return "Invalid report verdict.";
  if (body.summary.rooms.length < 1 || body.summary.rooms.length > MAX_ROOMS) {
    return `A report can contain between 1 and ${MAX_ROOMS} rooms.`;
  }
  for (const room of body.summary.rooms) {
    if (
      !room ||
      !boundedString(room.id, 120) ||
      !boundedString(room.name, 120) ||
      !boundedString(room.type, 80) ||
      !boundedString(room.direction, 8) ||
      !boundedString(room.verdict, 40) ||
      !boundedString(room.notes, 1_000) ||
      !Number.isFinite(room.scoreImpact) ||
      Math.abs(room.scoreImpact) > 100
    ) return "Invalid room data.";
  }
  if (body.customerName !== undefined && !boundedString(body.customerName, 100)) return "Customer name is too long.";
  if (body.customerCity !== undefined && !boundedString(body.customerCity, 100)) return "Customer city is too long.";
  if (body.planImageDataUrl !== undefined) {
    if (
      !boundedString(body.planImageDataUrl, MAX_PLAN_DATA_URL_LENGTH) ||
      !/^data:image\/(png|jpe?g);base64,/i.test(body.planImageDataUrl)
    ) return "Invalid or oversized floor-plan image.";
  }
  if (body.roomPoints !== undefined) {
    if (!Array.isArray(body.roomPoints) || body.roomPoints.length > MAX_ROOMS) return "Invalid room markers.";
    for (const point of body.roomPoints) {
      if (
        !point ||
        !boundedString(point.id, 120) ||
        !Number.isFinite(point.x) ||
        !Number.isFinite(point.y) ||
        point.x < 0 || point.x > 1 || point.y < 0 || point.y > 1
      ) return "Invalid room marker coordinates.";
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const account = await getProAccount();
  if (!account) return NextResponse.json({ error: "Sign in to use a report credit." }, { status: 401 });

  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Report request is too large." }, { status: 413 });
  }

  let reportId: string | null = null;
  try {
    const body = (await req.json()) as Body;
    const validationError = validateReportBody(body);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

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
