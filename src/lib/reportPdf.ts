// src/lib/reportPdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { VastuSummary } from "./vastuRules";
import type { RoomType } from "@/types/vastu";
import { getStaticTemplateForRoom } from "./templates";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

type AiRoomReport = {
  id: string;
  roomName: string;
  type: string;
  direction: string;
  verdict: string;
  explanation: string;
  nonStructuralRemedies: string;
  structuralGuidance: string;
  quickTips: string[];
};

type AiOverallSummary = {
  title: string;
  summaryParagraph: string;
  keyHighlights: string[];
  cautionPoints: string[];
};

type AiReport = {
  overallSummary: AiOverallSummary;
  rooms: AiRoomReport[];
  globalTips: string[];
};

type BuildPdfOptions = {
  customerName?: string;
  customerCity?: string;
};

/* -------------------------------------------------------------------------- */
/*                               PUBLIC ENTRY                                 */
/* -------------------------------------------------------------------------- */

/**
 * Main entry – called from /api/generate-report
 * Uses Hybrid (templates + AI) to create a rich multi-page PDF.
 */
export async function buildVastuReportPdf(
  summary: VastuSummary,
  customerName?: string,
  customerCity?: string,
): Promise<Uint8Array> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const aiReport = await buildAiReport(summary, { customerName, customerCity });
  return await buildPdfFromAi(summary, aiReport, { customerName, customerCity });
}

/* -------------------------------------------------------------------------- */
/*                             AI REPORT GENERATION                           */
/* -------------------------------------------------------------------------- */

