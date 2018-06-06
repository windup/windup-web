import {TestBed, async, inject} from '@angular/core/testing';

import 'rxjs/Rx';

import {Constants} from '../../src/app/constants';
import {TechReportService} from "../../src/app/reports/technologies/tech-report.service";
import {TECH_REPORT_DATA} from "./techreport-data";
import {initializeModelMappingData} from "../../src/app/generated/tsModels/discriminator-mapping-data";
import {GraphJSONToModelService} from "../../src/app/services/graph/graph-json-to-model.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {HttpClientTestingModule} from "@angular/common/http/testing";

initializeModelMappingData();

describe("TechReportService Test", () => {
    beforeEach(() => {
        TestBed.configureTestingModule(
            {
                imports: [ HttpClientModule, HttpClientTestingModule ],
                providers: [
                    Constants, TechReportService,
                    {
                        provide: GraphJSONToModelService,
                        useFactory: (http: HttpClient) => {
                            return new GraphJSONToModelService<any>(http, null);
                        },
                        deps: [ HttpClient ]
                    }
                ]
            }
        );
        TestBed.compileComponents().catch(error => console.error(error));
    });

    // it('Should make a GET request on backend', async(inject([TechReportService, MockBackend],
    //     (service: TechReportService, mockBackend: MockBackend) => {
    //
    //         mockBackend.connections.subscribe((connection: MockConnection) => {
    //             expect(connection.request.url).toEqual(
    //                 Constants.GRAPH_REST_BASE + '/graph/14/by-type/ProjectTechnologiesStats?depth=2&includeInVertices=false'
    //             );
    //             expect(connection.request.method).toEqual(RequestMethod.Get);
    //
    //             connection.mockRespond(new Response(new ResponseOptions({
    //                 body: TECH_REPORT_DATA
    //             })));
    //         });
    //
    //         service.getStats(14).toPromise()
    //             .then(techStat => {
    //                 techStat[0].projectModel.subscribe(projectModel => expect(projectModel.name).toEqual("Description Web Services"));
    //                 techStat[1].projectModel.subscribe(projectModel => expect(projectModel.name).toEqual("Description Web Services"));
    //                 techStat[2].projectModel.subscribe(projectModel => expect(projectModel.name).toEqual("Archives shared by multiple applications"));
    //             }, error => { fail(error); });
    //     }))
    // );

});
