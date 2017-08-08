import {Component, OnInit} from "@angular/core";
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

@Component({
    selector: 'wu-technologies-report-ejb',
    templateUrl: 'technologies-report-ejb.component.html',
    styleUrls: ['./technologies-report-ejb.component.scss']
})
export class TechnologiesEJBReportComponent implements OnInit {

    private execID: number;
    private reportId: Observable<string>;

    private ejbMessageDriven: EjbMessageDrivenModel[] = [];
    private filteredEjbMessageDriven : EjbMessageDrivenModel[] = [];
    private sortedEjbMessageDriven : EjbMessageDrivenModel[] = [];

    private ejbSessionStatelessBean: EjbSessionBeanModel[] = [];
    private filteredEjbSessionStatelessBean: EjbSessionBeanModel[] = [];
    private sortedEjbSessionStatelessBean: EjbSessionBeanModel[] = [];

    private ejbSessionStatefulBean: EjbSessionBeanModel[] = [];
    private filteredEjbSessionStatefulBean: EjbSessionBeanModel[] = [];
    private sortedEjbSessionStatefulBean: EjbSessionBeanModel[] = [];

    private ejbEntityBean: EjbEntityBeanModel[] = [];
    private filteredEjbEntityBean: EjbEntityBeanModel[] = [];
    private sortedEjbEntityBean: EjbEntityBeanModel[] = [];

    public searchText: string;

    private fake: number = 0;

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
                this.ejbMessageDriven = value;
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
                this.ejbSessionStatelessBean = value;
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
                this.ejbSessionStatefulBean = value;
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
                this.ejbEntityBean = value;
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
                mdb.beanName.search(new RegExp(this.searchText, 'i')) !== -1)
            );
            this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean.filter(ejb => (
                ejb.beanName.search(new RegExp(this.searchText, 'i')) !== -1)
            );
            this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean.filter(ejb => (
                ejb.beanName.search(new RegExp(this.searchText, 'i')) !== -1)
            );
            this.filteredEjbEntityBean = this.ejbEntityBean.filter(ejb => (
                ejb.beanName.search(new RegExp(this.searchText, 'i')) !== -1)
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



    sortByQualifiedNameCallback = (item: EjbMessageDrivenModel) : string => {
/*        item.ejbClass.subscribe( clazz => {
            let qualifiedName = clazz.qualifiedName;
            console.log(qualifiedName);
            return qualifiedName;
        });*/
        return (this.fake++).toString();
    };
}
