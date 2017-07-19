import Order = jasmine.Order;
import {UrlCleanerService} from "../../../src/app/core/routing/url-cleaner.service";

describe("UrlCleaner Service", () => {
    let instance: UrlCleanerService;

    beforeEach(() => {
        instance = new UrlCleanerService();
    });

    describe('filterQueryParams', () => {
        it('should remove only filtered parameters', () => {
            const url = 'http://www.google.com?q=query&filtered=filtered&keep=true';
            const expected = 'http://www.google.com?q=query&keep=true';
            const result = instance.filterQueryParams(url, ['filtered']);

            expect(result).toBe(expected);
        });

        it('should remove `?` when all parameter are filtered', () => {
            const url = 'http://www.google.com?q=query&filtered=filtered';
            const expected = 'http://www.google.com';
            const result = instance.filterQueryParams(url, ['filtered', 'q']);

            expect(result).toBe(expected);
        });

        it('should not touch fragments', () => {
            const url = 'http://www.google.com?q=query&filtered=filtered#fragment=fragment1';
            const expected = 'http://www.google.com#fragment=fragment1';
            const result = instance.filterQueryParams(url, ['filtered', 'q']);

            expect(result).toBe(expected);
        });

        it('should not modify url without params', () => {
            const url = 'http://google.com';
            const expected = 'http://google.com';
            const result = instance.filterQueryParams(url, ['filtered']);

            expect(result).toBe(expected);
        });

        it('should remove query param separator for url without params', () => {
            const url = 'http://google.com?';
            const expected = 'http://google.com';
            const result = instance.filterQueryParams(url, ['filtered']);

            expect(result).toBe(expected);
        });
    });

    describe('filterFragments', () => {
        it('should remove filtered fragments', () => {
            const url = 'http://www.google.com#q=query&filtered=filtered&keep=true';
            const expected = 'http://www.google.com#q=query&keep=true';
            const result = instance.filterFragments(url, ['filtered']);

            expect(result).toBe(expected);
        });

        it('should remove `#` when all parameter are filtered', () => {
            const url = 'http://www.google.com#q=query&filtered=filtered';
            const expected = 'http://www.google.com';
            const result = instance.filterFragments(url, ['filtered', 'q']);

            expect(result).toBe(expected);
        });

        it('should not touch query parameters', () => {
            const url = 'http://www.google.com?filtered=filteredQueryParam#q=query&filtered=filtered';
            const expected = 'http://www.google.com?filtered=filteredQueryParam';
            const result = instance.filterFragments(url, ['filtered', 'q']);

            expect(result).toBe(expected);
        });

        it('should not modify url without params', () => {
            const url = 'http://google.com';
            const expected = 'http://google.com';
            const result = instance.filterFragments(url, ['filtered']);

            expect(result).toBe(expected);
        });

        it('should remove fragment separator for url without params', () => {
            const url = 'http://google.com#';
            const expected = 'http://google.com';
            const result = instance.filterFragments(url, ['filtered']);

            expect(result).toBe(expected);
        });
    });
});
