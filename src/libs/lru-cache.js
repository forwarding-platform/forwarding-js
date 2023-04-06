import LRUCache from "lru-cache";

export const cache = new LRUCache({
  max: 2,
  ttl: 1000 * 60 * 60 * 24,
});
