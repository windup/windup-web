
import {DiscriminatorMapping} from './DiscriminatorMapping';
import {FrameModel} from './FrameModel';
import {TestShipModel} from './test/models/TestGeneratorModel';
import {TestGeneratorModel} from './test/models/TestGeneratorModel';
import {TestPlanetModel} from './test/models/TestGeneratorModel';

export class DiscriminatorMappingTestData extends DiscriminatorMapping
{
    static mapping: { [key: string]: typeof FrameModel } = {
        "TestShip": TestShipModel,
        "TestGenerator": TestGeneratorModel,
        "TestPlanet": TestPlanetModel,
    }
    
    public static getMapping() : { [key: string]: typeof FrameModel } { return this.mapping; }

    constructor() { super(); }
}
