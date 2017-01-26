import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {MigrationProject} from "windup-services";
import {MigrationProjectService} from "../services/migration-project.service";
import {FormComponent} from "./form.component";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../services/route-flattener.service";

@Component({
    templateUrl: './migration-project-form.component.html'
})
export class MigrationProjectFormComponent extends FormComponent implements OnInit, OnDestroy
{
    title: string = 'Create Migration Project';

    model:MigrationProject = <MigrationProject>{};

    editMode:boolean = false;

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
        });
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    save() {
        if (this.editMode) {
            console.log("Updating migration project: " + this.model.title);
            this._migrationProjectService.update(this.model).subscribe(
                migrationProject => this.rerouteToProjectList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating migration project: " + this.model.title);
            this._migrationProjectService.create(this.model).subscribe(
                migrationProject => this.rerouteToProjectList(),
                error => this.handleError(<any> error)
            );
        }
    }

    rerouteToProjectList() {
        this._router.navigate(['/project-list']);
    }

    cancel() {
        this.rerouteToProjectList();
    }
}
