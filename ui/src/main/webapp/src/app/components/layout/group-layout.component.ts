import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApplicationGroup} from "windup-services";
import {RouteLinkProviderService} from "../../services/route-link-provider-service";
import {MigrationIssuesComponent} from "../reports/migration-issues/migration-issues.component";
import {TechnologiesReport} from "../reports/technologies/technologies.report";
import {WindupService} from "../../services/windup.service";
import {ReportMenuItem} from "../navigation/context-menu-item.class";
import {AnalysisContextFormComponent} from "../analysis-context-form.component";

@Component({
    templateUrl: './group-layout.component.html',
    styles: [
        `:host /deep/ .nav-pf-vertical { top: 82px; }`,
//        `:host /deep/ .container-pf-nav-pf-vertical { margin-left: 200px; }`,
    ]
})
export class GroupLayoutComponent implements OnInit {
    protected applicationGroup: ApplicationGroup;
    protected menuItems;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _routeLinkProviderService: RouteLinkProviderService,
        private _windupService: WindupService
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
                    this._windupService.executeWindupGroup(this.applicationGroup.id);
                },
                icon: 'fa-rocket',
                isEnabled: true
            },
            {
                label: 'Dashboard',
                link: '',
                icon: 'fa-tachometer',
                isEnabled: true
            },
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
                TechnologiesReport,
                this._routeLinkProviderService,
            ),
            {
                label: 'Dependencies',
                link: '',
                icon: 'fa-code-fork',
                isEnabled: true
            }
        ];
    }
}
