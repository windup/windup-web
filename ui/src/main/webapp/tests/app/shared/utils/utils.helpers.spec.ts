import {utils} from "../../../../src/app/shared/utils";

describe('utils.helpers', () => {

    describe('nullCoalesce', () => {

        it('should return default value for null|undefined expression', () => {
            let object = null;

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should return default value for null|undefined expression in the middle', () => {
            let object = { a: { } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should return default value for invalid expression', () => {
            let object = { a: { b: 42 } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should return real value of existing expression', () => {
            let object = { a: { b: { c: 'world ' } } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(object.a.b.c);
        });

        it('should return default value for existing null expression', () => {
            let object = { a: { b: { c: null } } };

            let defaultValue = '';
            let result = utils.nullCoalesce(object, defaultValue, 'a', 'b', 'c');

            expect(result).toEqual(defaultValue);
        });

        it('should work with inheritance', () => {
            class A { a: number = 1 }
            class B extends A { b: number = 42 }

            let x = new B();

            let defaultValue = '';
            let result = utils.nullCoalesce(x, defaultValue, 'a');

            expect(result).toEqual(x.a);
        });
    });
});
