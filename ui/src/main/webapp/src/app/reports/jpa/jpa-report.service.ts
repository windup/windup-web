import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {GraphService} from "../../services/graph.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";
import {JPAEntityModel} from "../../generated/tsModels/JPAEntityModel";
import {JPANamedQueryModel} from "../../generated/tsModels/JPANamedQueryModel";
import {JPAPersistenceUnitModel} from "../../generated/tsModels/JPAPersistenceUnitModel";
import {JPAConfigurationFileModel} from "../../generated/tsModels/JPAConfigurationFileModel";

@Injectable()
export class JpaReportService extends GraphService
{
    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('jpaReport', null, true)
    getJpaInfo(execID: number): Observable<JpaReportInfo>
    {
        let a = this.getTypeAsArray<JPAEntityModel>(JPAEntityModel.discriminator, execID, {depth: 2, includeInVertices: false});
        let b = this.getTypeAsArray<JPANamedQueryModel>(JPANamedQueryModel.discriminator, execID, {depth: 2, includeInVertices: false});
        let c = this.getTypeAsArray<JPAPersistenceUnitModel>(JPAPersistenceUnitModel.discriminator, execID, {depth: 2, includeInVertices: false});
        let d = this.getTypeAsArray<JPAConfigurationFileModel>(JPAConfigurationFileModel.discriminator, execID, {depth: 2, includeInVertices: false});
        return Observable.forkJoin(a, b, c, d).map(val => {
            let jpaInfo: JpaReportInfo = {
                entities: val[0],
                namedQueries: val[1],
                persistenceUnits: val[2],
                configFiles: val[3],
            }
            return jpaInfo;
        });
    }
 }

export interface JpaReportInfo {
    entities: JPAEntityModel[];
    namedQueries: JPANamedQueryModel[];
    persistenceUnits: JPAPersistenceUnitModel[];
    configFiles: JPAConfigurationFileModel[];
};