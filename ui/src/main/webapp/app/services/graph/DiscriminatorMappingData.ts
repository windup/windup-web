import {FrameModel} from './FrameModel';
import {TestShipModel} from './test/models/TestGeneratorModel';
import {TestGeneratorModel} from './test/models/TestGeneratorModel';
import {TestPlanetModel} from './test/models/TestGeneratorModel';

export class DiscriminatorMappingData
{
    static mapping: { [key: string]: typeof FrameModel } = {
        "TestShip": TestShipModel,
        "TestGenerator": TestGeneratorModel,
        "TestPlanet": TestPlanetModel,
    }

    constructor(){};
}
