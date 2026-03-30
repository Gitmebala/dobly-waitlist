type Entry = {
  count: number;
  resetAt: number;
};

const stores = new Map<string, Map<string, Entry>>();

export function consumeRateLimit(keyspace: string, key: string, limit: number, windowMs: number) {
  const now = Date.now();
  let store = stores.get(keyspace);

  if (!store) {
    store = new Map();
    stores.set(keyspace, store);
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}
