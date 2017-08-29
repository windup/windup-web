import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from '@angular/router';

import {EJBInformationDTO, TechReportService} from "./tech-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {Observable} from "rxjs/Observable";
import {FilterableReportComponent} from "../filterable-report.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {ReportFilter} from "../../generated/windup-services";

@Component({
    selector: 'wu-technologies-report-ejb',
    templateUrl: 'technologies-report-ejb.component.html',
    styleUrls: ['../../../../css/report-tables.scss']
})
export class TechnologiesEJBReportComponent extends FilterableReportComponent implements OnInit {

    private execID: number;
    private reportId: Observable<string>;

    public ejbMessageDriven: EJBInformationDTO[] = [];
    public filteredEjbMessageDriven : EJBInformationDTO[] = [];
    public sortedEjbMessageDriven : EJBInformationDTO[] = [];

    public ejbSessionStatelessBean: EJBInformationDTO[] = [];
    public filteredEjbSessionStatelessBean: EJBInformationDTO[] = [];
    public sortedEjbSessionStatelessBean: EJBInformationDTO[] = [];

    public ejbSessionStatefulBean: EJBInformationDTO[] = [];
    public filteredEjbSessionStatefulBean: EJBInformationDTO[] = [];
    public sortedEjbSessionStatefulBean: EJBInformationDTO[] = [];

    public ejbEntityBean: EJBInformationDTO[] = [];
    public filteredEjbEntityBean: EJBInformationDTO[] = [];
    public sortedEjbEntityBean: EJBInformationDTO[] = [];

    public searchText: string;

    public title: string;

    public loadingMDB: boolean = true;
    public loadingEJBStateless: boolean = true;
    public loadingEJBStateful: boolean = true;
    public loadingEntity: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private _notificationService: NotificationService,
        _router: Router,
        _routeFlattener: RouteFlattenerService
    ){
        super(_router, route, _routeFlattener);
    }

    ngOnInit(): void {
        this.route.parent.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchEJBData();
        });
        this.route.params.forEach((params: Params) => {
            this.reportId = params['report_id'];
        });

        let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
        if (flatRouteData.data['displayName'])
            this.title = flatRouteData.data['displayName'];
    }

    fetchEJBData(): void {

        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.loadFilterFromRouteData(flatRouteData);
            this.techReportService.getEjbMessageDrivenModel(this.execID, this.reportFilter).subscribe(
                value => {
                    this.ejbMessageDriven = value;
                    this.filteredEjbMessageDriven = this.ejbMessageDriven;
                    this.sortedEjbMessageDriven = this.ejbMessageDriven;
                    this.updateSearch();
                    this.loadingMDB  = false;
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );

            this.techReportService.getEjbSessionBeanModel(this.execID, 'Stateless', this.reportFilter).subscribe(
                value => {
                    this.ejbSessionStatelessBean = value;
                    this.filteredEjbSessionStatelessBean = this.ejbSessionStatelessBean;
                    this.sortedEjbSessionStatelessBean = this.ejbSessionStatelessBean;
                    this.updateSearch();
                    this.loadingEJBStateless = false;

                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );

            this.techReportService.getEjbSessionBeanModel(this.execID, 'Stateful', this.reportFilter).subscribe(
                value => {
                    this.ejbSessionStatefulBean = value;
                    this.filteredEjbSessionStatefulBean = this.ejbSessionStatefulBean;
                    this.sortedEjbSessionStatefulBean = this.ejbSessionStatefulBean;
                    this.updateSearch();
                    this.loadingEJBStateful = false;
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );

            this.techReportService.getEjbEntityBeanModel(this.execID, this.reportFilter).subscribe(
                value => {
                    this.ejbEntityBean = value;
                    this.filteredEjbEntityBean = this.ejbEntityBean;
                    this.sortedEjbEntityBean = this.ejbEntityBean;
                    this.updateSearch();
                    this.loadingEntity = false;
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                    this._router.navigate(['']);
                }
            );
        }));
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

    filter(item:EJBInformationDTO): boolean {
        return (
            item.name.search(new RegExp(this.searchText, 'i')) !== -1 ||
            item.class.search(new RegExp(this.searchText, 'i')) !== -1 ||
            item.location.search(new RegExp(this.searchText, 'i')) !== -1)
    }

}
