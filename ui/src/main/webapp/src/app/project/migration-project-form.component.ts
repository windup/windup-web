import {Component, OnInit, OnDestroy, AfterViewInit, ViewChildren} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {MigrationProject} from "../generated/windup-services";
import {MigrationProjectService} from "./migration-project.service";
import {FormComponent} from "../shared/form.component";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {FormControl} from "@angular/forms";
import { filter } from 'rxjs/operators';

@Component({
    templateUrl: './migration-project-form.component.html',
    styles: [`
        p.help-block {
            color: #767676;
        }      
    `]
})
export class MigrationProjectFormComponent extends FormComponent implements OnInit, OnDestroy, AfterViewInit
{
    title: string = "Create Project";

    model: MigrationProject = <MigrationProject>{};

    isInWizard: boolean = false;
    editMode: boolean = false;

    errorMessages: string[];
    private routerSubscription: Subscription;

    @ViewChildren('idProjectTitle') inputProjectName;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationProjectService: MigrationProjectService,
        private _routeFlattener: RouteFlattenerService
    ) {
        super();
        
        this.routerSubscription = this._router.events
        .pipe(
            filter(event => event instanceof NavigationEnd)
        )
        .subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            if (flatRouteData.data['displayName'])
                this.title = flatRouteData.data['displayName'];

            if (flatRouteData.data['project']) {
                this.editMode = true;
                let projectID = flatRouteData.data['project'].id;

                // Reload it as we always need the latest data (route resolver does not guarantee this)
                this._migrationProjectService.get(projectID).subscribe(model => this.model = model);
            }

            if(!this.editMode) // Creating a new project.
                this._migrationProjectService.deleteProvisionalProjects().subscribe(res => {});

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
        });
    }

    ngOnInit(): void {
        
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.inputProjectName.first.nativeElement.focus();
    }

    getDescriptionHeight() {
        return Math.min(4 + (this.model.description ? this.model.description.length : 0) / 80, 25)
    }

    titleIsDuplicated(control:FormControl): boolean {
        let touched = control.touched == null ? false : control.touched;
        return control.hasError('nameIsTaken') && touched;
    }

    save() {
        if (this.model.title)
            this.model.title = this.model.title.trim();

        if (this.model.description)
            this.model.description = this.model.description.trim();

        if (this.editMode) {
            this._migrationProjectService.update(this.model).subscribe(
                migrationProject => this.navigateOnSuccess(migrationProject),
                error => this.handleError(<any> error)
            );
        } else {
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
