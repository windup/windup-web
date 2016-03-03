import {Component, OnInit} from "angular2/core";
import {Router} from "angular2/router";

import {WindupService} from "../services/windup.service";
import {RegisteredApplicationModel} from "../models/registered.application.model";
import {RegisteredApplicationService} from "../services/registeredapplication.service";

@Component({
    selector: 'application-list',
    templateUrl: 'app/templates/applicationlist.component.html',
    providers: [ RegisteredApplicationService ]
})
export class ApplicationListComponent implements OnInit {
    applications:RegisteredApplicationModel[];
    errorMessage:String;

    constructor(private _router:Router, private _registeredApplicationService:RegisteredApplicationService) {}

    ngOnInit():any {
        this.getApplications();
    }

    getApplications() {
        return this._registeredApplicationService.getApplications().subscribe(
            applications => this.applications = applications,
            error => this.errorMessage = <any>error
        );
    }

    registerApplication() {
        console.log("Should forward to app registration now");
        this._router.navigate(['RegisterApplicationForm'])
    }
}