import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from '@angular/router';

import {EJBInformationDTO, TechReportService} from "./tech-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {Observable} from "rxjs/Observable";
import {FilterableReportComponent} from "../filterable-report.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {ReportFilter} from "../../generated/windup-services";
import {FilterCallback} from "../../shared/filter/filter.pipe";

@Component({
    selector: 'wu-technologies-report-ejb',
    templateUrl: 'technologies-report-ejb.component.html',
    styleUrls: ['../../../../css/report-tables.scss']
})
export class TechnologiesEJBReportComponent extends FilterableReportComponent implements OnInit {

    private execID: number;
    private reportId: Observable<string>;

    public ejbMessageDriven: EJBInformationDTO[] = [];
    public ejbSessionStatelessBean: EJBInformationDTO[] = [];
    public ejbSessionStatefulBean: EJBInformationDTO[] = [];
    public ejbEntityBean: EJBInformationDTO[] = [];

    public searchText: string;

    public title: string;

    public loadingMDB: boolean = true;
    public loadingEJBStateless: boolean = true;
    public loadingEJBStateful: boolean = true;
    public loadingEntity: boolean = true;

    public filterCallback: FilterCallback = () => true;

    constructor(
        private route: ActivatedRoute,
        private techReportService: TechReportService,
        private _notificationService: NotificationService,
        _router: Router,
        _routeFlattener: RouteFlattenerService
    ){
        super(_router, route, _routeFlattener);
    }

    initialize(): void {
        /**
         * This one doesn't use routeFlattener.OnFlatRouteLoaded event
         * so init code can stay in ngOnInit()
         */
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
            const regex = new RegExp(this.searchText, 'i');
            this.filterCallback = this.filterEntities(regex);
        } else {
            this.filterCallback = () => true;
        }
    }

    clearSearch() {
        this.searchText = '';
        this.updateSearch();
    }

    filterEntities(regex: string|RegExp): (item: any) => boolean {
        return (item) => item.name.search(regex) !== -1 ||
            item.class.search(regex) !== -1 ||
            item.location.search(regex) !== -1;
    }

}
