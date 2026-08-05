// src/lib/reportPdf.ts
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage } from "pdf-lib";
import type { VastuSummary, Verdict } from "./vastuRules";
import type { RoomType } from "@/types/vastu";
import { getStaticTemplateForRoom, getVerdictPriority } from "./templates";

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

export type RoomPointAsset = { id: string; x: number; y: number };

export type ReportAssets = {
  /** Data URL (data:image/png;base64,... or data:image/jpeg;...) of the
   * uploaded floor plan, already downscaled client-side for this purpose. */
  planImageDataUrl?: string;
  /** Normalized (0-1) x/y per room, matched by id to summary.rooms, used to
   * plot pins on the embedded floor plan snapshot. */
  roomPoints?: RoomPointAsset[];
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
  assets?: ReportAssets,
): Promise<Uint8Array> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const aiReport = await buildAiReport(summary, { customerName, customerCity });
  return await buildPdfFromAi(summary, aiReport, { customerName, customerCity }, assets);
}

/* -------------------------------------------------------------------------- */
/*                        AI RESPONSE NORMALIZATION                           */
/* -------------------------------------------------------------------------- */

// The AI's JSON is asked (via prompt) to put plain strings in fields like
// `explanation` or `nonStructuralRemedies`, but nothing enforces that at the
// API level — a model can decide a "remedies" field is more naturally a
// list and hand back an array (or a nested object) instead. Every one of
// those fields eventually hits `text.split(...)` while drawing the PDF, so
// an unexpected shape crashed the whole report generation instead of just
// looking a little different. These coerce whatever comes back into safe,
// renderable strings/arrays before anything touches the PDF.

function toText(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(toText).filter(Boolean).join(" ");
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["text", "summary", "value", "en", "description", "content"]) {
      if (typeof obj[key] === "string") return obj[key] as string;
    }
    try {
      return Object.values(obj).map(toText).filter(Boolean).join(" ");
    } catch {
      return "";
    }
  }
  return String(value);
}

function toTextArray(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.map(toText).filter(Boolean);
  const text = toText(value);
  return text ? [text] : [];
}

function normalizeAiRoom(raw: unknown): AiRoomReport {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: toText(r.id),
    roomName: toText(r.roomName),
    type: toText(r.type),
    direction: toText(r.direction),
    verdict: toText(r.verdict),
    explanation: toText(r.explanation),
    nonStructuralRemedies: toText(r.nonStructuralRemedies),
    structuralGuidance: toText(r.structuralGuidance),
    quickTips: toTextArray(r.quickTips),
  };
}

function normalizeAiReport(raw: unknown): AiReport {
  const r = (raw ?? {}) as Record<string, unknown>;
  const overall = (r.overallSummary ?? {}) as Record<string, unknown>;

  const normalized: AiReport = {
    overallSummary: {
      title: toText(overall.title),
      summaryParagraph: toText(overall.summaryParagraph),
      keyHighlights: toTextArray(overall.keyHighlights),
      cautionPoints: toTextArray(overall.cautionPoints),
    },
    rooms: Array.isArray(r.rooms) ? r.rooms.map(normalizeAiRoom) : [],
    globalTips: toTextArray(r.globalTips),
  };

  if (r.expectationFraming && typeof r.expectationFraming === "object") {
    const e = r.expectationFraming as Record<string, unknown>;
    normalized.expectationFraming = {
      title: toText(e.title),
      intro: toText(e.intro),
      beforeAfterBullets: toTextArray(e.beforeAfterBullets),
      realisticTimelineNote: toText(e.realisticTimelineNote),
    };
  }

  if (r.timelineChecklist && typeof r.timelineChecklist === "object") {
    const t = r.timelineChecklist as Record<string, unknown>;
    normalized.timelineChecklist = {
      title: toText(t.title),
      intro: toText(t.intro),
      day0to2: toTextArray(t.day0to2),
      week1: toTextArray(t.week1),
      week2to4: toTextArray(t.week2to4),
      optionalIfRenovating: toTextArray(t.optionalIfRenovating),
      closingTip: toText(t.closingTip),
    };
  }

  if (r.architectNotes && typeof r.architectNotes === "object") {
    const a = r.architectNotes as Record<string, unknown>;
    normalized.architectNotes = {
      title: toText(a.title),
      intro: toText(a.intro),
      inputsAssumed: toTextArray(a.inputsAssumed),
      highPriorityAreas: toTextArray(a.highPriorityAreas),
      renovationSuggestions: toTextArray(a.renovationSuggestions),
      doNotChangeWithoutFeasibility: toTextArray(a.doNotChangeWithoutFeasibility),
      closingNote: toText(a.closingNote),
    };
  }

  return normalized;
}

/* -------------------------------------------------------------------------- */
/*                             AI REPORT GENERATION                           */
/* -------------------------------------------------------------------------- */

