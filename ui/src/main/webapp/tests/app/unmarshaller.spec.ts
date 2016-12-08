import {async} from '@angular/core/testing';

import {GraphJSONToModelService, RelationInfo} from '../../src/app/services/graph/graph-json-to-model.service';
import {getParentClass} from '../../src/app/services/graph/discriminator-mapping';
import {DiscriminatorMappingTestData} from './models/discriminator-mapping-test-data';
import {TestGeneratorModel, TestPlanetModel, TestShipModel} from './models/test.models';
import {TestGraphData} from './models/test-graph-data';

import 'rxjs/Rx';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/toPromise';

import {Http} from "@angular/http";

describe('Unmarshaller tests', () => {

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
        let modelObject = new GraphJSONToModelService(DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA, null);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(456);
        let model = <TestGeneratorModel> modelObject;
        console.log("Returned model: " + model);

        expect(model.name).toEqual("Blake Ross");
    });

    it ('unmarshaller test - fromJSON() - ship', async(() => {
        let modelObject = new GraphJSONToModelService<TestGeneratorModel>(DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA, null);

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
        let http = <Http>{
            get(url:string) {
                console.log("Should call get to: " + url + " now");
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
        };

        let modelObject = new GraphJSONToModelService<TestGeneratorModel>(DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA, http);

        return modelObject.shuttles.toPromise()
            .then((shuttles:TestShipModel[]) => {
                expect(shuttles).toBeDefined();
                expect(shuttles instanceof Array).toBeTruthy();
                expect(shuttles.length).toEqual(1);
                expect(shuttles[0].name).toEqual("Shuttle 1")
            }, error => {
                expect(false).toBeTruthy("Getting ship data failed due to: " + error);
            });
    }));

    it ('unmarshaller test - fromJSON() - fighter', async(() => {
        let http = <Http>{
            get(url:string) {
                console.log("Should call get to: " + url + " now");
                return Observable.create(function(observer) {
                    let value: any = JSON.parse(`[{ "_id": 1001, "w:winduptype": ["TestShip"], "name": "Fighter"}]`);
                    observer.next(value);
                    observer.complete();
                });
            }
        };

        let modelObject = new GraphJSONToModelService<TestGeneratorModel>(DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA, http);

        return modelObject.fighter.toPromise()
            .then((fighter:TestShipModel) => {
                expect(fighter).toBeDefined();
                expect(fighter instanceof Array).toBeFalsy();
                expect(fighter.name).toEqual("Fighter")
            }, error => {
                expect(false).toBeTruthy("Getting ship data failed due to: " + error);
            });
    }));

    it ('unmarshaller test - fromJSON() - planets', async(() => {
        let modelObject = new GraphJSONToModelService<TestGeneratorModel>(DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA, null);

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
