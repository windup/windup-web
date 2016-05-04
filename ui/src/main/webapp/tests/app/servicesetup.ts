/// <reference path="../../typings/browser/ambient/jasmine/index.d.ts" />

import {
    async,
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject,
    setBaseTestProviders
} from '@angular/core/testing';
import 'rxjs/Rx';

//import {
    //TEST_BROWSER_PLATFORM_PROVIDERS,
    //TEST_BROWSER_APPLICATION_PROVIDERS
//} from 'angular2/platform/testing/browser';

//setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS,
//    TEST_BROWSER_APPLICATION_PROVIDERS);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
