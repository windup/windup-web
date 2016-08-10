import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";
import {AnalysisContext} from "windup-services";

@Component({
    templateUrl: 'app/components/analysiscontextform.component.html',
    directives: [ NgClass ],
    providers: [ ]
})
export class MigrationProjectFormComponent implements OnInit
{
    registrationForm: ControlGroup;

    model:AnalysisContext = <AnalysisContext>{};

    editMode:boolean = false;
    loading:boolean = false;

    errorMessages: string[];

    constructor(
        private _router: Router,
        private _routeParams: RouteParams,
        private _formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
    }

    save() {
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
}