import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {MigrationProject} from "windup-services";
import {MigrationProjectService} from "./migration-project.service";
import {FormComponent} from "../shared/form.component";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";

@Component({
    templateUrl: './migration-project-form.component.html',
    styles: [`
        .project-edit .finish-buttons .btn { padding: 0 6em; margin-right: 2em; }
    `]
})
export class MigrationProjectFormComponent extends FormComponent implements OnInit, OnDestroy
{
    title: string = "Create Migration Project";

    model: MigrationProject = <MigrationProject>{};

    isInWizard: boolean = false;
    editMode: boolean = false;

    errorMessages: string[];
    private routerSubscription: Subscription;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationProjectService: MigrationProjectService,
        private _routeFlattener: RouteFlattenerService
    ) {
        super();
    }

    ngOnInit(): void {
        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            this.title = flatRouteData.data['displayName'];

            if (flatRouteData.data['project']) {
                this.editMode = true;
                this.model = flatRouteData.data['project'];
            }

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
        });
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    getDescriptionHeight() {
        return Math.min(4 + (this.model.description ? this.model.description.length : 0) / 80, 25)
    }

    save() {
        if (this.editMode) {
            console.log("Updating migration project: " + this.model.title);
            this._migrationProjectService.update(this.model).subscribe(
                migrationProject => this.navigateOnSuccess(migrationProject),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating migration project: " + this.model.title);
            this._migrationProjectService.create(this.model).subscribe(
                migrationProject => this.navigateOnSuccess(migrationProject),
                error => this.handleError(<any> error)
            );
        }
    }

    navigateOnSuccess(project: MigrationProject) {
        if (this.isInWizard) {
            // Come on, relative routes?!
            // this._router.navigate(['./add-applications']);
            this._router.navigate(['/wizard', 'project', project.id, 'add-applications']);
        } else {
            this.rerouteToProjectList();
        }
    }

    rerouteToProjectList() {
        this._router.navigate(['/project-list']);
    }

    cancel() {
        this.rerouteToProjectList();
    }
}
