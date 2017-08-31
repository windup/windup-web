import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Params, Router}   from '@angular/router';

import {IgnoredFilesReportService} from "./ignoredFiles-report.service";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from '../../shared/utils';
import {forkJoin} from "rxjs/observable/forkJoin";
import {ProjectModel} from "../../generated/tsModels/ProjectModel";
import {FileModel} from "../../generated/tsModels/FileModel";
import {TechnologyKeyValuePairModel} from "../../generated/tsModels/TechnologyKeyValuePairModel";
import {FilterApplication, RegisteredApplication} from "../../generated/windup-services";
import {IgnoredFileModel} from "../../generated/tsModels/IgnoredFileModel";

@Component({
    selector: 'wu-ignoredFiles-report',
    templateUrl: 'ignoredFiles-report.component.html'
})
export class IgnoredFilesReportComponent implements OnInit {

    private execID: number;
    private ignoredFilesInfo: IgnoredFileModel[] = [];

    constructor(private route: ActivatedRoute,
                private ignoredFilesService: IgnoredFilesReportService,
                private _notificationService: NotificationService,
                private _router: Router) {
    }

    ngOnInit(): void {
        this.route.parent.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchIgnoredFilesStats();
        });
    }

    fetchIgnoredFilesStats(): void {
        this.ignoredFilesService.getIgnoredFilesInfo(this.execID).subscribe(
            info => {
                this.ignoredFilesInfo = info;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    hasTextFileExtension(str): boolean {
        var afterDot = str.substr(str.lastIndexOf('.') + 1);
        return ("java properties jsp jsf ftl xml css html sql mf txt c cpp".includes(afterDot.toLowerCase()))
    }
}