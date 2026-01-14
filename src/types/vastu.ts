// src/types/vastu.ts

export type Direction =
  | "N"
  | "NE"
  | "E"
  | "SE"
  | "S"
  | "SW"
  | "W"
  | "NW";

  export type RoomType =
  // Bedrooms
  | "master_bedroom"
  | "bedroom"
  | "kids_room"
  | "guest_room"
  // Core rooms
  | "living"
  | "kitchen"
  | "dining"
  | "pooja"
  // Bathrooms
  | "toilet"
  | "powder_room"
  | "bathroom"
  // Entrance / circulation
  | "main_entrance"
  | "foyer"
  | "porch"
  | "mud_room"
  // Entertainment
  | "media_room"
  | "home_theater"
  | "gaming_room"
  | "music_room"
  | "bar"
  // Work / study
  | "study"
  | "home_office"
  | "library"
  // Outdoor
  | "balcony"
  | "terrace"
  | "courtyard"
  | "verandah"
  | "sit_out"
  | "deck"
  | "garden"
  | "gazebo"
  | "pergola"
  // Parking
  | "parking"
  | "garage"
  // Personal / service / storage
  | "dressing_room"
  | "servant_room"
  | "maid_room"
  | "store"
  | "store_room"
  | "shoe_closet"
  // Structural
  | "staircase"
  | "basement"
  // Utilities
  | "utility"
  | "laundry"
  | "wash_area"
  | "overhead_water_tank"
  | "underground_water_tank"
  | "electrical_room"
  // Amenities
  | "gym"
  | "pool"
  // Fallback
  | "other";

export type RoomPoint = {
  id: string;
  name: string;
  type: RoomType;
  x: number; // 0–1
  y: number; // 0–1
};