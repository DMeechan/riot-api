export class MemoryCache {
  cache: { [key: string]: { expires: number; value: object } };

  constructor() {
    this.cache = {};
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.cache[key]) return null;
    if (Date.now() > this.cache[key].expires) {
      delete this.cache[key];
      return null;
    }
    return this.cache[key].value as any;
  }

  async set(key: string, value: object, ttl: number): Promise<"OK"> {
    this.cache[key] = {
      expires: ttl ? Date.now() + ttl : 0,
      value,
    };
    return "OK";
  }

  async flush(): Promise<string> {
    this.cache = {};
    return "OK";
  }
}
