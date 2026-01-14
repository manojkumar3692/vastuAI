import { NextRequest, NextResponse } from "next/server";
import type { VastuSummary } from "@/lib/vastuRules";
import { buildVastuReportPdf } from "@/lib/reportPdf";

export const runtime = "nodejs";

type GenerateReportPayload = {
  customerName?: string;
  summary: VastuSummary;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateReportPayload;
    const { customerName, summary } = body || {};

    if (!summary || !Array.isArray(summary.rooms)) {
      return NextResponse.json(
        { error: "Invalid payload: summary missing" },
        { status: 400 }
      );
    }

    const uint8 = await buildVastuReportPdf(summary, customerName);

    return new NextResponse(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="vastu-report.pdf"',
      },
    });
  } catch (err) {
    console.error("generate-report error", err);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}