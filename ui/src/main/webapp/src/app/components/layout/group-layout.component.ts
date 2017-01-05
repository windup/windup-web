import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ApplicationGroup} from "windup-services";
import {RouteLinkProviderService} from "../../services/route-link-provider-service";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";
import {TechnologiesReportComponent} from "../reports/technologies/technologies-report.component";
import {WindupService} from "../../services/windup.service";
import {ReportMenuItem, ContextMenuItem} from "../navigation/context-menu-item.class";
import {AnalysisContextFormComponent} from "../analysis-context-form.component";
import {NotificationService} from "../../services/notification.service";
import {GroupListComponent} from "../group-list.component";
import {utils} from '../../utils';
import {GroupPageComponent} from "../group.page.component";
import {GroupExecutionsComponent} from "../executions/group-executions.component";
import {ApplicationDetailsComponent} from "../reports/application-details/application-details.component";
import {ApplicationGroupService} from "../../services/application-group.service";

@Component({
    templateUrl: './group-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 139px; }`
    ]
})
export class GroupLayoutComponent implements OnInit {
    protected applicationGroup: ApplicationGroup;
    protected menuItems;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _applicationGroupService: ApplicationGroupService,
        private _router: Router,
        private _routeLinkProviderService: RouteLinkProviderService,
        private _windupService: WindupService,
        private _notificationService: NotificationService
    ) {

    }

    ngOnInit(): void {
        this._router.events.subscribe((newRoute) => {
            if (!this.applicationGroup)
                return;

            //console.log("Group layout reloading group: " + this.applicationGroup.id);
            this._applicationGroupService.get(this.applicationGroup.id).subscribe((group) => {
                this.applicationGroup = group;
                this.createContextMenuItems();
            });
        });

        this._applicationGroupService.applicationGroupLoaded.subscribe((group) => {
            this.applicationGroup = group;
            this.createContextMenuItems();
        });

        this._activatedRoute.data.forEach((data: {applicationGroup: ApplicationGroup}) => {
            this.applicationGroup = data.applicationGroup;
            this.createContextMenuItems();
        });
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
            new ContextMenuItem(
                'Report Filter',
                'fa-filter',
                () => { return this.applicationGroup.applications.length > 0; },
                `/projects/${this.applicationGroup.migrationProject.id}/groups/${this.applicationGroup.id}/reports/filter`,
                null
            ),
            new ContextMenuItem(
                'Run Windup',
                'fa-rocket',
                () => { return this.applicationGroup.applications.length > 0; },
                null,
                () => {
                    this._windupService.executeWindupGroup(this.applicationGroup.id).subscribe(
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
            /*
            {
                label: 'Dependencies',
                link: '',
                icon: 'fa-code-fork',
                isEnabled: true
            }
            */
        ];
    }
}
