import {
    HttpModule, RequestMethod, ResponseOptions, Response, BaseRequestOptions, Http,
    ConnectionBackend
} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';

import 'rxjs/Rx';

import {Constants} from '../../src/app/constants';
import {TechReportService} from "../../src/app/components/reports/technologies/tech-report.service";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {TECH_REPORT_DATA} from "./techreport-data";


describe("Registered Tech Report Service Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [HttpModule],
                providers: [
                    Constants, TechReportService, MockBackend, BaseRequestOptions,
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

    it('Should make a GET request on backend', async(inject([TechReportService, MockBackend],
        (service: TechReportService, mockBackend: MockBackend) => {

            mockBackend.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.url).toEqual(Constants.GRAPH_REST_BASE + '/graph/14/by-type/TechnologiesStats?depth=1');
                expect(connection.request.method).toEqual(RequestMethod.Get);

                connection.mockRespond(new Response(new ResponseOptions({
                    body: TECH_REPORT_DATA
                })));
            });

            service.getStats(14).toPromise()
                .then(techStat => {
                }, error => { fail(error); });
        }))
    );

});
