import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {HttpModule} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';


import 'rxjs/Rx';

import {Constants} from '../../app/constants';


import {RegisteredApplicationService} from "../../app/services/registeredapplication.service";
import {RegisteredApplication} from "windup-services";

describe("Registered Application Service Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [Constants, RegisteredApplicationService]
            }
        );
        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('register app call', async(inject([RegisteredApplicationService], (service:RegisteredApplicationService) => {
        let inputApp = <RegisteredApplication>{};
        inputApp.inputPath = "src/main/java";
        return service.registerApplication(inputApp).toPromise()
            .then(application => {
                console.log("Registered application: " + JSON.stringify(application) + "; " + application.inputFilename);
                expect(application.inputFilename).toEqual("java");
            }, error => {
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    })));
});
