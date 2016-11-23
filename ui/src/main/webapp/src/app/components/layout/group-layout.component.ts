import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApplicationGroup} from "windup-services";
import {RouteLinkProviderService} from "../../services/route-link-provider-service";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";
import {TechnologiesReportComponent} from "../reports/technologies/technologies-report.component";
import {WindupService} from "../../services/windup.service";
import {ReportMenuItem} from "../navigation/context-menu-item.class";
import {AnalysisContextFormComponent} from "../analysis-context-form.component";
import {NotificationService} from "../../services/notification.service";

@Component({
    templateUrl: './group-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`
    ]
})
export class GroupLayoutComponent implements OnInit {
    protected applicationGroup: ApplicationGroup;
    protected menuItems;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _routeLinkProviderService: RouteLinkProviderService,
        private _windupService: WindupService,
        private _notificationService: NotificationService
    ) {

    }

    ngOnInit(): void {
        this._activatedRoute.data.forEach((data: {applicationGroup: ApplicationGroup}) => {
            this.applicationGroup = data.applicationGroup;
            this.createContextMenuItems();
        });
    }

    protected createContextMenuItems() {
        this.menuItems = [
            {
                label: 'View Project',
                link: '/group-list',
                data: { projectID: this.applicationGroup.migrationProject.id },
                icon: 'fa-tachometer',
                isEnabled: true
            },
            {
                label: 'Applications',
                link: '/groups/' + this.applicationGroup.id,
                icon: 'fa-cubes',
                isEnabled: true
            },
            {
                label: 'Config',
                link: this._routeLinkProviderService.getRouteForComponent(AnalysisContextFormComponent, {
                    groupId: this.applicationGroup.id
                }),
                icon: 'fa-cogs',
                isEnabled: true,
            },
            {
                label: 'Run Windup',
                action: () => {
                    this._windupService.executeWindupGroup(this.applicationGroup.id).subscribe(
                        success => {
                            this._notificationService.info('Windup execution has started');
                        },
                        error => {
                            this._notificationService.error(error.error);
                        }
                    );
                },
                icon: 'fa-rocket',
                isEnabled: true
            },
            /*
            {
                label: 'Dashboard',
                link: '/groups/' + this.applicationGroup.id,
                icon: 'fa-tachometer',
                isEnabled: true
            },
            */
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
