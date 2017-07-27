import {Injectable} from "@angular/core";

@Injectable()
export class PaginationService {
    public getPage<T>(items: T[], page: number = 1, itemsPerPage: number = 10): T[] {
        const countPages = Math.ceil(items.length / itemsPerPage);

        if (page < 1 || page > countPages) {
            throw new Error(`Invalid page '${page}'. Valid pages are from 1 to ${countPages}.`);
        }

        const indexFrom = (page - 1) * itemsPerPage;
        const indexTo = Math.min(page * itemsPerPage, items.length);

        const filteredArray = [];

        for (let i = indexFrom; i < indexTo; i++) {
            filteredArray.push(items[i]);
        }

        return filteredArray;
    }

    public getByIndex<T>(items: T[], indexFrom: number = 0, indexTo: number = 0): T[] {
        if (indexTo < indexFrom || indexTo > items.length) {
            throw new Error(`Invalid endIndex. Valid values are from 0 to ${items.length}.`);
        }

        if (indexFrom < 0 || indexFrom > items.length) {
        }

        const filteredArray = [];

        for (let i = indexFrom; i < indexTo; i++) {
            filteredArray.push(items[i]);
        }

        return filteredArray;
    }
}
