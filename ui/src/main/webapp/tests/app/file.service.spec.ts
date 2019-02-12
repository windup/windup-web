import {
    HttpModule, BaseRequestOptions, Http, ConnectionBackend, RequestMethod, ResponseOptions,
    Response
} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';


import {Constants} from '../../src/app/constants';

import {FileService} from "../../src/app/services/file.service";
import {KeycloakService} from "../../src/app/core/authentication/keycloak.service";
import {MockBackend, MockConnection} from "@angular/http/testing";


describe("File Service", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [
                    Constants,
                    FileService,
                    KeycloakService,
                    MockBackend,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
                            return new Http(backend, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    }
                ],

            }
        );
        TestBed.compileComponents().catch(error => console.error(error));
    });

    it('Should make a POST request on backend with path', async(inject([FileService, MockBackend],
        (service: FileService, mockBackend: MockBackend) => {

            mockBackend.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toEqual(Constants.REST_BASE + '/file/pathExists');
                expect(connection.request.method).toEqual(RequestMethod.Post);
                expect(connection.request.getBody()).toEqual('src/main/java');
                connection.mockRespond(new Response(new ResponseOptions({
                    body: true
                })));
            });

            service.pathExists("src/main/java").toPromise()
                .then(result => {
                    expect(result).toEqual(true);
                }, error => {
                    expect(false).toBeTruthy("Service call failed due to: " + error);
                });
        })));
});
