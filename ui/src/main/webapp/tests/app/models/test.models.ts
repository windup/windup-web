import {BaseModel} from '../../../app/services/graph/BaseModel';
import {GraphProperty} from "../../../app/services/graph/graph-property.decorator";
import {DiscriminatorMapping} from "../../../app/services/graph/DiscriminatorMapping";
import {GraphAdjacency} from "../../../app/services/graph/graph-adjacency.decorator";

import {Observable} from "rxjs/Observable";

export class TestGeneratorModel extends BaseModel
{
    static discriminator: string = 'TestGenerator';

    @GraphProperty("name")
    get name():string { return null; };

    @GraphProperty("rank")
    get rank():string { return null; };

    @GraphAdjacency("colonizes", "OUT")
    get colonizedPlanet(): Observable<TestPlanetModel[]> { return null; }; // edge label 'colonizes'

    @GraphAdjacency("commands", "OUT", false)
    get ship(): Observable<TestShipModel> { return null; }; // edge label 'commands'

    @GraphAdjacency("shuttles", "OUT", true)
    get shuttles(): Observable<TestShipModel[]> { return null; }; // edge label 'commands'

    @GraphAdjacency("fighter", "OUT", false)
    get fighter(): Observable<TestShipModel> { return null; }; // edge label 'commands'
}

export class TestPlanetModel extends BaseModel
{
    static discriminator: string = 'TestPlanet';

    @GraphProperty("name")
    get name():string { return null; };
}

export class TestShipModel extends BaseModel
{
    static discriminator: string = 'TestShip';

    @GraphProperty("name")
    get name():string { return null; };
}

DiscriminatorMapping.addModelClass(TestGeneratorModel);
DiscriminatorMapping.addModelClass(TestPlanetModel);
DiscriminatorMapping.addModelClass(TestShipModel);
