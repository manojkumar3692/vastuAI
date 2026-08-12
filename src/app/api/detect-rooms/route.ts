import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ROOM_TYPE_OPTIONS } from "@/lib/vastuRoomOptions";
import type { RoomType } from "@/types/vastu";

export const runtime = "nodejs";
// AI vision calls + a fairly large JSON response can take a while on busy
// plans — without this the route is capped at the platform's short default
// function timeout and can get killed mid-request.
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Auto-detection is deliberately scoped to a core set of room types, not
// the app's full ~50-type list. A floor plan with 15+ auto-placed pins is
// hard to read on mobile, and most of the Vastu value is concentrated in
// these types anyway. Everything else (terrace, study, servant room,
// French balcony, dining, etc.) is still fully supported — it's just
// manual-add-only via the "Add room" dropdown, which uses the full
// ROOM_TYPE_OPTIONS list untouched.
const CORE_AUTO_DETECT_TYPES = new Set<RoomType>([
  "master_bedroom",
  "bedroom",
  "kids_room",
  "guest_room",
  "kitchen",
  "toilet",
  "bathroom",
  "main_entrance",
  "living",
  "pooja",
  "staircase",
  "lift",
  "balcony",
  "store",
  "store_room",
]);

const CORE_ROOM_TYPE_OPTIONS = ROOM_TYPE_OPTIONS.filter((o) =>
  CORE_AUTO_DETECT_TYPES.has(o.value)
);

const VALID_ROOM_TYPES = new Set<string>(
  CORE_ROOM_TYPE_OPTIONS.map((o) => o.value)
);

const ROOM_TYPE_REFERENCE = CORE_ROOM_TYPE_OPTIONS.map(
  (o) => `${o.value} (${o.label})`
).join(", ");

type RawDetectedRoom = {
  name?: unknown;
  type?: unknown;
  x?: unknown;
  y?: unknown;
};

type CleanRoom = { name?: string; type: RoomType; x: number; y: number };

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

// Catches the AI naming a space with a vague placeholder instead of a real
// label — "Unknown Room", "Unlabelled Room", "Unidentified Space", etc. The
// prompt now tells it to omit these entirely rather than invent a name, but
// this is a safety net for when it doesn't follow that instruction, so a
// confusing, unremovable dot never reaches the user's floor plan.
const GENERIC_UNIDENTIFIED_NAME = /\b(unknown|unlabel(l)?ed|unidentifi(ed|able)|unnamed|undetermined|not\s*(clear|identified|labell?ed))\b/i;

/**
 * The model occasionally returns rooms with missing/garbled coordinates or a
 * type outside the allowed list. Previously these passed straight through to
 * the client, where a missing x/y became NaN (an invisible, broken marker)
 * and an unrecognised type broke the "type as RoomType" cast silently.
 * Sanitizing here means the client always gets clean, renderable data.
 */
