import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {IgnoredFilesReportService} from "./ignoredFiles-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {FilterApplication, RegisteredApplication} from "../../generated/windup-services";
import {IgnoredFileModel} from "../../generated/tsModels/IgnoredFileModel";
import {WindupVertexFrame} from "../../generated/tsModels/WindupVertexFrame";
import {BaseModel} from "../../services/graph/base.model";

@Component({
    selector: 'wu-ignoredFiles-report',
    templateUrl: 'ignoredFiles-report.component.html',
    styleUrls: ['../../../../css/report-tables.scss'],
})
export class IgnoredFilesReportComponent implements OnInit {

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



    constructor(private route: ActivatedRoute,
                private ignoredFilesService: IgnoredFilesReportService,
                private _notificationService: NotificationService,
                private _router: Router) {
    }

    ngOnInit(): void {
        this.route.parent.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchIgnoredFiles();
        });
    }

    fetchIgnoredFiles(): void {
        this.ignoredFilesService.getIgnoredFilesInfo(this.execID).subscribe(
            ignoredFiles => {
                this.ignoredFiles = ignoredFiles; //.map(f => <IgnoredFileModel> f);
                this.loading.ignoredFiles = false;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

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