import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {DependenciesService} from "./dependencies.service";
import {utils} from '../../../utils';

import {ProjectDependencyModel} from "../../../generated/tsModels/ProjectDependencyModel";
import {ProjectModel} from "../../../generated/tsModels/ProjectModel";
import {ArchiveModel} from "../../../generated/tsModels/ArchiveModel";
import {DuplicateArchiveModel} from "../../../generated/tsModels/DuplicateArchiveModel";
import {WindupConfigurationModel} from "../../../generated/tsModels/WindupConfigurationModel";
import {FileModel} from "../../../generated/tsModels/FileModel";


@Component({
    selector: 'wu-dependencies-report',
    templateUrl: 'dependencies-report.component.html'
})
export class DependenciesReportComponent implements OnInit
{
    private execID: number;
    protected rootProjects: ProjectModel[];
    protected dependencies: ProjectDependencyModel[];

    public constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private _depsService: DependenciesService,
    ) {
    }

    ngOnInit(): void {
        this._activatedRoute.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchRootProjects();
        });
    }

    fetchRootProjects(): void{
        this._depsService.getRootProjects(this.execID).subscribe(
            (rootProjects:ProjectModel[]) => {
                console.log("rootProjects: ", rootProjects);
                this.rootProjects = rootProjects;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            });
    }
}

