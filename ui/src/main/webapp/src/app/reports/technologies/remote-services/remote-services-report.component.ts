import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router}   from '@angular/router';
import {NotificationService} from "../../../core/notification/notification.service";
import {TechReportService} from "../tech-report.service";
import {RouteFlattenerService} from "../../../core/routing/route-flattener.service";
import {FilterableReportComponent} from "../../filterable-report.component";
import {utils} from "../../../shared/utils";
import {EjbRemoteServiceModel} from "../../../generated/tsModels/EjbRemoteServiceModel";
import {JaxRPCWebServiceModel} from "../../../generated/tsModels/JaxRPCWebServiceModel";
import {JaxRSWebServiceModel} from "../../../generated/tsModels/JaxRSWebServiceModel";
import {JaxWSWebServiceModel} from "../../../generated/tsModels/JaxWSWebServiceModel";
import {RMIServiceModel} from "../../../generated/tsModels/RMIServiceModel";
import nullCoalesce = utils.nullCoalesce;

@Component({
    templateUrl: './remote-services-report.component.html',
    styleUrls: ['../../../../../css/report-tables.scss']
})
export class TechnologiesRemoteServicesReportComponent extends FilterableReportComponent implements OnInit {
    ejbRemoteServices: EjbRemoteServiceModel[] = [];
    jaxRpcWebServices: JaxRPCWebServiceModel[] = [];
    jaxRsWebServices: JaxRSWebServiceModel[] = [];
    jaxWsWebServices: JaxWSWebServiceModel[] = [];
    rmiServices: RMIServiceModel[] = [];

    loading = {
        ejbRemoteServices: true,
        jaxRpcWebServices: true,
        jaxRsWebServices: true,
        jaxWsWebServices: true,
        rmiServices: true
    };

    title: string;

    sorting = {
        getJavaClassCallback: (entity) => nullCoalesce(entity, 0, 'resolved', 'implementationClass', 'qualifiedName'),
        getInterfaceCallback: (entity) => nullCoalesce(entity, 0,'resolved', 'interface', 'qualifiedName')
    };

    searchText: string;

    emptyFilterCallbacks = {
        remoteServices: (entity) => true,
        remoteServicesWithPath: (entity) => true
    };

    filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);

    constructor(
        activatedRoute: ActivatedRoute,
        router: Router,
        routeFlattener: RouteFlattenerService,
        private techReportService: TechReportService,
        private _notificationService: NotificationService,

    ) {
        super(router, activatedRoute, routeFlattener);
    }

    initialize(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => this.loadData(flatRouteData)));
    }

    protected loadData(flatRouteData) {
        this.title = flatRouteData.data.displayName;

        this.loadFilterFromRouteData(flatRouteData);

        const execId = this.execution.id;

        this.techReportService.getEjbRemoteServiceModel(execId, this.reportFilter).subscribe(
            data => {
                this.ejbRemoteServices = data;
                this.loading.ejbRemoteServices = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

        this.techReportService.getJaxRpcWebServices(execId, this.reportFilter).subscribe(
            data => {
                this.jaxRpcWebServices = data;
                this.loading.jaxRpcWebServices = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

        this.techReportService.getJaxRsWebServices(execId, this.reportFilter).subscribe(
            data => {
                this.jaxRsWebServices = data;
                this.loading.jaxRsWebServices = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

        this.techReportService.getJaxWsWebServices(execId, this.reportFilter).subscribe(
            data => {
                this.jaxWsWebServices = data;
                this.loading.jaxWsWebServices = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

        this.techReportService.getRmiServices(execId, this.reportFilter).subscribe(
            data => {
                this.rmiServices = data;
                this.loading.rmiServices = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });
    }

    ngOnInit(): void {

    }

    updateSearch() {
        const regex = new RegExp(this.searchText, 'i');

        this.filterCallbacks = Object.assign({}, {
            remoteServices: this.filterRemoteServices(regex),
            remoteServicesWithPath: this.filterRemoteServicesWithPath(regex)
        });
    }

    clearSearch() {
        this.searchText = '';
        this.filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);
    }

    filterRemoteServices(regex: string|RegExp) {
        return (entity) => {
            return nullCoalesce(entity, '', 'resolved', 'implementationClass', 'qualifiedName').search(regex) !== -1
                || nullCoalesce(entity, '', 'resolved', 'interface', 'qualifiedName').search(regex) !== -1;
        }
    }

    filterRemoteServicesWithPath(regex: string|RegExp) {
        return (entity) => {
            const filterRemoteServices = this.filterRemoteServices(regex);
            return filterRemoteServices(entity) || entity.path.search(regex) !== -1;
        }
    }
}
