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
  | "master_bedroom"
  | "bedroom"
  | "kitchen"
  | "toilet"
  | "living"
  | "pooja"
  | "dining"
  | "balcony"
  | "staircase"
  | "store"
  | "other";

export type RoomPoint = {
  id: string;
  name: string;
  type: RoomType;
  x: number; // 0–1
  y: number; // 0–1
};