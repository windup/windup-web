import {Component, OnInit, ViewEncapsulation} from "@angular/core";
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
import {OrderDirection} from "../../../shared/sort/sorting.service";

@Component({
    templateUrl: './hibernate-report.component.html',
    styleUrls: ['../../../../../css/report-tables.scss']
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

    sorting = {
        getJavaClassCallback: (entity) => entity.resolved.javaClass.qualifiedName
    };

    searchText: string;

    emptyFilterCallbacks = {
        entities: (entity) => true,
        mappingFiles: (file) => true,
        configurationFiles: (file) => true,
        sessionFactories: (factory) => true
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

    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.title = flatRouteData.data.displayName;

            this.loadFilterFromRouteData(flatRouteData);

            const execId = this.execution.id;

            this.techReportService.getHibernateEntityModel(execId, this.reportFilter).subscribe(
                data => {
                    this.entities = data;
                    this.loading.entities = false;
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });

            this.techReportService.getHibernateConfigurationFileModel(execId, this.reportFilter).subscribe(configurations => {
                this.configurationFiles = configurations;
                this.loading.configurationFiles = false;
            }, error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

            this.techReportService.getHibernateMappingFileModel(execId, this.reportFilter).subscribe(mappings => {
                this.mappingFiles = mappings;
                this.loading.mappingFiles = false;
            }, error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });

            this.techReportService.getHibernateSessionFactoryModel(execId, this.reportFilter).subscribe(sessionFactories => {
                this.sessionFactories = sessionFactories;
                this.loading.sessionFactories = false;
            }, error => {
                this._notificationService.error(utils.getErrorMessage(error));
            });
        }));
    }

    updateSearch() {
        const regex = new RegExp(this.searchText, 'i');

        this.filterCallbacks = Object.assign({}, {
            entities: this.filterEntities(regex),
            mappingFiles: this.filterMappingFiles(regex),
            configurationFiles: this.filterConfigurationFiles(regex),
            sessionFactories: this.filterSessionFactories(regex)
        });
    }

    clearSearch() {
        this.searchText = '';
        this.filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);
    }

    filterEntities(regex: string|RegExp) {
        return (entity) => {
            return entity.resolved.javaClass.qualifiedName.search(regex) !== -1
                || entity.tableName.search(regex) !== -1;
        }
    }

    filterMappingFiles(regex: string|RegExp) {
        return (file) => {
            return file.cachedPrettyPath.search(regex) !== -1;
        }
    }

    filterConfigurationFiles(regex: string|RegExp) {
        return this.filterMappingFiles(regex);
    }

    filterSessionFactories(regex: string|RegExp) {
        return (factory) => factory.resolved.hibernateConfigurationFileModel.cachedPrettyPath.search(regex) !== -1;
    }
}
