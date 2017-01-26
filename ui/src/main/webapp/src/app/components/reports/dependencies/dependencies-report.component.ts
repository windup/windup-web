import {Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {Router, ActivatedRoute, Params} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {DependenciesService} from "./dependencies.service";
import {utils} from '../../../utils';

import {DependenciesReportModel} from "../../../generated/tsModels/DependenciesReportModel";
import {GraphJSONToModelService} from "../../../services/graph/graph-json-to-model.service";
import {MavenProjectModel} from "../../../generated/tsModels/MavenProjectModel";

@Component({
    selector: 'wu-dependencies-report',
    templateUrl: './dependencies-report.component.html'
})
export class DependenciesReportComponent implements OnInit
{
    private execID: number;
    reportModel: DependenciesReportModel;
    dependencies: DependencyEntry[] = [];

    public constructor(
        private _router: Router,
        private _http: Http,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private _depsService: DependenciesService,
    ) {
    }

    ngOnInit(): void {
        this._activatedRoute.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fetchDepsReportModel();
        });
    }

    private fetchDepsReportModel(): void {
        this._depsService.getDepsReportModel(this.execID).subscribe(
            depReports => {
                depReports.forEach(depReport => {
                    this.loadDepReportData(depReport);
                });
            },
            error => {
                this._notificationService.error(utils.getErrorMessage(error));
                this._router.navigate(['']);
            }
        );
    }

    private loadDepReportData(depReport:DependenciesReportModel) {
        this.reportModel = depReport;

        // 1. Get the archives
        depReport.archiveGroups.subscribe(groups => {
            // 2. Cycle through each group
            groups.forEach(group => {
                let sha1 = group.sHA1;
                console.log("Group: " + sha1);

                // 3. Get the canonical project
                group.canonicalProject.subscribe(canonical => {
                    console.log("Canonical: " + canonical.name);

                    let mavenIdentifier = null;
                    let mavenProject = <MavenProjectModel>new GraphJSONToModelService().translateType(canonical, this._http, MavenProjectModel);
                    if (mavenProject.mavenIdentifier)
                        mavenIdentifier = mavenProject.mavenIdentifier;

                    // 4. Get the root file
                    canonical.rootFileModel.subscribe(rootFileModel => {
                        console.log("Root file: " + rootFileModel.fileName);

                        // 5. Get the archives
                        group.archives.subscribe(archives => {
                            console.log("Archives: " + archives);
                            let sha1Url = sha1 ?
                                'http://search.maven.org/#search|ga|1|1:"' + encodeURI(sha1) + '"'
                                : null;

                            let entry:DependencyEntry = {
                                paths: [],
                                gav: mavenIdentifier,
                                filename: rootFileModel.fileName,
                                sha1: sha1,
                                sha1Url: sha1Url,
                                name: canonical.name,
                                version: canonical.version,
                                organization: canonical.organization
                            };
                            this.dependencies.push(entry);

                            archives.forEach(archive => {
                                entry.paths.push(archive.fullPath);
                            });

                        });
                    });
                });
            });
        });
    }
}

interface DependencyEntry {
    paths:string[];
    gav:string;
    filename:string;
    sha1?:string;
    sha1Url?:string;
    name:string;
    version:string;
    organization:string;
}