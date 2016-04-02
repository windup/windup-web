/// <reference path="../../node_modules/angular2/ts/typings/jasmine/jasmine.d.ts" />

import {
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject,
    injectAsync
} from 'angular2/testing';
import 'rxjs/Rx';

import {setBaseTestProviders} from 'angular2/testing';
import {
    TEST_BROWSER_PLATFORM_PROVIDERS,
    TEST_BROWSER_APPLICATION_PROVIDERS
} from 'angular2/platform/testing/browser';

import {REST_BASE} from '../../app/constants';

setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS,
    TEST_BROWSER_APPLICATION_PROVIDERS);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
