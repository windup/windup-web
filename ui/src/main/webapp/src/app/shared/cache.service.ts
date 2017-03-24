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

        return item.immutable || !this.isExpired(item);
    }

    protected isExpired(item: CacheItem) {
        let currentTime = new Date();

        return currentTime > item.expires;
    }

    public getItem(key: string) {
        let item = this.dataMap.get(key);

        return item.data;
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
 * @param section {string} Cache section name
 * @param expiration {CacheExpiration} Expiration time (default is 5 min.)
 * @param immutable {boolean} If object is immutable, its cache never expires
 */
export function Cached(section?: string, expiration?: CacheExpiration, immutable: boolean = false) {
    if (section === null || section === undefined) {
        section = 'global';
    }

    let cacheSection = CacheServiceInstance.getSection(section);

    return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
        let originalMethod = descriptor.value; // save a reference to the original method

        // NOTE: Do not use arrow syntax here. Use a function expression in
        // order to use the correct value of `this` in this method (see notes below)
        descriptor.value = function (...args: any[]) {
            let cacheKey = getCacheKey(propertyKey, args);

            if (!cacheSection.hasItem(cacheKey)) {
                console.log('Cache miss', cacheKey);
                let result: Observable<any> = originalMethod.apply(this, args);

                return result.do(function(jsonResult) {
                    console.log('Cache emplacement', jsonResult);
                    cacheSection.setItem(cacheKey, jsonResult, immutable, expiration);
                });
            }

            console.log('cache hit', cacheKey);
            return new Observable<any>(function(observer) {
                observer.next(cacheSection.getItem(cacheKey));
                observer.complete();
            });
        };

        return descriptor;
    };
}

function getCacheKey(functionName: string, args: any[]) {
    let commaSeparatedArgs = args.join(', ');

    return functionName + '(' + commaSeparatedArgs + ')';
}

// I hope this will be sufficient for having single instance
export const CacheServiceInstance = new CacheService();
