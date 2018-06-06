import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {GraphService} from "../../services/graph.service";
import {ExecutionPhaseModel} from "../../generated/tsModels/ExecutionPhaseModel";
import {RuleProviderModel} from "../../generated/tsModels/RuleProviderModel";
import {RuleExecutionModel} from "../../generated/tsModels/RuleExecutionModel";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";

@Injectable()
export class RuleProviderExecutionsService extends GraphService {

    constructor(http: HttpClient, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('ruleProviderExecutions', null, true)
    getPhases(execID: number): Observable<ExecutionPhaseModel[]> {
        return this.getTypeAsArray<ExecutionPhaseModel>(ExecutionPhaseModel.discriminator, execID, {
            depth: 2,
            includeInVertices: false,
            blacklistProperties: ['ruleContents', 'countRemovedEdges', 'countAddedVertices', 'countAddedEdges', 'countRemovedVertices']
        });
    }

    @Cached('ruleProviderExecutions', null, true)
    getRuleProviders(execID: number): Observable<RuleProviderModel[]> {
        return this.getTypeAsArray<RuleProviderModel>(RuleProviderModel.discriminator, execID);
    }

    @Cached('ruleProviderExecutions', null, true)
    getRules(execID: number): Observable<RuleExecutionModel[]> {
        return this.getTypeAsArray<RuleExecutionModel>(RuleExecutionModel.discriminator, execID);
    }
}
