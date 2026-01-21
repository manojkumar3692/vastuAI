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

type AiExpectationFraming = {
  title: string; // e.g. "What to Expect After Following This Report"
  intro: string; // short paragraph
  beforeAfterBullets: string[]; // 4-6 bullets
  realisticTimelineNote: string; // 1-2 lines
};

type AiTimelineChecklist = {
  title: string; // e.g. "Action Timeline Checklist (30 Days)"
  intro: string;
  day0to2: string[];
  week1: string[];
  week2to4: string[];
  optionalIfRenovating: string[];
  closingTip: string;
};

type AiArchitectNotes = {
  title: string; // e.g. "Architect / Builder Notes (Share This Page)"
  intro: string;
  inputsAssumed: string[];
  highPriorityAreas: string[];
  renovationSuggestions: string[];
  doNotChangeWithoutFeasibility: string[];
  closingNote: string;
};

type AiReport = {
  overallSummary: AiOverallSummary;
  rooms: AiRoomReport[];
  globalTips: string[];

  // ✅ NEW (optional) – HYBRID add-ons
  expectationFraming?: AiExpectationFraming;
  timelineChecklist?: AiTimelineChecklist;
  architectNotes?: AiArchitectNotes;
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
            "Avoid suggesting demolition or major reconstruction by default; prefer non-structural fixes. " +
            "Keep language practical and modern, suitable for Indian flats and villas. " +
            "Do NOT make supernatural guarantees; keep expectations realistic.",
        },
        {
          role: "system",
          content:
            "Output must be valid JSON with this shape: " +
            "{ overallSummary: { title, summaryParagraph, keyHighlights[], cautionPoints[] }, " +
            "rooms: [{ id, roomName, type, direction, verdict, explanation, nonStructuralRemedies, structuralGuidance, quickTips[] }], " +
            "globalTips: string[], " +
            "expectationFraming?: { title, intro, beforeAfterBullets[], realisticTimelineNote }, " +
            "timelineChecklist?: { title, intro, day0to2[], week1[], week2to4[], optionalIfRenovating[], closingTip }, " +
            "architectNotes?: { title, intro, inputsAssumed[], highPriorityAreas[], renovationSuggestions[], doNotChangeWithoutFeasibility[], closingNote } }.",
        },
        {
          role: "system",
          content:
            "For expectationFraming: give 4–6 bullets, realistic, emotionally resonant, no medical claims. " +
            "For timelineChecklist: keep each list 3–6 bullets max, short and actionable. " +
            "For architectNotes: neutral tone for architect/builder; avoid shastra debates; focus on zoning/feasibility. " +
            "If unsure, still include these sections with safe general guidance.",
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

  // THEME – aligned with your site:
  const theme = {
    background: rgb(0.996, 0.976, 0.945), // ivory / off-white
    saffron: rgb(0.86, 0.46, 0.07), // saffron band
    gold: rgb(0.96, 0.76, 0.26), // golden accent
    green: rgb(0.58, 0.77, 0.55), // pastel green
    brown: rgb(0.25, 0.17, 0.11), // main text (deep brown)
    brownMuted: rgb(0.47, 0.39, 0.31), // muted body text
    borderSoft: rgb(0.93, 0.87, 0.77), // light borders
    lineSoft: rgb(0.88, 0.82, 0.73), // separators
  };

  const pageBg = theme.background;
  const ink = theme.brown;
  const subtle = theme.brownMuted;
  const lineColor = theme.lineSoft;
  const scoreGreen = theme.green;

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Optional: floor plan embed (SAFE – only if you later send a URL)
  const planImageUrl =
    (summary as any).planImageUrl || (summary as any).planPreviewImageUrl;

  let embeddedPlanImage: any | undefined;
  if (planImageUrl && typeof planImageUrl === "string") {
    try {
      const imgResp = await fetch(planImageUrl);
      if (imgResp.ok) {
        const imgBytes = await imgResp.arrayBuffer();
        const lower = planImageUrl.toLowerCase();
        if (lower.endsWith(".png")) embeddedPlanImage = await pdfDoc.embedPng(imgBytes);
        else embeddedPlanImage = await pdfDoc.embedJpg(imgBytes);
      }
    } catch (e) {
      console.error("[buildPdfFromAi] Failed to embed plan image:", e);
    }
  }

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();

  // Base background
  page.drawRectangle({ x: 0, y: 0, width, height, color: pageBg });

  // Saffron header band on first page
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: theme.saffron,
  });
  // Thin gold strip
  page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 4,
    color: theme.gold,
  });

  const marginX = 50;
  const marginTop = height - 60;
  const marginBottom = 50;
  let cursorY = marginTop;

  const drawDivider = () => {
    page.drawLine({
      start: { x: marginX, y: cursorY },
      end: { x: width - marginX, y: cursorY },
      thickness: 0.6,
      color: lineColor,
    });
    cursorY -= 10;
  };

  const newPage = (title?: string) => {
    page = pdfDoc.addPage();
    ({ width, height } = page.getSize());
    page.drawRectangle({ x: 0, y: 0, width, height, color: pageBg });

    cursorY = height - 60;

    if (title) {
      page.drawText(title, {
        x: marginX,
        y: cursorY - 14,
        size: 14,
        font: fontBold,
        color: ink,
      });
      cursorY -= 22;
      drawDivider();
    }
  };

  const ensureSpace = (needed: number, titleIfNew?: string) => {
    if (cursorY - needed < marginBottom) newPage(titleIfNew);
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
    const words = (text || "").split(/\s+/).filter(Boolean);
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

  const drawBullets = (
    bullets: string[],
    opts?: { size?: number; color?: ReturnType<typeof rgb> },
  ) => {
    const size = opts?.size ?? 11;
    const color = opts?.color ?? ink;
    (bullets || []).filter(Boolean).forEach((b) => {
      drawWrappedText(`• ${b}`, { size, color });
    });
  };

  /* --------------------- Tiny 3×3 Vastu mandala icon ---------------------- */

  (function drawMandalaIcon() {
    const mandalaSize = 40;
    const cell = mandalaSize / 3;
    const mandalaX = width - marginX - mandalaSize;
    const mandalaY = height - 65; // inside saffron band

    page.drawRectangle({
      x: mandalaX - 2,
      y: mandalaY - mandalaSize - 2,
      width: mandalaSize + 4,
      height: mandalaSize + 4,
      borderColor: rgb(1, 0.98, 0.9),
      borderWidth: 0.8,
      color: rgb(1, 1, 1),
    });

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        let color = rgb(1, 1, 1);

        const isCentre = row === 1 && col === 1;
        const isNE = row === 2 && col === 2;
        const isSE = row === 0 && col === 2;
        const isNW = row === 2 && col === 0;
        const isSW = row === 0 && col === 0;

        if (isCentre) color = theme.background;
        else if (isNE) color = theme.green;
        else if (isSE) color = theme.saffron;
        else if (isNW) color = theme.gold;
        else if (isSW) color = theme.brownMuted;

        page.drawRectangle({
          x: mandalaX + col * cell,
          y: mandalaY - (row + 1) * cell,
          width: cell - 0.6,
          height: cell - 0.6,
          color,
          borderColor: rgb(1, 0.96, 0.85),
          borderWidth: 0.4,
        });
      }
    }
  })();

  /* ------------------------------- PAGE 1 ---------------------------------- */

  const title = ai.overallSummary.title || "Vastu Layout Analysis Report";

  // Title inside saffron band (white)
  page.drawText(title, {
    x: marginX,
    y: cursorY - 20,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  cursorY -= 32;

  const preparedFor = opts.customerName ? opts.customerName : "Client";
  const preparedLine = opts.customerCity ? `${preparedFor}, ${opts.customerCity}` : preparedFor;

  drawWrappedText(`Prepared for: ${preparedLine}`, { size: 11, color: rgb(1, 1, 1) });
  cursorY -= 6;

  // Score box
  const scoreText = `${summary.score}/100`;
  const scoreLabel = "Overall Vastu Score";

  const scoreBoxWidth = 150;
  const scoreBoxHeight = 46;
  const scoreBoxX = width - marginX - scoreBoxWidth;
  const scoreBoxY = cursorY + 6;

  page.drawRectangle({ x: scoreBoxX, y: scoreBoxY, width: scoreBoxWidth, height: scoreBoxHeight, color: rgb(1, 1, 1) });
  page.drawRectangle({ x: scoreBoxX, y: scoreBoxY, width: scoreBoxWidth, height: scoreBoxHeight, borderColor: theme.borderSoft, borderWidth: 0.8 });
  page.drawRectangle({ x: scoreBoxX, y: scoreBoxY + scoreBoxHeight - 9, width: scoreBoxWidth, height: 9, color: scoreGreen });

  page.drawText(scoreLabel, { x: scoreBoxX + 10, y: scoreBoxY + 22, size: 9, font: fontRegular, color: subtle });
  page.drawText(scoreText, { x: scoreBoxX + 10, y: scoreBoxY + 10, size: 14, font: fontBold, color: scoreGreen });

  cursorY -= 14;

  const overallSummaryText = ai.overallSummary.summaryParagraph || summary.verdict;
  cursorY -= 8;

  drawWrappedText(overallSummaryText, { size: 11, color: ink });
  cursorY -= 8;

  drawWrappedText(
    "This analysis is based on room placement, directions and classical Vastu priorities. The focus is on achievable, non-demolition corrections suitable for modern apartments and villas.",
    { size: 9, color: subtle },
  );

  cursorY -= 14;

  drawSectionHeading("Key Strengths of this Layout");
  drawBullets(
    ai.overallSummary.keyHighlights?.length
      ? ai.overallSummary.keyHighlights
      : ["Some zones are well aligned and support stable living."],
    { size: 11, color: ink },
  );

  cursorY -= 10;

  drawSectionHeading("Caution & Priority Fixes");
  drawBullets(
    ai.overallSummary.cautionPoints?.length
      ? ai.overallSummary.cautionPoints
      : ["A few rooms may need lighter corrective measures (colours, layout changes, usage discipline)."],
    { size: 11, color: rgb(0.55, 0.30, 0.05) },
  );

  cursorY -= 10;

  /* ------------------ AI/HYBRID: EXPECTATION FRAMING (NEW) ---------------- */

  const expectationFallback: AiExpectationFraming = {
    title: "What to Expect After Following This Report",
    intro:
      "Most improvements feel strongest when you apply the top 3–5 priority corrections consistently, instead of trying everything in one day.",
    beforeAfterBullets: [
      "Before: restlessness / mental clutter → After: calmer routine and clearer mind",
      "Before: inconsistent sleep → After: more stable sleep cycles over 2–6 weeks",
      "Before: clutter builds up → After: cleaner zones and better daily flow",
      "Before: frequent friction at home → After: more grounded communication and stability",
    ],
    realisticTimelineNote:
      "Realistic timeline: some users feel early relief in 7–14 days; stronger stability usually builds over 2–6 weeks of consistent practice.",
  };

  const exp = ai.expectationFraming || expectationFallback;

  drawSectionHeading(exp.title);
  drawWrappedText(exp.intro, { size: 11, color: subtle });
  cursorY -= 6;
  drawBullets(exp.beforeAfterBullets, { size: 11, color: ink });
  cursorY -= 6;
  drawWrappedText(exp.realisticTimelineNote, { size: 9, color: subtle });

  cursorY -= 10;

  /* -------- Optional floor plan card (only if image is available) --------- */

  if (embeddedPlanImage) {
    const cardWidth = width - marginX * 2;
    const maxImgWidth = cardWidth - 24;
    const maxImgHeight = 150;

    const dims = embeddedPlanImage.scale(1);
    let imgW = dims.width;
    let imgH = dims.height;

    const scale = Math.min(maxImgWidth / imgW, maxImgHeight / imgH, 1);
    imgW *= scale;
    imgH *= scale;

    const cardHeight = imgH + 40;
    ensureSpace(cardHeight + 20);

    const cardY = cursorY - cardHeight;

    page.drawRectangle({
      x: marginX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      color: rgb(1, 1, 1),
      borderColor: theme.borderSoft,
      borderWidth: 0.8,
    });

    page.drawText("Floor plan snapshot (for reference only)", {
      x: marginX + 12,
      y: cardY + cardHeight - 18,
      size: 10,
      font: fontBold,
      color: subtle,
    });

    const imgX = marginX + (cardWidth - imgW) / 2;
    const imgY = cardY + 12;

    embeddedPlanImage.draw(page, { x: imgX, y: imgY, width: imgW, height: imgH });

    cursorY = cardY - 16;
  }

  drawWrappedText(
    "Note: This first page is a snapshot view. The next pages give room-wise guidance and detailed remedies.",
    { size: 9, color: subtle },
  );

  /* --------------------------- ROOM-WISE PAGES ---------------------------- */

  newPage("Room-wise Vastu Guidance");

  ai.rooms.forEach((room) => {
    const header = `${room.roomName || room.type} · ${room.direction} · ${room.verdict}`;

    ensureSpace(120, "Room-wise Vastu Guidance (contd.)");

    page.drawRectangle({
      x: marginX,
      y: cursorY - 18,
      width: width - marginX * 2,
      height: 22,
      color: rgb(1, 1, 1),
      borderColor: theme.borderSoft,
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

    drawWrappedText(room.explanation, { size: 11 });

    cursorY -= 4;
    drawWrappedText("Non-structural remedies:", { size: 11, bold: true });
    drawWrappedText(room.nonStructuralRemedies, { size: 11 });

    cursorY -= 4;
    drawWrappedText("If renovating / planning fresh:", { size: 11, bold: true });
    drawWrappedText(room.structuralGuidance, { size: 11 });

    if (room.quickTips?.length) {
      cursorY -= 4;
      drawWrappedText("Quick tips:", { size: 11, bold: true });
      room.quickTips.forEach((tip) => drawWrappedText(`• ${tip}`, { size: 11 }));
    }

    cursorY -= 8;
    drawDivider();
  });

  /* -------------------- AI/HYBRID: TIMELINE CHECKLIST (NEW) ---------------- */

  const timelineFallback: AiTimelineChecklist = {
    title: "Action Timeline Checklist (30 Days)",
    intro:
      "Use this checklist to apply improvements step-by-step without overwhelm. Start with easy non-structural changes first. Structural suggestions are optional and only if renovating.",
    day0to2: [
      "Declutter North & North-East; keep these zones light and open",
      "Keep toilets dry/clean; keep doors closed when not in use",
      "Improve ventilation and natural light where possible",
      "Move heavy storage away from North / North-East (if present)",
    ],
    week1: [
      "Apply top non-structural remedies listed per room",
      "Correct bed placement and sleeping direction (especially master bedroom)",
      "Adjust lighting/colours in problematic zones (as suggested)",
      "Set simple daily discipline: no clutter piles, fixed storage zones",
    ],
    week2to4: [
      "Recheck priority areas: entrance, kitchen, master bedroom, toilets, centre zone",
      "Add small enhancements where suggested (plants, lamps, zone-balancing items)",
      "Track sleep/mood briefly for 10 minutes a day (simple notes help)",
      "Re-run analysis after major rearrangement or renovation",
    ],
    optionalIfRenovating: [
      "Use room-wise structural guidance as a blueprint for your architect",
      "Discuss feasibility before moving walls/plumbing/staircase/water bodies",
      "After updating plan, re-run VastuCheck to validate zoning before execution",
    ],
    closingTip: "Tip: Don’t do everything at once. Consistency beats intensity.",
  };

  const tl = ai.timelineChecklist || timelineFallback;

  newPage(tl.title);
  drawWrappedText(tl.intro, { size: 11, color: subtle });
  cursorY -= 6;

  drawSectionHeading("Day 0–2 (Quick Wins)");
  drawBullets(tl.day0to2, { size: 11, color: ink });
  cursorY -= 8;

  drawSectionHeading("Week 1 (High Impact + Easy)");
  drawBullets(tl.week1, { size: 11, color: ink });
  cursorY -= 8;

  drawSectionHeading("Week 2–4 (Stabilise + Fine Tune)");
  drawBullets(tl.week2to4, { size: 11, color: ink });
  cursorY -= 8;

  drawSectionHeading("Optional (Only If Renovating / Redesigning)");
  drawBullets(tl.optionalIfRenovating, { size: 11, color: ink });

  cursorY -= 12;
  drawWrappedText(tl.closingTip, { size: 9, color: subtle });

  /* ------------------ AI/HYBRID: ARCHITECT NOTES PAGE (NEW) ---------------- */

  const architectFallback: AiArchitectNotes = {
    title: "Architect / Builder Notes (Share This Page)",
    intro:
      "This page is written for your architect, interior designer, or builder. It summarises layout-level observations in neutral terms. The goal is functional zoning + directional harmony within modern constraints.",
    inputsAssumed: [
      "North is aligned correctly as provided by the user",
      "Rooms are identified based on the marked plan and names",
      "This is directional zoning guidance, not a structural engineering review",
    ],
    highPriorityAreas: [
      "Main entrance zone and approach",
      "Kitchen (stove/sink relationship) and ventilation",
      "Master bedroom zone and bed-head direction",
      "Toilet locations relative to North-East / South-West",
      "Brahmasthan (centre zone) openness and load concentration",
      "Water bodies and staircase (for independent houses)",
    ],
    renovationSuggestions: [
      "Refer to each room’s “If renovating / planning fresh” notes as optional guidance",
      "Prefer shifting room functions/usage before considering heavy reconstruction",
      "Validate any revised plan by re-running VastuCheck before execution",
    ],
    doNotChangeWithoutFeasibility: [
      "Any wall removal affecting columns/beams",
      "Plumbing relocation impacting shafts in apartments",
      "Staircase/tank relocation without structural + service review",
    ],
    closingNote:
      "Recommendation: If plan changes are made, re-run the updated plan through VastuCheck to verify zones before construction/execution.",
  };

  const arch = ai.architectNotes || architectFallback;

  newPage(arch.title);
  drawWrappedText(arch.intro, { size: 11, color: subtle });
  cursorY -= 8;

  drawSectionHeading("Inputs Assumed");
  drawBullets(arch.inputsAssumed, { size: 11, color: ink });
  cursorY -= 8;

  drawSectionHeading("High-Priority Areas (Typically Highest Impact)");
  drawBullets(arch.highPriorityAreas, { size: 11, color: ink });
  cursorY -= 8;

  drawSectionHeading("If Renovating (Layout-Level Suggestions)");
  drawBullets(arch.renovationSuggestions, { size: 11, color: ink });
  cursorY -= 8;

  drawSectionHeading("Do Not Change Without Feasibility Check");
  drawBullets(arch.doNotChangeWithoutFeasibility, { size: 11, color: rgb(0.55, 0.30, 0.05) });

  cursorY -= 10;
  drawWrappedText(arch.closingNote, { size: 9, color: subtle });

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

  tips.forEach((tip) => drawWrappedText(`• ${tip}`, { size: 11 }));

  cursorY -= 16;
  drawDivider();

  drawWrappedText(
    "Disclaimer: Vastu is a traditional system of spatial harmony. This report is designed for guidance and lifestyle tuning, not as a medical, legal or financial prescription.",
    { size: 8.5, color: subtle },
  );

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}