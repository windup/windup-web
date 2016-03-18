/// <reference path="../../../../../node_modules/angular2/ts/typings/jasmine/jasmine.d.ts" />

import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
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

import {RegisteredApplicationModel} from "../../app/models/registered.application.model";
import {RegisteredApplicationService} from "../../app/services/registeredapplication.service";

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

describe("Registered Application Service Test", () => {
    beforeEachProviders(() => [
        HTTP_PROVIDERS,
        provide(REST_BASE, {useValue: REST_BASE.toString()}),
        RegisteredApplicationService
    ]);


    it('register app call', injectAsync([RegisteredApplicationService], (service:RegisteredApplicationService) => {
        return service.registerApplication("/fakepath").toPromise()
            .then(application => {
                console.log("Registered application: " + JSON.stringify(application) + "; " + application.inputPath);
                expect(application.inputPath).toEqual("/fakepath");
            }, error => {
                expect(false).toBeTruthy();
            });
    }));
});