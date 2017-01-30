import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {ApplicationGroup} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {MigrationIssuesComponent} from "../components/reports/migration-issues/migration-issues.component";
import {TechnologiesReportComponent} from "../components/reports/technologies/technologies-report.component";
import {DependenciesReportComponent} from "../components/reports/dependencies/dependencies-report.component";
import {ReportMenuItem, ContextMenuItem} from "../shared/navigation/context-menu-item.class";
import {AnalysisContextFormComponent} from "../components/analysis-context-form.component";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from '../shared/utils';
import {GroupExecutionsComponent} from "../components/executions/group-executions.component";
import {ApplicationDetailsComponent} from "../components/reports/application-details/application-details.component";
import {ApplicationGroupService} from "../group/application-group.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {EventBusService} from "../core/events/event-bus.service";
import {
    ApplicationGroupEvent,
    UpdateApplicationGroupEvent
} from "../core/events/windup-event";
import {AbstractComponent} from "../shared/AbstractComponent";
import {ReportFilterComponent} from "../components/reports/filter/report-filter.component";
import {MigrationProject} from "windup-services";
import {ApplicationListComponent} from "../components/application-list.component";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {WINDUP_WEB} from "../app.module";
import {ApplicationIndexComponent} from "../components/reports/application-index/application-index.component";
import {ProjectExecutionsComponent} from "../components/executions/project-executions.component";


@Component({
    templateUrl: './project-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`
    ]
})
export class ProjectLayoutComponent extends AbstractComponent implements OnInit, OnDestroy {
    protected project: MigrationProject;

    /**
     * TODO: It is little bit unclear what is and what will be active group.
     * For now user won't see any direct UI to create a new group, so project will have only one group.
     * So active group will be Default Group which is automatically created with project.
     */
    protected activeGroup: ApplicationGroup;
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
                this.activeGroup = event.group;
                this.createContextMenuItems();
        }));

        this._activatedRoute.data.subscribe((data: {project: MigrationProject}) => {
            this.project = data.project;

            this._applicationGroupService.getByProjectID(this.project.id).subscribe(appGroups => {
                if (appGroups.length > 1) {
                    this.activeGroup = appGroups[appGroups.length - 1];
                } else if (appGroups.length === 1) {
                    this.activeGroup = appGroups[0];
                } else {
                    throw Error('No app group found');
                }

                this._applicationGroupService.monitorGroup(this.activeGroup);
                this.createContextMenuItems();
            });
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._applicationGroupService.stopMonitoringGroup(this.activeGroup);
    }

    protected createContextMenuItems() {
        this.menuItems = [
            {
                label: 'View Project',
                link: this._routeLinkProviderService.getRouteForComponent(ProjectExecutionsComponent, {
                    projectId: this.project.id
                }),
                icon: 'fa-tachometer',
                isEnabled: true
            },
            {
                label: 'Applications',
                link: this._routeLinkProviderService.getRouteForComponent(ApplicationListComponent, {
                    projectId: this.project.id
                }),
                icon: 'fa-cubes',
                isEnabled: true
            },
            {
                label: 'Executions',
                link: this._routeLinkProviderService.getRouteForComponent(ProjectExecutionsComponent, {
                    projectId: this.project.id
                }),
                icon: 'fa-flask',
                isEnabled: true
            },
            {
                label: 'Config',
                link: this._routeLinkProviderService.getRouteForComponent(AnalysisContextFormComponent, {
                    projectId: this.project.id,
                    groupId: this.activeGroup.id
                }),
                icon: 'fa-cogs',
                isEnabled: true,
            },
            new ContextMenuItem(
                'Run Windup',
                'fa-rocket',
                () => {
                    // TODO: Fix this after full recompilation
                    return (<any>this.project).applications.length > 0;
                },
                null,
                () => {
                    // TODO: 'windup-services' vs 'windup-services.ts' issues
                    this._executionService.execute(<any>this.activeGroup).subscribe(
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
                this.activeGroup,
                ApplicationDetailsComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Issues',
                'fa-exclamation-triangle',
                this.activeGroup,
                MigrationIssuesComponent,
                this._routeLinkProviderService,
            ),
            new ReportMenuItem(
                'Application Index',
                'fa-book',
                this.activeGroup,
                ApplicationIndexComponent,
                this._routeLinkProviderService,
            ),
        ];

        if (!WINDUP_WEB.config.hideUnfinishedFeatures) {
            let reportFilterMenu = new ReportMenuItem(
                'Report Filter',
                'fa-filter',
                this.activeGroup,
                ReportFilterComponent,
                this._routeLinkProviderService
            );

            this.menuItems.splice(4, 0, reportFilterMenu);

            this.menuItems = [ ...this.menuItems,
                new ReportMenuItem(
                    'Technologies',
                    'fa-cubes',
                    this.activeGroup,
                    TechnologiesReportComponent,
                    this._routeLinkProviderService,
                ),
                new ReportMenuItem(
                    'Dependencies',
                    'fa-code-fork',
                    this.activeGroup,
                    DependenciesReportComponent,
                    this._routeLinkProviderService
                )
            ];
        }
    }
}
