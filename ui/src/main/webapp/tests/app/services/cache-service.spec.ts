import {StaticCache} from "../../../src/app/services/graph/cache";

describe("Cache service", () => {
    beforeEach(() => {
        console.log("-------------------- Cache service -------------------- ");
        StaticCache.clear();
    });

    it('Should cache properly.', () => {

        let noopFetcher = (key) => { return console.log(`noopFetcher(${key})`), "---"; };
        StaticCache.maxItems = 2;
        expect(StaticCache.cachedData.size).toEqual(0);

        // Add 1st
        console.log("Caching foo ");
        StaticCache.add("foo", "bar");
        expect(StaticCache.cachedData.size).toEqual(1);
        expect(StaticCache.getOrFetch("foo", noopFetcher)).toEqual("bar");

        // Rewrites the same key
        StaticCache.add("foo", "anotherBar");
        expect(StaticCache.cachedData.size).toEqual(1);
        expect(StaticCache.getOrFetch("foo", noopFetcher)).toEqual("anotherBar");

        // Add 2nd
        console.log("Caching foo2");
        StaticCache.add("foo2", "baz2");
        expect(StaticCache.cachedData.size).toEqual(2);
        expect(StaticCache.get("foo2")).toEqual("baz2");
        expect(StaticCache.get("foo")).toEqual("anotherBar");

        // Going over the limit - should remove "foo"
        console.log("Caching foo3");
        StaticCache.add("foo3", "baz3");
        expect(StaticCache.cachedData.size).toEqual(2);
        expect(StaticCache.getOrFetch("foo3", noopFetcher)).toEqual("baz3");
        expect(StaticCache.get("foo")).toEqual(void 0);
        //expect(StaticCache.get("foo")).toEqual("---");
        expect(StaticCache.get("foo2")).toEqual("baz2");

        // Going over the limit - should remove "foo2"
        console.log("Caching foo4");
        StaticCache.add("foo4", "baz4");
        expect(StaticCache.cachedData.size).toEqual(2);
        expect(StaticCache.getOrFetch("foo3", noopFetcher)).toEqual("baz3");
        expect(StaticCache.get("foo")).toEqual(void 0);
        expect(StaticCache.get("foo2")).toEqual(void 0);
        expect(StaticCache.getOrFetch("foo", noopFetcher)).toEqual("---");
        expect(StaticCache.getOrFetch("foo2", noopFetcher)).toEqual("---");
        expect(StaticCache.get("foo3")).toEqual(void 0);
        expect(StaticCache.get("foo4")).toEqual(void 0);
    });
});
