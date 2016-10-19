import {BaseModel} from '../../../src/app/services/graph/base.model';
import {GraphProperty} from "../../../src/app/services/graph/graph-property.decorator";
import {DiscriminatorMapping} from "../../../src/app/services/graph/discriminator-mapping";
import {GraphAdjacency} from "../../../src/app/services/graph/graph-adjacency.decorator";

import {Observable} from "rxjs/Observable";

export class TestGeneratorModel extends BaseModel
{
    static discriminator: string = 'TestGenerator';

    @GraphProperty("name")
    get name():string { return null; };

    @GraphProperty("rank")
    get rank():string { return null; };

    @GraphAdjacency("colonizes")
    get colonizedPlanet(): Observable<TestPlanetModel[]> { return null; }; // edge label 'colonizes'

    @GraphAdjacency("commands", false)
    get ship(): Observable<TestShipModel> { return null; }; // edge label 'commands'
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
