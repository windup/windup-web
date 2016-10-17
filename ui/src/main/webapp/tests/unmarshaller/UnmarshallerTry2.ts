
import {GraphJSONtoTsModelsService, RelationInfo} from '../../app/services/graph/GraphJSONtoTsModelsService';
//import {TestGeneratorModel, TestShipModel, TestPlanetModel} from '../../app/services/graph/test/models/TestGeneratorModel';
import {WarArchiveModel} from '../../app/tsModels/WarArchiveModel';
import {JavaClassFileModel} from '../../app/tsModels/JavaClassFileModel';
import {BaseFrameModel} from '../../app/services/graph/BaseFrameModel';
import {TestGraphData} from '../../app/services/graph/test/TestGraphData';
import {TechnologiesStatsModel} from '../../app/tsModels/TechnologiesStatsModel';
//import {TechnologyReferenceModel as TechnologiesStatsModel} from '../../app/tsModels/TechnologyReferenceModel';

import {DiscriminatorMapping, getParentClass} from '../../app/services/graph/DiscriminatorMapping';
import {DiscriminatorMappingData} from '../../app/tsModels/DiscriminatorMappingData';

import {FramesRestClientService} from '../../app/services/graph/FramesRestClientService';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax'; // Observable.ajax
import 'rxjs/add/operator/map';


export class UnmarshallerTry2
{
    static DISCR_TECH_STATS = TechnologiesStatsModel.discriminator; //"TechnologiesStats";
    static WINDUP_REST_URL =     "http://localhost:8080/windup-web-services/rest";
    static TECHSTATS_CREATE_URL = `${UnmarshallerTry2.WINDUP_REST_URL}/technologyStats/create?exec=`;
    static GRAPH_TECHSTATS_URL  = `${UnmarshallerTry2.WINDUP_REST_URL}/graph/by-type/${UnmarshallerTry2.DISCR_TECH_STATS}?depth=1`;
    
    constructor() {
        //this.graphClient = new FramesRestClientService();
    }


    /**
     * This simply returns the data from the graph service.
     */
    public getStatsFromGraph() //: Observable<TechnologiesStatsModel>
    {
        let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
        Observable.ajax.getJSON(UnmarshallerTry2.GRAPH_TECHSTATS_URL)
            .map(data => <TechnologiesStatsModel> service.fromJSON(data))
            .subscribe(data => console.log(data));
            //.catch(({ xhr }) => Observable.of( console.log(xhr.response.message) ));
    }


    public askForAndFetchTechStats2() : Promise<TechnologiesStatsModel> {
        let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
        
        // See RegisteredApplicationService and KeycloakService to get the token.
        
        return Observable.ajax.getJSON(UnmarshallerTry2.GRAPH_TECHSTATS_URL).toPromise()
        //subscribe( (next: TechnologiesStatsModel) => { } );
    }
    
    /**
     * Doesn't work. uses some weird incompatible jQuery's Promise.
     */
    public askForAndFetchTechStats() // : Promise<TechnologiesStatsModel>
    {
        // Fetch the TechStats. If not created, ask for creation.
        let ret = $.ajax({
            url: UnmarshallerTry2.GRAPH_TECHSTATS_URL
        }).then(resolve => function(data) {
            if (Array.isArray(data) && data.length != 0 ) {
                return 
            }
            else 
            {
                let execId = 1;
                return $.ajax({
                    url: UnmarshallerTry2.TECHSTATS_CREATE_URL + execId
                }).then(res => {
                    return $.ajax({
                        url: UnmarshallerTry2.GRAPH_TECHSTATS_URL
                    }).then(function(data) {
                        let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
                        var frame: JavaClassFileModel = (<JavaClassFileModel> service.fromJSON(data[0]));
                        //$('#header').append(data.id);
                        $('#response').append(frame.packageName);
                    });
                });
            }
            
        });
    }
    
    /**
     * This shows how to make a promise from jQuery's incompatible promise object.
     */
    public fetchTechStats(): Promise<any> {
        return new Promise( resolve => $.ajax({
            url: `http://localhost:8080/windup-web-services/rest/graph/by-type/${UnmarshallerTry2.DISCR_TECH_STATS}?depth=0`
        }).then(data => resolve(data) ) );
    }
    
    
    /**
     * jQuery's AJAX example.
     */
    public fetchSomeData() { //  : Promise<TechnologyReferenceModel>
        let service = new GraphJSONtoTsModelsService(DiscriminatorMappingData);
        
        $.ajax({
            url: "http://localhost:8080/windup-web-services/rest/graph/by-type/JavaClassFileModel?depth=0"
        }).then(function(data) {
            var frame: JavaClassFileModel = (<JavaClassFileModel> service.fromJSON(data[0]));
            //$('#header').append(data.id);
            $('#response').append(frame.packageName);
        });
    }
}