import {
    HttpModule, RequestMethod, ResponseOptions, Response, BaseRequestOptions, Http,
    ConnectionBackend
} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';


import 'rxjs/Rx';

import {Constants} from '../../src/app/constants';

import {KeyCloakServiceMock} from "./mocks/keycloak-service.mock";
import {RegisteredApplicationService} from "../../src/app/registered-application/registered-application.service";
import {KeycloakService} from "../../src/app/core/authentication/keycloak.service";
import {FileService} from "../../src/app/services/file.service";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {EventBusService} from "../../src/app/core/events/event-bus.service";
import {MigrationProject} from "windup-services";
import {SchedulerServiceMock} from "./mocks/scheduler-service.mock";
import {PackageMetadata} from "windup-services";
import {Subject} from "rxjs";
import createSpy = jasmine.createSpy;
import {RegisteredApplication} from "windup-services";
import {SchedulerService} from "../../src/app/shared/scheduler.service";

describe("Registered Application Service Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [
                    Constants, FileService, RegisteredApplicationService, MockBackend, BaseRequestOptions,
                    {
                        provide: SchedulerService,
                        useClass: SchedulerServiceMock
                    },
                    {
                        provide: EventBusService,
                        useValue: jasmine.createSpyObj('EventBusService', ['fireEvent'])
                    },
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
                expect(connection.request.url).toEqual(Constants.REST_BASE + '/migrationProjects/0/registeredApplications/register-path');
                expect(connection.request.method).toEqual(RequestMethod.Post);
                expect(connection.request.getBody()).toEqual("src/main/java");

                connection.mockRespond(new Response(new ResponseOptions({
                    body: {
                        inputFilename: 'java'
                    }
                })));
            });

            service.registerByPath(<MigrationProject>{id: 0}, inputPath).toPromise()
                .then(application => {
                    expect(application.inputFilename).toEqual("java");
                }, error => {
                    fail(error);
                });
        })));

    describe('waitUntilPackagesAreResolved', () => {
        let instance: RegisteredApplicationService;
        let schedulerMock: SchedulerServiceMock;
        let count = 0;

        // todo find out what to do with this:
        let subject = new Subject<PackageMetadata>();

        let getPackageMetadata = () => {

            count++;

            let result: PackageMetadata = {
                id: 1,
                discoveredDate: new Date(),
                scanStatus: 'QUEUED',
                packageTree: []
            };

            if (count === 3) {
                result.scanStatus = 'COMPLETE';
            } else if (count < 3) {
                result.scanStatus = 'IN_PROGRESS';
            } else {
                //throw new Error('Expected to get called max. 3 times, got called 4 times');
                result.scanStatus = 'COMPLETE';
                console.error('Expected to get called max. 3 times, got called 4 times');
            }

            subject.next(result);

            return subject;
        };

        beforeEach(() => {
            count = 0;
            schedulerMock = new SchedulerServiceMock();

            let originalMethod = schedulerMock.setTimeout.bind(schedulerMock);
            spyOn((<any>SchedulerServiceMock).prototype, 'setTimeout').and.callFake((callback, timeout) => {
                originalMethod(callback, timeout);
                schedulerMock.timerTick();
            });

            instance = new RegisteredApplicationService(null, null, jasmine.createSpyObj('multipartUploader', [
                'setOptions'
            ]), null, schedulerMock);
            spyOn(RegisteredApplicationService.prototype, 'getPackageMetadata').and.callFake(getPackageMetadata);
        });

        it('should use getPackageMetadata method', () => {
            instance.waitUntilPackagesAreResolved(<RegisteredApplication>{id: 1});
            expect(instance.getPackageMetadata).toHaveBeenCalled();
        });

        it('should make requests with timeout until packages are resolved', async(() => {
            instance.waitUntilPackagesAreResolved(<RegisteredApplication>{id: 1}).subscribe(
                value => {
                    expect(instance.getPackageMetadata).toHaveBeenCalledTimes(3);
                    expect(value.scanStatus).toBe('COMPLETED');
                },
                error => {
                    fail(error);
                }
            );

            expect(schedulerMock.setTimeout).toHaveBeenCalledTimes(2);
            schedulerMock.timerTick();
            expect(schedulerMock.setTimeout).toHaveBeenCalledTimes(2);
        }));
    });
});
