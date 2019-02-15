import {async, inject} from '@angular/core/testing';
import {HttpClient} from "@angular/common/http";
import {Observable} from 'rxjs';

import {GraphJSONToModelService, RelationInfo} from '../../src/app/services/graph/graph-json-to-model.service';
import {getParentClass} from '../../src/app/services/graph/discriminator-mapping';
import {DiscriminatorMappingTestData} from './models/discriminator-mapping-test-data';
import {TestGeneratorModel, TestPlanetModel, TestShipModel} from './models/test.models';
import {TestGraphData} from './models/test-graph-data';
import {StaticCache} from "../../src/app/services/graph/cache";

// A real model
import { SourceReportModel } from '../../src/app/generated/tsModels/SourceReportModel';
import { SourceReportToProjectEdgeModel } from '../../src/app/generated/tsModels/SourceReportToProjectEdgeModel';
import { ProjectModel } from '../../src/app/generated/tsModels/ProjectModel';


describe('Unmarshaller tests', () => {

    let graphJsonToModelService: GraphJSONToModelService<any>;
    let http: any;

    beforeEach(() => {
        StaticCache.clear();

        http = jasmine.createSpyObj('Http', [
            'get'
        ]);

        graphJsonToModelService = new GraphJSONToModelService<any>(http, DiscriminatorMappingTestData);
    });

    it("getParentClass()", function() {
        expect(getParentClass(TestPlanetModel).name).toBe("BaseModel");
    });

    it ('mapping test - getModelClassByDiscriminator()', () => {
        var clazz = DiscriminatorMappingTestData.getModelClassByDiscriminator("TestPlanet");
        expect(clazz).toEqual(TestPlanetModel);
        var clazz = DiscriminatorMappingTestData.getModelClassByDiscriminator("TestGenerator");
        expect(clazz).toEqual(TestGeneratorModel);
    });

    it ('mapping test - getDiscriminatorByModelClass()', () => {
        var discriminator = DiscriminatorMappingTestData.getDiscriminatorByModelClass(TestPlanetModel);
        expect(discriminator).toEqual("TestPlanet");
    });

    it ('unmarshaller test - fromJSON() - basic properties', () => {
        let modelObject = graphJsonToModelService.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(456);
        let model = <TestGeneratorModel> modelObject;

        expect(model.name).toEqual("Blake Ross");
    });

    it ('unmarshaller test - fromJSON() - basic properties - array', () => {
        let modelObjects = graphJsonToModelService.fromJSONarray(TestGraphData.TEST_FILE_MODELS);
        expect(modelObjects).toBeDefined();
        expect(modelObjects.length).toEqual(2);
        expect(modelObjects[0].vertexId).toEqual(16384);
        expect(modelObjects[1].vertexId).toEqual(16640);
    });

    it ('unmarshaller test - fromJSON() - SetInProperties', () => {
        let modelObject = graphJsonToModelService.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(456);
        let model = <TestGeneratorModel> modelObject;

        expect(model.setInPropsTest).toBeDefined("Should be defined");
        expect(model.setInPropsTest.length).toEqual(3);
        expect(model.setInPropsTest[0]).toEqual("property1");
        expect(model.setInPropsTest[1]).toEqual("property2");
        expect(model.setInPropsTest[2]).toEqual("property3");
    });

    it ('unmarshaller test - fromJSON() - ship', async(() => {
        let modelObject = graphJsonToModelService.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);

        return modelObject.ship.toPromise()
            .then((ship:TestShipModel) => {
                expect(ship).toBeDefined();
                expect(ship instanceof Array).toBeFalsy();
                expect(ship.name).toBeDefined();
                expect(ship.name).toEqual("USS Firefox");
            }, error => {
                expect(false).toBeTruthy("Getting ship data failed due to: " + error);
            });
    }));

    it ('unmarshaller test - fromJSON() - shuttles', async(() => {
        http.get.and.callFake((url: string) => {
                return Observable.create(function(observer) {
                    let value: any = {
                        json: function () {
                            return [{"_id": 1001, "w:winduptype": ["TestShip"], "name": "Shuttle 1"}];
                        }
                    };
                    observer.next(value);
                    observer.complete();
                });
            }
        );

        let modelObject = graphJsonToModelService.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);

        return modelObject.shuttles.toPromise()
            .then((shuttles:TestShipModel[]) => {
                expect(shuttles).toBeDefined();
                expect(shuttles instanceof Array).toBeTruthy();
                expect(shuttles.length).toEqual(1, "shuttles.length should be 1, was " + shuttles.length);
                expect(shuttles[0].name).toEqual("Shuttle 1")
            }, error => {
                expect(false).toBeTruthy("Getting ship data failed due to: " + error);
            });
    }));

    it ('unmarshaller test - fromJSON() - fighter', async(() => {
        http.get.and.callFake((url: string) => {
                return Observable.create(function(observer) {
                    let value: any = {
                        json: function () {
                            return [{ "_id": 1001, "w:winduptype": ["TestShip"], "name": "Fighter"}];
                        }
                    };
                    observer.next(value);
                    observer.complete();
                });
        });

        let modelObject = graphJsonToModelService.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);
        expect(modelObject instanceof Array).toBeFalsy("fromJSON() should return a single object, was: " + JSON.stringify(modelObject ));

        return modelObject.fighter.toPromise()
            .then((fighter:TestShipModel) => {
                expect(fighter).toBeDefined();
                expect(fighter instanceof Array).toBeFalsy("modelObject.fighter getter should return a single object, was: " + JSON.stringify(fighter));
                expect(fighter.name).toEqual("Fighter")
            }, error => {
                expect(false).toBeTruthy("Getting ship data failed due to: " + error);
            });
    }));

    it ('unmarshaller test - fromJSON() - planets', async(() => {
        let modelObject = graphJsonToModelService.fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);

        return modelObject.colonizedPlanet.toPromise()
            .then((planets:TestPlanetModel[]) => {
                expect(planets).toBeDefined();
                expect(planets instanceof Array).toBeTruthy();
                expect(planets.length).toEqual(2);
                expect(planets[0]).toBeDefined();
                expect(planets[1]).toBeDefined();
                expect(planets[0].name).toEqual("Mars");
                expect(planets[1].name).toEqual("Venus");
                //expect(planets[2]).toBeNull();
            }, error => {
                expect(false).toBeTruthy("Getting planet data failed due to: " + error);
            });
    }));


    it ('unmarshaller test - fromJSON() - SourceModelReport with @Incidence', async(() => {
        let modelObject = graphJsonToModelService
            .fromJSON(TestGraphData.TEST_FRAME_WITH_INCIDENCE);

        /// SourceReportModel projectEdges -> should be Observable<SourceReportToProjectEdgeModel[]>
        return modelObject.projectEdges.toPromise()
            .then((sourceReports: SourceReportToProjectEdgeModel[]) => {
                expect(sourceReports).toBeDefined("sourceReports should be defined");
                expect(sourceReports instanceof Array).toBeTruthy("sourceReports should be an array");
                expect(sourceReports.length).toEqual(1, "sourceReports length should be 1");
                expect(sourceReports[0]).toBeDefined("sourceReports item one should be defined");
                expect(sourceReports[0].fullPath).toBeDefined("sourceReports fullPath should be defined");
                expect(sourceReports[0].fullPath).toEqual("jee-example-app-1.0.0.ear/META-INF/MANIFEST.MF", "sourceReports[0] should have the expected fullPath");
                expect(sourceReports[0].projectModel).toBeDefined("sourceReports[0].projectModel should be defined");
                sourceReports[0].projectModel.toPromise().then((projectModel: ProjectModel)  => {
                    expect(projectModel.name).toEqual("JEE Example App");
                });
            }, error => {
                expect(false).toBeTruthy("Getting source report data failed due to: " + error);
            });
    }));



    it("Util functions", () => {
        let info = RelationInfo.parse("foo[Bar");
        expect(info).toBeDefined();
        expect(info.beanPropName).toEqual("foo");
        expect(info.typeDiscriminator).toEqual("Bar");
        expect(info.isArray).toBeTruthy();

        info = RelationInfo.parse("foo|[Bar");
        expect(info).toBeDefined();
        expect(info.beanPropName).toEqual("foo");
        expect(info.typeDiscriminator).toEqual("Bar");
        expect(info.isArray).toBeTruthy();

        info = RelationInfo.parse("foo|Bar");
        expect(info).toBeDefined();
        expect(info.beanPropName).toEqual("foo");
        expect(info.typeDiscriminator).toEqual("Bar");
        expect(info.isArray).toBeFalsy();

        info = RelationInfo.parse("foo[");
        expect(info).toBeDefined();
        expect(info.beanPropName).toEqual("foo");
        expect(info.typeDiscriminator).toBeNull();
        expect(info.isArray).toBeTruthy();

        info = RelationInfo.parse("foo");
        expect(info).toBeDefined();
        expect(info.beanPropName).toEqual("foo");
        expect(info.typeDiscriminator).toBeNull();
        expect(info.isArray).toBeFalsy();
    })
});
