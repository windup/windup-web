
import {GraphJSONtoTsModelsService, RelationInfo} from '../../app/services/graph/GraphJSONtoTsModelsService';
//import {TestGeneratorModel, TestShipModel, TestPlanetModel} from '../../app/services/graph/test/models/TestGeneratorModel';
import {WarArchiveModel} from '../../app/tsModels/WarArchiveModel';
import {JavaClassFileModel} from '../../app/tsModels/JavaClassFileModel';
import {FrameModel} from '../../app/services/graph/FrameModel';
import {TestGraphData} from '../../app/services/graph/test/TestGraphData';

import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {DiscriminatorMappingData} from '../../app/tsModels/DiscriminatorMappingData';

import {FramesRestClientService} from '../../app/services/graph/FramesRestClientService';
//import $ from 'jquery';



export class UnmarshallerClass
{
    //@Inject
    private graphClient: FramesRestClientService;
    
    constructor() {
        //this.graphClient = new FramesRestClientService();
    }

    
    public fetchSomeData(){
        let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
        
        $.ajax({
            url: "http://localhost:8080/windup-web-services/rest/graph/by-type/JavaClassFileModel?depth=0"
        }).then(function(data) {
            var frame: JavaClassFileModel = (<JavaClassFileModel> service.fromJSON(data[0]));
            //$('#header').append(data.id);
            $('#response').append(frame.packageName);
        });
        /*
        */
    }
}