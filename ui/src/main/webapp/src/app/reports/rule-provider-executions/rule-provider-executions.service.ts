import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs";
import {GraphService} from "../../services/graph.service";
import {ExecutionPhaseModel} from "../../generated/tsModels/ExecutionPhaseModel";
import {RuleProviderModel} from "../../generated/tsModels/RuleProviderModel";
import {RuleExecutionModel} from "../../generated/tsModels/RuleExecutionModel";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";

@Injectable()
export class RuleProviderExecutionsService extends GraphService {

    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    getPhases(execID: number): Observable<ExecutionPhaseModel[]> {
        return this.getTypeAsArray<ExecutionPhaseModel>(ExecutionPhaseModel.discriminator, execID, {
            depth: 2
        });
    }

    getRuleProviders(execID: number): Observable<RuleProviderModel[]> {
        return this.getTypeAsArray<RuleProviderModel>(RuleProviderModel.discriminator, execID);
    }

    getRules(execID: number): Observable<RuleExecutionModel[]> {
        return this.getTypeAsArray<RuleExecutionModel>(RuleExecutionModel.discriminator, execID);
    }
}
