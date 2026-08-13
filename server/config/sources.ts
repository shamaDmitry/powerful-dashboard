export interface RateLimitedSourceConfig {
  id: string;
  url: string;
  // Request rate limit configuration (e.g., 10 requests per 3,600,000 ms / 1 hour)
  rateLimit: {
    maxRequests: number;
    windowMs: number;
  };
  // Cache TTL configuration (how long data is considered fresh)
  ttlMs: number;
  parseData: (rawData: unknown) => unknown;
}

export const SERVER_SOURCES: Record<string, RateLimitedSourceConfig> = {
  "opensky-limited": {
    id: "opensky-limited",
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
  },
};
