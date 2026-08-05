// src/app/api/generate-report/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { VastuSummary } from "@/lib/vastuRules";
import { buildVastuReportPdf } from "@/lib/reportPdf";

export const runtime = "nodejs";
// The AI report-writing call + PDF assembly can take well past a short
// default serverless timeout, especially for layouts with many rooms —
// without this the function gets killed mid-generation and the user just
// sees a failure after a long wait. Mirrors the same fix on detect-rooms.
export const maxDuration = 60;

type RoomPointPayload = { id: string; x: number; y: number };

type GenerateReportPayload = {
  customerName?: string;
  customerCity?: string;
  summary: VastuSummary;
  planImageDataUrl?: string;
  roomPoints?: RoomPointPayload[];
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateReportPayload;
    const { customerName, customerCity, summary, planImageDataUrl, roomPoints } =
      body || {};

    if (!summary || !Array.isArray(summary.rooms)) {
      return NextResponse.json(
        { error: "Invalid payload: summary missing" },
        { status: 400 },
      );
    }

    const bytes = await buildVastuReportPdf(summary, customerName, customerCity, {
      planImageDataUrl,
      roomPoints,
    });

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
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Failed to generate report",
        // Only leak the real cause outside production — this was previously
        // swallowed entirely, so a bad OpenAI key/model, a malformed
        // request body, etc. all looked identical from the browser and had
        // to be chased down in server logs.
        ...(process.env.NODE_ENV !== "production" ? { detail: message } : {}),
      },
      { status: 500 },
    );
  }
}