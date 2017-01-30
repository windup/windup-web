import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {ApplicationGroup, MigrationProject} from "windup-services";
import {ApplicationGroupService} from "../services/application-group.service";
import {FormComponent} from "../shared/form.component";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";

@Component({
    selector: 'wu-create-group-form',
    templateUrl: './application-group-form.component.html',
})
export class ApplicationGroupForm extends FormComponent implements OnInit, OnDestroy
{
    project:MigrationProject;
    model:ApplicationGroup = <ApplicationGroup>{};

    editMode:boolean = false;

    loadingProject:boolean = false;
    loadingGroup:boolean = false;
    title: string = 'Create Application Group';

    private routerSubscription;

    get loading():boolean {
        return this.loadingProject || this.loadingGroup;
    }

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _applicationGroupService: ApplicationGroupService,
        private _routeFlattener: RouteFlattenerService
    ) {
        super();
    }

    ngOnInit() {
        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            this.title = flatRouteData.data['displayName'];
            this.project = flatRouteData.data['project'];

            if (flatRouteData.data['applicationGroup']) {
                this.editMode = true;
                this.model = flatRouteData.data['applicationGroup'];
            }
        });
    }


    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    save() {
        if (this.editMode) {
            console.log("Updating group: " + this.model.title);
            this.model.migrationProject = <MigrationProject>{};
            this.model.migrationProject.id = this.project.id;
            this._applicationGroupService.update(this.model).subscribe(
                migrationProject => this.rerouteToGroupList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating group: " + this.model.title);
            this.model.migrationProject = this.project;
            this._applicationGroupService.create(this.model).subscribe(
                migrationProject => this.rerouteToGroupList(),
                error => this.handleError(<any> error)
            );
        }
    }

    rerouteToGroupList() {
        this._router.navigate(['/projects', this.project.id]);
    }

    cancel() {
        this.rerouteToGroupList();
    }
}
