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
    static HIBERNATE_REPORT_BASE = Constants.GRAPH_REST_BASE + '/reports/{execID}/hibernate';
    static HIBERNATE_ENTITY_URL = TechReportService.HIBERNATE_REPORT_BASE + '/entity';
    static HIBERNATE_MAPPING_FILE = TechReportService.HIBERNATE_REPORT_BASE + '/mappingFile';
    static HIBERNATE_CONFIG_FILE = TechReportService.HIBERNATE_REPORT_BASE + '/configurationFile';
    static HIBERNATE_SESSION_FACTORY = TechReportService.HIBERNATE_REPORT_BASE + '/sessionFactory';

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
        let url =`${Constants.GRAPH_REST_BASE}/reports/${execID}/ejb/${ejbType}`; /* ` fix for google chrome debugger */
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

    protected getDataFromFilteredEndpoint<T>(url: string, filter: any): Observable<T[]> {
        const jsonFilter = this.serializeFilter(filter);

        return this._http.post(url, jsonFilter, this.JSON_OPTIONS)
            .map(response => {
                const json = response.json();
                const entities = this._graphJsonToModelService.fromJSONarray(json);
                return entities;
            });
    }

    getHibernateEntityModel(execID: number, filter?: ReportFilter): Observable<HibernateEntityModel[]> {
        const url = TechReportService.HIBERNATE_ENTITY_URL.replace('{execID}', execID.toString());

        const entitiesObservable = this.getDataFromFilteredEndpoint<HibernateEntityModel>(url, filter);

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

    getHibernateMappingFileModel(execID: number, filter?: ReportFilter): Observable<HibernateMappingFileModel[]> {
        const url = TechReportService.HIBERNATE_MAPPING_FILE.replace('{execID}', execID.toString());

        return this.getDataFromFilteredEndpoint(url, filter);
    }

    getHibernateConfigurationFileModel(execID: number, filter?: ReportFilter): Observable<HibernateConfigurationFileModel[]> {
        const url = TechReportService.HIBERNATE_CONFIG_FILE.replace('{execID}', execID.toString());

        return this.getDataFromFilteredEndpoint(url, filter);
    }

    getHibernateSessionFactoryModel(execID: number, filter?: ReportFilter): Observable<HibernateSessionFactoryModel[]> {
        const url = TechReportService.HIBERNATE_SESSION_FACTORY.replace('{execID}', execID.toString());
        const entitiesObservable = this.getDataFromFilteredEndpoint<HibernateSessionFactoryModel>(url, filter);

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
