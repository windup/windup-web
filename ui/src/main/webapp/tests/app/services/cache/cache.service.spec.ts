import {CacheSection} from "../../../../src/app/shared/cache.service";

class MockCacheSection extends CacheSection {
    public get map() {
        return this.dataMap;
    }

    public isExpired(item) {
        return super.isExpired(item);
    }
}

describe("Cache service", () => {
    let instance: MockCacheSection;
    let key: string;
    let value: number;
    let item: any;


    beforeEach(() => {
        instance = new MockCacheSection();
        key = 'secret of the universe';
        value = 42;
    });


    it('hasItem should return false, when item does not exists', () => {
        expect(instance.hasItem('blablabla')).toBe(false);
    });

    describe('after inserting item', () => {
        beforeEach(() => {
           instance.setItem(key, value);
        });

        it('hasItem should return true for that item', () => {
            expect(instance.hasItem(key)).toBe(true);
        });

        it('getItem should return its value', () => {
            expect(instance.getItem(key)).toBe(value);
        });

        it('should have 5 minutes expiration time by default', () => {
            let item = instance.map.get(key);
            let expiresInMs = item.expires.getTime();
            let createdInMs = item.created.getTime();
            let fiveMinutesInMs = 5*60*1000;

            expect(expiresInMs - createdInMs).toBe(fiveMinutesInMs);
        });

        it('should not be immutable by default', () => {
            let item = instance.map.get(key);

            expect(item.immutable).toBe(false);
        });

        it('countItems should return 1', () => {
            expect(instance.countItems()).toBe(1);
        });
    });

    describe('isExpired method', () => {
        beforeEach(() => {
            instance.setItem(key, value);
            item = instance.map.get(key);
        });

        it('should return true for expired item which is not immutable', () => {
            item.expires = new Date(new Date().getTime() - 1);

            expect(instance.isExpired(item)).toBe(true);
        });

        it('should return false for expired item which is immutable', () => {
            item.expires = new Date(new Date().getTime() - 1);
            item.immutable = true;

            expect(instance.isExpired(item)).toBe(false);
        });

        it('should return false for not yet expired item', () => {
            item.expires = new Date(new Date().getTime() + 1);
            item.immutable = false;

            expect(instance.isExpired(item)).toBe(false);
        });

        it('should return false for not yet expired item which is immutable', () => {
            item.expires = new Date(new Date().getTime() + 1);
            item.immutable = true;

            expect(instance.isExpired(item)).toBe(false);
        });
    });

    describe('hasItem', () => {
        beforeEach(() => {
            instance.setItem(key, value);

            item = instance.map.get(key);
            item.expires = new Date(new Date().getTime() - 1);
        });

        it('should return false for expired item', () => {
            expect(instance.hasItem(key)).toBe(false);
        });

        it('should return true for "expired" immutable item', () => {
            item.immutable = true;;
            expect(instance.hasItem(key)).toBe(true);
        });
    });

    describe('clear', () => {
        beforeEach(() => {
            instance.setItem(key, value);
        });

        it('should remove all items from cache', () => {
            instance.clear();
            expect(instance.countItems()).toBe(0);
        });
    });

    describe('removeExpiredItems', () => {
        beforeEach(() => {
            instance.setItem(key, value);
            item = instance.map.get(key);
        });

        it('should remove expired items', () => {
            item.expires = new Date(new Date().getTime() - 1);
            instance.removeExpiredItems();
            expect(instance.countItems()).toBe(0);
        });

        it('should not remove not yet expired items', () => {
            item.expires = new Date(new Date().getTime() + 1);
            instance.removeExpiredItems();
            expect(instance.countItems()).toBe(1);
        });

        it('should not remove expired immutable items', () => {
            item.expires = new Date(new Date().getTime() - 1);
            item.immutable = true;
            instance.removeExpiredItems();
            expect(instance.countItems()).toBe(1);
        });

        it('should behave correctly also for multiple items', () => {
            instance.clear();

            for (let i = 0; i < 10; i += 2) {
                instance.setItem(i.toString(), i);
                instance.map.get(i.toString()).expires = new Date(new Date().getTime() - 1);
            }

            for (let i = 1; i < 10; i += 2) {
                instance.setItem(i.toString(), i);
            }

            expect(instance.countItems()).toBe(10);

            instance.removeExpiredItems();

            expect(instance.countItems()).toBe(5);

            instance.map.forEach((item, key) => {
                expect(parseInt(key) % 2).toBe(1);
            });
        });
    });
});
