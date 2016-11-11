import {
    HttpModule, RequestMethod, ResponseOptions, Response, BaseRequestOptions, Http,
    ConnectionBackend
} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';


import 'rxjs/Rx';

import {Constants} from '../../src/app/constants';

import {KeyCloakServiceMock} from "./mocks/keycloak-service.mock";
import {RegisteredApplicationService} from "../../src/app/services/registered-application.service";
import {KeycloakService} from "../../src/app/services/keycloak.service";
import {FileService} from "../../src/app/services/file.service";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload/ng2-file-upload";
import {MockBackend, MockConnection} from "@angular/http/testing";

describe("Registered Application Service Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [
                    Constants, FileService, RegisteredApplicationService, MockBackend, BaseRequestOptions,
                    {
                        provide: FileUploader,
                        /*
                         * Just a Mock/fake object as it isn't really used by the test here
                         */
                        useFactory: () => {
                            return new FileUploader({});
                        },
                    },
                    {
                        provide: KeycloakService,
                        useFactory: () => {
                            return new KeyCloakServiceMock();
                        }
                    },
                    {
                        provide: Http,
                        useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    }
                ]
            }
        );
        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('Should make a POST request on backend with path and title', async(inject([RegisteredApplicationService, MockBackend],
        (service: RegisteredApplicationService, mockBackend: MockBackend) => {

            let inputPath = "src/main/java";

            mockBackend.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toEqual(Constants.REST_BASE + '/registeredApplications/register-path/0');
                expect(connection.request.method).toEqual(RequestMethod.Post);
                expect(JSON.parse(connection.request.getBody())).toEqual(jasmine.objectContaining({
                    "inputPath": inputPath,
                    "title": "java"
                }));

                connection.mockRespond(new Response(new ResponseOptions({
                    body: {
                        inputFilename: 'java'
                    }
                })));
            });

            service.registerByPath(0, inputPath).toPromise()
                .then(application => {
                    expect(application.inputFilename).toEqual("java");
                }, error => {
                    fail(error);
                });
        })));
});
