import {Component, OnChanges, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {TechReportService, StatsItem} from "./tech-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {ProjectTechnologiesStatsModel} from "../../generated/tsModels/ProjectTechnologiesStatsModel";
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {TechnologyKeyValuePairModel} from "../../generated/tsModels/TechnologyKeyValuePairModel";
import {FilterApplication, RegisteredApplication} from "../../generated/windup-services";
import {EjbMessageDrivenModel} from "../../generated/tsModels/EjbMessageDrivenModel";
import {Observable} from "rxjs/Observable";
import {JavaClassFileModel} from "../../generated/tsModels/JavaClassFileModel";
import {JavaClassModel} from "../../generated/tsModels/JavaClassModel";
import {EjbSessionBeanModel} from "../../generated/tsModels/EjbSessionBeanModel";
import {EjbEntityBeanModel} from "../../generated/tsModels/EjbEntityBeanModel";
import {EjbBeanBaseModel} from "../../generated/tsModels/EjbBeanBaseModel";

@Component({
    selector: 'wu-technologies-report-ejb',
    templateUrl: 'technologies-report-ejb.component.html',
    styleUrls: ['./technologies-report-ejb.component.scss']
})
export class TechnologiesEJBReportComponent implements OnInit {

    private execID: number;
    private reportId: Observable<string>;

    public ejbMessageDriven: EJBStat[] = [];
    public filteredEjbMessageDriven : EJBStat[] = [];
    public sortedEjbMessageDriven : EJBStat[] = [];

    public ejbSessionStatelessBean: EJBStat[] = [];
    public filteredEjbSessionStatelessBean: EJBStat[] = [];
    public sortedEjbSessionStatelessBean: EJBStat[] = [];

    public ejbSessionStatefulBean: EJBStat[] = [];
    public filteredEjbSessionStatefulBean: EJBStat[] = [];
    public sortedEjbSessionStatefulBean: EJBStat[] = [];

    public ejbEntityBean: EJBStat[] = [];
    public filteredEjbEntityBean: EJBStat[] = [];
    public sortedEjbEntityBean: EJBStat[] = [];

    public searchText: string;

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private _notificationService: NotificationService,
        private _router: Router
    ){}

    ngOnInit(): void {
        this.route.parent.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchEJBData();
        });
        this.route.params.forEach((params: Params) => {
            this.reportId = params['report_id'];
        });
    }

    fetchEJBData(): void {
        this.techReportService.getEjbMessageDrivenModel(this.execID).subscribe(
            value => {
                this.ejbMessageDriven = this.loadStats(value);
                this.filteredEjbMessageDriven = this.ejbMessageDriven;
                this.sortedEjbMessageDriven = this.ejbMessageDriven;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

        this.techReportService.getEjbSessionBeanModel(this.execID, 'Stateless').subscribe(
            value => {
                this.ejbSessionStatelessBean = this.loadStats(value);
                this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean;
                this.sortedEjbSessionStatelessBean = this.ejbSessionStatelessBean;

            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

        this.techReportService.getEjbSessionBeanModel(this.execID, 'Stateful').subscribe(
            value => {
                this.ejbSessionStatefulBean = this.loadStats(value);
                this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean;
                this.sortedEjbSessionStatefulBean = this.ejbSessionStatefulBean;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

        this.techReportService.getEjbEntityBeanModel(this.execID).subscribe(
            value => {
                // this.ejbEntityBean = value;
                this.ejbEntityBean = this.loadStats(value);
                this.filteredEjbEntityBean = this.ejbEntityBean;
                this.sortedEjbEntityBean = this.ejbEntityBean;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );

    }

    updateSearch() {
        if (this.searchText && this.searchText.length > 0) {
            this.filteredEjbMessageDriven = this.ejbMessageDriven.filter(mdb => (
                this.filter(mdb))
            );
            this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean.filter(ejb => (
                this.filter(ejb))
            );
            this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean.filter(ejb => (
                this.filter(ejb))
            );
            this.filteredEjbEntityBean = this.ejbEntityBean.filter(ejb => (
                this.filter(ejb))
            );
        } else {
            this.filteredEjbMessageDriven = this.ejbMessageDriven;
            this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean;
            this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean;
            this.filteredEjbEntityBean = this.ejbEntityBean;
        }
    }

    clearSearch() {
        this.searchText = '';
        this.updateSearch();
    }

    filter(item:EJBStat): boolean {
        return (
            item.name.search(new RegExp(this.searchText, 'i')) !== -1 ||
            item.class.search(new RegExp(this.searchText, 'i')) !== -1 ||
            item.location.search(new RegExp(this.searchText, 'i')) !== -1)
    }

    loadStats(values:EjbBeanBaseModel[]):EJBStat[] {
        let result = [];
        values.forEach( mdb => {
            let mdbStat: EJBStat = {
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

interface EJBStat {
    name: String,
    class: String,
    location: String,
    sourceVertexId: number,
    interface: String;
}
