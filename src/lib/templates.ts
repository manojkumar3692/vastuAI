// src/lib/templates.ts
import type { RoomType } from "@/types/vastu";
import { Verdict } from "./vastuRules";

/**
 * Static, room-level Vastu knowledge.
 *
 * AI will later:
 *  - look at (roomType, direction, verdict, notes)
 *  - pull the right static chunks from here
 *  - stitch + personalise per layout
 */
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
    foyer: "Foyer / Lobby",
    porch: "Porch",
    mud_room: "Mud Room",
  
    // Entertainment
    media_room: "Media Room",
    home_theater: "Home Theater",
    gaming_room: "Gaming Room",
    music_room: "Music Room",
    bar: "Bar / Lounge",
  
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
  
// helper to pretty print the type as a label
function prettyLabel(type: RoomType): string {
    return type
      .split("_")
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(" ");
  }
  
  const GENERIC_TEMPLATE_BASE: Omit<RoomStaticTemplate, "label"> = {
    purpose:
      "This room plays a functional role in your home’s comfort and energy balance. Its impact depends on how it is used and which direction it occupies.",
    idealDirections:
      "Certain directions are naturally more supportive for this room’s function. In your report we highlight the zones that enhance its role.",
    okayDirections:
      "Some directions are workable with lighter remedies and awareness around usage, colours and layout.",
    avoidDirections:
      "Highly sensitive or conflicting directions can create stress over time and are usually handled with stronger corrections or future planning.",
    nonStructuralRemedies:
      "Focus on cleanliness, decluttering, balanced lighting, appropriate colours and mindful usage to keep this area energetically stable without demolition.",
    structuralGuidance:
      "If you are renovating or building afresh, align this room with recommended Vastu zones and avoid cutting through very sensitive corners or the exact centre.",
    layoutAndUsageTips:
      "Keep the room well-ventilated, tidy and used for its primary purpose. Avoid turning it into a permanent junk or overflow area.",
  };
  
  export function getStaticTemplateForRoom(type: RoomType): RoomStaticTemplate {
    const fromMap = ROOM_STATIC_TEMPLATES[type];
  
    if (fromMap) {
      return fromMap;
    }
  
    const label = prettyLabel(type);
  
    // fallback generic template so TS is happy and runtime is safe
    return {
      label,
      ...GENERIC_TEMPLATE_BASE,
      // You can tweak text further if you want it to mention the label:
      purpose: `The ${label.toLowerCase()} plays an important role in your home’s comfort and energy balance. Its impact depends on how it is used and where it sits in the layout.`,
    };
  }

export type RoomStaticTemplate = {
  /** Clean label to show in UI / PDF (fallback to ROOM_TYPE_LABEL when needed) */
  label: string;

  /** 2–3 line explanation of what this room means in Vastu context */
  purpose: string;

  /** Ideal zones + why they are considered strong for this room */
  idealDirections: string;

  /** Directions that are workable / manageable with lighter remedies */
  okayDirections: string;

  /** Directions that are usually avoided or considered weak */
  avoidDirections: string;

  /** Generic non-demolition corrections (mirrors, colours, symbols, routines, etc.) */
  nonStructuralRemedies: string;

  /** If someone is renovating or building fresh, how should they correct / place this room */
  structuralGuidance: string;

  /** Short practical tips (sleeping, cooking, placing furniture, usage habits, etc.) */
  layoutAndUsageTips: string;
};





/**
 * Static templates per room type.
 *
 * These are direction-agnostic; we’ll let the scoring & AI layer decide how to
 * speak depending on N/NE/… + verdict, but the core wisdom lives here.
 */
export const ROOM_STATIC_TEMPLATES: Partial<
  Record<RoomType, RoomStaticTemplate>
