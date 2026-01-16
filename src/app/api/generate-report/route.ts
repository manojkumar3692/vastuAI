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

    // ✅ Always normalize to Uint8Array
    const uint8 =
      bytes instanceof Uint8Array
        ? bytes
        : new Uint8Array(bytes as ArrayBufferLike);

    // ✅ Get a clean ArrayBuffer (no SharedArrayBuffer in the type)
    const pdfArrayBuffer = uint8.buffer.slice(
      uint8.byteOffset,
      uint8.byteOffset + uint8.byteLength,
    ) as ArrayBuffer;

    // ✅ Use native Response, cast body as any to satisfy TS
    return new Response(pdfArrayBuffer as any, {
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