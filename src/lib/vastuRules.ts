// src/lib/vastuRules.ts
import type { Direction, RoomType } from "@/types/vastu";

export type Verdict =
  | "Auspicious"
  | "Favourable"
  | "Average"
  | "Unfavourable"
  | "Critical";

  type BaseRoomType =
  | "master_bedroom"
  | "bedroom"
  | "kitchen"
  | "toilet"
  | "living"
  | "pooja"
  | "dining"
  | "balcony"
  | "staircase"
  | "main_entrance"
  | "circulation"
  | "parking"
  | "storage"
  | "study"
  | "entertainment"
  | "service"
  | "overhead_tank"
  | "underground_tank"
  | "electrical"
  | "gym"
  | "pool"
  | "dressing"
  | "other";

function normalizeRoomType(type: RoomType): BaseRoomType {
  switch (type) {
    // bedrooms
    case "master_bedroom":
      return "master_bedroom";
    case "bedroom":
    case "kids_room":
    case "guest_room":
      return "bedroom";
    case "dressing_room":
      return "dressing";

    // bathrooms
    case "toilet":
    case "powder_room":
    case "bathroom":
      return "toilet";

    // core rooms
    case "kitchen":
      return "kitchen";
    case "living":
      return "living";
    // Entertainment rooms are active/evening-use spaces, not the social
    // "living room" zone — their own remedy templates (templates.ts) favour
    // West/North-West and caution against North-East, the opposite of what
    // the old bucketing (lumped in with "living") scored them on.
    case "media_room":
    case "home_theater":
    case "gaming_room":
    case "music_room":
    case "bar":
      return "entertainment";
    case "dining":
      return "dining";
    case "pooja":
      return "pooja";

    // outdoor → balcony bucket
    case "balcony":
    case "terrace":
    case "courtyard":
    case "verandah":
    case "sit_out":
    case "deck":
    case "garden":
    case "gazebo":
    case "pergola":
      return "balcony";

    case "main_entrance":
      return "main_entrance";

    // light circulation / transition spaces — similar directional guidance
    // to the entrance itself, per templates.ts
    case "foyer":
    case "porch":
    case "mud_room":
      return "circulation";

    // Lift gets the same directional treatment as a staircase — both are
    // "heavy" vertical-movement structural elements Vastu groups together
    // (avoid Brahmasthan/NE, prefer S/W/SW).
    case "staircase":
    case "lift":
      return "staircase";

    // heavy storage / wet-utility cluster
    case "basement":
    case "store":
    case "store_room":
    case "shoe_closet":
    case "utility":
    case "laundry":
    case "wash_area":
      return "storage";

    case "overhead_water_tank":
      return "overhead_tank";
    case "underground_water_tank":
      return "underground_tank";
    case "electrical_room":
      return "electrical";
    case "servant_room":
    case "maid_room":
      return "service";
    case "parking":
    case "garage":
      return "parking";
    case "gym":
      return "gym";
    case "pool":
      return "pool";

    case "study":
    case "home_office":
    case "library":
      return "study";

    default:
      return "other";
  }
}

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

/* -------------------------------------------------------------------------- */
/*  Rules below fill a gap where ~20 room types previously fell straight to   */
/*  scoreGeneric() regardless of direction. Each is grounded in the ideal /   */
/*  okay / avoid guidance already written for that room type in               */
/*  src/lib/templates.ts, kept in the same +4/+2/-2/-4/0 scale as the rules   */
/*  above. These are still one product's calibration of classical guidance,  */
/*  not an official numeric standard — treat exact point values as tunable.  */
/* -------------------------------------------------------------------------- */

