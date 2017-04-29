import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {FilterApplication, ProjectTraversalReducedDTO, WindupExecution} from "windup-services";
import {NotificationService} from "../../core/notification/notification.service";
import {RoutedComponent} from "../../shared/routed.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {WindupService} from "../../services/windup.service";
import {OrderDirection} from "../../shared/sort/sorting.service";
import {
    ApplicationDetailsFullDTO, ApplicationDetailsService,
    ProjectTraversalFullDTO, TagFullDTO
} from "../application-details/application-details.service";
import {utils} from "../../shared/utils";

@Component({
    templateUrl: './execution-application-list.component.html',
    styleUrls: [
        '../../../../css/tables.scss'
    ]
})
export class ExecutionApplicationListComponent extends RoutedComponent implements OnInit, OnDestroy
{
    private projectID:number;
    private execID:number;

    initialSort = {property: 'fileName', direction: OrderDirection.ASC};
    execution:WindupExecution;
    filteredApplications: FilterApplication[] = [];
    sortedApplications: FilterApplication[] = [];
    searchText: string;

    applicationDetailsDTO:ApplicationDetailsFullDTO;
    pointsByApplication:Map<number, number> = new Map<number, number>();
    tagsByApplication:Map<number, {name: string, level: string}[]> = new Map<number, {name: string, level: string}[]>();

    constructor(
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        _router: Router,
        private _windupService: WindupService,
        private _notificationService: NotificationService,
        private _applicationDetailsService:ApplicationDetailsService,
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngOnInit(): any {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            let executionId = parseInt(flatRouteData.params['executionId']);
            this.execID = executionId;

            this._windupService.getExecution(executionId)
                .subscribe(execution => {
                    this.loadExecution(execution);
                });
        }));
    }

    loadExecution(execution: WindupExecution) {
        this.projectID = execution.projectId;
        this.execution = execution;
        this.filteredApplications = execution.filterApplications;
        this.sortedApplications = execution.filterApplications;
        this.updateSearch();

        this._applicationDetailsService.getApplicationDetailsData(this.execID).subscribe(
            applicationDetailsDto => {
                this.applicationDetailsDTO = applicationDetailsDto;
                this.flattenReportData();
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    ngOnDestroy() {
    }

    updateSearch() {
        if (this.searchText && this.searchText.length > 0) {
            this.filteredApplications = this.execution.filterApplications.filter(app => app.fileName.search(new RegExp(this.searchText, 'i')) !== -1);
        }
        else {
            this.filteredApplications = this.execution.filterApplications;
        }
    }

    private flattenReportData() {
        this.applicationDetailsDTO.traversals.forEach(traversal => {
            // 1. Get the Filter Application
            let filterApplication = this.getFilterApplication(traversal);

            if (!filterApplication)
                return;

            this.pointsByApplication.set(filterApplication.id, 0);
            this.tagsByApplication.set(filterApplication.id, []);
            // 2. Traverse and add up the points
            this.flattenReportDataForTraversal(filterApplication, traversal);
        });

        this.tagsByApplication.forEach((value, index, map) => {
            this.tagsByApplication.set(index, value.sort((a, b) => {
                if (a.level != b.level) {
                    if (a.level == "IMPORTANT")
                        return -1;
                    else if (b.level == "IMPORTANT")
                        return 1;

                    // These should be the only two cases, but if for some reason there is an unknown tag,
                    // just use name comparisong below.
                }

                return a.name.localeCompare(b.name);
            }));
        });
    }

    private flattenReportDataForTraversal(filterApplication:FilterApplication, traversal:ProjectTraversalFullDTO) {
        let addPointsToMap = (points:number) => {
            let existingPoints = this.pointsByApplication.get(filterApplication.id);
            if (!existingPoints)
                this.pointsByApplication.set(filterApplication.id, points);
            else
                this.pointsByApplication.set(filterApplication.id, existingPoints + points);
        };

        let addTag = (tag:TagFullDTO) => {
            // TODO/FIXME: This is a hack (same hack as in windup core - in application_list.ftl)
            if (tag.nameString == "Decompiled Java File")
                return;

            let existingTags = this.tagsByApplication.get(filterApplication.id);
            if (existingTags.find(existingTag => existingTag.name == tag.nameString))
                return;

            existingTags.push({name: tag.nameString, level: tag.levelString});
        };

        // Just make sure that we always at least zero it out.
        addPointsToMap(0);

        traversal.files.forEach(file => {
            file.tags.forEach(tag => addTag(tag));

            file.hints.forEach(hint => addPointsToMap(hint.effort));
            file.classifications.forEach(classification => addPointsToMap(classification.effort));
        });
        traversal.children.forEach(childTraversal => this.flattenReportDataForTraversal(filterApplication, childTraversal));
    }

    private getFilterApplication(traversal:ProjectTraversalFullDTO):FilterApplication {
        if (!this.filteredApplications)
            return null;

        return this.filteredApplications.find(app => app.fileName == traversal.canonicalFilename);
    }
}
