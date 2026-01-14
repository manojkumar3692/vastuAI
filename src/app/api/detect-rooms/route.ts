import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
You are a Vastu assistant analyzing a *2D floor plan* image.

Return JSON with the following structure:

{
  "rooms": [
    {
      "name": "Master Bedroom",
      "type": "master_bedroom",
      "x": 0.73,
      "y": 0.42
    }
  ]
}

Rules:
- "x" and "y" are NORMALIZED coordinates from 0-1,
  where (0,0) is top-left of the plan image and (1,1) is bottom-right.
- "name" should be human-friendly (e.g., "Bedroom 1", "Kitchen", "Toilet").
- "type" must be one of:
  "master_bedroom", "bedroom", "kitchen", "toilet",
  "living", "pooja", "dining", "balcony", "staircase", "store", "other".
- Only include clearly identifiable rooms; skip labels you are unsure about.
- Do NOT include any text outside the house layout.
- Respond with JSON only, no extra text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
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
    });

    const content = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    const rooms = Array.isArray(parsed.rooms) ? parsed.rooms : [];

    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("detect-rooms error", err);
    return NextResponse.json(
      { error: "Failed to detect rooms" },
      { status: 500 }
    );
  }
}