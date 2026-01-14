// src/lib/reportPdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { VastuSummary } from "@/lib/vastuRules";
import type { RoomType } from "@/types/vastu";

export const ROOM_TYPE_LABEL: Record<RoomType, string> = {
    // Bedrooms
    master_bedroom: "Master Bedroom",
    bedroom: "Bedroom",
    kids_room: "Kids Room",
    guest_room: "Guest Room",
  
    // Core rooms
    living: "Living Room",
    kitchen: "Kitchen",
    dining: "Dining Room",
    pooja: "Pooja Room",
  
    // Bathrooms
    toilet: "Toilet / Bath",
    powder_room: "Powder Room",
    bathroom: "Bathroom",
  
    // Entrance / circulation
    main_entrance: "Main Entrance",
    foyer: "Foyer",
    porch: "Porch",
    mud_room: "Mud Room",
  
    // Entertainment
    media_room: "Media Room",
    home_theater: "Home Theater",
    gaming_room: "Gaming Room",
    music_room: "Music Room",
    bar: "Bar",
  
    // Work / study
    study: "Study",
    home_office: "Home Office",
    library: "Library",
  
    // Outdoor
    balcony: "Balcony",
    terrace: "Terrace",
    courtyard: "Courtyard",
    verandah: "Verandah",
    sit_out: "Sit-out",
    deck: "Deck",
    garden: "Garden",
    gazebo: "Gazebo",
    pergola: "Pergola",
  
    // Parking
    parking: "Parking",
    garage: "Garage",
  
    // Personal / service / storage
    dressing_room: "Dressing Room",
    servant_room: "Servant Room",
    maid_room: "Maid Room",
    store: "Store / Utility",
    store_room: "Store Room",
    shoe_closet: "Shoe Closet",
  
    // Structural
    staircase: "Staircase",
    basement: "Basement",
  
    // Utilities
    utility: "Utility",
    laundry: "Laundry",
    wash_area: "Wash Area",
    overhead_water_tank: "Overhead Water Tank",
    underground_water_tank: "Underground Water Tank",
    electrical_room: "Electrical Room",
  
    // Amenities
    gym: "Gym",
    pool: "Pool",
  
    // Fallback
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