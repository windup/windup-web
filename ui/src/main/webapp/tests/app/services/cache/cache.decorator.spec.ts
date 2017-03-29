import {Cached, CacheSection, CacheServiceInstance} from "../../../../src/app/shared/cache.service";

let cacheServiceInstance = CacheServiceInstance;
let sectionSection = cacheServiceInstance.getSection('section');
let globalSection = cacheServiceInstance.getSection('global');

class MockClass {
    @Cached()
    public foo(id: number) {
        return id;
    }

    @Cached('section')
    public bar(id: number, somethingElse: number, andAnotherOne: number) {
        return 'bar';
    }

    @Cached('section', {seconds: 1}, true)
    public hello() {
        return 'world';
    }

    @Cached('section', {minutes: 10, seconds: 10}, false)
    public greet() {

    }
}

class MockCacheSection extends CacheSection {
    public constructor(protected cacheSection) {
        super();
    }

    public get map() {
        return this.cacheSection.dataMap;
    }

    public isExpired(item) {
        return this.cacheSection.isExpired(item);
    }
}

/**
 * TODO: Temporarily commented out
 * I'm afraid I' don't have the same instance of CacheServiceInstance as Cached decorator has
 */
xdescribe('@Cached decorator', () => {
    let instance = new MockClass();
    let cacheSectionSection = new MockCacheSection(sectionSection);
    let cacheSectionGlobal = new MockCacheSection(globalSection);

    describe('Empty decorator without parameter', () => {
        let key = 'foo(42)';
        let value = 42;

        beforeEach(() => {
            spyOn(instance, 'foo');
            instance.foo(value);
        });

        it('should add item into "global" cache section after first call', () => {
           expect(globalSection.countItems()).toBe(1);
        });

        it('should add item into cache under proper key', () => {
           expect(globalSection.hasItem(key));
        });

        it('should store proper value for given item', () => {
            expect(globalSection.getItem(key)).toBe(value);
        });

        it('should use default configuration for item', () => {
            let item = cacheSectionGlobal.map.get(key);
            expect(item.immutable).toBe(false);
            expect(item.expires.getTime() - item.expires.getTime()).toBe(5 * 60 * 1000);
        });

        it('should no longer call method after having item in cache', () => {
            for (let i = 0; i < 4; i++) {
                let result = instance.foo(value);
                expect(result).toBe(value);
            }

            expect(instance.foo).toHaveBeenCalledTimes(1);
        });

        it('should call method for different item', () => {
            instance.foo(500);

            expect(instance.foo).toHaveBeenCalled();
            expect(instance.foo).toHaveBeenCalledWith(500);
        });
    });

    describe('Decorator with section', () => {
        beforeEach(() => {
            instance.bar(1, 2, 3);
        });

        it('should use that section', () => {
          expect(sectionSection.countItems()).toBe(1);
        });

        it('should properly set key for multiple parameters', () => {
            let expectedKey = 'bar(1, 2, 3)';
            expect(sectionSection.hasItem(expectedKey)).toBe(true);
        });
    });

    describe('Decorator with all parameters', () => {
        beforeEach(() => {
            instance.hello();
            instance.greet();
        });

        it('should properly set them in cache item', () => {
            let key = 'hello';
            let item = cacheSectionSection.map.get(key);

            let interval = item.expires.getTime() - item.created.getTime();
            let oneSecondInMs = 1000;

            expect(item.immutable).toBe(true);
            expect(interval).toBe(oneSecondInMs);
        });

        it('shoud properly set immutable parameter', () => {
            let key = 'greet';
            let item = cacheSectionSection.map.get(key);

            let interval = item.expires.getTime() - item.created.getTime();
            let expectedInterval = 10 * 60 * 1000 + 10 * 1000;

            expect(item.immutable).toBe(false);
            expect(interval).toBe(expectedInterval);
        });
    });
});