async function buildAiReport(
  summary: VastuSummary,
  opts: BuildPdfOptions,
): Promise<AiReport> {
  const enrichedRooms = summary.rooms.map((room) => {
    const staticTemplate = getStaticTemplateForRoom(room.type as RoomType);
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

  const payload = {
    customerName: opts.customerName || null,
    customerCity: opts.customerCity || null,
    overallScore: summary.score,
    overallVerdict: summary.verdict,
    rooms: enrichedRooms,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a senior Vastu consultant. You receive JSON with a home's Vastu summary and static templates. " +
            "Return a structured JSON report with room-wise explanations and simple, practical remedies. " +
            "Avoid suggesting demolition or major reconstruction by default; prefer non-structural fixes.",
        },
        {
          role: "system",
          content:
            "Output must be valid JSON with this shape: " +
            "{ overallSummary: { title, summaryParagraph, keyHighlights[], cautionPoints[] }, " +
            "rooms: [{ id, roomName, type, direction, verdict, explanation, nonStructuralRemedies, structuralGuidance, quickTips[] }], " +
            "globalTips: string[] }.",
        },
        {
          role: "user",
          content: JSON.stringify(payload, null, 2),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error("[buildAiReport] OpenAI error:", response.status, errText);
    throw new Error("AI report generation failed");
  }

  const json = await response.json();
  const raw =
    json.choices?.[0]?.message?.content ??
    json.choices?.[0]?.message?.tool_calls?.[0]?.arguments;

  if (!raw) {
    throw new Error("Empty AI response");
  }

  let report: AiReport;
  try {
    report = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (e) {
    console.error("[buildAiReport] Failed to parse AI JSON:", e, raw);
    throw new Error("AI response was not valid JSON");
  }

  return report;
}

/* -------------------------------------------------------------------------- */
/*                               PDF GENERATION                               */
/* -------------------------------------------------------------------------- */

async function buildPdfFromAi(
  summary: VastuSummary,
  ai: AiReport,
  opts: BuildPdfOptions,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Theme colours – soft, premium, trust
  const pageBg = rgb(0.99, 0.98, 0.96);      // off-white
  const ink = rgb(0.12, 0.14, 0.18);         // main text
  const subtle = rgb(0.45, 0.47, 0.50);      // muted text
  const accent = rgb(0.79, 0.65, 0.34);      // gold-ish accent
  const lineColor = rgb(0.85, 0.85, 0.85);   // separators
  const scoreGreen = rgb(0.15, 0.55, 0.30);  // score colour

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();

  // paint background
  page.drawRectangle({ x: 0, y: 0, width, height, color: pageBg });

  const marginX = 50;
  const marginTop = height - 60;
  const marginBottom = 50;
  let cursorY = marginTop;

  const newPage = (title?: string) => {
    page = pdfDoc.addPage();
    ({ width, height } = page.getSize());
    page.drawRectangle({ x: 0, y: 0, width, height, color: pageBg });
    cursorY = height - 60;
    if (title) {
      page.drawText(title, {
        x: marginX,
        y: cursorY,
        size: 14,
        font: fontBold,
        color: ink,
      });
      cursorY -= 24;
      drawDivider();
    }
  };

  const ensureSpace = (needed: number, titleIfNew?: string) => {
    if (cursorY - needed < marginBottom) {
      newPage(titleIfNew);
    }
  };

  const drawDivider = () => {
    page.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: width - marginX, y: cursorY },
      thickness: 0.5,
      color: lineColor,
    });
    cursorY -= 10;
  };

  const drawWrappedText = (
    text: string,
    opts: {
      x?: number;
      maxWidth?: number;
      size?: number;
      lineHeight?: number;
      color?: ReturnType<typeof rgb>;
      bold?: boolean;
      titleIfNewPage?: string;
    } = {},
  ) => {
    const {
      x = marginX,
      maxWidth = width - marginX * 2,
      size = 11,
      lineHeight = 14,
      color = ink,
      bold = false,
      titleIfNewPage,
    } = opts;

    const font = bold ? fontBold : fontRegular;
    const words = text.split(/\s+/);
    let line = "";

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, size);
      if (testWidth > maxWidth && line) {
        ensureSpace(lineHeight + 2, titleIfNewPage);
        page.drawText(line, {
          x,
          y: cursorY - lineHeight,
          size,
          font,
          color,
        });
        cursorY -= lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }

    if (line) {
      ensureSpace(lineHeight + 2, titleIfNewPage);
      page.drawText(line, {
        x,
        y: cursorY - lineHeight,
        size,
        font,
        color,
      });
      cursorY -= lineHeight;
    }
  };

  const drawSectionHeading = (label: string) => {
    ensureSpace(26);
    page.drawText(label, {
      x: marginX,
      y: cursorY - 14,
      size: 13,
      font: fontBold,
      color: ink,
    });
    cursorY -= 22;
    drawDivider();
  };

  /* ------------------------------- PAGE 1 ---------------------------------- */
  // Title band
  const title = ai.overallSummary.title || "Vastu Layout Analysis Report";

  page.drawText(title, {
    x: marginX,
    y: cursorY - 20,
    size: 22,
    font: fontBold,
    color: ink,
  });

  cursorY -= 32;

  // Prepared for + city (subheading)
  const preparedFor = opts.customerName ? opts.customerName : "Client";
  const preparedLine = opts.customerCity
    ? `${preparedFor}, ${opts.customerCity}`
    : preparedFor;

  drawWrappedText(`Prepared for: ${preparedLine}`, {
    size: 11,
    color: subtle,
  });

  cursorY -= 6;

  // Score pill on the right
  const scoreText = `${summary.score}/100`;
  const scoreLabel = "Overall Vastu Score";

  const scoreBoxWidth = 150;
  const scoreBoxHeight = 46;
  const scoreBoxX = width - marginX - scoreBoxWidth;
  const scoreBoxY = cursorY + 6;

  page.drawRectangle({
    x: scoreBoxX,
    y: scoreBoxY,
    width: scoreBoxWidth,
    height: scoreBoxHeight,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: scoreBoxX,
    y: scoreBoxY,
    width: scoreBoxWidth,
    height: scoreBoxHeight,
    borderColor: lineColor,
    borderWidth: 0.8,
  });

  // green bar
  page.drawRectangle({
    x: scoreBoxX,
    y: scoreBoxY + scoreBoxHeight - 10,
    width: scoreBoxWidth,
    height: 10,
    color: scoreGreen,
  });

  page.drawText(scoreLabel, {
    x: scoreBoxX + 10,
    y: scoreBoxY + 22,
    size: 9,
    font: fontRegular,
    color: subtle,
  });

  page.drawText(scoreText, {
    x: scoreBoxX + 10,
    y: scoreBoxY + 10,
    size: 14,
    font: fontBold,
    color: scoreGreen,
  });

  cursorY -= 14;

  // Overall summary paragraph
  const overallSummaryText =
    ai.overallSummary.summaryParagraph || summary.verdict;
  cursorY -= 8;

  drawWrappedText(overallSummaryText, {
    size: 11,
    color: ink,
  });

  cursorY -= 8;

  drawWrappedText(
    "This analysis is based on room placement, directions and classical Vastu priorities. The focus is on achievable, non-demolition corrections suitable for modern apartments and villas.",
    {
      size: 9,
      color: subtle,
    },
  );

  cursorY -= 14;

  // Key Strengths
  drawSectionHeading("Key Strengths of this Layout");

  if (ai.overallSummary.keyHighlights?.length) {
    ai.overallSummary.keyHighlights.forEach((item) => {
      drawWrappedText(`• ${item}`, { size: 11 });
    });
  } else {
    drawWrappedText("• Some zones are well aligned and support stable living.", {
      size: 11,
    });
  }

  cursorY -= 10;

  // Caution Points
  drawSectionHeading("Caution & Priority Fixes");

  if (ai.overallSummary.cautionPoints?.length) {
    ai.overallSummary.cautionPoints.forEach((item) => {
      drawWrappedText(`• ${item}`, {
        size: 11,
        color: rgb(0.55, 0.30, 0.05),
      });
    });
  } else {
    drawWrappedText(
      "• A few rooms may need lighter corrective measures (colours, layout changes, usage discipline).",
      { size: 11, color: rgb(0.55, 0.30, 0.05) },
    );
  }

  cursorY -= 10;

  drawWrappedText(
    "Note: This first page is a snapshot view. The next pages give room-wise guidance and detailed remedies.",
    { size: 9, color: subtle },
  );

  /* --------------------------- ROOM-WISE PAGES ---------------------------- */

  newPage("Room-wise Vastu Guidance");

  ai.rooms.forEach((room) => {
    const header = `${room.roomName || room.type} · ${
      room.direction
    } · ${room.verdict}`;

    // approximate space needed; if low, create new page
    ensureSpace(120, "Room-wise Vastu Guidance (contd.)");

    // Room header bar
    page.drawRectangle({
      x: marginX,
      y: cursorY - 18,
      width: width - marginX * 2,
      height: 22,
      color: rgb(1, 1, 1),
    });
    page.drawRectangle({
      x: marginX,
      y: cursorY - 18,
      width: width - marginX * 2,
      height: 22,
      borderColor: lineColor,
      borderWidth: 0.6,
    });

    page.drawText(header, {
      x: marginX + 8,
      y: cursorY - 14,
      size: 11,
      font: fontBold,
      color: ink,
    });

    cursorY -= 32;

    // Explanation
    drawWrappedText(room.explanation, {
      size: 11,
    });

    cursorY -= 4;
    drawWrappedText("Non-structural remedies:", {
      size: 11,
      bold: true,
    });
    drawWrappedText(room.nonStructuralRemedies, {
      size: 11,
    });

    cursorY -= 4;
    drawWrappedText("If renovating / planning fresh:", {
      size: 11,
      bold: true,
    });
    drawWrappedText(room.structuralGuidance, {
      size: 11,
    });

    if (room.quickTips?.length) {
      cursorY -= 4;
      drawWrappedText("Quick tips:", {
        size: 11,
        bold: true,
      });
      room.quickTips.forEach((tip) => {
        drawWrappedText(`• ${tip}`, { size: 11 });
      });
    }

    cursorY -= 8;
    drawDivider();
  });

  /* --------------------------- GLOBAL TIPS PAGE --------------------------- */

  newPage("Lifestyle & Global Vastu Tips");

  const tips =
    ai.globalTips && ai.globalTips.length
      ? ai.globalTips
      : [
          "Keep the North and North-East zones light, open and clutter-free.",
          "Regular natural ventilation and light are as important as direction corrections.",
          "Maintain very high cleanliness in toilets and keep doors closed when not in use.",
          "Review this report every 6–12 months and update small habits gradually.",
        ];

  tips.forEach((tip) => {
    drawWrappedText(`• ${tip}`, { size: 11 });
  });

  cursorY -= 16;
  drawDivider();

  drawWrappedText(
    "Disclaimer: Vastu is a traditional system of spatial harmony. This report is designed for guidance and lifestyle tuning, not as a medical, legal or financial prescription.",
    { size: 8.5, color: subtle },
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}