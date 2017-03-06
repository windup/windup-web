import {Injectable} from "@angular/core";

@Injectable()
export class SortingService<T> {
    protected orderByProperty: string;
    protected orderByCallback: (a: any, b: any) => number;
    protected modifier: number = 1;

    public constructor() {
        this.orderByCallback = (a: T, b: T) => this.comparatorCallback(a, b) * this.modifier;
    }

    public orderCallback(callback: OrderCallback<T>, direction: OrderDirection): this {
        this.modifier = direction === OrderDirection.ASC ? 1 : -1;

        if (typeof callback !== 'function') {
            throw new Error('Callback should be function');
        }

        this.orderByCallback = (a: T, b: T) => {
            return callback(a, b) * this.modifier;
        };

        return this;
    }

    public orderBy(propertyCallback: any, direction?: OrderDirection): this
    public orderBy(property: string, direction: OrderDirection = OrderDirection.ASC): this {
        this.setOrderDirection(direction);

        if (typeof property === 'function') {
            this.orderByCallback = (a: T, b: T) => {
                return this.comparatorCallback(property(a), property(b)) * this.modifier;
            };
        } else {
            this.orderByCallback = (a: T, b: T) => {
                return this.comparatorCallback(a[property], b[property]) * this.modifier;
            };
        }

        this.orderByProperty = property;

        return this;
    }

    protected comparatorCallback(a: any, b: any): number  {
        if (a < b) {
            return -1;
        }

        if (a > b) {
            return +1;
        }

        return 0;
    }

    public setOrderDirection(direction: OrderDirection): this {
        this.modifier = direction === OrderDirection.ASC ? 1 : -1;
        return this;
    }

    public getOrderDirection(): OrderDirection {
        return this.modifier;
    }

    public getOrderByProperty(): string|Function {
        return this.orderByProperty
    }

    public sort(array: T[]): T[] {
        return array.slice().sort(this.orderByCallback);
    }
}

export enum OrderDirection {
    ASC = 1,
    DESC = -1
}

export interface OrderCallback<T> {
    (a: T, b: T): number
}

export interface Comparator<T> {
    compare(a: T, b: T): number;
}

export interface PropertyCallback<T> {
    (item: T): any;
}
