import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationGroup} from "windup-services";
import {RouteLinkProviderService} from "../../services/route-link-provider-service";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";
import {TechnologiesReportComponent} from "../reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "../reports/dependencies/dependencies-report.component";
import {WindupService} from "../../services/windup.service";
import {ReportMenuItem, ContextMenuItem} from "../navigation/context-menu-item.class";
import {AnalysisContextFormComponent} from "../analysis-context/analysis-context-form.component";
import {NotificationService} from "../../services/notification.service";
import {GroupListComponent} from "../group-list.component";
import {utils} from '../../utils';
import {GroupPageComponent} from "../group.page.component";
import {GroupExecutionsComponent} from "../executions/group-executions.component";
import {ApplicationDetailsComponent} from "../reports/application-details/application-details.component";
import {ApplicationGroupService} from "../../services/application-group.service";
import {WindupExecutionService} from "../../services/windup-execution.service";
import {EventBusService} from "../../services/events/event-bus.service";
import {
    ExecutionEvent, ExecutionCompletedEvent, ApplicationGroupEvent,
    UpdateApplicationGroupEvent
} from "../../services/events/windup-event";
import {AbstractComponent} from "../AbstractComponent";
import {ReportFilterComponent} from "../reports/filter/report-filter.component";


@Component({
    templateUrl: './group-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`
    ]
})
export class GroupLayoutComponent extends AbstractComponent implements OnInit, OnDestroy {
    protected applicationGroup: ApplicationGroup;
    protected menuItems;

    // TODO: Execution progress: Group Layout must be updated when execution state changes (is completed)

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _applicationGroupService: ApplicationGroupService,
        private _router: Router,
        private _routeLinkProviderService: RouteLinkProviderService,
        private _executionService: WindupExecutionService,
        private _notificationService: NotificationService,
        private _eventBus: EventBusService
    ) {
        super();
    }

    ngOnInit(): void {
        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(UpdateApplicationGroupEvent))
            .subscribe((event: ApplicationGroupEvent) => {
                this.applicationGroup = event.group;
                this.createContextMenuItems();
        }));

        this._activatedRoute.data.forEach((data: {applicationGroup: ApplicationGroup}) => {
            this.applicationGroup = data.applicationGroup;
            this._applicationGroupService.monitorGroup(this.applicationGroup);
            this.createContextMenuItems();
        });
/*
        // It would be nice if it was possible to programatically rerun Resolve
        // I created issue for that: https://github.com/angular/angular/issues/13638
        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(ExecutionCompletedEvent.TYPE))
            .filter((event: ExecutionEvent) => event.group && event.group.id === this.applicationGroup.id)
            .subscribe((event: ExecutionEvent) => {
                this.createContextMenuItems();
            })
        );
*/
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._applicationGroupService.stopMonitoringGroup(this.applicationGroup);
    }

    protected createContextMenuItems() {
        this.menuItems = [
            {
                label: 'View Project',
                link: this._routeLinkProviderService.getRouteForComponent(GroupListComponent, {
                    projectId: this.applicationGroup.migrationProject.id
                }),
                icon: 'fa-tachometer',
                isEnabled: true
            },
            {
                label: 'Applications',
                link: this._routeLinkProviderService.getRouteForComponent(GroupPageComponent, {
                    projectId: this.applicationGroup.migrationProject.id,
                    groupId: this.applicationGroup.id
                }),
                icon: 'fa-cubes',
                isEnabled: true
            },
            {
                label: 'Executions',
                link: this._routeLinkProviderService.getRouteForComponent(GroupExecutionsComponent, {
                    projectId: this.applicationGroup.migrationProject.id,
                    groupId: this.applicationGroup.id
                }),
                icon: 'fa-flask',
                isEnabled: true
            },
            {
                label: 'Config',
                link: this._routeLinkProviderService.getRouteForComponent(AnalysisContextFormComponent, {
                    projectId: this.applicationGroup.migrationProject.id,
                    groupId: this.applicationGroup.id
                }),
                icon: 'fa-cogs',
                isEnabled: true,
            },
            new ReportMenuItem(
                'Report Filter',
                'fa-filter',
                this.applicationGroup,
                ReportFilterComponent,
                this._routeLinkProviderService
            ),
            new ContextMenuItem(
                'Run Windup',
                'fa-rocket',
                () => { return this.applicationGroup.applications.length > 0; },
                null,
                () => {
                    // TODO: 'windup-services' vs 'windup-services.ts' issues
                    this._executionService.execute(<any>this.applicationGroup).subscribe(
                        success => {
                            this._notificationService.info('Windup execution has started');
                        },
                        error => {
                            this._notificationService.error(utils.getErrorMessage(error));
                        }
                    );
                }
            ),
            /*
            {
                label: 'Dashboard',
                link: '/groups/' + this.applicationGroup.id,
                icon: 'fa-tachometer',
                isEnabled: true
            },
            */
            new ReportMenuItem(
                'Application Details',
                'fa-list',
                this.applicationGroup,
                ApplicationDetailsComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.applicationGroup,
                MigrationIssuesComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Technologies',
                'fa-cubes',
                this.applicationGroup,
                TechnologiesReportComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Dependencies',
                'fa-code-fork',
                this.applicationGroup,
                DependenciesReportComponent,
                this._routeLinkProviderService,
            ),
        ];
    }
}
