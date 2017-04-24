import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

import {MigrationProject} from "windup-services";
import {RouteLinkProviderService} from "../core/routing/route-link-provider-service";
import {AnalysisContextFormComponent} from "../analysis-context/analysis-context-form.component";
import {EventBusService} from "../core/events/event-bus.service";
import {AbstractComponent} from "../shared/AbstractComponent";
import {ProjectExecutionsComponent} from "../executions/project-executions.component";
import {ApplicationListComponent} from "../registered-application/application-list.component";
import {MigrationProjectEvent, UpdateMigrationProjectEvent} from "../core/events/windup-event";
import {MigrationProjectService} from "./migration-project.service";
import {RoutedComponent} from "../shared/routed.component";
import {FlattenedRouteData, RouteFlattenerService} from "../core/routing/route-flattener.service";

@Component({
    templateUrl: './project-layout.component.html',
    styles: [
        `:host /deep/ .row-cards-pf:first-child { padding-top: initial; }`
    ]
})
export class ProjectLayoutComponent extends RoutedComponent implements OnInit, OnDestroy {
    protected allProjects: MigrationProject[];
    protected project: MigrationProject;
    protected menuItems;

    // TODO: Execution progress: Project Layout must be updated when execution state changes (is completed)

    constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        protected _routeLinkProviderService: RouteLinkProviderService,
        protected _migrationProjectService: MigrationProjectService,
        protected _eventBus: EventBusService,
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngOnInit(): void {
        this.addSubscription(this._eventBus.onEvent.filter(event => event.isTypeOf(UpdateMigrationProjectEvent))
            .subscribe((event: MigrationProjectEvent) => {
                this.project = event.migrationProject;
                this.createContextMenuItems();
        }));

        this.addSubscription(this.flatRouteLoaded.subscribe(flattenedRoute => this.loadDataFromRoute(flattenedRoute)));
        this.loadProjects();
    }

    protected loadDataFromRoute(flattenedRoute: FlattenedRouteData) {
        this.project = flattenedRoute.data.project;
        this._migrationProjectService.monitorProject(this.project);
        this.createContextMenuItems();
    }

    protected loadProjects() {
        this._migrationProjectService.getAll().subscribe((projects: MigrationProject[]) => {
            this.allProjects = projects;
        });
    }

    ngOnDestroy() {
        super.ngOnDestroy();
        this._migrationProjectService.stopMonitoringProject(this.project);
    }

    protected createContextMenuItems() {
        this.menuItems = [
            {
                label: 'View Project',
                link: this._routeLinkProviderService.getRouteForComponent(ProjectExecutionsComponent, { projectId: this.project.id }),
                icon: 'fa-tachometer',
                isEnabled: true
            },
            {
                label: 'Applications',
                link: this._routeLinkProviderService.getRouteForComponent(ApplicationListComponent, { projectId: this.project.id }),
                icon: 'fa-cubes',
                isEnabled: true
            },
            {
                label: 'Configuration', // MarcZ 2017-04
                link: this._routeLinkProviderService.getRouteForComponent(AnalysisContextFormComponent, { projectId: this.project.id }),
                icon: 'fa-cogs',
                isEnabled: true,
            },
        ];
    }

    public getProjectLabel = (project: MigrationProject): string => {
        return project ? project.title : '';
    };

    public getProjectRoute = (project: MigrationProject): any[] => {
        return project ? ['/projects', project.id, 'project-detail'] : null;
    };

    public navigateToProject = (project: MigrationProject) => {
        this._router.navigate(this.getProjectRoute(project));
    };
}
