import { Component, OnInit, OnDestroy} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";

import {RegisteredApplication, RegistrationType} from "windup-services";
import {RegisteredApplicationService} from "./registered-application.service";
import {FileExistsValidator} from "../shared/validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {FormComponent} from "../shared/form.component";
import {Constants} from "../constants";
import {MigrationProject} from "windup-services";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {TabComponent} from "../shared/tabs/tab.component";

@Component({
    templateUrl: "./register-application-form.component.html",
    styleUrls: ['./register-application-form.component.scss']
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit, OnDestroy
{
    protected registrationForm: FormGroup;
    protected application: RegisteredApplication;
    protected multipartUploader: FileUploader;
    protected mode: RegistrationType = "UPLOADED";
    protected fileInputPath: string;
    private isDirWithApps: boolean = false;
    protected isAllowUploadMultiple: boolean = true;

    isInWizard: boolean = false;
    project: MigrationProject;
    routerSubscription: Subscription;

    countUploadedApplications: number = 0;

    protected labels = {
        heading: 'Add Applications',
        uploadButton: 'Upload'
    };

    constructor(
        protected _router: Router,
        protected _activatedRoute: ActivatedRoute,
        protected _fileService: FileService,
        protected _registeredApplicationService: RegisteredApplicationService,
        protected _formBuilder: FormBuilder,
        protected _routeFlattener: RouteFlattenerService
    ) {
        super();
        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
        this.multipartUploader.onSuccessItem = () => this.countUploadedApplications++;
        this.multipartUploader.onErrorItem = (item, response) => {
            this.errorMessages.push(response);
        };
        this.multipartUploader.onAfterAddingFile = () => this.registerUploaded();
    }

    ngOnInit(): any {
        this.registrationForm = this._formBuilder.group({
            // Name under which the control is registered, default value, Validator, AsyncValidator
            appPathToRegister: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)],
            isDirWithAppsCheckBox: [] // TODO: Validate if appPathToRegister has a directory if this is true.
        });

        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];

            if (!flatRouteData.data['project']) {
                throw new Error('Project must be specified');
            }

            this.project = flatRouteData.data['project'];

            let uploadUrl = Constants.REST_BASE + RegisteredApplicationService.UPLOAD_URL;
            uploadUrl = uploadUrl.replace("{projectId}", this.project.id.toString());

            this.multipartUploader.setOptions({
                url: uploadUrl,
                method: 'POST',
                disableMultipart: false
            });
        });
    }

    ngOnDestroy(): void {
        this.multipartUploader.clearQueue();
        this.routerSubscription.unsubscribe();
    }

    protected register() {
        if (this.mode == "PATH") {
            this.registerPath();
        } else {
            this.navigateOnSuccess();
            return false;
        }
    }

    private registerPath() {
        if (this.isDirWithApps) {
            this._registeredApplicationService.registerApplicationInDirectoryByPath(this.project, this.fileInputPath)
                .subscribe(
                    application => this.navigateOnSuccess(),
                    error => this.handleError(error)
                );
        } else {
            this._registeredApplicationService.registerByPath(this.project, this.fileInputPath).subscribe(
                application => this.navigateOnSuccess(),
                error => this.handleError(<any>error)
            )
        }
    }

    private registerUploaded() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select the file to upload.");
            return;
        }

        this._registeredApplicationService.uploadApplications(this.project).subscribe(
            () => {},
            error => this.handleError(<any>error)
        );
    }

    navigateOnSuccess() {
        if (this.isInWizard) {
            this.navigateAway(['/wizard', 'project', this.project.id, 'configure-analysis']);
        } else {
            this.rerouteToApplicationList();
        }
    }

    protected navigateAway(path: any[]) {
        this.multipartUploader.clearQueue();
        this._router.navigate(path);
    }

    protected rerouteToApplicationList() {
        this.navigateAway([`/projects/${this.project.id}/applications`]);
    }

    private cancelRegistration() {
        if (this.isInWizard) {
            this.navigateAway([`/wizard/project/${this.project.id}/create-project`]);
        } else {
            this.rerouteToApplicationList();
        }
    }

    private changeMode(mode: RegistrationType) {
        this.mode = mode;

        if (this.mode === 'PATH') {
            this.labels.uploadButton = 'Upload';
        } else if (this.mode === 'UPLOADED') {
            // this is not really nice, but when using UPLOADED mode, upload is done automatically
            // so no action is actually being executed, so label is 'Done'
            this.labels.uploadButton = 'Done';
        }
    }

    /**
     * Checks if project has any applications
     *
     * @returns {boolean}
     */
    projectHasApplications() {
        return (this.project && this.project.applications && this.project.applications.length > 0);
    }

    public get isValid() {
        /**
         * If project already has some applications,
         * form is always valid, no matter of what is filled in.
         *
         * This allows us to have 'Back' step in wizard and not requiring
         * user to upload new application.
         */
        if (this.projectHasApplications()) {
            return true;
        }

        if (this.mode === 'PATH') {
            return this.fileInputPath && this.fileInputPath.length > 0;
        } else if (this.mode === 'UPLOADED') {
            return this.countUploadedApplications > 0;
        }
    }

    public onTabSelected(tab: TabComponent) {
        this.changeMode(tab.properties.mode);
    }
}
