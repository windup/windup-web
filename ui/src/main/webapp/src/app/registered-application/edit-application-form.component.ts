import {Component, OnInit} from "@angular/core";
import {FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RegisteredApplication, RegistrationType} from "../generated/windup-services";
import {RegisteredApplicationService} from "./registered-application.service";
import {FileExistsValidator} from "../shared/validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {Constants} from "../constants";
import {RegisterApplicationFormComponent} from "./register-application-form.component";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {EventBusService} from "../core/events/event-bus.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {NotificationService} from "../core/notification/notification.service";

@Component({
    templateUrl: './register-application-form.component.html',
    styleUrls: ['./register-application-form.component.scss'] // apparently they are not inherited
})
export class EditApplicationFormComponent extends RegisterApplicationFormComponent implements OnInit {

    constructor(
        _router:Router,
        _activatedRoute: ActivatedRoute,
        _fileService:FileService,
        _registeredApplicationService:RegisteredApplicationService,
        _formBuilder: FormBuilder,
        _routeFlattener: RouteFlattenerService,
        _eventBus: EventBusService,
        _migrationProjectService: MigrationProjectService,
        _notificationService: NotificationService
    ) {
        super(_router, _activatedRoute, _fileService, _registeredApplicationService, _formBuilder, _routeFlattener,
            _eventBus, _migrationProjectService, _notificationService);

        this.labels.heading = 'Update application';
        this.labels.uploadButton = 'Update';
    }

    ngOnInit(): any {
        super.ngOnInit();

        this.isAllowUploadMultiple = false;

        this.registrationForm = this._formBuilder.group({
            appPathToRegister: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)]
        });

        this._activatedRoute.data.takeUntil(this.destroy).subscribe((data: {application: RegisteredApplication}) => {
            this.application = data.application;
            this.mode = this.application.registrationType;
            this.fileInputPath = this.application.inputPath;
            this.multipartUploader.setOptions({
                url: Constants.REST_BASE + RegisteredApplicationService.REUPLOAD_APPLICATION_URL.replace('{appId}', this.application.id.toString()),
                disableMultipart: false,
                method: 'PUT'
            });
        });
    }

    // @Override
    register() {
        if (this.mode == "PATH") {
            this.application.inputPath = this.fileInputPath;
            this._registeredApplicationService.updateByPath(this.application).takeUntil(this.destroy).subscribe(
              //  application => this.rerouteToApplicationList(),
                application => this.rerouteToConfigurationForm(),
                error => this.handleError(<any>error)
            );
        } else {
            if (this.multipartUploader.getNotUploadedItems().length > 0) {
                this._registeredApplicationService.updateByUpload(this.application).takeUntil(this.destroy).subscribe(
                    //application => this.rerouteToApplicationList(),
                    application => this.rerouteToApplicationList(),
                    error => this.handleError(<any>error)
                );
            } else {
                this.handleError("Please select file first");
            }
        }
        return false;
    }
}
