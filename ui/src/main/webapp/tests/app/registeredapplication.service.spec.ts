
import {TestBed, getTestBed, async, inject} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {Constants} from '../../src/app/constants';

import {KeyCloakServiceMock} from "./mocks/keycloak-service.mock";
import {RegisteredApplicationService} from "../../src/app/registered-application/registered-application.service";
import {KeycloakService} from "../../src/app/core/authentication/keycloak.service";
import {FileService} from "../../src/app/services/file.service";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";
import {EventBusService} from "../../src/app/core/events/event-bus.service";
import {MigrationProject, PackageMetadata, RegisteredApplication} from "../../src/app/generated/windup-services";
import {SchedulerServiceMock} from "./mocks/scheduler-service.mock";
import {Subject} from "rxjs";
import createSpy = jasmine.createSpy;
import {SchedulerService} from "../../src/app/shared/scheduler.service";
import {NgZone} from "@angular/core";

describe("Registered Application Service Test", () => {
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpClientTestingModule],
                providers: [
                    Constants, FileService, RegisteredApplicationService,
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
                    }
                ]
            }
        );
        TestBed.compileComponents().catch(error => console.error(error));

        let injector = getTestBed();
        httpMock = injector.get(HttpTestingController);
    });

    it('Should make a POST request on backend with path and title', async(inject([RegisteredApplicationService],
        (service: RegisteredApplicationService) => {

            let inputPath = "src/main/java";

            service.registerByPath(<MigrationProject>{id: 0}, inputPath, false).toPromise()
                .then(application => {
                    expect(application.inputFilename).toEqual("java");
                }, error => {
                    fail(error);
                });

            const req = httpMock.expectOne(Constants.REST_BASE + '/migrationProjects/0/registeredApplications/register-path?exploded=false');

            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(inputPath);

            req.flush({
                inputFilename: 'java'
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
            ]), null, schedulerMock, new NgZone({enableLongStackTrace: false}));
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
