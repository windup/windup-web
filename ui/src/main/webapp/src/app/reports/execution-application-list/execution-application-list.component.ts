import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {FilterApplication, WindupExecution} from "windup-services";
import {NotificationService} from "../../core/notification/notification.service";
import {RoutedComponent} from "../../shared/routed.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {WindupService} from "../../services/windup.service";
import {OrderDirection} from "../../shared/sort/sorting.service";

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

    constructor(
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        _router: Router,
        private _windupService: WindupService,
        private _notificationService: NotificationService,
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
    }

    ngOnDestroy() {
    }

    updateSearch() {
        if (this.searchText && this.searchText.length > 0) {
            this.filteredApplications = this.execution.filterApplications.filter(app => app.fileName.search(new RegExp(this.searchText, 'i')) !== -1);
        } else {
            this.filteredApplications = this.execution.filterApplications;
        }
    }
}
