import {Injectable, Type} from "@angular/core";
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
import {ReportFilter} from "../../generated/windup-services";
import {Constants} from "../../constants";
import {utils} from "../../shared/utils";
import {HibernateEntityModel} from "../../generated/tsModels/HibernateEntityModel";
import {HibernateMappingFileModel} from "../../generated/tsModels/HibernateMappingFileModel";
import {HibernateConfigurationFileModel} from "../../generated/tsModels/HibernateConfigurationFileModel";
import {HibernateSessionFactoryModel} from "../../generated/tsModels/HibernateSessionFactoryModel";
import Observables = utils.Observables;

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

    getEjbMessageDrivenModel(execID: number, filter?: ReportFilter): Observable<EJBInformationDTO[]> {
        return this.getEJBs<EjbMessageDrivenModel>(execID, 'mdb', EjbMessageDrivenModel, filter);
    }

    getEjbSessionBeanModel(execID: number, sessionType: string, filter?: ReportFilter): Observable<EJBInformationDTO[]> {
        return this.getEJBs<EjbSessionBeanModel>(execID, 'ejb', EjbSessionBeanModel, filter, sessionType);
    }

    getEjbEntityBeanModel(execID: number, filter?: ReportFilter): Observable<EJBInformationDTO[]> {
        return this.getEJBs<EjbEntityBeanModel>(execID, 'entity', EjbEntityBeanModel, filter);
    }

    private getEJBs<T extends EjbBeanBaseModel>(execID: number, ejbType: string, clazz?: typeof EjbBeanBaseModel,  filter?: ReportFilter, sessionType?: string): Observable<EJBInformationDTO[]> {
        let serializedFilter = this.serializeFilter(filter);
        let url =`${Constants.GRAPH_REST_BASE}/reports/${execID}/ejb/${ejbType}`;
        if (sessionType) {
            url += '?sessionType=' + sessionType;
        }
        return this._http.post(url, serializedFilter, this.JSON_OPTIONS)
            .map(res => res.json())
            .map(data => {
                if (!Array.isArray(data)) {
                    throw new Error("No items returned");
                }

                return <T[]>this._graphJsonToModelService.fromJSONarray(data, clazz);
            })
            .map(value => {
                    return this.loadEJBInformation(value);
                }
            );
    }

    private loadEJBInformation(values:EjbBeanBaseModel[]):EJBInformationDTO[] {
        let result = [];
        values.forEach( mdb => {
            let mdbStat: EJBInformationDTO = {
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

    getHibernateEntityModel(execID: number): Observable<HibernateEntityModel[]> {
        const entitiesObservable = this.getTypeAsArray<HibernateEntityModel>(HibernateEntityModel.discriminator, execID, {
            /*
             * TODO: THIS IS PROBLEM
             *
             * Endpoint expects to get label of edge, but frontend has it ONLY in @GraphAdjacency annotation
             *  which is not accessible.
             *
             *  It is not straightforward that 'PersistenceEntity-jpaEntityClass' will resolve to 'javaClass'
             */
            out: this.getProperiesString('PersistenceEntity-jpaEntityClass', 'decompiledSource')
        });

        return Observables.resolveValuesArray(entitiesObservable, ['javaClass']).flatMap(entitiesArray => {
            return Observable.forkJoin(entitiesArray.map(entity => Observables.resolveObjectProperties(entity.resolved.javaClass, ['decompiledSource'])))
                .map(resolvedJavaClasses => {
                    const updatedEntitiesArray = [ ... entitiesArray ];

                    return updatedEntitiesArray.map((entity, index)  => {
                        entity.resolved.javaClass = resolvedJavaClasses[index];

                        return entity;
                    })
                });
        });
    }

    getHibernateMappingFileModel(execID: number): Observable<HibernateMappingFileModel[]> {
        return this.getTypeAsArray<HibernateMappingFileModel>(HibernateMappingFileModel.discriminator, execID);
    }

    getHibernateConfigurationFileModel(execId: number): Observable<HibernateConfigurationFileModel[]> {
        return this.getTypeAsArray<HibernateConfigurationFileModel>(HibernateConfigurationFileModel.discriminator, execId);
    }

    getHibernateSessionFactoryModel(execID: number): Observable<HibernateSessionFactoryModel[]> {
        const entitiesObservable = this.getTypeAsArray<HibernateSessionFactoryModel>(HibernateSessionFactoryModel.discriminator, execID, {
            out: this.getProperiesString('hibernateSessionFactory')
        });

        return Observables.resolveValuesArray(entitiesObservable, ['hibernateConfigurationFileModel']);
    }
}

export class StatsItem {
    key: string;
    quantity: number = 0;
    label: string;
}

export interface EJBInformationDTO {
    name: String,
    class: String,
    location: String,
    sourceVertexId: number,
    interface: String;
}
