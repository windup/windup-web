import {DiscriminatorMapping} from '../../../app/services/graph/DiscriminatorMapping';
import {BaseModel} from '../../../app/services/graph/BaseModel';

import {TestGeneratorModel, TestPlanetModel, TestShipModel} from '../models/test.models';
import {WindupConfigurationModel} from '../../../app/tsModels/WindupConfigurationModel';
import {FileModel} from '../../../app/tsModels/FileModel';
import {JavaClassFileModel} from '../../../app/tsModels/JavaClassFileModel';




export class DiscriminatorMappingTestData extends DiscriminatorMapping
{
    static mapping: { [key: string]: typeof BaseModel } = {
        "BaseWindupConfiguration" : WindupConfigurationModel,
        "TestGenerator": TestGeneratorModel,
        "TestShip": TestShipModel,
        "TestPlanet": TestPlanetModel,
        "FileResource": FileModel,
        "JavaClassFileModel": JavaClassFileModel,
    };
    
    constructor() { super(); };
}


