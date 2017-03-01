import {SortingService, OrderDirection} from "../../../src/app/shared/sort/sorting.service";
import Order = jasmine.Order;

describe("Sorting service", () => {
    let instance: SortingService<any>;

    let assertArraysAreEqual = (a: any[], b: any[]) => {
        expect(a.length).toEqual(b.length);

        for (let i = 0; i < a.length; i++) {
            expect(a[i]).toEqual(b[i]);
        }
    };

    let assertArrayIsSorted = (array: any[], order: OrderDirection = OrderDirection.ASC, comparator?: any) => {
        let length = array.length;

        let ascComparator  = (a: any, b: any) => { return a <= b; };
        let descComparator = (a: any, b: any) => { return a >= b; };

        let compareCallback;

        if (!comparator) {
            compareCallback = (order === OrderDirection.ASC) ? ascComparator : descComparator;
        } else {
            compareCallback = comparator;
        }

        for (let i = 0; i < length - 1; i++) {
            if (!compareCallback(array[i], array[i+1])) {
                fail('Array should be sorted');
            }
        }
    };

    beforeEach(() => {
       instance = new SortingService<any>();
    });

    describe('sorting primitive types', () => {
        const items = [ 1, 100, 2, 3, 0 -1, 10, 50, 0, 3, 7 ];

        it('should not modify original array', () => {
            let arrayForSorting = items.slice();

            instance.sort(items);

            assertArraysAreEqual(arrayForSorting, items);
        });

        it('should sort in ascending order by default', () => {
            let sortedArray = instance.sort(items);

            assertArrayIsSorted(sortedArray);
        });

        it('should sort in descending order', () => {
            instance.setOrderDirection(OrderDirection.DESC);
            let sortedArray = instance.sort(items);
            assertArrayIsSorted(sortedArray, OrderDirection.DESC);
        });
    });

    describe('sorting objects', () => {
        const items = [
            { name: 'Ambulance', number: 155 },
            { name: 'Police', number: 158 },
            { name: 'Firefighters', number: 150 }
        ];

        const moduloCallback = (item) => item.number % 7;
        const compareModuloCallback = (a, b) => moduloCallback(a) <= moduloCallback(b);

        it('should sort by object property', () => {
            instance.orderBy('name', OrderDirection.ASC);

            let sortedArray = instance.sort(items);
            assertArrayIsSorted(sortedArray, OrderDirection.ASC, (a: any, b: any) => a['name'] <= b['name']);
        });

        it('should sort by property callback', () => {
            instance.orderBy(moduloCallback, OrderDirection.ASC);

            let sortedArray = instance.sort(items);
            assertArrayIsSorted(sortedArray, OrderDirection.ASC, compareModuloCallback);
        });

        it('should sort by OrderCallback', () => {
            let callback = (a: any, b: any) => moduloCallback(a) - moduloCallback(b);
            instance.orderCallback(callback, OrderDirection.ASC);

            let sortedArray = instance.sort(items);
            assertArrayIsSorted(sortedArray, OrderDirection.ASC, compareModuloCallback);
        });
    });
});
