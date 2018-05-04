import { Component, OnInit, OnDestroy} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {FileUploader} from "ng2-file-upload/ng2-file-upload";

import {MigrationProject, RegisteredApplication, RegistrationType} from "../generated/windup-services";
import {RegisteredApplicationService} from "./registered-application.service";
import {FileExistsValidator} from "../shared/validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {FormComponent} from "../shared/form.component";
import {Constants} from "../constants";
import {Subscription} from "rxjs";
import {FlattenedRouteData, RouteFlattenerService} from "../core/routing/route-flattener.service";
import {TabComponent} from "../shared/tabs/tab.component";
import {FileUploaderOptions, FilterFunction} from "ng2-file-upload";
import {EventBusService} from "../core/events/event-bus.service";
import {UpdateMigrationProjectEvent} from "../core/events/windup-event";
import {MigrationProjectService} from "../project/migration-project.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {FileLikeObject} from "ng2-file-upload/file-upload/file-like-object.class";
import formatString = utils.formatString;

@Component({
    templateUrl: "./register-application-form.component.html",
    styleUrls: ['./register-application-form.component.scss']
})
export class RegisterApplicationFormComponent extends FormComponent implements OnInit, OnDestroy
{
    registrationForm: FormGroup;
    protected application: RegisteredApplication;
    multipartUploader: FileUploader;
    protected mode: RegistrationType = "UPLOADED";
    fileInputPath: string = '';
    isDirWithExplodedApp: boolean = false;
    isAllowUploadMultiple: boolean = true;

    isInWizard: boolean = false;
    project: MigrationProject;
    routerSubscription: Subscription;
    uploading: boolean = false;

    labels = {
        heading: 'Add Applications',
        uploadButton: 'Upload'
    };

    constructor(
        protected _router: Router,
        protected _activatedRoute: ActivatedRoute,
        protected _fileService: FileService,
        protected _registeredApplicationService: RegisteredApplicationService,
        protected _formBuilder: FormBuilder,
        protected _routeFlattener: RouteFlattenerService,
        protected _eventBus: EventBusService,
        protected _migrationProjectService: MigrationProjectService,
        protected _notificationService: NotificationService
    ) {
        super();

        this.multipartUploader = _registeredApplicationService.getMultipartUploader();
        //this.multipartUploader.onSuccessItem = () => console.log("File uploaded");
        this.multipartUploader.onAfterAddingFile = () => this.registerUploaded();
        this.multipartUploader.onWhenAddingFileFailed = (item: FileLikeObject, filter: FilterFunction, options) => {
            let msg;
            if (filter["rejectMessage"])
                msg = formatString(filter["rejectMessage"], item.name);
            else
                switch (filter.name) {
                    case "onlyJavaArchives": msg = `'${item.name}' could not be added to the project as it is not a valid Java deployment (${filter["suffixes"].join(", ")})`; break;
                    case 'queueLimit': msg = "Maximum number of queued files reached."; break;
                    case 'fileSize': msg = `File '${item.name}' is too large.`; break;
                    case 'fileType': msg = `File '${item.name}' is of invalid file type.`; break;
                    case 'mimeType': msg = `File '${item.name}' is of invalid MIME type.`; break;
                    default: `File rejected for uploading: '${item.name}'`; break;
                }
            this._notificationService.error(msg);
        };

        let suffixes = ".ear .har .jar .rar .sar .war .zip".split(" ");
        this.multipartUploader.options.filters.push(<FilterFunction>{
            name: "onlyJavaArchives",
            fn: (item?: FileLikeObject, options?: FileUploaderOptions) => {
                return item.name && suffixes.some(suffix => item.name.endsWith(suffix));
            },
            suffixes: suffixes,
            // JEXL would be needed for this.
            //rejectMessage: "File was rejected: '{item.name}'\nOnly Java archives are accepted {filter.suffixes.join(', ')})",
        });
    }

    ngOnInit(): any {
        this._eventBus.onEvent
            .filter(event => event.isTypeOf(UpdateMigrationProjectEvent))
            .subscribe((event: UpdateMigrationProjectEvent) => this.project = event.migrationProject);

        this.registrationForm = this._formBuilder.group({
            // Name under which the control is registered: [default value, Validator, AsyncValidator]
            appPathToRegister: ["",
                Validators.compose([Validators.required, Validators.minLength(4)]),
                Validators.composeAsync([
                    FileExistsValidator.create(this._fileService),
                ]),
            ],
            //isDirWithAppsCheckBox: [], // TODO: Validate if appPathToRegister has a directory if this is true.
            isDirWithExplodedApp: [],
        });

        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];

