/**
 * Inspired by React Query / TanStack Query
 */
export class QueryClient {
  /**
   * @type {Map<string, any>}
   */
  cache = new Map();
  /**
   * @type {Map<string, Set<() => void>>}
   */
  subscribers = new Map();

  /**
   * @param {() => void} redraw
   */
  constructor(redraw) {
    this.redraw = redraw;
  }

  /**
   * Fetches data for a given query key and stores it in cache.
   * If data is already in cache, returns the cached value.
   * If not, it calls the query function, stores the result, and notifies subscribers.
   *
   * @template T
   *
   * @param {{
   *     queryKey: any[],
   *     queryFn: () => Promise<T>,
   *     enabled: boolean,
   * }} options
   *
   * @returns {T | null | undefined}
   */
  fetch(options) {
    if (!options.enabled) {
      return null;
    }

    const key = options.queryKey.join('.');
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    // add a null value to the cache to prevent multiple requests
    this.cache.set(key, null);

    options
      .queryFn()
      .then((res) => {
        this.cache.set(key, res);
        this.redraw();
        this.notifySubscribers(key);
      })
      .catch((error) => console.error(`Error on fetching ${key}:`, error));
  }

  /**
   * @param {string} key
   */
  notifySubscribers(key) {
    const subs = this.subscribers.get(key);
    if (subs) {
      const callbacks = Array.from(subs);
      for (const callback of callbacks) {
        callback();
      }
    }
  }

  /**
   * Subscribes to updates for a given query key.
   * Automatically triggers the callback if data is already available.
   *
   * @param {any[]} queryKey
   * @param {() => void} callback
   */
  subscribe(queryKey, callback) {
    const key = queryKey.join('.');
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)?.add(callback);

    // Using `get` here to check if the cache has a value for the key.
    // During loading, `null` might be written to the cache temporarily,
    // so we can't assume the presence of a value means it's fully loaded.
    // Also, just because it's loading doesn't mean the element actually exists yet.
    if (this.cache.get(key)) {
      queueMicrotask(() => callback());
    }

    return () => this.unsubscribe(queryKey, callback);
  }

  /**
   * Unsubscribes a previously registered callback from a query key.
   *
   * @param {any[]} queryKey
   * @param {() => void} callback
   */
  unsubscribe(queryKey, callback) {
    const key = queryKey.join('.');
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        this.subscribers.delete(key);
      }
    }
  }
}