> = {
  // ───────────────────────────────── Bedrooms ────────────────────────────────
  master_bedroom: {
    label: "Master Bedroom",
    purpose:
      "The master bedroom represents the stability, health and decision-making power of the head of the family. Vastu considers it the anchor of emotional and financial security in the home.",
    idealDirections:
      "South-West is considered the most auspicious zone for the master bedroom, as it supports long-term stability, grounded thinking and steady growth. South and West can also work well, especially in compact apartments, as long as toilets and heavy cut-outs are handled correctly.",
    okayDirections:
      "North-West and South-East can be manageable for a master bedroom when layout constraints exist, but they are better suited for guests or younger members. With careful bed placement, colours and lighting, these zones can still function without creating constant unrest.",
    avoidDirections:
      "North-East is generally discouraged for the master bedroom as it is a spiritual and 'light' zone; using it as the primary adult bedroom may bring overthinking, health drains or confusion. A master bedroom in the centre (Brahmasthan) or under major beams is also avoided where possible.",
    nonStructuralRemedies:
      "Keep the bed solid-backed against a stable wall, avoiding large windows directly behind the headboard. Use earthy, muted tones (beige, warm greys, soft browns) to stabilise energy. Remove clutter, broken items and work laptops from the bed zone. If the bedroom is in a lighter or more disturbed zone, add grounding elements like a thick rug, solid wooden furniture and warm, steady lighting.",
    structuralGuidance:
      "While planning or renovating, prioritise the South-West corner for the master bedroom, with toilets pushed to West/South sides where possible. Avoid placing the entrance door directly in line with the bed. Ensure adequate wall support behind the headboard and minimise sharp room cuts or large voids near the South-West corner of the flat.",
    layoutAndUsageTips:
      "Ideal sleeping posture is with the head towards South or East. Avoid mirrors directly facing the bed. Keep minimal electronics near the headboard, and avoid turning the bedroom into a full-fledged office. A calm, decluttered master bedroom supports more balanced decisions and steadier emotional responses in the family.",
  },

  bedroom: {
    label: "Bedroom",
    purpose:
      "Regular bedrooms support rest, healing and emotional balance for family members or guests. A Vastu-aligned bedroom encourages better sleep, mood and relationships.",
    idealDirections:
      "South, West and North-West are generally good for bedrooms. South-West suits elders or couples; North-West is well suited for guests or grown-up children who may be more mobile or likely to move out in the future.",
    okayDirections:
      "East-facing or South-East bedrooms can work for younger members or those with active lifestyles, provided colours and lighting are balanced. Minor adjustments in bed placement and usage patterns usually keep these rooms comfortable.",
    avoidDirections:
      "North-East is better reserved for Pooja, meditation or study. Using it purely as a bedroom can sometimes lead to restlessness or disturbed sleep, especially for adults. The exact centre of the house is also avoided for heavy sleeping furniture.",
    nonStructuralRemedies:
      "Keep under-bed storage clean and light; avoid storing old clothes, metal junk or files directly under the sleeping area. Use soothing pastel or earthy shades, dimmable warm lighting and minimal sharp décor. A simple salt bowl or indoor plant (where practical) can help keep the room feeling fresh and light.",
    structuralGuidance:
      "While planning layouts, place family bedrooms along the South and West bands wherever possible, with attached toilets aligned to West/South walls. Avoid narrow, dark bedrooms with very low ventilation; if such compromise is needed, prioritise it for occasional guest use rather than primary family members.",
    layoutAndUsageTips:
      "Place the bed so that, on waking, one can see the room door without being exactly in line with it. Avoid TVs/screens directly opposite the bed if possible. Keep wardrobes on heavier walls (South/West) and leave North/East lighter and more open for morning light.",
  },

  kids_room: {
    label: "Kids Room",
    purpose:
      "A kids’ bedroom supports growth, learning, curiosity and emotional security. It should feel playful yet grounded, allowing children to sleep well and focus better.",
    idealDirections:
      "East and North-East are excellent for children who are in their learning years, supporting clarity, focus and openness. North can also work well when good light and ventilation are present.",
    okayDirections:
      "North-West or South can be acceptable for kids’ rooms when space is limited. These zones may create more activity or movement, which suits some children but may need calming décor and routines.",
    avoidDirections:
      "Heavy South-West zones are typically reserved for the master/elders and can sometimes create stubbornness when used for children. Very noisy or dark corners with poor ventilation should also be avoided for kids where possible.",
    nonStructuralRemedies:
      "Use soft, cheerful colours like light mint, pastel blue, or soft yellow, avoiding overuse of dark reds or greys. Keep study desks in the North or East part of the room. Reduce clutter, especially unused toys and broken items, to keep the space feeling light and safe.",
    structuralGuidance:
      "If designing afresh, try to place kids’ bedrooms along the East or North band with a study nook that catches natural daylight. Keep heavy storage units along South/West walls and leave North/East more open. Avoid overhead beams directly above the study or bed area.",
    layoutAndUsageTips:
      "Place the bed so the head is towards East or South. Position the study desk so that the child faces East or North while studying. Keep gadget charging areas away from the bed and develop a routine for winding down without screens before sleep.",
  },

  guest_room: {
    label: "Guest Room",
    purpose:
      "A guest bedroom should feel welcoming and comfortable while remaining slightly 'light' in attachment, allowing guests to come and go smoothly without energetic stagnation.",
    idealDirections:
      "North-West is traditionally preferred for guest rooms, as it supports temporary stays and smooth departures. It keeps the energy dynamic without creating over-attachment or friction.",
    okayDirections:
      "North, East, or South can also be used for guest rooms if other bedrooms are already allocated. These placements work well when the room is used occasionally.",
    avoidDirections:
      "South-West is rarely recommended for guest rooms, as that zone is associated with long-term stability and should ideally be used by the head of the family.",
    nonStructuralRemedies:
      "Keep décor neutral and clutter-free. Use fresh linens, soft lighting and minimal heavy furniture. Avoid storing the family’s long-term junk in the guest room, as that can make the space heavy and underused.",
    structuralGuidance:
      "When planning, keep the guest room relatively independent, with easy access to a common toilet. A North-West placement works very well in multi-bedroom layouts.",
    layoutAndUsageTips:
      "Place the bed with the head towards South, West or East. Avoid positioning the bed directly opposite the room door. A compact wardrobe and a small seating space make the room more functional without overloading it.",
  },

  // ───────────────────────────────── Core rooms ──────────────────────────────
  living: {
    label: "Living Room",
    purpose:
      "The living room is the social heart of the house, where guests are received and family members gather. It carries the first impression of the home’s energy and harmony.",
    idealDirections:
      "North, East and North-East are generally recommended for living rooms as they keep this space bright, open and welcoming. These directions encourage social harmony and a lighter atmosphere.",
    okayDirections:
      "North-West and South can also function well, especially in modern apartments, as long as they receive adequate light and the heavy furniture is placed thoughtfully.",
    avoidDirections:
      "A very heavy, dark living space in South-West with poor ventilation can sometimes feel dull or stagnant. If unavoidable, it should be balanced with light, colours and active usage.",
    nonStructuralRemedies:
      "Use brighter colours and artwork near the North/East walls, and keep heavy storage or bulky sofas to South/West. Avoid cluttered shoe racks or broken items near the main entrance. Ensure good airflow and maintain cleanliness as this room carries the outer-facing energy of the home.",
    structuralGuidance:
      "If designing from scratch, place the main living or drawing room towards the front of the house, ideally in the North or East side. Keep circulation easy, with clear pathways and minimal sharp corners jutting into seating areas.",
    layoutAndUsageTips:
      "Arrange seating so that the head of the family faces East or North while interacting. Keep TV or media units against South/West walls where possible. Maintain some open floor area in the living room so energy can circulate and the space doesn’t feel cramped.",
  },

  kitchen: {
    label: "Kitchen",
    purpose:
      "The kitchen is the Agni (fire) centre of the home, influencing nourishment, health and financial flow. A balanced kitchen supports both physical vitality and family bonding.",
    idealDirections:
      "South-East is the classical ideal zone for the kitchen, as it aligns the fire element with the rising sun. East and South can also be favourable when the stove and sink are placed thoughtfully.",
    okayDirections:
      "North-West can be a workable zone for the kitchen in apartments where SE is not available, especially if cooking is done more during evening hours. Careful handling of colours and fire-sink distances becomes important here.",
    avoidDirections:
      "North and North-East are typically avoided for the main kitchen, as they are lighter, spiritual and financial zones; placing heavy fire here may disturb clarity and finances over time.",
    nonStructuralRemedies:
      "Keep the stove clean and functional; avoid placing it directly under overhead beams. Use warm but not overly dark colours (peach, soft terracotta, mild yellow). Maintain clear separation between water and fire zones – don’t keep the sink and stove touching each other. Use ample lighting so the cooking area never feels gloomy.",
    structuralGuidance:
      "When planning, place the kitchen in the South-East or East side where possible. Arrange the stove so the main cook ideally faces East while cooking. Keep heavier storage and fridge along South/West walls, and leave North/East slightly lighter.",
    layoutAndUsageTips:
      "Avoid cluttered countertops and leaking taps. Store grains and groceries neatly, preferably along a South or West wall. Keep trash covered and ideally in a South/South-West corner of the kitchen, cleared regularly.",
  },

  dining: {
    label: "Dining",
    purpose:
      "The dining area is where nourishment is actually taken in; it influences family bonding, communication and the way food energy is received.",
    idealDirections:
      "West and North-West are often suitable for dining spaces, especially when located near the kitchen. East can also be good, particularly when morning meals or breakfast are taken there.",
    okayDirections:
      "South or Central zones can work as open-plan dining areas in modern layouts, provided they are well-lit and not cramped between circulation paths.",
    avoidDirections:
      "Very dark or congested corners with no ventilation are best avoided for dining, as they can dull appetite and mood. Placing the primary dining space directly in the North-East may sometimes conflict with its spiritual/meditative nature.",
    nonStructuralRemedies:
      "Keep the dining table clutter-free and in good repair. Use warm, pleasant colours and comfortable seating. Avoid storing heavy junk, cleaning tools or rarely used boxes around the eating area.",
    structuralGuidance:
      "Design the dining area adjacent or close to the kitchen for ease and to avoid food being carried across long corridors. Maintain decent circulation around the table and avoid low beams directly over the main seating positions.",
    layoutAndUsageTips:
      "If possible, family members should face East, North or West while eating. Avoid placing the main dining chair with the back directly to the entrance of the room. Keep a soft, warm light over the table to create an inviting atmosphere.",
  },

  pooja: {
    label: "Pooja Room",
    purpose:
      "The Pooja or altar area is the spiritual anchor of the home, where prayer, gratitude and meditation are centred. Its placement gently tunes the overall vibration of the house.",
    idealDirections:
      "North-East is traditionally the most auspicious zone for a Pooja room, followed by East and North. These directions support clarity, faith and balanced thought.",
    okayDirections:
      "In compact flats, a calm niche in the North or East of the living room or bedroom can work, provided it is kept clean, elevated and undisturbed by heavy noise.",
    avoidDirections:
      "South, South-West and directly in front of toilets are usually avoided for Pooja. Placing the altar under a staircase or in a store room tends to dilute its energy.",
    nonStructuralRemedies:
      "Keep the Pooja area clutter-free, with only essential idols or pictures. Use soft, natural colours and gentle lighting. Ensure incense, lamps and candles are handled safely, and avoid storing unrelated items beneath the altar.",
    structuralGuidance:
      "If designing new, allocate a small but dedicated space in the North-East or East side. Provide for good ventilation and the option to close the area neatly when not in use. Avoid heavy storage directly above the altar in upper cabinets.",
    layoutAndUsageTips:
      "Ideally, one faces East or North while praying. Keep regular cleaning routines and avoid placing footwear or dustbins near the Pooja area. Try to maintain a calm boundary around this space, away from TV noise and loud conversations.",
  },

  // ──────────────────────────────── Bathrooms / Toilets ─────────────────────
  toilet: {
    label: "Toilet / Bath",
    purpose:
      "Toilets and baths handle waste elimination and cleansing. In Vastu, they’re treated carefully to prevent energy leakage or contamination of sensitive zones.",
    idealDirections:
      "North-West and South-East are generally considered manageable zones for toilets, especially in modern apartments. With proper ventilation and dryness, they function without major disturbance.",
    okayDirections:
      "South and West can work for toilets when they are aligned on the outer periphery and not cutting into key bedrooms or the North-East zone. Proper drainage and exhaust are critical here.",
    avoidDirections:
      "North and North-East are usually avoided for toilets as they can affect finances, clarity and health. Toilets in the exact centre of the property are also considered very problematic.",
    nonStructuralRemedies:
      "Keep the toilet dry, clean and well-ventilated. Use lighter, fresher colours (off-whites, light greys, soft blues). Always keep the door and WC lid closed when not in use. A simple salt bowl, indoor plant (where practical) and regular deep cleaning can significantly reduce negative impact.",
    structuralGuidance:
      "While planning, push toilets to the outer edges of the layout wherever possible, ideally in North-West, West, South or South-East bands. Avoid placing them directly opening into kitchens, Pooja rooms or very tight corridors.",
    layoutAndUsageTips:
      "Ensure proper slope towards the drain, no persistent dampness on walls, and a good-quality exhaust fan. Avoid heavy storage of junk inside toilet shafts. Keep personal-care items organised and discard expired products regularly.",
  },

  powder_room: {
    label: "Powder Room",
    purpose:
      "A powder room is a compact toilet/wash area mainly for guests. It should be functional, hygienic and discrete.",
    idealDirections:
      "North-West is ideal for guest-oriented toilets as it supports temporary use. South-East or West can also be acceptable, especially near living/dining zones.",
    okayDirections:
      "South or West segments of central/lobby areas can host a powder room if space is constrained. Key is to keep it dry, odour-free and visually screened.",
    avoidDirections:
      "North-East and exact centre should be avoided for any toilet, including compact powder rooms. Placing them directly opposite the main entrance is also discouraged.",
    nonStructuralRemedies:
      "Focus on strong ventilation, good odour control and regular cleaning. Use light wall colours and smart, compact fittings to keep the space from feeling cramped.",
    structuralGuidance:
      "When planning, tuck powder rooms along circulation zones connecting living/dining to bedrooms, without letting them open directly into main social spaces.",
    layoutAndUsageTips:
      "Keep the door discreetly placed, add a small mirror and handwash area, and ensure there is no water stagnation on the floor.",
  },

  bathroom: {
    label: "Bathroom",
    purpose:
      "Full bathrooms, especially attached ones, combine cleansing, relaxation and sometimes toilet usage. Their design affects both comfort and subtle energy hygiene.",
    idealDirections:
      "Similar to toilets, the North-West, West, South and South-East bands are generally more manageable for bathrooms, especially when attached to bedrooms.",
    okayDirections:
      "Where layouts are tight, a bathroom towards the outer South or West edges of the flat can be acceptable if kept dry and well ventilated.",
    avoidDirections:
      "North-East and exact centre are best avoided for wet, heavy bathroom blocks. Large, always-damp bathrooms in these zones are considered problematic in Vastu.",
    nonStructuralRemedies:
      "Prioritise dryness: good exhaust, sunlight where possible, and proper tiling. Use light, clean colours. Keep storage neat and avoid hoarding unused products.",
    structuralGuidance:
      "During planning, stack bathrooms vertically where possible to simplify plumbing and keep all wet areas in a defined band rather than scattered across sensitive zones.",
    layoutAndUsageTips:
      "Separate dry and wet zones inside the bathroom. Keep electrical points away from water sources and ensure all fixtures are maintained in working order.",
  },

  // ─────────────────────────────── Entrance / circulation ────────────────────
  main_entrance: {
    label: "Main Entrance",
    purpose:
      "The main entrance is the mouth of energy for the home. It strongly influences first impressions, opportunities and the overall feel of the space.",
    idealDirections:
      "North, North-East and East-facing entrances are generally considered positive in classical Vastu, provided they are well-proportioned and well-maintained. A clean, bright entry invites supportive energy.",
    okayDirections:
      "North-West and South-East entrances can also function well when proportioned correctly and not congested. Small corrections in lighting and usage can keep these zones harmonious.",
    avoidDirections:
      "Very low, dark or obstructed entrances, especially when combined with sharp cuts or heavy clutter, are discouraged irrespective of direction. In some traditions, specific South or South-West placements are handled carefully or corrected with design.",
    nonStructuralRemedies:
      "Keep the entrance clean, well-lit and free from broken shoes, dustbins or heavy clutter. Use a good-quality nameplate and a simple, auspicious symbol if culturally appropriate. Avoid squeaky, damaged doors.",
    structuralGuidance:
      "In planning, ensure the entrance feels proportionate to the home size, with a small transition area (foyer) if possible. Avoid creating immediate visual clutter or sharp corners jutting into the entry path.",
    layoutAndUsageTips:
      "Ensure easy opening and closing of the door, no major obstacles immediately behind it, and a gentle sense of welcome — plants, soft lighting and minimum noise help.",
  },

  foyer: {
    label: "Foyer / Lobby",
    purpose:
      "The foyer is the buffer zone between outside and inside. It helps 'filter' external energy before one enters the main living or private zones.",
    idealDirections:
      "A foyer aligned with the main entrance in North, East or North-East tends to feel open and welcoming. It should not be too cramped or dark.",
    okayDirections:
      "Compact lobbies in South, West or North-West can still function well if they are decluttered and not overloaded with storage.",
    avoidDirections:
      "Extremely tight foyers stuffed with shoes, boxes and heavy storage are best avoided, as they choke the entry energy regardless of direction.",
    nonStructuralRemedies:
      "Use soft, warm lighting, a simple console or shoe unit and a mirror placed thoughtfully (not exactly facing the main door). Avoid turning the foyer into a dumping ground.",
    structuralGuidance:
      "When planning, allocate at least a small breathing space inside the door before opening into major rooms. This helps psychologically and energetically.",
    layoutAndUsageTips:
      "Keep circulation easy, avoid sharp corners at head height, and keep décor minimal yet welcoming.",
  },

  porch: {
    label: "Porch / Entry Sit-out",
    purpose:
      "The porch acts as a semi-open transition space, often used for casual seating or parking. It shapes first impressions of the home.",
    idealDirections:
      "North and East-facing porches with good light and airflow feel welcoming and active. They also support morning light exposure.",
    okayDirections:
      "South and West porches can be used effectively with shading and cooling elements, especially in hot climates.",
    avoidDirections:
      "Porches cluttered with junk, broken items or constantly damp surfaces should be avoided, as they send a poor signal before entering the home.",
    nonStructuralRemedies:
      "Use plants, clean flooring and simple seating. Avoid storing unused equipment or garbage here. Keep the area well-lit at night.",
    structuralGuidance:
      "Design porches with adequate shelter from rain and harsh sun, while still allowing visual openness towards the street or compound.",
    layoutAndUsageTips:
      "Avoid blocking the main door with parked vehicles. Keep a clear walking path and maintain cleanliness.",
  },

  mud_room: {
    label: "Mud Room",
    purpose:
      "A mud room is a functional buffer where shoes, bags and outdoor items are parked before entering the cleaner inner home.",
    idealDirections:
      "Near the main entrance, ideally along North, North-West or West, where it can catch dust and outdoor energy before it spreads inside.",
    okayDirections:
      "South or South-West edges near secondary entrances can also host a mud room in larger houses.",
    avoidDirections:
      "Deep inside the core of the house or right next to Pooja/dining zones, as it brings dust and clutter into sensitive areas.",
    nonStructuralRemedies:
      "Use organised storage, closed cabinets and easy-to-clean flooring. Avoid piling shoes and bags in an open heap.",
    structuralGuidance:
      "Plan adequate hooks, shelves and benches for sitting and removing footwear. Provide good ventilation and clear separation from the main living areas.",
    layoutAndUsageTips:
      "Maintain a simple rule: outdoor items stay in the mud room; indoor areas remain cleaner and calmer.",
  },

  staircase: {
    label: "Staircase",
    purpose:
      "Staircases move energy between levels. Their placement and direction affect how smoothly movement and growth occur in the home.",
    idealDirections:
      "South, West and South-West are often preferred for heavier elements like staircases, as they help anchor the structure.",
    okayDirections:
      "North-West and South-East can manage staircases in some layouts, provided they don’t cut through key centres.",
    avoidDirections:
      "A staircase in the exact centre (Brahmasthan) or dominating the North-East corner is usually avoided, as it can create a feeling of pressure or blockage.",
    nonStructuralRemedies:
      "Keep staircases well-lit, clean and free of junk storage under steps. Avoid very steep, squeaky or damaged stairs. Use balanced colours and railings for safety.",
    structuralGuidance:
      "While planning, avoid placing toilets directly under the staircase or creating head-injury-prone low areas. Ensure comfortable riser-tread proportions and smooth handrail design.",
    layoutAndUsageTips:
      "Discourage using staircases as long-term storage zones. Maintain equal step heights and avoid missing or oddly sized steps.",
  },

  basement: {
    label: "Basement",
    purpose:
      "Basements represent the subconscious foundation of the home — storage, utilities or special activity areas like gyms or home theatres.",
    idealDirections:
      "If used, basements are better placed under South or West portions of the house, keeping lighter North and East less burdened.",
    okayDirections:
      "Full-plot basements are common in some designs; in such cases, proper light wells, ventilation and usage planning become more important than direction alone.",
    avoidDirections:
      "Dark, damp basements used for random junk storage are discouraged, as they can symbolically and practically weigh the house down.",
    nonStructuralRemedies:
      "Focus on ventilation, dehumidification and cleanliness. Clearly organise storage instead of keeping random piles.",
    structuralGuidance:
      "Plan basements with clear functions (parking, recreation, storage) rather than as undefined leftover space. Provide safe stair access and emergency exits.",
    layoutAndUsageTips:
      "Avoid spending long hours daily in very low-light, low-ventilation basements. Keep heavy documents, heirlooms and valuables neatly arranged.",
  },

  // ─────────────────────────────── Outdoor / balconies ───────────────────────
  balcony: {
    label: "Balcony",
    purpose:
      "Balconies act as lungs of the home, allowing fresh air, light and visual openness. They also influence mood and connection to the outside world.",
    idealDirections:
      "North, East and North-East balconies bring pleasant light and are generally considered beneficial for morning exposure and mental freshness.",
    okayDirections:
      "West-facing balconies receive stronger afternoon light; they can be made comfortable with shading and plants. South balconies can also work with proper heat management.",
    avoidDirections:
      "There is no forbidden direction for balconies, but structurally weak, cluttered or unsafe balconies are best avoided regardless of orientation.",
    nonStructuralRemedies:
      "Keep balconies tidy, with well-maintained plants and comfortable seating. Avoid turning them into permanent dump zones for unused items.",
    structuralGuidance:
      "Plan balcony depths to be usable, not just symbolic. Ensure proper railing height, waterproofing and drainage.",
    layoutAndUsageTips:
      "Use the balcony consciously for relaxation, light exercise or quiet time rather than only as a clothes-drying bay, if possible.",
  },

  terrace: {
    label: "Terrace",
    purpose:
      "Terraces provide open-sky relief, useful for gatherings, gardening or quiet reflection. They also influence the thermal behaviour of the house.",
    idealDirections:
      "Terraces that open more to East or North can be cooler and more comfortable. Partial pergolas can help manage harsh light from South/West.",
    okayDirections:
      "Any direction can work with proper shading and railing, but usability and safety are key.",
    avoidDirections:
      "Unprotected, cluttered terraces with weak parapets or water stagnation are best avoided.",
    nonStructuralRemedies:
      "Maintain waterproofing, keep drains clear and avoid heavy, random storage on terraces. Use plants and simple seating to create a soothing environment.",
    structuralGuidance:
      "Plan access and parapets carefully, and avoid loading terraces with overweight structures without proper engineering.",
    layoutAndUsageTips:
      "Use terrace time consciously for health (walking, sunlight) and relaxation instead of ignoring the space entirely.",
  },

  courtyard: {
    label: "Courtyard",
    purpose:
      "An internal courtyard (angan) acts as a light well and energy centre, often used for community, family gatherings or quiet reflection.",
    idealDirections:
      "Courtyards placed near the central band, with light from East or North, help keep the home breathable and pleasant.",
    okayDirections:
      "Offset courtyards can still work if they allow good cross-ventilation and light penetration into inner rooms.",
    avoidDirections:
      "Fully covered or dark 'courtyards' that don’t actually bring light or air can become dead zones rather than positive centres.",
    nonStructuralRemedies:
      "Keep the courtyard clean, minimally furnished and open to the sky wherever possible. Plants and simple seating enhance the feel.",
    structuralGuidance:
      "Plan rainwater handling, floor levels and shading consciously so the courtyard is usable in multiple seasons.",
    layoutAndUsageTips:
      "Use the courtyard for family time, prayer, yoga or quiet reading to make the most of this high-value element.",
  },

  verandah: {
    label: "Verandah",
    purpose:
      "A verandah is a semi-open sitting and transition area, often connecting the house to the garden or street.",
    idealDirections:
      "North and East verandahs feel pleasant for morning activities; West and South verandahs can be used later in the day with shading.",
    okayDirections:
      "Any direction can work as long as climate and usage are considered; verandahs expand functional space and soften the indoor-outdoor boundary.",
    avoidDirections:
      "N/A – the challenge is not direction but poor maintenance or clutter.",
    nonStructuralRemedies:
      "Keep seating simple and comfortable, avoid overloading with storage and ensure good flooring and cleanliness.",
    structuralGuidance:
      "Plan covered verandahs with adequate head height and safe railings or boundaries.",
    layoutAndUsageTips:
      "Use as a calm buffer rather than a dumping space. A well-used verandah improves both lifestyle and Vastu feel.",
  },

  sit_out: {
    label: "Sit-out",
    purpose:
      "A sit-out is a small, informal sitting corner near the entrance or garden, used for quick chats or relaxation.",
    idealDirections:
      "Near the North or East side of the house, a sit-out can provide pleasant light and social connection.",
    okayDirections:
      "South or West sit-outs can work with adequate shading from intense sun.",
    avoidDirections:
      "None specifically; main caution is to avoid blocking circulation or over-cluttering.",
    nonStructuralRemedies:
      "Use compact, weather-resistant furniture and keep the area neat.",
    structuralGuidance:
      "While planning, carve a small but usable niche that doesn’t eat into essential circulation.",
    layoutAndUsageTips:
      "Use the sit-out for calm, low-stress activities that reset your mood.",
  },

  deck: {
    label: "Deck",
    purpose:
      "A deck is a raised outdoor platform, often used for leisure, dining or gatherings.",
    idealDirections:
      "East and North decks feel comfortable for much of the day. South/West decks need shading and cooling strategies.",
    okayDirections:
      "Any direction with appropriate design can work; the main goal is usability and safety.",
    avoidDirections:
      "N/A directionally – but decks without proper structural support or waterproofing are discouraged.",
    nonStructuralRemedies:
      "Keep deck surfaces clean and non-slippery. Avoid heavy clutter and ensure safe railing heights.",
    structuralGuidance:
      "Plan structural support correctly and integrate the deck with the interior circulation.",
    layoutAndUsageTips:
      "Use as an extension of indoor living, not as a forgotten platform.",
  },

  garden: {
    label: "Garden",
    purpose:
      "Gardens bring the Earth element, greenery and seasonal life into the property, supporting health and mood.",
    idealDirections:
      "North and East gardens are especially refreshing, while small, well-kept patches in any direction are valuable.",
    okayDirections:
      "South and West gardens can be warm but still beneficial with appropriate planting and shade trees.",
    avoidDirections:
      "Neglected, overgrown or littered gardens are discouraged irrespective of direction.",
    nonStructuralRemedies:
      "Keep paths defined, plants healthy and waste cleared. Use appropriate lighting and avoid water stagnation.",
    structuralGuidance:
      "Plan irrigation, drainage and access clearly so the garden is easy to maintain.",
    layoutAndUsageTips:
      "Spend regular time in the garden for grounding and relaxation; this strengthens its positive impact.",
  },

  gazebo: {
    label: "Gazebo",
    purpose:
      "A gazebo provides a shaded outdoor sitting area, ideal for relaxation or social time.",
    idealDirections:
      "Placed in a pleasant part of the garden, often towards North, East or a scenic corner of the property.",
    okayDirections:
      "Any direction can be workable; view, shade and wind direction matter more practically.",
    avoidDirections:
      "Placing a gazebo in a cramped or noisy corner defeats its calming purpose.",
    nonStructuralRemedies:
      "Use comfortable seating and light décor; keep the area clean and inviting.",
    structuralGuidance:
      "Ensure structural stability, safe roofing and long-term durability against weather.",
    layoutAndUsageTips:
      "Use for quiet conversations, reading or light family time to maximise its value.",
  },

  pergola: {
    label: "Pergola",
    purpose:
      "Pergolas filter light and create semi-shaded transitions over decks, pathways or sit-out areas.",
    idealDirections:
      "Over South or West openings, pergolas help soften harsh light. Over East/North they create ambience without much heat.",
    okayDirections:
      "Any direction is fine if the design suits the climate and usage.",
    avoidDirections:
      "None directionally; unsafe or poorly anchored pergolas should be avoided.",
    nonStructuralRemedies:
      "Train lightweight creepers or add fabric shading where appropriate; maintain the structure regularly.",
    structuralGuidance:
      "Design for wind loads and water drainage; integrate with the building envelope.",
    layoutAndUsageTips:
      "Combine pergolas with seating or walkways to make them truly functional.",
  },

  // ─────────────────────────────── Parking / service / storage ──────────────
  parking: {
    label: "Parking",
    purpose:
      "Parking areas handle vehicles and movement. They should be functional without overwhelming the entrance or garden.",
    idealDirections:
      "North-West and West are often used for parking zones, as they keep movement dynamic without dominating the calm zones.",
    okayDirections:
      "South or front-side parking can work if circulation is smooth and the entrance is still visually clear.",
    avoidDirections:
      "Completely blocking the main entrance view or packing vehicles into the central open space is discouraged.",
    nonStructuralRemedies:
      "Keep parking lines clear, avoid random junk and maintain good lighting.",
    structuralGuidance:
      "Plan driveways, turning radii and drainage carefully, especially in compact plots.",
    layoutAndUsageTips:
      "Keep one clean pedestrian path free from parked vehicles, especially for elders and children.",
  },

  garage: {
    label: "Garage",
    purpose:
      "A garage provides covered parking and storage for vehicles and related items.",
    idealDirections:
      "West, North-West or South are commonly used, aligning heavier masses away from light, open zones.",
    okayDirections:
      "Stand-alone garages can be placed on any side if circulation and aesthetics are handled well.",
    avoidDirections:
      "Blocking prime North-East open areas with a bulky garage is usually avoided in traditional layouts.",
    nonStructuralRemedies:
      "Keep the garage organised instead of hoarding random clutter. Ensure good ventilation and lighting.",
    structuralGuidance:
      "Plan adequate door width, headroom and safe slopes if ramps are used.",
    layoutAndUsageTips:
      "Separate daily-use items from long-term storage to keep the garage efficient and not overwhelming.",
  },

  store: {
    label: "Store / Utility",
    purpose:
      "Store rooms hold bulk items, seasonal goods and household reserves. They represent how the family manages 'backup' resources.",
    idealDirections:
      "South, South-West and West are generally suitable for storage, as they anchor heavier items.",
    okayDirections:
      "North-West can also host compact stores if space is tight, provided clutter is controlled.",
    avoidDirections:
      "North-East and centre are usually kept light and open, not overloaded with storerooms.",
    nonStructuralRemedies:
      "Label and organise storage racks. Clear out expired or unused items regularly to prevent stagnation.",
    structuralGuidance:
      "Plan a modest store size with proper shelving and ventilation rather than a dark, overstuffed box.",
    layoutAndUsageTips:
      "Schedule periodic clearing and re-organisation; a clean store room reflects smoother mental and financial organisation.",
  },

  store_room: {
    label: "Store Room",
    purpose:
      "A dedicated store room holds grains, utensils, seasonal clothes or household stock.",
    idealDirections:
      "South-West, South or West are usually preferred for storing heavy, long-term items.",
    okayDirections:
      "North-West can also be used if the room is kept tidy and not overloaded.",
    avoidDirections:
      "North-East and the exact centre are not ideal for heavy, stagnant storage.",
    nonStructuralRemedies:
      "Use strong racks, clear labelling and regular cleaning. Avoid dumping random junk.",
    structuralGuidance:
      "Place the store away from main social and spiritual zones, anchoring it in heavier bands.",
    layoutAndUsageTips:
      "Review stored items periodically; donate or discard what is no longer needed.",
  },

  shoe_closet: {
    label: "Shoe Closet",
    purpose:
      "A shoe closet keeps footwear organised and prevents clutter from spreading near the entrance and inner rooms.",
    idealDirections:
      "Near the entrance in North, North-West or West bands, but discreet and well-closed.",
    okayDirections:
      "South or South-West corners near secondary entries can also work.",
    avoidDirections:
      "Within Pooja, living room centre or bedroom core zones. Avoid open shoe piles in front of the main door.",
    nonStructuralRemedies:
      "Use closed cabinets, keep shoes clean and arrange them regularly. Avoid mixing very old, damaged footwear with daily pairs.",
    structuralGuidance:
      "Provide a ventilated cabinet or niche near the entrance rather than open racks spilling into circulation.",
    layoutAndUsageTips:
      "Encourage the habit of placing shoes in the closet rather than scattering them across the foyer or corridor.",
  },

  // ─────────────────────────────── Work / study / office ────────────────────
  study: {
    label: "Study Room",
    purpose:
      "A study room supports focused learning, planning and mental clarity for students or working adults.",
    idealDirections:
      "North-East and East are excellent for study spaces, supporting concentration and calm thinking. North also works well.",
    okayDirections:
      "West or North-West can work for short, energetic study sessions with proper layout and lighting.",
    avoidDirections:
      "Very noisy, dark or heavily cluttered corners are more damaging than direction alone. South-West is usually reserved for master bedroom or core stability rather than pure study.",
    nonStructuralRemedies:
      "Use calm, light colours and good task lighting. Keep the desk clutter-free and avoid facing a blank wall too closely. Arrange books neatly and ensure proper ventilation.",
    structuralGuidance:
      "Plan windows to the North or East of the study area where possible. Provide adequate storage so the study surface remains free for actual work.",
    layoutAndUsageTips:
      "Ideally, one faces East or North while studying. Avoid placing the study desk directly under a heavy beam or in a circulation path.",
  },

  media_room: {
    label: "Media Room",
    purpose:
      "A media room is a relaxed entertainment zone for movies, shows and casual hangouts. In Vastu, it’s treated as an active, recreational space that should not overpower the calm zones of the home.",
    idealDirections:
      "West and North-West are generally suitable for media rooms, as they comfortably host evening activities and screen time without disturbing the lighter North-East zones.",
    okayDirections:
      "South or South-East can also be used for media/TV rooms in modern layouts, especially where families gather more in the evenings.",
    avoidDirections:
      "North-East and the exact centre are better reserved for calm, light and spiritual or social spaces rather than intense screen-focussed activity.",
    nonStructuralRemedies:
      "Use good soundproofing, soft furnishings and controlled lighting (dimmers, wall lamps) to prevent harsh glare. Keep cables organised and avoid turning the room into a permanent clutter zone of gadgets and boxes.",
    structuralGuidance:
      "When planning, place the media wall on a solid South or West wall where possible, with seating opposite. Provide for ventilation, acoustic treatment and minimal sound leakage into bedrooms.",
    layoutAndUsageTips:
      "Avoid placing the main TV directly opposite a bedroom bed or Pooja area. Keep some rule around screen time so this room remains a place of joy rather than overstimulation.",
  },

  home_theater: {
    label: "Home Theater",
    purpose:
      "A home theater is a specialised, darkened room optimised for immersive movie or audio-visual experiences. It carries intense sound and visual stimulation.",
    idealDirections:
      "West, North-West and South are well-suited for home theaters, particularly if they are more active during evenings or nights.",
    okayDirections:
      "South-West can host a home theater in larger houses if bedrooms and Pooja zones are not directly adjacent and soundproofing is strong.",
    avoidDirections:
      "North-East, central zones and directly above or below very sensitive rooms (like Pooja or master bedroom) are generally avoided for heavy, loud home theaters.",
    nonStructuralRemedies:
      "Use acoustic panels, rugs and soft upholstery to absorb sound. Keep emergency lighting handy, and avoid storing random junk behind false panelling.",
    structuralGuidance:
      "Plan wall thickness, door placement and ventilation from the start. Avoid low ceilings with multiple beams that create oppressive, boxy spaces.",
    layoutAndUsageTips:
      "Arrange seating so viewers are not too close to the screen. Maintain pathways for safe exit in low light and keep wiring/cables properly concealed.",
  },

  gaming_room: {
    label: "Gaming Room",
    purpose:
      "A gaming room (console, PC or board games) is a high-activity zone, often linked to fun, competition and focus. In Vastu, it’s treated as a lively but potentially overstimulating area.",
    idealDirections:
      "West and North-West are good for gaming zones, supporting social play and temporary intensity without disturbing the main calm zones.",
    okayDirections:
      "South or South-East can also handle gaming rooms, especially for younger members, provided routines and noise levels are balanced.",
    avoidDirections:
      "North-East is best avoided for heavy, high-energy gaming setups, as it is ideally kept calm and meditative.",
    nonStructuralRemedies:
      "Use ergonomic seating, controlled lighting and limited visual clutter. Avoid excessive dark colours and neon everywhere; balance with some grounding, neutral tones.",
    structuralGuidance:
      "Allow for ventilation and cooling (gaming equipment generates heat). Plan enough power outlets and cable management from the start.",
    layoutAndUsageTips:
      "Encourage breaks and avoid placing the gaming room right next to bedrooms of people who prefer quiet. Keep a time boundary so gaming does not spill aggressively into all hours.",
  },

  music_room: {
    label: "Music Room / Jam Room",
    purpose:
      "A music or jam room holds instruments, practice and creative sound. It can be both expressive and therapeutic when balanced well.",
    idealDirections:
      "East and North-East are good for classical, devotional or meditative music spaces. West and North-West can be suitable for more casual or band-style jam rooms.",
    okayDirections:
      "South or South-East can work for passionate practice sessions, provided acoustics and neighbours are considered.",
    avoidDirections:
      "There is no absolute forbidden direction, but loud, unbuffered music directly in very sensitive bedroom or Pooja walls should be handled carefully.",
    nonStructuralRemedies:
      "Use basic acoustic treatment to reduce echo. Keep instruments clean and in good repair; avoid dumping broken or unused equipment everywhere.",
    structuralGuidance:
      "Provide safe storage for instruments, decent natural or soft artificial light and comfortable seating or standing space.",
    layoutAndUsageTips:
      "Create dedicated zones for different instruments. Maintain some schedule so practice stays harmonious for the household, not a constant disturbance.",
  },

  bar: {
    label: "Bar / Lounge Counter",
    purpose:
      "A home bar or lounge counter is a leisure element used for entertaining guests and unwinding. In Vastu, it is treated as a discretionary luxury feature to be placed sensitively.",
    idealDirections:
      "West, South or North-West corners of living or entertainment zones are generally used for bars, keeping them slightly away from the spiritual and sleep zones.",
    okayDirections:
      "South-East can host a bar as an extension of dining or entertainment areas in some modern layouts, provided it is handled tastefully.",
    avoidDirections:
      "North-East, Pooja areas and bedrooms are typically avoided for bar counters or alcohol storage. Placing a bar in the exact entrance line is also discouraged.",
    nonStructuralRemedies:
      "Keep the bar neat, well-lit and not overstocked in visible clutter. Avoid making it the visual centre of the entire home; let it remain a corner feature.",
    structuralGuidance:
      "Design with closed storage, proper glass safety and easy cleaning in mind. Avoid placing it directly under low beams or in very cramped niches.",
    layoutAndUsageTips:
      "Use the bar moderately and ensure it does not become an emotional escape centre. Keep water, snacks and seating nearby so the usage feels relaxed and social, not chaotic.",
  }
}



  export function getVerdictPriority(
    verdict: Verdict,
  ): "positive" | "neutral" | "warning" | "critical" {
    switch (verdict) {
      case "Auspicious":
      case "Favourable":
        return "positive";
      case "Average":
        return "neutral";
      case "Unfavourable":
        return "warning";
      case "Critical":
        return "critical";
      default:
        return "neutral";
    }
  }