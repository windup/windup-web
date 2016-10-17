
import {DiscriminatorMapping} from '../DiscriminatorMappingBFM';
import {BaseFrameModel} from '../BaseFrameModel';
import {TestShipModel} from '../test/models/TestGeneratorModel';
import {TestGeneratorModel} from '../test/models/TestGeneratorModel';
import {TestPlanetModel} from '../test/models/TestGeneratorModel';

export class DiscriminatorMappingTestData extends DiscriminatorMapping
{
    static mapping: { [key: string]: typeof BaseFrameModel } = {
        "TestShip": TestShipModel,
        "TestGenerator": TestGeneratorModel,
        "TestPlanet": TestPlanetModel,
    }
    
    public static getMapping() : { [key: string]: typeof BaseFrameModel } { return this.mapping; }

    constructor() { super(); }
}
