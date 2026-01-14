// src/lib/reportPdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { VastuSummary } from "@/lib/vastuRules";
import type { RoomType } from "@/types/vastu";

const ROOM_TYPE_LABEL: Record<RoomType, string> = {
  master_bedroom: "Master Bedroom",
  bedroom: "Bedroom",
  kitchen: "Kitchen",
  toilet: "Toilet / Bath",
  living: "Living Room",
  pooja: "Pooja Room",
  dining: "Dining",
  balcony: "Balcony",
  staircase: "Staircase",
  store: "Store / Utility",
  other: "Other",
};

export async function buildVastuReportPdf(
  summary: VastuSummary,
  customerName?: string
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = height - 50;

  const drawText = (
    text: string,
    opts: {
      x?: number;
      y?: number;
      size?: number;
      bold?: boolean;
      color?: { r: number; g: number; b: number };
    } = {}
  ) => {
    const size = opts.size ?? 11;
    const x = opts.x ?? 40;
    const color = opts.color ?? { r: 0, g: 0, b: 0 };
    const f = opts.bold ? fontBold : fontRegular;
    page.drawText(text, {
      x,
      y: opts.y ?? y,
      size,
      font: f,
      color: rgb(color.r, color.g, color.b),
    });
  };

  // Title
  drawText("Vastu Layout Analysis Report", {
    x: 40,
    y,
    size: 18,
    bold: true,
  });
  y -= 24;

  if (customerName) {
    drawText(`Prepared for: ${customerName}`, {
      y,
      size: 11,
      color: { r: 0.2, g: 0.2, b: 0.2 },
    });
    y -= 16;
  }

  drawText(`Overall Vastu Score: ${summary.score}/100`, {
    y,
    size: 12,
    bold: true,
    color: { r: 0.1, g: 0.45, b: 0.2 },
  });
  y -= 16;

  drawText(summary.verdict, {
    y,
    size: 11,
    color: { r: 0.1, g: 0.45, b: 0.2 },
  });
  y -= 24;

  drawText("Room-wise Vastu Analysis", { y, size: 13, bold: true });
  y -= 18;

  // Table header
  drawText("Room", { y, size: 11, bold: true });
  drawText("Direction", { x: 220, y, size: 11, bold: true });
  drawText("Verdict", { x: 300, y, size: 11, bold: true });
  y -= 14;

  page.drawLine({
    start: { x: 40, y },
    end: { x: width - 40, y },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  });
  y -= 12;

  for (const r of summary.rooms) {
    if (y < 80) {
      page = pdfDoc.addPage();
      ({ width, height } = page.getSize());
      y = height - 50;
    }

    const roomLabel = r.name || "Room";
    const typeLabel = ROOM_TYPE_LABEL[r.type] ?? r.type;
    const dirLabel = r.direction;
    const verdictText = r.verdict;

    drawText(roomLabel, { y, size: 10, bold: true });
    drawText(typeLabel, {
      x: 40,
      y: y - 11,
      size: 9,
      color: { r: 0.35, g: 0.35, b: 0.35 },
    });

    drawText(dirLabel, { x: 220, y, size: 10 });

    let verdictColor = { r: 0, g: 0, b: 0 };
    if (r.verdict === "Auspicious") verdictColor = { r: 0.1, g: 0.5, b: 0.2 };
    else if (r.verdict === "Favourable")
      verdictColor = { r: 0.15, g: 0.45, b: 0.25 };
    else if (r.verdict === "Average")
      verdictColor = { r: 0.3, g: 0.3, b: 0.3 };
    else if (r.verdict === "Unfavourable")
      verdictColor = { r: 0.8, g: 0.55, b: 0.1 };
    else if (r.verdict === "Critical")
      verdictColor = { r: 0.8, g: 0.2, b: 0.2 };

    drawText(verdictText, { x: 300, y, size: 10, color: verdictColor });

    if (r.notes) {
      drawText(r.notes, {
        x: 300,
        y: y - 11,
        size: 9,
        color: { r: 0.35, g: 0.35, b: 0.35 },
      });
    }

    y -= 24;
  }

  // Footer
  y = 40;
  drawText("Note:", {
    y,
    size: 9,
    bold: true,
    color: { r: 0.3, g: 0.3, b: 0.3 },
  });
  drawText(
    "This report is an AI-assisted, rule-based Vastu overview and should be reviewed with a qualified Vastu consultant for important decisions.",
    {
      x: 40,
      y: y - 10,
      size: 8,
      color: { r: 0.35, g: 0.35, b: 0.35 },
    }
  );

  const bytes = await pdfDoc.save();
  return new Uint8Array(bytes);
}