import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable} from "@angular/core";

@Injectable()
export class ActivatedRouteMock {

    // ActivatedRoute.params is Observable
    private subject = new BehaviorSubject(this.testParams);
    params = this.subject.asObservable();

    // Test parameters
    private _testParams: {};
    get testParams() { return this._testParams; }
    set testParams(params: {}) {
        this._testParams = params;
        this.subject.next(params);
    }

    // ActivatedRoute.data is Observable
    private dataSubject = new BehaviorSubject(this.testData);
    data = this.dataSubject.asObservable();

    // Test data
    private _testData: {};
    get testData() { return this._testData; }
    set testData(data: {}) {
        this._testData = data;
        this.dataSubject.next(data);
    }

    // ActivatedRoute.snapshot.params
    get snapshot() {
        return {
            params: this.testParams,
            data: this.testData,
            url: this.url
        };
    }

    private _parent: ActivatedRouteMock;
    get parent(): ActivatedRouteMock { return this._parent; }
    set parent(parent: ActivatedRouteMock) {
        if (parent) {
            this._parent = parent;
        }
        else {
            this._parent = new ActivatedRouteMock();
        }
    }

    get url(): string[] {
        return ['this', 'is', 'a', 'mock'];
    }
}
