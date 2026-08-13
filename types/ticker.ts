export type TickerCategory = "aviation" | "crypto" | "space" | "ufo" | "cringe";

export interface TickerMessage {
  id: string;
  category: TickerCategory;
  icon: string;
  text: string;
  timestamp: number;
}
