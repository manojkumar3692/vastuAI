// src/app/api/generate-report/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { VastuSummary } from "@/lib/vastuRules";
import { buildVastuReportPdf } from "@/lib/reportPdf";

export const runtime = "nodejs";

type GenerateReportPayload = {
  customerName?: string;
  customerCity?: string;
  summary: VastuSummary;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateReportPayload;
    const { customerName, customerCity, summary } = body || {};

    if (!summary || !Array.isArray(summary.rooms)) {
      return NextResponse.json(
        { error: "Invalid payload: summary missing" },
        { status: 400 },
      );
    }

    const bytes = await buildVastuReportPdf(summary, customerName, customerCity);

    return new NextResponse(bytes, {
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
      { status: 500 },
    );
  }
}