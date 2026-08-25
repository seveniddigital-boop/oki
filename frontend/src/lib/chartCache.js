// Bounded LRU cache for /api/market-chart responses. Keeps switching between
// assets and timeframes instant and avoids refetching identical series.
const cache = new Map();
const TTL = 5 * 60 * 1000;
const MAX = 60;

export const chartKey = (type, id, days) => `${type}:${id}:${days}`;

export function getCachedChart(key) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) {
    cache.delete(key);
    cache.set(key, hit); // refresh LRU position
    return hit.data;
  }
  return null;
}

export function setCachedChart(key, data) {
  cache.set(key, { data, ts: Date.now() });
  if (cache.size > MAX) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}
