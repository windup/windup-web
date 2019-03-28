import {
    Cached, CacheSection,
    getCacheServiceInstance
} from "../../../../src/app/shared/cache.service";
import {Observable, of} from "rxjs";

let cacheServiceInstance = getCacheServiceInstance();
let sectionSection = cacheServiceInstance.getSection('section');
let globalSection = cacheServiceInstance.getSection('global');

class MockClass {
    public fooCalledTimes = 0;

    @Cached()
    public foo(id: number) {
        this.fooCalledTimes++;
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

    public greetCalledTimes = 0;

    @Cached('section', {minutes: 10, seconds: 10}, false)
    public greet() {
        let value = this.greetCalledTimes === 0 ? 7 : 77;
        this.greetCalledTimes++;

        return of(value);
    }

    static CacheItemCallback = (value: number) => {
        return value > 42;
    };

    @Cached({section: 'section', immutable: true, expiration: {seconds: 1}, cacheItemCallback: MockClass.CacheItemCallback})
    public world(value: number) {
        return value;
    }


    public arbitraryParameterCalledTimes = 0;

    @Cached()
    public arbitraryParameter(object: any) {
        this.arbitraryParameterCalledTimes++;
        return object;
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

describe('@Cached decorator', () => {
    let instance = new MockClass();
    let mockCacheSectionSection = new MockCacheSection(sectionSection);
    let mockCacheSectionGlobal = new MockCacheSection(globalSection);

    describe('Empty decorator without parameter', () => {
        let key = 'foo(42)';
        let value = 42;

        beforeEach(() => {
            instance.foo(value);
        });

        xit('should add item into "global" cache section after first call', () => {
           expect(globalSection.countItems()).toBe(1);
        });

        xit('should add item into cache under proper key', () => {
           expect(globalSection.hasItem(key));
        });

        xit('should store proper value for given item', () => {
            expect(globalSection.getItem(key).value).toBe(value);
        });

        xit('should use default configuration for item', () => {
            let item = mockCacheSectionGlobal.map.get(key);
            expect(item.immutable).toBe(false);
            expect(item.expires.getTime() - item.created.getTime()).toBe(5 * 60 * 1000);
        });

        xit('should no longer call method after having item in cache', () => {
            // Cannot use spies here - they probably think method got called even though it did not
            //let originalMethod = instance.foo.bind(instance);
            //spyOn(instance, 'foo').and.callFake((value) => originalMethod(value));

            instance.fooCalledTimes = 0;

            for (let i = 0; i < 4; i++) {
                let result = instance.foo(value);
                expect(result).toBe(value);
            }

            expect(instance.fooCalledTimes).toBe(0);
        });

        xit('should call method for different item', () => {
            instance.fooCalledTimes = 0;
            instance.foo(500);

            expect(instance.fooCalledTimes).toBe(1);
        });
    });

    describe('Decorator with section', () => {
        beforeEach(() => {
            instance.bar(1, 2, 3);
        });

        xit('should use that section', () => {
          expect(sectionSection.countItems()).toBe(1);
        });

        xit('should properly set key for multiple parameters', () => {
            let expectedKey = 'bar(1, 2, 3)';
            expect(sectionSection.hasItem(expectedKey)).toBe(true);
        });
    });

    describe('Decorator with all parameters', () => {
        beforeEach(() => {
            instance.hello();
            instance.greet().subscribe(_ => {}); // needs to be subscribed, otherwise Observable.do is not executed
        });

        xit('should properly set them in cache item', () => {
            let key = 'hello()';
            let item = mockCacheSectionSection.map.get(key);

            let interval = item.expires.getTime() - item.created.getTime();
            let oneSecondInMs = 1000;

            expect(item.immutable).toBe(true);
            expect(interval).toBe(oneSecondInMs);
        });

        xit('should properly set immutable parameter', () => {
            let key = 'greet()';
            let item = mockCacheSectionSection.map.get(key);

            let interval = item.expires.getTime() - item.created.getTime();
            let expectedInterval = 10 * 60 * 1000 + 10 * 1000;

            expect(item.immutable).toBe(false);
            expect(interval).toBe(expectedInterval);
        });

        xit('should return cached value as observable for observables', () => {
            expect(instance.greet().subscribe).toBeDefined();
            instance.greet().subscribe(value => {
                expect(value).toBe(7);
            });
        });

        xit('should call function again, when value is out of cache', () => {
            instance.greetCalledTimes = 0;

            sectionSection.clear(); // clear cache, first call should go to function

            for (let i = 0; i < 2; i++) {
                // first call should return 7 and store it in cache
                // second call should get it from cache
                instance.greet().subscribe(value => {
                    expect(value).toBe(7);
                });
            }

            sectionSection.clear(); // cache should be cleared
            instance.greet().subscribe(value => {
                expect(value).toBe(77); // and function should be called again, this time returning 77
            })
        });
    });

    describe('Decorator with object syntax', () => {
        let key;

        beforeEach(() => {
            sectionSection.clear();

            key = 'world(120)';
            instance.world(120);
        });

        xit('should properly set immutable property', () => {
            let item = mockCacheSectionSection.map.get(key);

            expect(item.immutable).toBe(true);
        });

        xit('should properly set expiration time', () => {
            let item = mockCacheSectionSection.map.get(key);

            let interval = item.expires.getTime() - item.created.getTime();
            let oneSecondInMs = 1000;

            expect(interval).toBe(oneSecondInMs);
        });

        describe('cacheItemCallback', () => {
            beforeEach(() => {
                sectionSection.clear();
            });

            xit('should not cache items for which callback returns false', () => {
                instance.world(42);

                expect(sectionSection.countItems()).toBe(0);
            });

            xit('should cache items for which callback returns true', () => {
                instance.world(420);

                expect(sectionSection.countItems()).toBe(1);
            });
        });
    });

    describe('Passing different function parameters', () => {
        beforeEach(() => {
            instance.arbitraryParameterCalledTimes = 0;
        });

        let functionCallTemplate = (parameter, anotherParameter, countCallsFirst = 1, countCallsSecond = 2) => {
            let result = instance.arbitraryParameter(parameter);
            let cachedResult = instance.arbitraryParameter(parameter);

            expect(instance.arbitraryParameterCalledTimes).toBe(countCallsFirst);
            expect(cachedResult).toBe(result);
            expect(cachedResult).toBe(parameter);

            for (let i = 0; i < 2; i++) {
                let result = instance.arbitraryParameter(anotherParameter);

                expect(instance.arbitraryParameterCalledTimes).toBe(countCallsSecond);
                expect(result).toBe(anotherParameter);
            }
        };

        xit('should work for numeric parameter', () => {
            functionCallTemplate(7, 42);
        });

        xit('should work for string parameter', () => {
            functionCallTemplate('hello', 'world');
        });

        xit('should work for object parameter', () => {
            let firstObject = { title: 'hello' };
            let secondObject = { title: 'world' };
            let thirdObject = { title: 'hello' };

            functionCallTemplate(firstObject, secondObject);

            let result = instance.arbitraryParameter(firstObject);
            let cachedResult = instance.arbitraryParameter(thirdObject);
            // first object and third object has the same signature => they should have the same cache key
            expect(instance.arbitraryParameterCalledTimes).toBe(2);
            expect(result).toBe(cachedResult);
            expect(result).toBe(firstObject);
        });
    });
});
