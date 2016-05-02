/// <reference path="../../node_modules/angular2/ts/typings/jasmine/jasmine.d.ts" />

import {provide} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {
    async,
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject
} from 'angular2/testing';

import 'rxjs/Rx';

import {Constants} from '../../app/constants';

import {FileService} from "../../app/services/file.service";


describe("File Service", () => {
    beforeEachProviders(() => [
        HTTP_PROVIDERS,
        Constants,
        FileService
    ]);

    it('file exists call', async(inject([FileService], (service:FileService) => {
        return service.pathExists("src/main/java").toPromise()
            .then(result => {
                expect(result).toEqual(true);
            }, error => {
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    })));
});
