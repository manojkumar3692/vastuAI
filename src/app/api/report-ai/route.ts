// src/app/api/report-ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import type { VastuSummary } from "@/lib/vastuRules";
import { getStaticTemplateForRoom } from "@/lib/templates";
import type { RoomType } from "@/types/vastu";

export const runtime = "nodejs";
// Optional: avoid caching this route on Vercel
// export const dynamic = "force-dynamic";

type ReportAiPayload = {
  customerName?: string;
  customerCity?: string;
  summary: VastuSummary;
};

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn(
    "[report-ai] OPENAI_API_KEY is not set – /api/report-ai will fail until configured.",
  );
}

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 },
      );
    }

    const body = (await req.json()) as ReportAiPayload;
    const { customerName, customerCity, summary } = body || {};

    if (!summary || !Array.isArray(summary.rooms)) {
      return NextResponse.json(
        { error: "Invalid payload: summary missing" },
        { status: 400 },
      );
    }

    // Enrich each room with static Vastu wisdom
    const enrichedRooms = summary.rooms.map((room) => {
      const staticTemplate = getStaticTemplateForRoom(
        room.type as RoomType,
      );
      return {
        id: room.id,
        name: room.name,
        type: room.type,
        direction: room.direction,
        verdict: room.verdict,
        notes: room.notes,
        scoreImpact: room.scoreImpact,
        staticTemplate,
      };
    });

    // User message payload to AI (raw JSON of layout context)
    const userPayload = {
      customerName: customerName || null,
      customerCity: customerCity || null,
      overallScore: summary.score,
      overallVerdict: summary.verdict,
      rooms: enrichedRooms,
    };

    // Call OpenAI in JSON mode
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini", // <-- you can swap model later if needed
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are a senior Vastu consultant. You receive a JSON with a home's Vastu summary and static templates. Return a structured JSON report with room-wise explanations and simple, practical remedies. Avoid suggesting demolition or major reconstruction by default; prefer non-structural fixes.",
            },
            {
              role: "system",
              content:
                "Output must be valid JSON with this shape: { overallSummary: { title: string, summaryParagraph: string, keyHighlights: string[], cautionPoints: string[] }, rooms: [{ id: string, roomName: string, type: string, direction: string, verdict: string, explanation: string, nonStructuralRemedies: string, structuralGuidance: string, quickTips: string[] }], globalTips: string[] }.",
            },
            {
              role: "user",
              content: JSON.stringify(userPayload, null, 2),
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("OpenAI error:", response.status, errText);
      return NextResponse.json(
        { error: "AI report generation failed" },
        { status: 500 },
      );
    }

    const json = await response.json();

    const aiContent =
      json.choices?.[0]?.message?.content ||
      json.choices?.[0]?.message?.tool_calls?.[0]?.arguments ||
      null;

    if (!aiContent) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 },
      );
    }

    let report;
    try {
      report = typeof aiContent === "string" ? JSON.parse(aiContent) : aiContent;
    } catch (e) {
      console.error("Failed to parse AI JSON:", e, aiContent);
      return NextResponse.json(
        { error: "AI response was not valid JSON" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        report,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("report-ai error", err);
    return NextResponse.json(
      { error: "Failed to generate AI report" },
      { status: 500 },
    );
  }
}