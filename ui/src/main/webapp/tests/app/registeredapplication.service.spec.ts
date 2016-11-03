import {HttpModule} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';


import 'rxjs/Rx';

import {Constants} from '../../app/constants';


import {RegisteredApplicationService} from "../../app/services/registeredapplication.service";
import {KeycloakService} from "../../app/services/keycloak.service";
import {FileService} from "../../app/services/file.service";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload/ng2-file-upload";

describe("Registered Application Service Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [
                    Constants, FileService, RegisteredApplicationService, KeycloakService,
                    {
                        provide: FileUploader,
                        /*
                         * Just a Mock/fake object as it isn't really used by the test here
                         */
                        useFactory: () => {
                            return new FileUploader({});
                        },
                    }
                ]
            }
        );
        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('register app call', async(inject([RegisteredApplicationService], (service:RegisteredApplicationService) => {
        let inputPath = "src/main/java/";
        return service.registerByPath(0, inputPath).toPromise()
            .then(application => {
                console.log("Registered application: " + application.inputFilename);
                expect(application.inputFilename).toEqual("java");
            }, error => {
                if (error)
                expect(false).toBeTruthy("Service call failed due to: " + error);
            });
    })));
});
