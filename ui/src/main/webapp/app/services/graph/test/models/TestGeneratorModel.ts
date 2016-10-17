import {BaseFrameModel} from '../../BaseFrameModel';
//import {TestPlanetModel} from './TestPlanetModel';
//import {TestShipModel} from './TestShipModel';

export class TestGeneratorModel extends BaseFrameModel
{
    static discriminator: string = 'TestGenerator';

    static graphPropertyMapping: { [key:string]:string; } = {
        bar: 'boo',
        name: 'name',
        rank: 'rank',
    };

    static graphRelationMapping: { [key:string]:string; } = {
        colonizes: 'colonizedPlanet[',
        commands: 'ship',
    };

    boo: string;
    name: string;
    rank: string;

    public colonizedPlanet: TestPlanetModel[]; // edge label 'colonizes'

    public ship: TestShipModel; // edge label 'commands'
}

export class TestPlanetModel extends BaseFrameModel
{
    static discriminator: string = 'TestPlanet';

    static graphPropertyMapping: { [key:string]:string; } = {
        name: 'name',
    };

    static graphRelationMapping: { [key:string]:string; } = {
    };

    name: string;
}

export class TestShipModel extends BaseFrameModel
{
    static discriminator: string = 'TestShip';

    static graphPropertyMapping: { [key:string]:string; } = {
        name: 'name',
    };

    static graphRelationMapping: { [key:string]:string; } = {
    };

    name: string;
}
