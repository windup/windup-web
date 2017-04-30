import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import 'rxjs/add/operator/do';

@Injectable()
export class CacheService {
    private cacheSections: Map<string, CacheSection> = new Map<string, CacheSection>();

    public getSection(section: string) {
        if (!this.cacheSections.has(section)) {
            this.cacheSections.set(section, new CacheSection());
        }

        return this.cacheSections.get(section);
    }
}

export class CacheSection {
    protected dataMap: Map<string, CacheItem> = new Map<string, CacheItem>();

    /**
     * Checks if given key is in cache
     *
     * @param key {string}
     * @returns {boolean}
     */
    public hasItem(key: string): boolean {
        if (!this.dataMap.has(key)) {
            return false;
        }

        let item = this.dataMap.get(key);

        return !this.isExpired(item);
    }

    protected isExpired(item: CacheItem) {
        let currentTime = new Date();

        return !item.immutable && currentTime > item.expires;
    }

    public getItem(key: string) {
        let item = this.dataMap.get(key);

        return item.data;
    }

    public removeItem(key: string) {
        if (this.dataMap.has(key)) {
            this.dataMap.delete(key);
        }
    }

    /**
     * Sets cache item
     *
     * @param key {string}
     * @param data {any}
     * @param immutable {boolean} - If data is immutable, it never expires
     * @param expiration {CacheExpiration} - Cache expiration interval
     */
    public setItem(key: string, data: any, immutable: boolean = false, expiration: CacheExpiration = {minutes: 5}) {
        expiration = Object.assign({
            minutes: 0,
            seconds: 0
        }, expiration);

        let expirationInSec = expiration.minutes * 60 + expiration.seconds;
        let expirationTimestamp = new Date().getTime() + expirationInSec * 1000;
        let expirationDate = new Date(expirationTimestamp);

        let item: CacheItem = {
            data: data,
            created: new Date(),
            expires: expirationDate,
            immutable: immutable
        };

        this.dataMap.set(key, item);
    }

    /**
     * Remove expired items from cache
     */
    public removeExpiredItems() {
        this.dataMap.forEach((item, key) => {
            if (this.isExpired(item)) {
                // I think JS HashMap should be concurrently modifiable
                this.dataMap.delete(key);
            }
        });
    }

    /**
     * Clears cache
     */
    public clear() {
        this.dataMap.clear();
    }

    /**
     * Gets count of items in cache
     *
     * @returns {number}
     */
    public countItems(): number {
        return this.dataMap.size;
    }
}

interface CacheItem {
    data: any;
    created: Date;
    expires: Date;
    immutable: boolean;
}

interface CacheExpiration {
    minutes?: number;
    seconds?: number;
    // I don't thing we need hours :)
}

/**
 * Caches function call result
 *
 * @param configuration {CacheConfiguration}
 */
export function Cached(configuration?: CacheConfiguration);
/**
 * Caches function call result
 *
 * @param section {string} Cache section name
 * @param expiration {CacheExpiration} Expiration time (default is 5 min.)
 * @param immutable {boolean} If object is immutable, its cache never expires
 * @param cacheItemCallback {Function} Callback which specifies if item can be cached.
 */
export function Cached(section?: string, expiration?: CacheExpiration, immutable?: boolean, cacheItemCallback?: Function);
export function Cached(section?, expiration?: CacheExpiration, immutable: boolean = false, cacheItemCallback?: Function) {
    if (typeof section === 'object') {
        let configuration = Object.assign({}, {
            immutable: false
        }, section);

        expiration = configuration.expiration;
        immutable = configuration.immutable;
        cacheItemCallback = configuration.cacheItemCallback;
        section = section.section;
    }
    else if (section === null || section === undefined) {
        section = 'global';
    }

    let cacheSection = CacheServiceInstance.getSection(section);

    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        let originalMethod = descriptor.value; // save a reference to the original method

        // NOTE: Do not use arrow syntax here. Use a function expression in
        // order to use the correct value of `this` in this method (see notes below)
        descriptor.value = function (...args: any[]) {
            return originalMethod.apply(this, args);

        //     let cacheKey = getCacheKey(propertyKey, args);
        //
        //     if (!cacheSection.hasItem(cacheKey)) {
        //         let result: any|Observable<any> = originalMethod.apply(this, args);
        //
        //         let storeItemInCache = (result: any, isObservable: boolean = false) => {
        //             let isItemCacheable = true;
        //
        //             if (cacheItemCallback && typeof cacheItemCallback === 'function') {
        //                 isItemCacheable = cacheItemCallback(result);
        //             }
        //
        //             if (isItemCacheable) {
        //                 cacheSection.setItem(cacheKey, {
        //                     value: result,
        //                     isObservable: isObservable
        //                 }, immutable, expiration);
        //             }
        //         };
        //
        //         if (isObservable(result)) {
        //             return result.do(jsonResult => storeItemInCache(jsonResult, true));
        //         } else {
        //             storeItemInCache(result);
        //             return result;
        //         }
        //     }
        //
        //     let data = cacheSection.getItem(cacheKey);
        //
        //     if (!data.isObservable) {
        //         return data.value;
        //     } else {
        //         return Observable.of(data.value);
        //     }
        };

        return descriptor;
    };
}

/**
 * Not really a proper way to detect observable, but good enough for now
 * Borrowed from https://github.com/angular/angular/pull/15171
 *
 * @param obj
 * @returns {boolean}
 */
function isObservable(obj: any|Observable<any>) {
    return !!obj && typeof obj.subscribe === 'function';
}

function getCacheKey(functionName: string, args: any[]) {
    let commaSeparatedArgs = args.map(arg => JSON.stringify(arg)).join(', ');

    return functionName + '(' + commaSeparatedArgs + ')';
}

// I hope this will be sufficient for having single instance
export const CacheServiceInstance = new CacheService();

export interface CacheConfiguration {
    section?: string;
    immutable?: boolean;
    expiration?: CacheExpiration;
    cacheItemCallback?: (any) => boolean;
}