function sanitizeRooms(raw: unknown): CleanRoom[] {
  if (!Array.isArray(raw)) return [];

  const cleaned: CleanRoom[] = [];

  for (const entry of raw as RawDetectedRoom[]) {
    if (!entry || typeof entry !== "object") continue;

    const { x, y, type, name } = entry;
    if (!isFiniteNumber(x) || !isFiniteNumber(y)) continue; // unusable point
    if (x < -0.08 || x > 1.08 || y < -0.08 || y > 1.08) continue; // clearly off-plan

    const clampedX = Math.min(0.98, Math.max(0.02, x));
    const clampedY = Math.min(0.98, Math.max(0.02, y));

    // Outside the core auto-detect list (AI drift/hallucination, or plain
    // not matching one of the scoped types) — drop it rather than falling
    // back to a generic "other" bucket, which would reintroduce the exact
    // clutter/confusion this scoping is meant to avoid.
    if (typeof type !== "string" || !VALID_ROOM_TYPES.has(type)) continue;
    const safeType = type as RoomType;

    const safeName =
      typeof name === "string" && name.trim() ? name.trim() : undefined;

    // No usable name at all, or a vague "I couldn't identify this" name —
    // drop it rather than showing the user an unlabeled, confusing marker
    // they'd have to manually remove.
    if (!safeName || GENERIC_UNIDENTIFIED_NAME.test(safeName)) continue;

    cleaned.push({ name: safeName, type: safeType, x: clampedX, y: clampedY });
  }

  // Sanity cap — guards against a pathological/looping response.
  return cleaned.slice(0, 60);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageDataUrl = body?.imageDataUrl as string | undefined;

    if (!imageDataUrl || typeof imageDataUrl !== "string") {
      return NextResponse.json(
        { error: "imageDataUrl is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are a Vastu assistant analyzing a 2D architectural floor plan image.

This app only auto-detects a deliberately small set of core room types —
everything else is added manually by the user afterwards, so the plan stays
readable on mobile instead of getting cluttered with pins. Identify ONLY
rooms/spaces that clearly match one of these specific types, and return JSON
with this structure:

{
  "rooms": [
    { "name": "Master Bedroom", "type": "master_bedroom", "x": 0.73, "y": 0.42 }
  ]
}

Allowed types (do not invent new ones, and do not use anything outside this
list):
  ${ROOM_TYPE_REFERENCE}

Coordinate rules:
- "x" and "y" are NORMALIZED coordinates from 0 to 1 relative to the FULL
  image, where (0,0) is the top-left corner and (1,1) is the bottom-right
  corner.
- Place the point at the approximate CENTRE of the room's enclosed floor
  area (bounded by its walls) — not on the text label itself if the label
  sits in a corner, overlaps a wall, or sits outside the room's boundary.
- Only use coordinates inside the visible floor plan; ignore borders,
  legends, title blocks, north-arrow symbols or dimension lines that sit
  outside the built structure.

Room type rules:
- Match bedrooms carefully: "master_bedroom" for the largest/primary
  bedroom (often has an attached bath, sometimes explicitly labelled).
  Use "kids_room" or "guest_room" when the plan labels or clearly implies
  it (e.g. twin beds/children's layout, or explicitly marked "Guest").
  Otherwise use "bedroom" for any other regular bedroom.
- Skip anything that does not clearly match one of the allowed types above
  — do not force a Study, Terrace, Servant Room, Dining Room, French
  Balcony, courtyard, etc. into the closest available category. Those are
  intentionally left for the user to add manually.
- Also skip non-room elements entirely: dimension text, north-arrow
  symbols, title blocks, scale bars, legends.
- Within the allowed types, if you genuinely cannot tell what a space is —
  no text label and no visual clue — OMIT it rather than guessing. Do not
  invent a placeholder name like "Unknown Room" or "Unlabelled Room"; only
  include a room if you can give it a real, specific name.
- "name" should be a short, human-friendly label as written or implied on
  the plan (e.g., "Bedroom 1", "Kitchen", "Common Toilet").

Respond with JSON only, no extra text.
`;

    const completion = await openai.chat.completions.create(
      {
        model: "gpt-5.6-luna",
        // This is pattern-matching against an image, not multi-step logic —
        // low reasoning effort trims the model's internal "thinking" time
        // without giving up meaningful accuracy on this kind of task.
        reasoning_effort: "low",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are an expert architect & Vastu assistant that reads floor plans and returns clean JSON.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  // We can pass the full data URL directly
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
      },
      { timeout: 45_000, maxRetries: 2 }
    );

    const content = completion.choices[0]?.message?.content || "{}";

    let parsed: { rooms?: unknown } = {};
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("detect-rooms: failed to parse AI JSON", e, content);
      return NextResponse.json(
        { error: "AI response was not valid JSON" },
        { status: 502 }
      );
    }

    const rooms = sanitizeRooms(parsed?.rooms);

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("detect-rooms error", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Failed to detect rooms",
        ...(process.env.NODE_ENV !== "production" ? { detail: message } : {}),
      },
      { status: 500 }
    );
  }
}
