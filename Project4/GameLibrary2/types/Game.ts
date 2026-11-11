import { Session } from "./Session";

export type GameStatus = "owned" | "wishlist" | "playing" | "completed";

export type Game = {
  id: string;
  title: string;
  platform: string;
  year: string;
  coverUri?: string;
  status: GameStatus;
  rating: number;   // 0-5 stars
  notes: string;
  addedAt: string;  // ISO date
  sessions?: Session[];
};
