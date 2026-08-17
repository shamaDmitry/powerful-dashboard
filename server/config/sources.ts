// External API (Raw JSON)
//   │
//   ▼
// parseData()  ──────► Saved to In-Memory Cache
//   │
//   ▼
// formatMessage() ──────► Sent to /api/ticker & Rendered in <Ticker />

import { TickerCategory } from "@/types/ticker";

export interface RateLimitedSourceConfig {
  id: string;
  category: TickerCategory;
  icon: string;
  url: string;
  // Request rate limit configuration (e.g., 10 requests per 3,600,000 ms / 1 hour)
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  ttlMs: number; // Time To Live, Cache TTL configuration (how long data is considered fresh)
  parseData: (rawData: unknown) => unknown;
  formatMessage?: (parsedData: unknown) => string | null;
}

export const SERVER_SOURCES: Record<string, RateLimitedSourceConfig> = {
  "corporate-bs": {
    id: "corporate-bs",
    category: "cringe",
    icon: "💼",
    url: "https://corporatebs-generator.sameerkumar.website/",
    rateLimit: {
      maxRequests: 60,
      windowMs: 3600 * 1000, // 1 hour
    },
    ttlMs: 30 * 1000, // 30 seconds
    parseData: (rawData: unknown) => {
      const parsedPayload = rawData as { phrase?: string };

      return {
        phrase: parsedPayload?.phrase,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { phrase?: string };

      return parsed?.phrase ? `Corporate BS says: "${parsed.phrase}"` : null;
    },
  },
  "bored-api": {
    id: "bored-api",
    category: "cringe",
    icon: "🎲",
    url: "https://bored-api.appbrewery.com/random",
    rateLimit: {
      maxRequests: 60,
      windowMs: 3600 * 1000, // 1 hour
    },
    ttlMs: 30 * 1000, // 30 seconds
    parseData: (rawData: unknown) => {
      const parsedPayload = rawData as { activity?: string };

      return {
        activity: parsedPayload?.activity,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { activity?: string };

      return parsed?.activity ? `BoredAPI says: "${parsed.activity}"` : null;
    },
  },
  "opensky-limited": {
    id: "opensky-limited",
    category: "aviation",
    icon: "✈️",
    url: "https://opensky-network.org/api/states/all",
    rateLimit: {
      maxRequests: 10,
      windowMs: 3600 * 1000,
    },
    // 10 requests per 60 min = 1 request every 6 minutes (360,000 ms)
    ttlMs: 360 * 1000,
    parseData: (rawData: unknown) => {
      const responsePayload = rawData as { states?: unknown[] };

      const totalPlanesCount = Array.isArray(responsePayload?.states)
        ? responsePayload.states.length
        : 0;

      return {
        totalPlanes: totalPlanesCount,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { totalPlanes?: number };

      return parsed?.totalPlanes
        ? `OpenSky: There are currently ${parsed.totalPlanes.toLocaleString()} aircraft in the air`
        : null;
    },
  },
  "open-meteo": {
    id: "open-meteo",
    category: "space",
    icon: "🌡️",
    url: "https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current_weather=true",
    rateLimit: {
      maxRequests: 60,
      windowMs: 3600 * 1000,
    },
    ttlMs: 60 * 1000,
    parseData: (rawData: unknown) => {
      const parsedPayload = rawData as {
        current_weather?: { temperature?: number };
      };

      return {
        temperature: parsedPayload?.current_weather?.temperature,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { temperature?: number };

      return parsed?.temperature !== undefined
        ? `Kyiv: temperature ${parsed.temperature}°C`
        : null;
    },
  },
  "binance-btc": {
    id: "binance-btc",
    category: "crypto",
    icon: "💎",
    url: "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
    rateLimit: {
      maxRequests: 120,
      windowMs: 3600 * 1000,
    },
    ttlMs: 15 * 1000,
    parseData: (rawData: unknown) => {
      const parsedPayload = rawData as { price?: string };

      return {
        price: parsedPayload?.price,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { price?: string };

      return parsed?.price
        ? `BTC/USDT: $${parseFloat(parsed.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : null;
    },
  },
  "kanye-quotes": {
    id: "kanye-quotes",
    category: "cringe",
    icon: "🎤",
    url: "https://api.kanye.rest/",
    rateLimit: {
      maxRequests: 60,
      windowMs: 3600 * 1000,
    },
    ttlMs: 45 * 1000,
    parseData: (rawData: unknown) => {
      const parsedPayload = rawData as { quote?: string };

      return {
        quote: parsedPayload?.quote,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { quote?: string };

      return parsed?.quote ? `Kanye West says: "${parsed.quote}"` : null;
    },
  },
  "earthquakes": {
    id: "earthquakes",
    category: "space",
    icon: "🌋",
    url: "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson",
    rateLimit: {
      maxRequests: 60,
      windowMs: 3600 * 1000,
    },
    ttlMs: 300 * 1000, // 5 minutes cache
    parseData: (rawData: unknown) => {
      const parsedPayload = rawData as { features?: any[] };
      const list = (parsedPayload.features || []).map((f: any) => ({
        id: f.id,
        mag: f.properties?.mag,
        place: f.properties?.place,
        time: f.properties?.time,
        url: f.properties?.url,
        tsunami: f.properties?.tsunami,
        lng: f.geometry?.coordinates?.[0],
        lat: f.geometry?.coordinates?.[1],
        depth: f.geometry?.coordinates?.[2],
      }));

      return {
        earthquakes: list,
        timestamp: Date.now(),
      };
    },
    formatMessage: (data: unknown) => {
      const parsed = data as { earthquakes?: any[] };
      const latest = parsed?.earthquakes?.[0];
      return latest
        ? `Seismic Alert: M ${latest.mag} at ${latest.place}`
        : null;
    },
  },
};
