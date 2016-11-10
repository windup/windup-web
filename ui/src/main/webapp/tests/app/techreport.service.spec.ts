import {
    HttpModule, RequestMethod, ResponseOptions, Response, BaseRequestOptions, Http,
    ConnectionBackend
} from '@angular/http';

import {TestBed, async, inject} from '@angular/core/testing';

import 'rxjs/Rx';

import {Constants} from '../../src/app/constants';
import {KeyCloakServiceMock} from "./mocks/keycloak-service.mock";
import {TechReportService} from "../../src/app/components/reports/technologies/tech-report.service";
import {KeycloakService} from "../../src/app/services/keycloak.service";
import {FileService} from "../../src/app/services/file.service";
import {FileUploader, FileUploaderOptions} from "ng2-file-upload/ng2-file-upload";
import {MockBackend, MockConnection} from "@angular/http/testing";
import {GeneralStatsItemModel} from "../../src/app/generated/tsModels/GeneralStatsItemModel"


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
                    body: TECHREPORT_SERVICE_BODY
                })));
            });

            service.getStats(14).toPromise()
                .then(techStat => {
                    techStat.statsFilesByTypeJavaPercent.subscribe( (item:GeneralStatsItemModel) => expect(item.quantity).toEqual(61) )
                    techStat.statsServicesEjbMessageDriven.subscribe( (item:GeneralStatsItemModel) => expect(item.quantity).toEqual(2) )
                    techStat.statsServerResourcesJndiTotalEntries.subscribe( (item:GeneralStatsItemModel) => expect(item.quantity).toEqual(3) )
                }, error => { fail(error); });
        }))
    );


    let TECHREPORT_SERVICE_BODY = [{"w:winduptype":["TechnologiesStats"],"vertices_in":{},"_type":"vertex","TechnologiesStats_computed":1478523106261,"vertices_out":{"stats.java.classes.original":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.java.classes.original":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/230656/IN/stats.java.classes.original","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":230656,"GeneralStatsItem_qty":22}],"direction":"OUT"},"stats.files.byType.js.percent":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.files.byType.js.percent":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/226304/IN/stats.files.byType.js.percent","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":226304,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.files.byType.fmt.percent":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.files.byType.fmt.percent":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/227328/IN/stats.files.byType.fmt.percent","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":227328,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.services.http.jax-ws":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.http.jax-ws":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/229376/IN/stats.services.http.jax-ws","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":229376,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.java.jars.total":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.java.jars.total":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/231424/IN/stats.java.jars.total","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":231424,"GeneralStatsItem_qty":9}],"direction":"OUT"},"stats.services.ejb.stateful":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.ejb.stateful":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/227840/IN/stats.services.ejb.stateful","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":227840,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.services.jpa.persistenceUnits":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.jpa.persistenceUnits":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/228864/IN/stats.services.jpa.persistenceUnits","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":228864,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.files.byType.xml.percent":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.files.byType.xml.percent":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/227072/IN/stats.files.byType.xml.percent","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":227072,"GeneralStatsItem_qty":15}],"direction":"OUT"},"stats.serverResources.jndi.totalEntries":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.serverResources.jndi.totalEntries":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/230400/IN/stats.serverResources.jndi.totalEntries","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":230400,"GeneralStatsItem_qty":3}],"direction":"OUT"},"stats.services.ejb.stateless":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.ejb.stateless":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/227584/IN/stats.services.ejb.stateless","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":227584,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.services.ejb.messageDriven":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.ejb.messageDriven":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/228096/IN/stats.services.ejb.messageDriven","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":228096,"GeneralStatsItem_qty":2}],"direction":"OUT"},"stats.serverResources.msg.jms.queues":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.serverResources.msg.jms.queues":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/229632/IN/stats.serverResources.msg.jms.queues","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":229632,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.files.byType.html.percent":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.files.byType.html.percent":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/226560/IN/stats.files.byType.html.percent","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":226560,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.java.classes.total":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.java.classes.total":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/230912/IN/stats.java.classes.total","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":230912,"GeneralStatsItem_qty":49}],"direction":"OUT"},"stats.files.byType.css.percent":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.files.byType.css.percent":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/226816/IN/stats.files.byType.css.percent","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":226816,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.java.jars.original":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.java.jars.original":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/231168/IN/stats.java.jars.original","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":231168,"GeneralStatsItem_qty":6}],"direction":"OUT"},"stats.files.byType.java.percent":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.files.byType.java.percent":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/226048/IN/stats.files.byType.java.percent","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":226048,"GeneralStatsItem_qty":61}],"direction":"OUT"},"stats.serverResources.msg.jms.topics":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.serverResources.msg.jms.topics":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/229888/IN/stats.serverResources.msg.jms.topics","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":229888,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.services.jpa.entitites":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.jpa.entitites":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/228352/IN/stats.services.jpa.entitites","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":228352,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.services.jpa.namedQueries":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.jpa.namedQueries":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/228608/IN/stats.services.jpa.namedQueries","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":228608,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.serverResources.msg.jms.connectionFactories":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.serverResources.msg.jms.connectionFactories":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/230144/IN/stats.serverResources.msg.jms.connectionFactories","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":230144,"GeneralStatsItem_qty":0}],"direction":"OUT"},"stats.services.http.jax-rs":{"vertices":[{"w:winduptype":["GeneralStatsItem"],"vertices_in":{"stats.services.http.jax-rs":{"_type":"link","link":"http://localhost:8080/windup-web-services/rest-furnace/graph/14/edges/229120/IN/stats.services.http.jax-rs","direction":"IN"}},"_type":"vertex","vertices_out":{},"_id":229120,"GeneralStatsItem_qty":0}],"direction":"OUT"}},"_id":225792}]
});
