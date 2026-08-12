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

const VALID_ROOM_TYPES = new Set<string>(
  ROOM_TYPE_OPTIONS.map((o) => o.value)
);

// Single source of truth for what the model is allowed to return — kept in
// sync with the app's full room type list (src/lib/vastuRoomOptions.ts)
// instead of a hand-typed subset, so newly supported room types never
// silently fall outside what detection can produce.
const ROOM_TYPE_REFERENCE = ROOM_TYPE_OPTIONS.map(
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

    const safeType: RoomType =
      typeof type === "string" && VALID_ROOM_TYPES.has(type)
        ? (type as RoomType)
        : "other";

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

Identify every room / labelled space you can see and return JSON with this
structure:

{
  "rooms": [
    { "name": "Master Bedroom", "type": "master_bedroom", "x": 0.73, "y": 0.42 }
  ]
}

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
- "type" MUST be exactly one of these values (do not invent new ones):
  ${ROOM_TYPE_REFERENCE}
- Match each room to the closest available type from the list above. For
  example: a "Study"/"Office" maps to "study" or "home_office", a "Servant
  Room" maps to "servant_room", a "Pooja"/"Puja" room maps to "pooja", a
  car porch/parking bay maps to "parking".
- If you are unsure of a room's EXACT type but can still tell roughly what
  kind of space it is (a bedroom-like room, a balcony, a store, etc.), use
  "other" and give it the best short name you can — don't omit it just
  because you're unsure of the precise category.
- If you genuinely cannot tell what a space is AND there is no text label on
  the plan to go by — just an empty walled area you can't identify — OMIT it
  from the response entirely. Do not invent a placeholder name like "Unknown
  Room" or "Unlabelled Room"; a vague, unidentifiable marker confuses the
  user more than leaving it out. Only include a room if you can give it a
  real, specific name.
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
