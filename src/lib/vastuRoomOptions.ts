import type { RoomType } from "@/types/vastu";
import { ROOM_TYPE_LABEL } from "@/lib/templates";

export type RoomTypeOption = {
  value: RoomType;
  label: string;
  group: string;
};

export const ROOM_TYPE_OPTIONS: RoomTypeOption[] = [
  // Amenities
  { value: "gym", label: ROOM_TYPE_LABEL.gym, group: "Amenities" },
  { value: "pool", label: ROOM_TYPE_LABEL.pool, group: "Amenities" },

  // Bathrooms
  { value: "toilet", label: ROOM_TYPE_LABEL.toilet, group: "Bathrooms" },
  { value: "powder_room", label: ROOM_TYPE_LABEL.powder_room, group: "Bathrooms" },
  { value: "bathroom", label: ROOM_TYPE_LABEL.bathroom, group: "Bathrooms" },

  // Bedrooms
  { value: "master_bedroom", label: ROOM_TYPE_LABEL.master_bedroom, group: "Bedrooms" },
  { value: "bedroom", label: ROOM_TYPE_LABEL.bedroom, group: "Bedrooms" },
  { value: "kids_room", label: ROOM_TYPE_LABEL.kids_room, group: "Bedrooms" },
  { value: "guest_room", label: ROOM_TYPE_LABEL.guest_room, group: "Bedrooms" },

  // Core rooms
  { value: "kitchen", label: ROOM_TYPE_LABEL.kitchen, group: "Core Rooms" },
  { value: "living", label: ROOM_TYPE_LABEL.living, group: "Core Rooms" },
  { value: "dining", label: ROOM_TYPE_LABEL.dining, group: "Core Rooms" },
  { value: "pooja", label: ROOM_TYPE_LABEL.pooja, group: "Core Rooms" },

  // Entertainment
  { value: "media_room", label: ROOM_TYPE_LABEL.media_room, group: "Entertainment" },
  { value: "home_theater", label: ROOM_TYPE_LABEL.home_theater, group: "Entertainment" },
  { value: "gaming_room", label: ROOM_TYPE_LABEL.gaming_room, group: "Entertainment" },
  { value: "music_room", label: ROOM_TYPE_LABEL.music_room, group: "Entertainment" },
  { value: "bar", label: ROOM_TYPE_LABEL.bar, group: "Entertainment" },

  // Entrance
  { value: "main_entrance", label: ROOM_TYPE_LABEL.main_entrance, group: "Entrance" },
  { value: "foyer", label: ROOM_TYPE_LABEL.foyer, group: "Entrance" },
  { value: "porch", label: ROOM_TYPE_LABEL.porch, group: "Entrance" },
  { value: "mud_room", label: ROOM_TYPE_LABEL.mud_room, group: "Entrance" },

  // Outdoor
  { value: "balcony", label: ROOM_TYPE_LABEL.balcony, group: "Outdoor" },
  { value: "terrace", label: ROOM_TYPE_LABEL.terrace, group: "Outdoor" },
  { value: "courtyard", label: ROOM_TYPE_LABEL.courtyard, group: "Outdoor" },
  { value: "verandah", label: ROOM_TYPE_LABEL.verandah, group: "Outdoor" },
  { value: "sit_out", label: ROOM_TYPE_LABEL.sit_out, group: "Outdoor" },
  { value: "deck", label: ROOM_TYPE_LABEL.deck, group: "Outdoor" },
  { value: "garden", label: ROOM_TYPE_LABEL.garden, group: "Outdoor" },
  { value: "gazebo", label: ROOM_TYPE_LABEL.gazebo, group: "Outdoor" },
  { value: "pergola", label: ROOM_TYPE_LABEL.pergola, group: "Outdoor" },

  // Parking
  { value: "parking", label: ROOM_TYPE_LABEL.parking, group: "Parking" },
  { value: "garage", label: ROOM_TYPE_LABEL.garage, group: "Parking" },

  // Personal spaces
  { value: "dressing_room", label: ROOM_TYPE_LABEL.dressing_room, group: "Personal Spaces" },

  // Service areas
  { value: "servant_room", label: ROOM_TYPE_LABEL.servant_room, group: "Service Areas" },
  { value: "maid_room", label: ROOM_TYPE_LABEL.maid_room, group: "Service Areas" },

  // Storage
  { value: "store_room", label: ROOM_TYPE_LABEL.store_room, group: "Storage" },
  { value: "shoe_closet", label: ROOM_TYPE_LABEL.shoe_closet, group: "Storage" },
  { value: "store", label: ROOM_TYPE_LABEL.store, group: "Storage" },

  // Structural
  { value: "staircase", label: ROOM_TYPE_LABEL.staircase, group: "Structural" },
  { value: "basement", label: ROOM_TYPE_LABEL.basement, group: "Structural" },

  // Utilities
  { value: "utility", label: ROOM_TYPE_LABEL.utility, group: "Utilities" },
  { value: "laundry", label: ROOM_TYPE_LABEL.laundry, group: "Utilities" },
  { value: "wash_area", label: ROOM_TYPE_LABEL.wash_area, group: "Utilities" },
  { value: "overhead_water_tank", label: ROOM_TYPE_LABEL.overhead_water_tank, group: "Utilities" },
  { value: "underground_water_tank", label: ROOM_TYPE_LABEL.underground_water_tank, group: "Utilities" },
  { value: "electrical_room", label: ROOM_TYPE_LABEL.electrical_room, group: "Utilities" },

  // Work spaces
  { value: "study", label: ROOM_TYPE_LABEL.study, group: "Work Spaces" },
  { value: "home_office", label: ROOM_TYPE_LABEL.home_office, group: "Work Spaces" },
  { value: "library", label: ROOM_TYPE_LABEL.library, group: "Work Spaces" },

  // Fallback
  { value: "other", label: ROOM_TYPE_LABEL.other, group: "Other" },
];