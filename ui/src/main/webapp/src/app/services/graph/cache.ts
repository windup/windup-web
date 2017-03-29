/**
 * Caches results returned from given fetcher callback for given key,
 * up to maxItems results, deletes the oldest results when full (FIFO).
 */
export class StaticCache
{
    static cachedData: Map<string, any> = new Map<string, any>();
    static maxItems: number = 400;
    static stats = { hits: 0, fetches: 0 };

    static get(key: string){
        return this.cachedData.get(key);
    }

    static getOrFetch(key: string, fetcher: (string) => any): any {
        let value = this.cachedData.get(key);

        if (value != null){
            this.stats.hits++;
            return value;
        }

        this.stats.fetches++;
        value = fetcher(key);
        this.add(key, value);
        return value;
    }

    static add(key, value){
        this.cachedData.set(key, value);
        this.deleteOverflowing();
    }

    static deleteOverflowing(): void {
        if (this.cachedData.size > this.maxItems) {
            this.deleteOldest(this.cachedData.size - this.maxItems);
        }
    }

    /// A Map object iterates its elements in insertion order — a for...of loop returns an array of [key, value] for each iteration.
    /// However that seems not to work. Trying with forEach.
    static deleteOldest(howMany: number): void {
        let iterKeys = this.cachedData.keys();
        let item: IteratorResult<string>;
        while (howMany-- > 0 && (item = iterKeys.next(), !item.done)){
            this.cachedData.delete(item.value); // Deleting while iterating should be ok in JS.
        }
    }

    static clear(): void {
        this.cachedData = new Map<string, any>();
    }

    static toString(): string {
        return `Cache: ${this.stats.hits} hits, ${this.stats.fetches} fetches.`;
    }

}
