type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

type CacheStore = Map<string, CacheEntry<unknown>>;

function getStore(): CacheStore {
  const globalScope = globalThis as typeof globalThis & {
    __vod_landing_memory_cache__?: CacheStore;
  };
  if (!globalScope.__vod_landing_memory_cache__) {
    globalScope.__vod_landing_memory_cache__ = new Map();
  }
  return globalScope.__vod_landing_memory_cache__;
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
