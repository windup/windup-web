import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";

import {MigrationProject} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {ApplicationGroup} from "windup-services";

@Component({
    selector: 'create-group-form',
    templateUrl: 'app/components/applicationgroupform.component.html',
    directives: [ NgClass ],
    providers: [ ApplicationGroupService ]
})
export class ApplicationGroupForm implements OnInit
{
    registrationForm: ControlGroup;

    model:ApplicationGroup = <ApplicationGroup>{};

    editMode:boolean = false;
    loading:boolean = false;

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _applicationGroupService: ApplicationGroupService,
        private _formBuilder: FormBuilder
    ) {
        this.registrationForm = this._formBuilder.group({
            title: ["", Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(128)])]
        });
    }

    ngOnInit() {
        let id:number = parseInt(this._routeParams.get("groupID"));
        if (!isNaN(id)) {
            this.editMode = true;
            this.loading = true;
            this._applicationGroupService.get(id).subscribe(
                model => { this.model = model; this.loading = false },
                error => this.handleError(<any> error)
            );
        }
    }

    save() {
        if (this.editMode) {
            console.log("Updating group: " + this.model.title);
            this._applicationGroupService.update(this.model).subscribe(
                migrationProject => this.rerouteToGroupList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating group: " + this.model.title);
            this._applicationGroupService.create(this.model).subscribe(
                migrationProject => this.rerouteToGroupList(),
                error => this.handleError(<any> error)
            );
        }
    }

    /**
     * This works simplifies the process of checking for an error state on the control.
     *
     * It makes sure that the control is not-pristine (don't show errors on fields the user hasn't touched yet)
     * and that the control is already rendered.
     */
    hasError(control:NgControlName) {
        let touched = control.touched == null ? false : control.touched;
        return !control.valid && touched && control.control != null;
    }

    private handleError(error: any) {
        this.errorMessages = [];
        if (error.parameterViolations) {
            error.parameterViolations.forEach(violation =>
            {
                console.log("Violation: " + JSON.stringify(violation));
                this.errorMessages.push(violation.message);
            });
        } else
        {
            this.errorMessages.push("Error: " + error);
        }
    }

    rerouteToGroupList() {
        this._router.navigate(['GroupList']);
    }

    cancel() {
        this.rerouteToGroupList();
    }
}