function scoreMainEntrance(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "N":
    case "NE":
    case "E":
      return {
        scoreImpact: +4,
        verdict: "Auspicious",
        notes: "Classic ideal entrance direction — invites positive energy and opportunity.",
      };
    case "NW":
    case "SE":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Workable entrance direction with good upkeep and proportion.",
      };
    case "S":
    case "SW":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "Traditionally handled carefully; consider design corrections at the threshold.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreStaircase(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "S":
    case "W":
    case "SW":
      return {
        scoreImpact: +4,
        verdict: "Auspicious",
        notes: "Heavy structural element well anchored in a stable zone.",
      };
    case "NW":
    case "SE":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Manageable placement for a staircase.",
      };
    case "NE":
      return {
        scoreImpact: -4,
        verdict: "Critical",
        notes: "Staircase in North-East blocks the light, spiritual zone — strongly discouraged.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreDining(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "W":
    case "NW":
    case "E":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good zone for dining, especially near the kitchen.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "Dining directly in the spiritual North-East zone is usually avoided.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreBalcony(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "N":
    case "E":
    case "NE":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Pleasant, light-filled zone for open/outdoor space.",
      };
    default:
      // No forbidden direction for outdoor spaces — usability/upkeep matters
      // more than orientation here.
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreCirculation(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "N":
    case "E":
    case "NE":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Open, welcoming zone for an entrance-adjacent space.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreParking(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "W":
    case "NW":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good zone for vehicle movement without disturbing calmer areas.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "Avoid letting parking dominate the prime North-East zone.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreStorage(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "S":
    case "SW":
    case "W":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good zone to anchor heavier storage/utility mass.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "North-East is best kept light and open, not used for storage.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreStudy(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "NE":
    case "E":
      return {
        scoreImpact: +4,
        verdict: "Auspicious",
        notes: "Excellent zone for focus and clarity while studying/working.",
      };
    case "N":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good supporting zone for study or work.",
      };
    case "SW":
      return {
        scoreImpact: -1,
        verdict: "Average",
        notes: "Traditionally reserved for the master bedroom/stability zone; workable but not ideal.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreEntertainment(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "W":
    case "NW":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Comfortably hosts evening/active use without disturbing calmer zones.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "North-East is better reserved for calm, light activity than screen/entertainment use.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreService(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "NW":
    case "N":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Suitable transient/movement zone for service quarters.",
      };
    case "SW":
      return {
        scoreImpact: -1,
        verdict: "Average",
        notes: "South-West is usually reserved for the family's stability zone.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreOverheadTank(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "SW":
    case "S":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Heavy mass well anchored away from the lighter zones.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "A heavy overhead tank shouldn't dominate the light North-East zone.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreUndergroundTank(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "NE":
    case "N":
    case "E":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "The water element traditionally suits this zone.",
      };
    case "SW":
      return {
        scoreImpact: -1,
        verdict: "Average",
        notes: "South-West is the earth/stability zone, less suited to water storage.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreElectrical(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "SE":
    case "S":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Fire/energy-linked zone, a natural fit for electrical fittings.",
      };
    case "NE":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "Keep electrical/heat-generating equipment out of the North-East zone.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreGym(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "W":
    case "S":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good active zone for exercise/high-energy use.",
      };
    case "NE":
      return {
        scoreImpact: -1,
        verdict: "Average",
        notes: "High-activity use can conflict with the calmer North-East zone.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scorePool(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "NE":
    case "N":
    case "E":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Water bodies are traditionally favoured in this zone.",
      };
    case "SW":
      return {
        scoreImpact: -2,
        verdict: "Unfavourable",
        notes: "Water in the earth/stability zone is generally discouraged.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

function scoreDressing(direction: Direction): RoomScoreEval {
  switch (direction) {
    case "W":
    case "NW":
      return {
        scoreImpact: +2,
        verdict: "Favourable",
        notes: "Good supporting zone for a dressing area.",
      };
    default:
      return { scoreImpact: 0, verdict: "Average", notes: "" };
  }
}

/* -------------------------------------------------------------------------- */
/*                      CENTRE / BRAHMASTHAN ZONE                             */
/* -------------------------------------------------------------------------- */

// The core classical principle for the Brahmasthan isn't "which direction is
// best" (there's only one zone), it's "how much does this room's presence
// disturb keeping the centre open." So this branches on room TYPE, not on
// any further direction — heavier, fixed, or elemental rooms (fire/water/
// movement) are scored worse than an open courtyard or a light transitional
// space, which classical layouts actually favour at the exact centre.

const CENTRE_HEAVY_TYPES = new Set<BaseRoomType>([
  "kitchen",
  "toilet",
  "staircase",
  "storage",
  "overhead_tank",
  "underground_tank",
  "electrical",
  "parking",
  "service",
]);

const CENTRE_OPEN_TYPES = new Set<BaseRoomType>(["balcony"]);
const CENTRE_MILD_TYPES = new Set<BaseRoomType>(["circulation", "pooja"]);

function scoreCentreZone(baseType: BaseRoomType): RoomScoreEval {
  if (CENTRE_OPEN_TYPES.has(baseType)) {
    return {
      scoreImpact: +2,
      verdict: "Favourable",
      notes:
        "An open courtyard/light well at the exact centre (Brahmasthan) is one of the most classically auspicious layouts, as long as it stays open and uncluttered.",
    };
  }

  if (CENTRE_MILD_TYPES.has(baseType)) {
    return {
      scoreImpact: -1,
      verdict: "Average",
      notes:
        "Workable at the centre only if kept minimal and open — the Brahmasthan is traditionally kept as light and unobstructed as possible.",
    };
  }

  if (CENTRE_HEAVY_TYPES.has(baseType)) {
    return {
      scoreImpact: -4,
      verdict: "Critical",
      notes:
        "Fire, water, storage or heavy movement elements at the exact centre (Brahmasthan) are strongly discouraged in Vastu — this zone should stay open.",
    };
  }

  if (baseType === "other") {
    return {
      scoreImpact: 0,
      verdict: "Average",
      notes: "Vastu generally favours keeping the exact centre (Brahmasthan) open and unobstructed.",
    };
  }

  // Everything else (bedrooms, dining, living, main entrance, study,
  // entertainment, gym, pool, dressing): a fixed enclosed room disrupts the
  // "keep it open" principle, but isn't as severe as the heavy/elemental
  // types above.
  return {
    scoreImpact: -3,
    verdict: "Unfavourable",
    notes:
      "Building an enclosed room at the exact centre (Brahmasthan) goes against the classical principle of keeping this zone open.",
  };
}

function scoreRoom(type: RoomType, direction: Direction): RoomScoreEval {
    const baseType = normalizeRoomType(type);

    if (direction === "Centre") {
      return scoreCentreZone(baseType);
    }

    switch (baseType) {
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
      case "main_entrance":
        return scoreMainEntrance(direction);
      case "staircase":
        return scoreStaircase(direction);
      case "dining":
        return scoreDining(direction);
      case "balcony":
        return scoreBalcony(direction);
      case "circulation":
        return scoreCirculation(direction);
      case "parking":
        return scoreParking(direction);
      case "storage":
        return scoreStorage(direction);
      case "study":
        return scoreStudy(direction);
      case "entertainment":
        return scoreEntertainment(direction);
      case "service":
        return scoreService(direction);
      case "overhead_tank":
        return scoreOverheadTank(direction);
      case "underground_tank":
        return scoreUndergroundTank(direction);
      case "electrical":
        return scoreElectrical(direction);
      case "gym":
        return scoreGym(direction);
      case "pool":
        return scorePool(direction);
      case "dressing":
        return scoreDressing(direction);
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