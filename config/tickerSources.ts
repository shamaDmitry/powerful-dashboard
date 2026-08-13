import { TickerCategory } from "@/types/ticker";

export interface BaseSourceConfig {
  id: string;
  category: TickerCategory;
  icon: string;
}

export interface RestSourceConfig extends BaseSourceConfig {
  type: "rest";
  url: string;
  intervalMs: number;
  parseResponse: (data: unknown) => string | null;
}

export interface WebSocketSourceConfig extends BaseSourceConfig {
  type: "websocket";
  url: string;
  throttleMs: number;
  parseMessage: (data: unknown) => string | null;
}

export type TickerSourceConfig = RestSourceConfig | WebSocketSourceConfig;

export const TICKER_SOURCES: TickerSourceConfig[] = [
  // 1. OpenSky
  // {
  //   id: "opensky",
  //   type: "rest",
  //   category: "aviation",
  //   icon: "✈️",
  //   url: "https://opensky-network.org/api/states/all",
  //   intervalMs: 60000,
  //   parseResponse: (data: unknown) => {
  //     const parsedPayload = data as { states?: unknown[] };
  //     return `OpenSky: Зараз у повітрі ${parsedPayload?.states?.length?.toLocaleString()} літаків`;
  //   },
  // },
  // 2. Open-Meteo
  {
    id: "open-meteo",
    type: "rest",
    category: "space",
    icon: "🌡️",
    url: "https://api.open-meteo.com/v1/forecast?latitude=50.45&longitude=30.52&current_weather=true",
    intervalMs: 120000,
    parseResponse: (data: unknown) => {
      const parsedPayload = data as {
        current_weather?: { temperature?: number };
      };

      return parsedPayload?.current_weather?.temperature !== undefined
        ? `Київ: температура ${parsedPayload.current_weather.temperature}°C`
        : null;
    },
  },
  // 3. Binance Crypto
  {
    id: "binance-btc",
    type: "websocket",
    category: "crypto",
    icon: "💎",
    url: "wss://stream.binance.com:9443/ws/btcusdt@trade",
    throttleMs: 5000,
    parseMessage: (data: unknown) => {
      const parsedPayload = data as { p?: string };

      return parsedPayload?.p
        ? `BTC/USDT: $${parseFloat(parsedPayload.p).toFixed(2)}`
        : null;
    },
  },
  // 4. Kanye Quotes
  {
    id: "kanye-quotes",
    type: "rest",
    category: "cringe",
    icon: "🎤",
    url: "https://api.kanye.rest/",
    intervalMs: 45000,
    parseResponse: (data: unknown) => {
      const parsedPayload = data as { quote?: string };

      return parsedPayload?.quote ? `Каньє: "${parsedPayload.quote}"` : null;
    },
  },
];
