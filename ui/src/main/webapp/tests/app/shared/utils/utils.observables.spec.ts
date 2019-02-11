import {utils} from "../../../../src/app/shared/utils";
import Observables = utils.Observables;
import {Observable} from 'rxjs';
import {async} from "@angular/core/testing";

describe('Observables', () => {
    const assertResolvedProperties = (resolvedObject, properties) => {
        console.log(resolvedObject);

        const countProperties = Object.keys(properties).length;

        expect(resolvedObject.hasOwnProperty('resolved')).toBeTruthy();
        expect(Object.keys(resolvedObject['resolved']).length).toBe(countProperties);

        Object.keys(properties).forEach(property => {
            expect(resolvedObject['resolved'].hasOwnProperty(property)).toBeTruthy();
            expect(resolvedObject['resolved'][property]).toBe(properties[property]);
        });
    };

    describe('resolveValuesArray', () => {
        it('should work for empty array', async(() => {
            Observables.resolveValuesArray(Observable.of([]), ['dummy']).subscribe(data => {
                expect(data.length).toBe(0);
            });
        }));

        it('should work for scalar values', async(() => {
            const objects = [
                { name: 'hello' },
                { name: 'world' }
            ];

            Observables.resolveValuesArray(Observable.of(objects), ['name'])
                .subscribe(data => {

                });
        }));

        it('should work for Observable values', async(() => {
            const properties = [ { name: 'hello' }, { name: 'world' }];

            const objects = [
                { name: Observable.of(properties[0].name) },
                { name: Observable.of(properties[1].name) }
            ];

            Observables.resolveValuesArray(Observable.of(objects), ['name'])
                .subscribe(data => {
                    expect(data.length).toBe(objects.length);
                    data.forEach((object, index) => {
                        assertResolvedProperties(object, properties[index]);
                    });
                });
        }));

        it('should work for combined values', async(() => {
            const properties = [ { name: 'hello', value: 1 }, { name: 'world', value: 42 }];

            const objects = [
                { name: Observable.of(properties[0].name), value: properties[0].value },
                { name: Observable.of(properties[1].name), value: properties[1].value },
            ];

            Observables.resolveValuesArray(Observable.of(objects), ['name', 'value'])
                .subscribe(data => {
                    expect(data.length).toBe(objects.length);
                    data.forEach((object, index) => {
                        assertResolvedProperties(object, properties[index]);
                    });
                });
        }));
    });

    describe('resolveValues', () => {
        it('should work for scalar values', async(() => {
            const object = { name: 'hello' };

            Observables.resolveValues(Observable.of(object), ['name'])
                .subscribe(resolvedObject => {
                    expect(resolvedObject.hasOwnProperty('resolved')).toBeTruthy();
                    expect(resolvedObject['resolved'].hasOwnProperty('name')).toBeTruthy();
                    expect(Object.keys(resolvedObject['resolved']).length).toBe(1);

                    expect(resolvedObject['resolved']['name']).toBe(object.name);
                });
        }));

        it('should work for Observable values', async(() => {
            const object = { name: Observable.of('hello') };

            Observables.resolveValues(Observable.of(object), ['name'])
                .subscribe(resolvedObject => {
                    assertResolvedProperties(resolvedObject, {name: 'hello'})
                });
        }));

        it('should work for combined values', async(() => {
            const properties = { name: 'hello', value: 42};

            const object = { name: Observable.of(properties.name), value: 42 };

            Observables.resolveValues(Observable.of(object), ['name', 'value'])
                .subscribe(resolvedObject => {
                    expect(resolvedObject.hasOwnProperty('resolved')).toBeTruthy();
                    expect(Object.keys(resolvedObject['resolved']).length).toBe(2);

                    Object.keys(properties).forEach(property => {
                        expect(resolvedObject['resolved'].hasOwnProperty(property)).toBeTruthy();
                        expect(resolvedObject['resolved'][property]).toBe(properties[property]);
                    });
                });
        }));
    });
});
