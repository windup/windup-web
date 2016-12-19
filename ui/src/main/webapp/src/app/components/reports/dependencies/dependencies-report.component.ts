import {Observable} from "rxjs";
import {Component, OnInit, Pipe, PipeTransform} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {DependenciesService} from "./dependencies.service";
import {utils} from '../../../utils';

import {DependenciesReportModel} from "../../../generated/tsModels/DependenciesReportModel";
import {DependencyReportDependencyGroupModel} from "../../../generated/tsModels/DependencyReportDependencyGroupModel";
import {ProjectDependencyModel} from "../../../generated/tsModels/ProjectDependencyModel";
import {ProjectModel} from "../../../generated/tsModels/ProjectModel";
import {ArchiveModel} from "../../../generated/tsModels/ArchiveModel";
import {DuplicateArchiveModel} from "../../../generated/tsModels/DuplicateArchiveModel";
import {WindupConfigurationModel} from "../../../generated/tsModels/WindupConfigurationModel";
import {ApplicationArchiveModel} from "../../../generated/tsModels/ApplicationArchiveModel";
import {FileModel} from "../../../generated/tsModels/FileModel";


/**
 * Fetches the given Observable and stores it's result into it's .result property, then calls given continuation.
 */
export function fetch <T> (from: Observable<T>, then: (result: T, from: Observable<T> & {result: T}) => any) {
    if (!from)
        return console.warn("null passed as Observable."), void 0;
    from.subscribe(what => {
        (<any>from).result = what;
        then(what, <any>from);
    });
}


@Component({
    selector: 'wu-dependencies-report',
    templateUrl: 'dependencies-report.component.html'
})
export class DependenciesReportComponent implements OnInit
{
    private execID: number;
    protected reportModel: DependenciesReportModel;
    protected archiveGroups: DependencyReportDependencyGroupModel[];
    /// Not used?
    protected inputApps: ApplicationArchiveModel[];
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
            this.fetchDepsReportModel();
            this.fetchRootProjects();
            this.fetchInputApps();
        });
    }

    fetchDepsReportModel(): void {
        this._depsService.getDepsReportModel(this.execID).subscribe(
            (depReport: DependenciesReportModel) => {
                console.debug("windupConfig: ", depReport);
                this.reportModel = depReport;
                depReport.projectModel.subscribe(p => (<any>depReport.projectModel).result = p);
                ///fetch(depReport.projectModel);
                /// Report -*> ArchiveGroup -*> rootFileModel ~=> ArchiveModel { ~=> DuplicateArchiveModel? .canonicalArchive }
                // ArchiveModel --> .canonicalProject {
                //    .rootFileModel.fileName
                //    .mavenIdentifier
                //    .name .version ...
                // }

                // Setting these:
                // * dependency.canonicalProject.result
                // * dependency.archiveName
                depReport.archiveGroups.map(groups => {
                    this.archiveGroups = groups;
                    groups.map(dep => {
                        let dep_:any = dep; // Prevent TS complaints.
                        //dependency.canonicalProject.subscribe(p => (<any>dependency.canonicalProject).result = p);
                        fetch(dep.canonicalProject, (depProj) => {
                            dep_.sha1 = dep.sHA1;
                            dep_.project = depProj;
                            fetch(depProj.rootFileModel, (root) => {
                                dep_.archiveName = root.fileName;
                            });
                            dep_.gav = dep_.project.mavenIdentifier;
                            dep_.sha1url = 'http://search.maven.org/#search|ga|1|1:"' + encodeURL(dep.sHA1, 'ISO-8859-1') + '"';
                        });
                    });
                });
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    fetchInputApps(): void {
        this._depsService.getWindupConfiguration(this.execID).subscribe(
            (windupConfig: WindupConfigurationModel) => {
                console.debug("windupConfig: ", windupConfig);
                windupConfig.inputPaths.map(app => {
                });
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    fetchRootProjects(): void {
        this._depsService.getRootProjects(this.execID).subscribe(
            (rootProjects:ProjectModel[]) => {
                console.debug("rootProjects: ", rootProjects);
                this.rootProjects = rootProjects;
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }
}



// TODO
@Pipe({name: 'encodeURL', pure: false})
export class EncodeUrlPipe implements PipeTransform {
   transform(value: any, args: any[] = []) {
       return value;
   }
}

@Pipe({name: 'sortDependencyGroupArchivesByPath', pure: false})
export class SortDependencyGroupArchivesByPathPipe implements PipeTransform {
   transform(value: any, args: any[] = []) {
       return value;
   }
}

@Pipe({name: 'sortDependencyArchivesByPath', pure: false})
export class sortDependencyArchivesByPathAscendingPipe implements PipeTransform {
   transform(value: any, args: any[] = []) {
       return value;
   }
}
