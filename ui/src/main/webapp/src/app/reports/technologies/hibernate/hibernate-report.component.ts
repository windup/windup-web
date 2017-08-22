import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router}   from '@angular/router';
import {NotificationService} from "../../../core/notification/notification.service";
import {TechReportService} from "../tech-report.service";
import {HibernateEntityModel} from "../../../generated/tsModels/HibernateEntityModel";
import {HibernateMappingFileModel} from "../../../generated/tsModels/HibernateMappingFileModel";
import {HibernateConfigurationFileModel} from "../../../generated/tsModels/HibernateConfigurationFileModel";
import {HibernateSessionFactoryModel} from "../../../generated/tsModels/HibernateSessionFactoryModel";
import {RouteFlattenerService} from "../../../core/routing/route-flattener.service";
import {FilterableReportComponent} from "../../filterable-report.component";
import {utils} from "../../../shared/utils";

@Component({
    templateUrl: './hibernate-report.component.html'
})
export class TechnologiesHibernateReportComponent extends FilterableReportComponent implements OnInit {
    entities: HibernateEntityModel[] = [];
    mappingFiles: HibernateMappingFileModel[] = [];
    configurationFiles: HibernateConfigurationFileModel[] = [];
    sessionFactories: HibernateSessionFactoryModel[] = [];

    loading = {
        entities: true,
        mappingFiles: true,
        configurationFiles: true,
        sessionFactories: true
    };

    title: string;

    constructor(
        activatedRoute: ActivatedRoute,
        router: Router,
        routeFlattener: RouteFlattenerService,
        private techReportService: TechReportService,
        private _notificationService: NotificationService,

    ) {
        super(router, activatedRoute, routeFlattener);
    }

    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.title = flatRouteData.data.displayName;

            this.loadFilterFromRouteData(flatRouteData);

            const execId = this.execution.id;

            this.techReportService.getHibernateEntityModel(execId).subscribe(
                data => {
                    this.entities = data;
                    this.loading.entities = false;
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });

            this.techReportService.getHibernateConfigurationFileModel(execId).subscribe(configurations => {
                this.configurationFiles = configurations;
                this.loading.configurationFiles = false;
            }, error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

            this.techReportService.getHibernateMappingFileModel(execId).subscribe(mappings => {
                this.mappingFiles = mappings;
                this.loading.mappingFiles = false;
            }, error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

            this.techReportService.getHibernateSessionFactoryModel(execId).subscribe(sessionFactories => {
                this.sessionFactories = sessionFactories;
                this.loading.sessionFactories = false;
            }, error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });
        }));
    }
}
