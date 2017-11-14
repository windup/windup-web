import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {IgnoredFilesReportService} from "./ignoredFiles-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {FileModel} from "../../generated/tsModels/FileModel";
import {FilterApplication} from "../../generated/windup-services";
import {IgnoredFileModel} from "../../generated/tsModels/IgnoredFileModel";
import {BaseModel} from "../../services/graph/base.model";
import {FilterableReportComponent} from "../filterable-report.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {ApplicationArchiveModel} from "../../generated/tsModels/ApplicationArchiveModel";
import {ArchiveModel} from "../../generated/tsModels/ArchiveModel";

@Component({
    selector: 'wu-ignoredFiles-report',
    templateUrl: 'ignoredFiles-report.component.html',
    styleUrls: ['../../../../css/report-tables.scss'],
})
export class IgnoredFilesReportComponent extends FilterableReportComponent implements OnInit {

    private execID: number;
    private ignoredFiles: IgnoredFileModel[] = [];

    private searchText: string;

    private loading = {
        ignoredFiles: true
    };

    emptyFilterCallbacks = {
        ignoredFiles: (ignoredFile) => true,
    }

    filterCallbacks = Object.assign({}, this.emptyFilterCallbacks);


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        routeFlattener: RouteFlattenerService,
        private ignoredFilesService: IgnoredFilesReportService,
        private _notificationService: NotificationService,
    ) {
        super(router, activatedRoute, routeFlattener);
    }

    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.execID = this.execution.id;
            this.loadFilterFromRouteData(flatRouteData);

            this.fetchIgnoredFiles();
        }));
    }

    fetchIgnoredFiles(): void {
        this.ignoredFilesService.getIgnoredFilesInfo(this.execID, this.reportFilter).subscribe(
            ignoredFiles => {
                if (this.reportFilter && this.reportFilter.selectedApplications && this.reportFilter.selectedApplications.length > 0){
                    ignoredFiles = ignoredFiles.filter((file) => {
                        let app = this.getAppThisFileBelongsToRecursively(file);
                        if (null == app)
                            return false;
                        let belongsToApp = !!this.reportFilter.selectedApplications.find((appFilter: FilterApplication) => appFilter.inputPath === app.filePath);
                        return belongsToApp;
                    })
                }

                this.ignoredFiles = ignoredFiles;
                this.loading.ignoredFiles = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this.router.navigate(['']);
            }
        );
    }

    getAppThisFileBelongsToRecursively(file: FileModel): ArchiveModel {
        let curFile = file;

        while (curFile) {
            if (curFile instanceof ApplicationArchiveModel)
                return <ArchiveModel><any>curFile;
            if (!curFile.parentFile["get"])
                return <ArchiveModel><any>curFile;
            curFile = curFile.parentFile["get"];
        }
        return null;
    }

    appSortBy = (file) => { return this.getAppThisFileBelongsToRecursively(file).fileName; }


    hasTextFileExtension(file): boolean {
        if (!file || !file.fileName) {
            debugger;
            return false;
        }
        let name = file.fileName;
        let afterDot = name.substr(name.lastIndexOf('.') + 1);
        return ("java properties jsp jsf ftl xml css html sql mf txt c cpp".split(" ").includes(afterDot.toLowerCase()))
    }
}

class WuTableState<T extends BaseModel> {
    items: T[] = [];
    loading: boolean = true;
    filter: (item: T) => boolean = (item) => true;
}