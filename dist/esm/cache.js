export class MemoryCache {
    constructor() {
        this.cache = {};
    }
    async get(key) {
        if (!this.cache[key])
            return null;
        if (Date.now() > this.cache[key].expires) {
            delete this.cache[key];
            return null;
        }
        return this.cache[key].value;
    }
    async set(key, value, ttl) {
        this.cache[key] = {
            expires: ttl ? Date.now() + ttl : 0,
            value,
        };
        return "OK";
    }
    async flush() {
        this.cache = {};
        return "OK";
    }
}
