import type { Vibe } from "./config";

export type ManStatus = "pending" | "active" | "paused" | "matched" | "removed";
export type WomanStatus = "pending" | "active" | "paused" | "removed";

export interface Man {
  id: string;
  name: string;
  age: number;
  city: string;
  ig: string;
  linkedin?: string | null;
  description: string;     // the human write-up
  openTo: string;          // "drinks, a long dinner, a day festival"
  places: string[];        // 2-3 real spots/events, the "where you'll find him"
  vibes: Vibe[];
  status: ManStatus;
  lastConfirmedAt: string; // ISO date
  addedAt: string;         // ISO date
}

export interface Woman {
  id: string;
  name: string;
  email: string;
  age: number;
  city: string;
  ig?: string | null;
  ageMin: number;
  ageMax: number;
  likedVibes: Vibe[];
  regions: string[];       // cities/regions she'll travel to; man.city must be in here
  status: WomanStatus;
  joinedAt: string;
}

export interface Impression {
  manId: string;
  womanId: string;
  dropWeek: string;        // ISO date of the Monday of that week
}

export interface Assignment {
  womanId: string;
  manIds: string[];
}
