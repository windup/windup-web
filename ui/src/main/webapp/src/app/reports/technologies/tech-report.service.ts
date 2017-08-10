import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {GraphService} from "../../services/graph.service";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {Cached} from "../../shared/cache.service";
import {EjbMessageDrivenModel} from "../../generated/tsModels/EjbMessageDrivenModel";
import {EjbEntityBeanModel} from "../../generated/tsModels/EjbEntityBeanModel";
import {EjbSessionBeanModel} from "../../generated/tsModels/EjbSessionBeanModel";
import {EjbBeanBaseModel} from "../../generated/tsModels/EjbBeanBaseModel";

@Injectable()
export class TechReportService extends GraphService
{
    constructor(http: Http, graphJsonToModelService: GraphJSONToModelService<any>) {
        super(http, graphJsonToModelService);
    }

    @Cached('techReport', null, true)
    getStats(execID: number): Observable<ProjectTechnologiesStatsModel[]>
    {
        return this.getTypeAsArray<ProjectTechnologiesStatsModel>(ProjectTechnologiesStatsModel.discriminator, execID, {
            depth: 2,
            includeInVertices: false
        });
    }

    getEjbMessageDrivenModel(execID: number): Observable<EJBStatDTO[]> {
        return this.getTypeAsArray<EjbMessageDrivenModel>(
            EjbMessageDrivenModel.discriminator,
            execID,
            {depth: 1}
        ).map(value => {
            return this.loadStats(value);
            }
        );
    }

    getEjbSessionBeanModel(execID: number, sessionType: string): Observable<EJBStatDTO[]> {
        return this.getTypeAsArray<EjbSessionBeanModel>(
            EjbSessionBeanModel.discriminator,
            execID,
            {depth: 1},
            'sessionType',
            sessionType
        ).map(value => {
                return this.loadStats(value);
            }
        );
    }

    getEjbEntityBeanModel(execID: number): Observable<EJBStatDTO[]> {
        return this.getTypeAsArray<EjbEntityBeanModel>(
            EjbEntityBeanModel.discriminator,
            execID,
            {depth: 1}
            ).map(value => {
                return this.loadStats(value);
            }
        );
    }

    private loadStats(values:EjbBeanBaseModel[]):EJBStatDTO[] {
        let result = [];
        values.forEach( mdb => {
            let mdbStat: EJBStatDTO = {
                name: '',
                class: '',
                location: '',
                sourceVertexId: null,
                interface: ''
            };
            mdbStat.name = mdb.beanName;

            mdb.ejbClass.subscribe(clazz => {
                mdbStat.class = clazz.qualifiedName;
                clazz.decompiledSource.subscribe(source => {
                    if (source) {
                        mdbStat.sourceVertexId = source.vertexId;
                    }
                });
            });

            if (mdb instanceof EjbMessageDrivenModel) {
                mdb.destination.subscribe(destination => {
                    if (destination) {
                        mdbStat.location = destination.jndiLocation;
                    }
                });
            } else if (mdb instanceof EjbSessionBeanModel) {
                mdb.globalJndiReference.subscribe(destination => {
                    if (destination) {
                        mdbStat.location = destination.jndiLocation;
                    }
                });

                mdb.ejbLocal.subscribe(interfaze => {
                    if (interfaze) {
                        mdbStat.interface = interfaze.qualifiedName;
                    } else {
                        mdb.ejbRemote.subscribe(interfaze => {
                            if (interfaze) {
                                mdbStat.interface = interfaze.qualifiedName;
                            }
                        });
                    }
                });

                mdb.ejbDeploymentDescriptor.subscribe(deploymentDescriptor => {
                    if (deploymentDescriptor) {
                        mdbStat.sourceVertexId = deploymentDescriptor.vertexId;
                    }
                });
            }
            result.push(mdbStat);
        });
        return result;
    }

}

export class StatsItem {
    key: string;
    quantity: number = 0;
    label: string;
}

export interface EJBStatDTO {
    name: String,
    class: String,
    location: String,
    sourceVertexId: number,
    interface: String;
}
