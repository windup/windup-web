import {provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';

import {addProviders, async, inject} from '@angular/core/testing';

import 'rxjs/Rx';

import {Constants} from '../../app/constants';

import {FileService} from "../../app/services/file.service";


describe("File Service", () => {
    beforeEach(() => {
        addProviders([
            HTTP_PROVIDERS,
            Constants,
            FileService
        ]);
    });

    it('file exists call', async(inject([FileService], (service:FileService) => {
        return service.pathExists("src/main/java").toPromise()
            .then(result => {
                expect(result).toEqual(true);
            }, error => {
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    })));
});