            if (!flatRouteData.data['project']) {
                throw new Error('Project must be specified');
            }

            this.project = flatRouteData.data['project'];
            this._migrationProjectService.monitorProject(this.project);

            let uploadUrl = Constants.REST_BASE + RegisteredApplicationService.UPLOAD_URL;
            uploadUrl = uploadUrl.replace("{projectId}", this.project.id.toString());

            this.multipartUploader.setOptions({
                url: uploadUrl,
                method: 'POST',
                disableMultipart: false,
                removeAfterUpload: false // cannot use this, there is a bug and it always removes items even for failure
            });
        });
    }

    ngOnDestroy(): void {
        this.multipartUploader.clearQueue();
        this.routerSubscription.unsubscribe();
        this._migrationProjectService.stopMonitoringProject(this.project);
    }

    register() {
        if (this.mode == "PATH") {
            this.registerPath();
        } else {
            this.navigateOnSuccess();
            return false;
        }
    }

    private registerPath() {
        /**
         * If there are already some uploaded applications, we consider form to be valid
         * But if user is on Register Path section, clicking submit button triggers registering app by path with invalid
         *  path.
         *  To avoid that, treat it as success and do the navigation right away, even when no input path is set.
         */
        if ((!this.fileInputPath || this.fileInputPath.length === 0) && this.isValid) {
            this.navigateOnSuccess();
            return;
        }

        this._fileService.queryServerPathTargetType(this.fileInputPath).subscribe((type_: string) => {
            if (type_ === "DIRECTORY" && !this.isDirWithExplodedApp) { //this.isDirWithApps
                this._registeredApplicationService.registerApplicationInDirectoryByPath(this.project, this.fileInputPath)
                    .subscribe(
                        application => this.navigateOnSuccess(),
                        error => this.handleError(error)
                    );
            } else {
                this._registeredApplicationService.registerByPath(this.project, this.fileInputPath, this.isDirWithExplodedApp).subscribe(
                    application => this.navigateOnSuccess(),
                    error => this.handleError(<any>error)
                )
            }
        });
    }

    private registerUploaded() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select the file to upload.");
            return;
        }

        this.uploading = true;
        this._registeredApplicationService.uploadApplications(this.project).subscribe(
            () => {this.uploading = false; console.log("Uploads done")},
            error => {
                this.uploading = false;
                console.log("Upload error");
                if (!error.hasOwnProperty('code') || error.code !== RegisteredApplicationService.ERROR_FILE_EXISTS) {
                    this.handleError(<any>error);
                }
            }
        );
    }

    navigateOnSuccess() {
        if (this.isInWizard) {
            this.navigateAway(['/wizard', 'project', this.project.id, 'configure-analysis']);
        } else {
            //this.rerouteToApplicationList();
            this.rerouteToConfigurationForm();
        }
    }

    protected navigateAway(path: any[]) {
        this.multipartUploader.clearQueue();
        this._router.navigate(path);
    }

    protected rerouteToApplicationList() {
        this.navigateAway([`/projects/${this.project.id}/applications`]);
    }

    protected rerouteToConfigurationForm() {
        this.navigateAway([`/projects/${this.project.id}/analysis-context`]);
    }

    cancelRegistration() {
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

    handleError(error: any) {
        this._notificationService.error(utils.getErrorMessage(error));
    }

    public get isValid() {
        if (this.uploading)
            return false;

        /**
         * If project already has some applications,
         * form is always valid for "upload" tab and also for empty path in "server path" tab.
         *
         * This allows us to have 'Back' step in wizard and not requiring
         * user to upload new application.
         */
        if  (this.isInWizard && this.projectHasApplications() && this.fileInputPath.length === 0) {
            return true;
        }

        if (this.mode === 'PATH') {
            const appPathField = this.registrationForm.get('appPathToRegister');

            return this.fileInputPath && this.fileInputPath.length > 0 &&
                !this.hasError(appPathField) && !appPathField.pending;
        } else if (this.mode === 'UPLOADED') {
            return this.projectHasApplications();
        }
    }

    public onTabSelected(tab: TabComponent) {
        this.changeMode(tab.properties.mode);
    }
}
