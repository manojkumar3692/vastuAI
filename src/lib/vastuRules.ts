// src/lib/vastuRules.ts
import type { Direction, RoomType } from "@/types/vastu";

export type Verdict =
  | "Auspicious"
  | "Favourable"
  | "Average"
  | "Unfavourable"
  | "Critical";

export type RoomDirectionInput = {
  id: string;
  name: string;
  type: RoomType;
  direction: Direction;
};

export type RoomVastuResult = {
  id: string;
  name: string;
  type: RoomType;
  direction: Direction;
  verdict: Verdict;
  notes: string;
  scoreImpact: number;
};

export type VastuSummary = {
  score: number; // 0–100
  verdict: string;
  rooms: RoomVastuResult[];
};

type RoomScoreEval = {
  scoreImpact: number;
  verdict: Verdict;
  notes: string;
};

function scoreKitchen(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "SE":
      return {
        scoreImpact: +4,
        verdict: "Auspicious",
        notes: "Ideal Vastu zone for kitchen (Agni).",
      };
    case "E":
    case "S":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good placement for kitchen.",
      };
    case "SW":
    case "W":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "May create heaviness or conflicts; consider remedies.",
      };
    case "N":
    case "NE":
      return {
        scoreImpact: -4,
        verdict: "Critical",
        notes:
          "Kitchen in North or North-East is strongly discouraged in Vastu.",
      };
    case "NW":
      return {
        scoreImpact: -1,
        verdict: "Average",
        notes: "Manageable with some corrections/remedies.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreMasterBedroom(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "SW":
      return {
        scoreImpact: +4,
        verdict: "Auspicious",
        notes: "Best zone for master bedroom and stability.",
      };
    case "S":
    case "W":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good for rest and authority.",
      };
    case "N":
    case "NE":
      return {
        scoreImpact: -3,
        verdict: "Unfavourable",
        notes:
          "May disturb health/decision-making; not ideal for head of family.",
      };
    default:
      return {
        scoreImpact: 0,
        verdict: "Average",
        notes: "Usable but not a classical ideal zone.",
      };
  }
}

function scoreBedroom(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "SW":
    case "S":
    case "W":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good direction for bedrooms.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes:
          "NE bedrooms can lead to restlessness; apply remedies if needed.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreToilet(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "NW":
    case "SE":
      return {
        scoreImpact: -1,
        verdict: "Average",
        notes: "Common placement; manage with basic remedies.",
      };
    case "S":
    case "W":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes:
          "Heavier corrections may be needed; keep dry & ventilated.",
      };
    case "N":
    case "NE":
      return {
        scoreImpact: -4,
        verdict: "Critical",
        notes:
          "Toilet in North/North-East is considered very inauspicious.",
      };
    default:
      return { scoreImpact: -1, verdict: "Average", notes: "" };
  }
}

function scorePooja(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "NE":
      return {
        scoreImpact: +4,
        verdict: "Auspicious",
        notes: "North-East is ideal for Pooja/altar.",
      };
    case "E":
    case "N":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good spiritual zone for Pooja room.",
      };
    case "S":
    case "SW":
      return {
        scoreImpact: -3,
        verdict: "Unfavourable",
        notes:
          "Avoid Pooja in heavy/fire zones; keep minimal if unavoidable.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreLiving(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "N":
    case "NE":
    case "E":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Welcoming social zone; good for living room.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreGeneric(_direction: Direction): RoomScoreEval {
  // Neutral default
  return { scoreImpact: 0, verdict: "Average", notes: "" };
}

function scoreRoom(type: RoomType, direction: Direction): RoomScoreEval {
  switch (type) {
    case "kitchen":
      return scoreKitchen(direction);
    case "master_bedroom":
      return scoreMasterBedroom(direction);
    case "bedroom":
      return scoreBedroom(direction);
    case "toilet":
      return scoreToilet(direction);
    case "pooja":
      return scorePooja(direction);
    case "living":
      return scoreLiving(direction);
    default:
      return scoreGeneric(direction);
  }
}

export function evaluateVastu(rooms: RoomDirectionInput[]): VastuSummary {
  const results: RoomVastuResult[] = rooms.map((r) => {
    const base = scoreRoom(r.type, r.direction);
    return {
      id: r.id,
      name: r.name || "Room",
      type: r.type,
      direction: r.direction,
      verdict: base.verdict,
      notes: base.notes,
      scoreImpact: base.scoreImpact,
    };
  });

  // Base neutral score 70, then adjust by room impacts
  const rawScore = 70 + results.reduce((sum, r) => sum + r.scoreImpact, 0);
  const score = Math.max(0, Math.min(100, rawScore));

  let verdict: string;
  if (score >= 85) verdict = "Highly Vastu-aligned layout";
  else if (score >= 70) verdict = "Generally favourable with minor corrections";
  else if (score >= 50) verdict = "Needs Vastu corrections in key areas";
  else verdict = "Significantly imbalanced; major corrections recommended";

  return { score, verdict, rooms: results };
}