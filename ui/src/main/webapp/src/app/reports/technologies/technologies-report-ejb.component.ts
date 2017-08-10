import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router} from '@angular/router';

import {EJBStatDTO, TechReportService} from "./tech-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {Observable} from "rxjs/Observable";

@Component({
    selector: 'wu-technologies-report-ejb',
    templateUrl: 'technologies-report-ejb.component.html',
    styleUrls: ['./technologies-report-ejb.component.scss']
})
export class TechnologiesEJBReportComponent implements OnInit {

    private execID: number;
    private reportId: Observable<string>;

    public ejbMessageDriven: EJBStatDTO[] = [];
    public filteredEjbMessageDriven : EJBStatDTO[] = [];
    public sortedEjbMessageDriven : EJBStatDTO[] = [];

    public ejbSessionStatelessBean: EJBStatDTO[] = [];
    public filteredEjbSessionStatelessBean: EJBStatDTO[] = [];
    public sortedEjbSessionStatelessBean: EJBStatDTO[] = [];

    public ejbSessionStatefulBean: EJBStatDTO[] = [];
    public filteredEjbSessionStatefulBean: EJBStatDTO[] = [];
    public sortedEjbSessionStatefulBean: EJBStatDTO[] = [];

    public ejbEntityBean: EJBStatDTO[] = [];
    public filteredEjbEntityBean: EJBStatDTO[] = [];
    public sortedEjbEntityBean: EJBStatDTO[] = [];

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

    filter(item:EJBStatDTO): boolean {
        return (
            item.name.search(new RegExp(this.searchText, 'i')) !== -1 ||
            item.class.search(new RegExp(this.searchText, 'i')) !== -1 ||
            item.location.search(new RegExp(this.searchText, 'i')) !== -1)
    }

}
