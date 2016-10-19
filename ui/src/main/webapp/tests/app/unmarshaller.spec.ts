import {async} from '@angular/core/testing';

import {GraphJSONToModelService, RelationInfo} from '../../src/app/services/graph/graph-json-to-model.service';
import {DiscriminatorMapping, getParentClass} from '../../src/app/services/graph/discriminator-mapping';
import {TestGeneratorModel, TestPlanetModel, TestShipModel} from './models/test.models';
import {TestGraphData} from './models/test-graph-data';

import 'rxjs/Rx';

describe('Unmarshaller tests', () => {

    it("getParentClass()", function() {
        expect(getParentClass(TestPlanetModel).name).toBe("BaseModel");
    });

    it ('mapping test - getModelClassByDiscriminator()', () => {
        var clazz = DiscriminatorMapping.getModelClassByDiscriminator("TestPlanet");
        expect(clazz).toEqual(TestPlanetModel);
        var clazz = DiscriminatorMapping.getModelClassByDiscriminator("TestGenerator");
        expect(clazz).toEqual(TestGeneratorModel);
    });

    it ('mapping test - getDiscriminatorByModelClass()', () => {
        var discriminator = DiscriminatorMapping.getDiscriminatorByModelClass(TestPlanetModel);
        expect(discriminator).toEqual("TestPlanet");
    });

    it ('unmarshaller test - fromJSON() - basic properties', () => {
        let modelObject = new GraphJSONToModelService().fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);
        expect(modelObject).toBeDefined();
        expect(modelObject.vertexId).toEqual(456);
        let model = <TestGeneratorModel> modelObject;
        console.log("Returned model: " + model);

        expect(model.name).toEqual("Blake Ross");
    });

    it ('unmarshaller test - fromJSON() - ship', async(() => {
        let modelObject = new GraphJSONToModelService<TestGeneratorModel>().fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);

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

    it ('unmarshaller test - fromJSON() - planets', async(() => {
        let modelObject = new GraphJSONToModelService<TestGeneratorModel>().fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);

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
