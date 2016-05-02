/// <reference path="../../node_modules/angular2/ts/typings/jasmine/jasmine.d.ts" />

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

import {Constants} from '../../app/constants';


import {RegisteredApplicationModel} from "../../app/models/registered.application.model";
import {RegisteredApplicationService} from "../../app/services/registeredapplication.service";

describe("Registered Application Service Test", () => {
    beforeEachProviders(() => [
        HTTP_PROVIDERS,
        Constants,
        RegisteredApplicationService
    ]);

    it('register app call', injectAsync([RegisteredApplicationService], (service:RegisteredApplicationService) => {
        let inputApp = new RegisteredApplicationModel();
        inputApp.inputPath = "src/main/java";
        return service.registerApplication(inputApp).toPromise()
            .then(application => {
                console.log("Registered application: " + JSON.stringify(application) + "; " + application.inputFilename);
                expect(application.inputFilename).toEqual("java");
            }, error => {
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    }));
});
