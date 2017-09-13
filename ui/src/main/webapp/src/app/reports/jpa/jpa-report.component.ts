import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {JpaReportInfo, JpaReportService} from "./jpa-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {FileModel} from "../../generated/tsModels/FileModel";
import {FilterApplication, RegisteredApplication, ReportFilter} from "../../generated/windup-services";
import {JavaClassModel} from "../../generated/tsModels/JavaClassModel";
import {FilterableReportComponent} from "../filterable-report.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {JavaSourceFileModel} from "../../generated/tsModels/JavaSourceFileModel";
import {ApplicationArchiveModel} from "../../generated/tsModels/ApplicationArchiveModel";
import {ArchiveModel} from "../../generated/tsModels/ArchiveModel";

@Component({
    templateUrl: 'jpa-report.component.html',
    styleUrls: ['../../../../css/report-tables.scss'],
})
export class JpaReportComponent extends FilterableReportComponent implements OnInit {

    private jpaInfo: JpaReportInfo = new JpaReportInfo();

    private execID: number;

    private searchText: string;

    private loading = true;

    private emptyFilterCallbacks = {
        entities: (entity) => true,
        namedQueries: (file) => true,
        configurationFiles: (file) => true,
        persistenceUnits: (factory) => true
    };

    private filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);

    constructor(
        private jpaReportService: JpaReportService,
        private _notificationService: NotificationService,
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }


    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            //this.title = flatRouteData.data.displayName;

            this.loadFilterFromRouteData(flatRouteData);

            this.execID = this.execution.id;

            this.fetchJpaInfo();
        }));
    }


    fetchJpaInfo(): void {
        let onError = (error) => {
            this._notificationService.error(utils.getErrorMessage(error));
            this._router.navigate(['']);
        };
        this.jpaReportService.getJpaInfo(this.execID).subscribe(jpaInfo => {
            jpaInfo.entities = jpaInfo.entities.filter(entity => {
                let javaClass: JavaClassModel = entity.javaClass["get"];
                let sourceFile: JavaSourceFileModel = javaClass.decompiledSource["get"];
                return this.isAppInFilter(this.reportFilter, this.getAppThisFileBelongsToRecursively(sourceFile));
            });
            /**/
            this.jpaInfo = jpaInfo;
        }, onError);
        this.loading = false;
    }

    // Filtering
    getAppThisFileBelongsToRecursively(file: FileModel): ArchiveModel {
        while (file) {
            if (file instanceof ApplicationArchiveModel)
                    return <ArchiveModel><any>file;
            if (!file.parentFile || !file.parentFile["get"])
                    return <ArchiveModel><any>file;
            file = file.parentFile["get"];
        }
        return null;
    }

    isAppInFilter(filter: ReportFilter, app: ArchiveModel) {
        if (null == app)
            return false;
        if (!filter || !filter.selectedApplications || !filter.selectedApplications.length)
            return true;
        // TODO: Why ReportFilter has selectedApplications: FilterApplication[]; but in reality there is a string[]?
        let belongsToApp = !!this.reportFilter.selectedApplications.find((appPath) => (<string><any>appPath) === app.filePath);
        return belongsToApp;
    }


    private updateSearch() {
        const regex = new RegExp(this.searchText, 'i');

        this.filterCallbacks = Object.assign({}, {
            entities: this.filterEntities(regex),
            namedQueries: this.filterNamedQueries(regex),
            configurationFiles: this.filterConfigurationFiles(regex),
            persistenceUnits: this.filterPersistenceUnits(regex)
        });
    }

    private clearSearch() {
        this.searchText = '';
        this.filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);
    }

    private filterEntities(regex: RegExp) {
        let re: RegExp = typeof regex === "string" ? new RegExp(regex) : regex;

        return (entity) => re.test(entity.name) || re.test(entity.tableName);
    }

    private filterNamedQueries(regex: RegExp) {
        return (namedQuery) => regex.test(namedQuery.name);
    }

    private filterConfigurationFiles(regex: RegExp) {
        return (file) => regex.test(file.cachedPrettyPath);
    }

    private filterPersistenceUnits(regex: RegExp) {
        return (pu) => regex.test(pu.name);
    }
}

