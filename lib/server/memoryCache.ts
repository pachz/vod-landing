type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type CacheStore = Map<string, CacheEntry<unknown>>;

const GLOBAL_CACHE_KEY = "__vod_landing_memory_cache__";

function getStore(): CacheStore {
  const globalScope = globalThis as Record<string, CacheStore>;
  if (!globalScope[GLOBAL_CACHE_KEY]) {
    globalScope[GLOBAL_CACHE_KEY] = new Map();
  }
  return globalScope[GLOBAL_CACHE_KEY];
}

export function getCacheValue<T>(key: string): T | undefined {
  const store = getStore();
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) {
    return undefined;
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return undefined;
  }

  return entry.value;
}

export function setCacheValue<T>(key: string, value: T, ttlMs: number): void {
  const store = getStore();
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export async function getOrSetCacheValue<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = getCacheValue<T>(key);
  if (cached !== undefined) {
    return cached;
  }

  const freshValue = await fetcher();
  setCacheValue(key, freshValue, ttlMs);
  return freshValue;
}

