import {StaticCache} from "../../../src/app/services/graph/cache";

describe("Cache service", () => {
    beforeEach(() => {
        StaticCache.clear();
    });

    it('Should cache properly.', () => {

        let noopFetcher = (key) => { return console.log(`noopFetcher(${key})`), "---"; };
        StaticCache.maxItems = 2;
        expect(StaticCache.cachedData.size).toEqual(0);

        // Add 1st
        StaticCache.add("foo", "bar");
        expect(StaticCache.cachedData.size).toEqual(1);
        expect(StaticCache.getOrFetch("foo", noopFetcher)).toEqual("bar");

        // Rewrites the same key
        StaticCache.add("foo", "anotherBar");
        expect(StaticCache.cachedData.size).toEqual(1);
        expect(StaticCache.getOrFetch("foo", noopFetcher)).toEqual("anotherBar");

        // Add 2nd
        StaticCache.add("foo2", "baz2");
        expect(StaticCache.cachedData.size).toEqual(2);
        expect(StaticCache.get("foo2")).toEqual("baz2");
        expect(StaticCache.get("foo")).toEqual("anotherBar");

        // Going over the limit - should remove "foo"
        StaticCache.add("foo3", "baz3");
        expect(StaticCache.cachedData.size).toEqual(2);
        expect(StaticCache.getOrFetch("foo3", noopFetcher)).toEqual("baz3");
        expect(StaticCache.get("foo")).toEqual(void 0);
        //expect(StaticCache.get("foo")).toEqual("---");
        expect(StaticCache.get("foo2")).toEqual("baz2");

        // Going over the limit - should remove "foo2"
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
