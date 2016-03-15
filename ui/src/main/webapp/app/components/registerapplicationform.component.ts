import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";

import {RegisteredApplicationModel} from "../models/registered.application.model";
import {RegisteredApplicationService} from "../services/registeredapplication.service";

@Component({
    selector: 'register-application-form',
    templateUrl: 'app/templates/registerapplicationform.component.html',
    providers: [ RegisteredApplicationService ]
})
export class RegisterApplicationFormComponent {
    model = new RegisteredApplicationModel();
    errorMessage:string;

    constructor(private _router:Router, private _registeredApplicationService:RegisteredApplicationService) {}

    register() {
        console.log("Should register application: " + this.model.inputPath);
        this._registeredApplicationService.registerApplication(this.model.inputPath).subscribe(
            application => this.rerouteToApplicationList(),
            error => this.errorMessage = <any>error
        );
    }

    rerouteToApplicationList() {
        this._router.navigate(['ApplicationList']);
    }

    cancelRegistration() {
        this.rerouteToApplicationList();
    }
}