/**
 * The report-writing call previously used a bare fetch() with no timeout and
 * no retry — if OpenAI was slow, the request just hung until the platform's
 * own (short, unconfigured) function timeout killed it outright, with no
 * chance to recover. This adds a per-attempt timeout and a couple of retries
 * on transient failures (timeout, 5xx, network error), mirroring the
 * timeout/maxRetries already added to the detect-rooms route.
 */
async function callOpenAiChat(
  body: Record<string, unknown>,
  { timeoutMs = 50_000, retries = 2 }: { timeoutMs?: number; retries?: number } = {},
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      // Retry on server-side/rate-limit errors; treat 4xx (other than 429)
      // as non-retryable since retrying won't fix a bad request.
      if (!response.ok && (response.status >= 500 || response.status === 429) && attempt < retries) {
        lastError = new Error(`OpenAI responded ${response.status}`);
        continue;
      }

      return response;
    } catch (err) {
      lastError = err;
      if (attempt === retries) throw err;
      // otherwise fall through and retry
    } finally {
      clearTimeout(timer);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("OpenAI request failed");
}

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

  const response = await callOpenAiChat({
    model: "gpt-5.6-luna",
    // Writing explanations/remedies from data we've already scored is a
    // drafting task, not deep multi-step reasoning — low effort cuts the
    // model's internal "thinking" time (the biggest chunk of the 30-40s
    // wait) without asking it to skip real work.
    reasoning_effort: "low",
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

  let parsed: unknown;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (e) {
    console.error("[buildAiReport] Failed to parse AI JSON:", e, raw);
    throw new Error("AI response was not valid JSON");
  }

  return normalizeAiReport(parsed);
}

/* -------------------------------------------------------------------------- */
/*                          TEXT FITTING HELPERS                              */
/* -------------------------------------------------------------------------- */

// The AI writes the report title and each room's header line — their length
// isn't schema-constrained, and both were previously drawn with a raw
// page.drawText() call with no width check, so a longer-than-usual title or
// room name would silently run off the edge of the page instead of wrapping
// or truncating. These keep everything inside its box.

function wrapTextToLines(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  // Belt-and-suspenders: the AI response is normalized to plain strings
  // before it ever reaches here (see normalizeAiReport above), but keep
  // this defensive so a non-string slipping through some other call site
  // degrades to empty text instead of crashing PDF generation outright.
  const safeText = typeof text === "string" ? text : toText(text);
  const words = safeText.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

function fitTextBlock(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
  maxLines: number
): string[] {
  const lines = wrapTextToLines(text, font, size, maxWidth);
  if (lines.length <= maxLines) return lines;

  const kept = lines.slice(0, maxLines);
  const ellipsis = "…";
  let last = kept[maxLines - 1];
  while (
    last.length > 0 &&
    font.widthOfTextAtSize(last + ellipsis, size) > maxWidth
  ) {
    last = last.slice(0, -1).trimEnd();
  }
  kept[maxLines - 1] = last + ellipsis;
  return kept;
}

function fitSingleLine(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string {
  const safeText = typeof text === "string" ? text : toText(text);
  if (font.widthOfTextAtSize(safeText, size) <= maxWidth) return safeText;
  const ellipsis = "…";
  let result = safeText;
  while (result.length > 0 && font.widthOfTextAtSize(result + ellipsis, size) > maxWidth) {
    result = result.slice(0, -1);
  }
  return (result.trimEnd() || safeText.slice(0, 1)) + ellipsis;
}

/* -------------------------------------------------------------------------- */
/*                               PDF GENERATION                               */
/* -------------------------------------------------------------------------- */

async function buildPdfFromAi(
  summary: VastuSummary,
  ai: AiReport,
  opts: BuildPdfOptions,
  assets?: ReportAssets,
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

  // Floor plan embed — the user's actual uploaded plan (already downscaled
  // client-side), passed straight through as a data URL rather than a
  // fetchable URL, so it's decoded here directly.
  let embeddedPlanImage: PDFImage | undefined;
  const planImageDataUrl = assets?.planImageDataUrl;
  if (planImageDataUrl && typeof planImageDataUrl === "string") {
    try {
      const match = /^data:(image\/(png|jpe?g));base64,(.+)$/i.exec(
        planImageDataUrl,
      );
      if (match) {
        const mime = match[1].toLowerCase();
        const base64 = match[3];
        const bytes = Buffer.from(base64, "base64");
        embeddedPlanImage = mime.includes("png")
          ? await pdfDoc.embedPng(bytes)
          : await pdfDoc.embedJpg(bytes);
      }
    } catch (e) {
      console.error("[buildPdfFromAi] Failed to embed plan image:", e);
    }
  }

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();

  // Base background
  page.drawRectangle({ x: 0, y: 0, width, height, color: pageBg });

  const marginX = 50;

  // Title is AI-generated free text with no length constraint — fit it to
  // up to 2 lines instead of letting it run off the page edge, and grow the
  // saffron band to match so the white "Prepared for" line underneath it
  // never spills onto the (white) page background where it'd be unreadable.
  const title = ai.overallSummary.title || "Vastu Layout Analysis Report";
  const titleFontSize = 22;
  const titleLineHeight = 24;
  const titleMaxWidth = width - marginX * 2 - 60; // leave room for the mandala icon
  const titleLines = fitTextBlock(title, fontBold, titleFontSize, titleMaxWidth, 2);
  const bandHeight = 110 + (titleLines.length - 1) * titleLineHeight;

  // Saffron header band on first page
  page.drawRectangle({
    x: 0,
    y: height - bandHeight,
    width,
    height: bandHeight,
    color: theme.saffron,
  });
  // Thin gold strip
  page.drawRectangle({
    x: 0,
    y: height - bandHeight,
    width,
    height: 4,
    color: theme.gold,
  });

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

  // Title inside saffron band (white) — wrapped/fitted above, band sized to match.
  titleLines.forEach((line, i) => {
    page.drawText(line, {
      x: marginX,
      y: cursorY - 20 - i * titleLineHeight,
      size: titleFontSize,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
  });

  cursorY -= 32 + (titleLines.length - 1) * titleLineHeight;

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
    const roomPoints = assets?.roomPoints ?? [];
    const hasPins = roomPoints.length > 0;

    const cardWidth = width - marginX * 2;
    const maxImgWidth = cardWidth - 24;
    const maxImgHeight = 220;
    const legendHeight = hasPins ? 16 : 0;

    const dims = embeddedPlanImage.scale(1);
    let imgW = dims.width;
    let imgH = dims.height;

    const scale = Math.min(maxImgWidth / imgW, maxImgHeight / imgH, 1);
    imgW *= scale;
    imgH *= scale;

    const cardHeight = imgH + 40 + legendHeight;
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
    const imgY = cardY + 12 + legendHeight;

    // NB: pdf-lib images are drawn via page.drawImage(), not image.draw() —
    // the latter doesn't exist and would have thrown at runtime the first
    // time this path actually executed (it never had before, since nothing
    // previously populated a plan image for the PDF to embed).
    page.drawImage(embeddedPlanImage, { x: imgX, y: imgY, width: imgW, height: imgH });

    // Pins — matched by id to the scored rooms, coloured by verdict, so the
    // snapshot actually shows WHERE each room sits rather than just being a
    // decorative picture of the plan.
    if (hasPins) {
      const roomsById = new Map(summary.rooms.map((r) => [r.id, r]));

      roomPoints.forEach((point) => {
        const roomInfo = roomsById.get(point.id);
        if (!roomInfo) return;
        if (
          !Number.isFinite(point.x) ||
          !Number.isFinite(point.y) ||
          point.x < 0 ||
          point.x > 1 ||
          point.y < 0 ||
          point.y > 1
        ) {
          return;
        }

        const priority = getVerdictPriority(roomInfo.verdict as Verdict);
        const pinColor =
          priority === "positive"
            ? rgb(0.13, 0.55, 0.28)
            : priority === "neutral"
            ? rgb(0.83, 0.55, 0.13)
            : priority === "warning"
            ? rgb(0.78, 0.42, 0.1)
            : rgb(0.75, 0.15, 0.15);

        // Normalized y=0 is the top of the image; PDF y grows upward, so flip.
        const pinX = imgX + point.x * imgW;
        const pinY = imgY + (1 - point.y) * imgH;

        page.drawCircle({
          x: pinX,
          y: pinY,
          size: 3.2,
          color: pinColor,
          borderColor: rgb(1, 1, 1),
          borderWidth: 0.8,
        });
      });

      page.drawText(
        "Pins: green = favourable  ·  amber = average  ·  orange/red = needs correction",
        {
          x: marginX + 12,
          y: cardY + 6,
          size: 7.5,
          font: fontRegular,
          color: subtle,
        },
      );
    }

    cursorY = cardY - 16;
  }

  drawWrappedText(
    "Note: This first page is a snapshot view. The next pages give room-wise guidance and detailed remedies.",
    { size: 9, color: subtle },
  );

  /* --------------------------- ROOM-WISE PAGES ---------------------------- */

  newPage("Room-wise Vastu Guidance");

  ai.rooms.forEach((room) => {
    const rawHeader = `${room.roomName || room.type} · ${room.direction} · ${room.verdict}`;
    // Room name is free text (user-edited or AI-labelled) — fit it to the
    // header bar's width instead of letting long names run past the card.
    const header = fitSingleLine(rawHeader, fontBold, 11, width - marginX * 2 - 16);

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