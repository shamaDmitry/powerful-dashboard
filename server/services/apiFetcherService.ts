// server/services/apiFetcherService.ts
import { SERVER_SOURCES } from "../config/sources";

// Simple In-Memory Cache
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const requestLog = new Map<string, number[]>(); // Лог таймстампів викликів

export async function getOrFetchData(sourceId: string) {
  const source = SERVER_SOURCES[sourceId];
  if (!source) throw new Error(`Unknown source: ${sourceId}`);

  const now = Date.now();
  const cached = cache.get(sourceId);

  // 1. Якщо дані є в кєші і вони не застаріли — віддаємо їх МИТТЄВО
  if (cached && cached.expiresAt > now) {
    return { data: cached.data, fromCache: true };
  }

  // 2. Перевірка політики Rate Limit
  const timestamps = requestLog.get(sourceId) || [];
  // Відфільтровуємо запити, що вийшли за межі вікна (наприклад, старіші за 1 годину)
  const recentRequests = timestamps.filter(
    (time) => now - time < source.rateLimit.windowMs,
  );

  // Якщо ми досягли ліміту — повертаємо застарілий кеш (Stale-While-Revalidate pattern)
  if (recentRequests.length >= source.rateLimit.maxRequests) {
    console.warn(
      `[RateLimit Warning] Limit reached for ${sourceId}. Serving stale cache.`,
    );

    if (cached) return { data: cached.data, fromCache: true, stale: true };

    throw new Error(
      `Rate limit exceeded for ${sourceId} and no cache available.`,
    );
  }

  // 3. Робимо реальний запит до стороннього API
  try {
    const res = await fetch(source.url);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const rawData = await res.json();
    const parsedData = source.parseData(rawData);

    // Оновлюємо лог запитів та кеш
    recentRequests.push(now);
    requestLog.set(sourceId, recentRequests);

    cache.set(sourceId, {
      data: parsedData,
      expiresAt: now + source.ttlMs,
    });

    return { data: parsedData, fromCache: false };
  } catch (error) {
    // Якщо API впало — видаємо старий кеш, якщо він є
    if (cached) return { data: cached.data, fromCache: true, error: true };
    throw error;
  }
}
