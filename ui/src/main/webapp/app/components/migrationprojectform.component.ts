import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {MigrationProjectService} from "../services/migrationproject.service";
import {MigrationProject} from "windup-services";
import {FormComponent} from "./formcomponent.component";

@Component({
    selector: 'create-migration-project-form',
    templateUrl: 'app/components/migrationprojectform.component.html',
    directives: [ NgClass ],
    providers: [ MigrationProjectService ]
})
export class MigrationProjectFormComponent extends FormComponent implements OnInit
{
    registrationForm: ControlGroup;

    model:MigrationProject = <MigrationProject>{};

    editMode:boolean = false;
    loading:boolean = false;

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _migrationProjectService: MigrationProjectService,
        private _formBuilder: FormBuilder
    ) {
        super();
        this.registrationForm = this._formBuilder.group({
            title: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(128)])]
        });
    }

    ngOnInit() {
        let id:number = parseInt(this._routeParams.get("projectID"));
        if (!isNaN(id)) {
            this.editMode = true;
            this.loading = true;
            this._migrationProjectService.get(id).subscribe(
                model => { this.model = model; this.loading = false },
                error => this.handleError(<any> error)
            );
        }
    }

    save() {
        if (this.editMode) {
            console.log("Updating migration project: " + this.model.title);
            this._migrationProjectService.update(this.model).subscribe(
                migrationProject => this.rerouteToApplicationList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating migration project: " + this.model.title);
            this._migrationProjectService.create(this.model).subscribe(
                migrationProject => this.rerouteToApplicationList(),
                error => this.handleError(<any> error)
            );
        }
    }

    rerouteToApplicationList() {
        this._router.navigate(['ProjectList']);
    }

    cancel() {
        this.rerouteToApplicationList();
    }
}