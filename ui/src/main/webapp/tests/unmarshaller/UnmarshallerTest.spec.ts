import {GraphJSONtoTsModelsService, RelationInfo} from '../../app/services/graph/GraphJSONtoTsModelsService';
import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {DiscriminatorMappingTestData} from '../../app/services/graph/DiscriminatorMappingTestData';
import {TestGeneratorModel, TestShipModel, TestPlanetModel} from '../../app/services/graph/test/models/TestGeneratorModel';
import {FrameModel} from '../../app/services/graph/FrameModel';
import {TestGraphData} from '../../app/services/graph/test/TestGraphData';

describe('Unmarshaller tests', () => {
    it("getParentClass()", function() {
        expect(getParentClass(TestPlanetModel).name).toBe("FrameModel");
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

    it ('unmarshaller test - fromJSON()', () => {
        let frame = new GraphJSONtoTsModelsService(DiscriminatorMappingTestData).fromJSON(TestGraphData.TEST_GRAPH_MODEL_DATA);
        expect(frame).toBeDefined();
        expect(frame.getVertexId()).toEqual(456);
        let model = <TestGeneratorModel> frame;

        expect(model.name).toEqual("Blake Ross");

        expect(model.ship).toBeDefined();
        expect(model.ship instanceof Array).toBeFalsy();
        //expect(model.ship.name).toBeDefined();
        //expect((<TestShipModel>model.ship).name).toEqual("USS Firefox");

        expect(model.colonizedPlanet).toBeDefined();
        expect(model.colonizedPlanet instanceof Array).toBeTruthy();
        expect(model.colonizedPlanet.length).toEqual(3);
        expect(model.colonizedPlanet[0]).toBeDefined();
        expect(model.colonizedPlanet[1]).toBeDefined();
        expect(model.colonizedPlanet[0].name).toEqual("Mars");
        expect(model.colonizedPlanet[1].name).toEqual("Venus");
        expect(model.colonizedPlanet[2]).toBeNull();
    });

    /*
    // Don't run, overwrites the static mapping.
    it ('class scanning test', () => {
        DiscriminatorMapping.scanGlobalClasses();
        expect("foo").toEqual("foo");
        //expect(DiscriminatorMapping.mapping["TestPlanet"]).toEqual(TestPlanetModel);
        // Problem: SystemJS doesn't put classes into the global object:
        // http://stackoverflow.com/questions/38851816/systemjs-listing-all-registered-functions
    });
    */

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
