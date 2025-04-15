/**
 * Inspired by React Query / TanStack Query
 */
export class QueryClient {
  /**
   * @type {Map<string, any>}
   */
  cache = new Map();

  /**
   * @param {() => void} redraw
   */
  constructor(redraw) {
    this.redraw = redraw;
  }

  /**
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
  get(options) {
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
      })
      .catch((error) => console.error(`Error on fetching ${key}:`, error));
  }
}
