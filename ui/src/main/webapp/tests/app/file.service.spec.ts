
import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {Constants} from '../../src/app/constants';

import {FileService} from "../../src/app/services/file.service";
import {KeycloakService} from "../../src/app/core/authentication/keycloak.service";


describe("File Service", () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpClientTestingModule],
                providers: [
                    Constants,
                    FileService,
                    KeycloakService,                    
                ],

            }
        );
        TestBed.compileComponents().catch(error => console.error(error));

        injector = getTestBed();
        httpMock = injector.get(HttpTestingController);
    });

    it('Should make a POST request on backend with path', async(inject([FileService],
        (service: FileService) => {
            const path = 'src/main/java';

            /**
             * TODO: There is a bug in Angular, which prevents from using boolean value true
             * see https://github.com/angular/angular/issues/20690
             */
            const responseValue: any = 'true';

            service.pathExists(path).toPromise()
                .then(result => {
                    expect(result).toEqual(responseValue);
                }, error => {
                    expect(false).toBeTruthy("Service call failed due to: " + error);
                });

            const req = httpMock.expectOne(Constants.REST_BASE + '/file/pathExists');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toBe(path);

            req.flush(responseValue);
    })));

    afterEach(() => {
        httpMock.verify();
    });
});
