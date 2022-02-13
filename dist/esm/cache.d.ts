export declare class MemoryCache {
    cache: {
        [key: string]: {
            expires: number;
            value: object;
        };
    };
    constructor();
    get<T>(key: string): Promise<T | null>;
    set(key: string, value: object, ttl: number): Promise<"OK">;
    flush(): Promise<string>;
}
