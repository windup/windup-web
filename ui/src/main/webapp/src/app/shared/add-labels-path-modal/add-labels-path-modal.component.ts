import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from "@angular/core";
import {FormComponent} from "../form.component";
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../../services/file.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {Configuration, LabelsPath, MigrationProject} from "../../generated/windup-services";
import {ModalDialogComponent} from "../dialog/modal-dialog.component";
import {LabelService} from "../../configuration/label.service";
import {FileLikeObject, FileUploaderOptions, FilterFunction} from "ng2-file-upload";
import {utils} from "../utils";
import {Subscription, Observable} from "rxjs";
import {FileUploaderWrapper} from "../upload/file-uploader-wrapper.service";
import formatString = utils.formatString;
import {DialogService} from "../dialog/dialog.service";
import {ConfirmationModalComponent} from "../dialog/confirmation-modal.component";
import {TabComponent} from "../tabs/tab.component";

@Component({
    selector: 'wu-add-labels-path-modal',
    templateUrl: './add-labels-path-modal.component.html',
    styleUrls: [
        '../../registered-application/register-application-form.component.scss',
        './add-labels-path-modal.component.scss'
    ]
})
export class AddLabelsPathModalComponent extends FormComponent implements OnInit, OnDestroy {
    @Input()
    project: MigrationProject;

    @Input()
    configuration: Configuration;

    @Output()
    configurationSaved = new EventEmitter();

    // Form models
    // Remove because of deprecated for more info see:
    // https://angular.io/api/forms/FormControlName#use-with-ngmodel
    // inputPath = "";
    // scanRecursively = true;

    addLabelsPathForm: FormGroup;

    @ViewChild(ModalDialogComponent)
    modalDialog: ModalDialogComponent;

    multipartUploader: FileUploaderWrapper;

    countUploadedLabels = 0;
    isAllowUploadMultiple = true;

    uploadedLabels: LabelsPath[] = [];

    dialogSubscription: Subscription = null;

    mode: string;

    getLabelNameCallback = (label: LabelsPath): string => {
        const paths =  label.path.split('/');
        return paths[paths.length - 1];
    };

    private subscriptions: Subscription[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _fileService: FileService,
        private _configurationService: ConfigurationService,
        private _labelService: LabelService,
        private _dialogService: DialogService
    ) {
        super();
        this.multipartUploader = <FileUploaderWrapper>_labelService.getMultipartUploader();

        this.subscriptions.push(this.multipartUploader.observables.onSuccessItem.subscribe((result) => {
            this.countUploadedLabels++;
            const labelsPath = JSON.parse(result.response);
            this.uploadedLabels = [ ...this.uploadedLabels, labelsPath ];
        }));

        this.subscriptions.push(this.multipartUploader.observables.onErrorItem.subscribe((result) => {
            this.handleError(utils.parseServerResponse(result.response));
        }));
        this.subscriptions.push(this.multipartUploader.observables.onAfterAddingFile.subscribe(() => this.uploadLabel()));
        this.subscriptions.push(this.multipartUploader.observables.onWhenAddingFileFailed.subscribe(result => {
            const item = result.item;
            const filter = result.filter;

            let msg;

            if (filter["rejectMessage"]) {
                msg = formatString(filter["rejectMessage"], item.name);
            } else {
                switch (filter.name) {
                    default:
                        msg = `File rejected for uploading: '${item.name}'`;
                        break;
                    case "invalidLabelProvider":
                        msg = `'${item.name}' could not be added to the project as it is not a valid label provider file`;
                        break;
                    case 'queueLimit':
                        msg = "Maximum number of queued files reached.";
                        break;
                    case 'fileSize':
                        msg = `File '${item.name}' is too large.`;
                        break;
                    case 'fileType':
                        msg = `File '${item.name}' is of invalid file type.`;
                        break;
                    case 'mimeType':
                        msg = `File '${item.name}' is of invalid MIME type.`;
                        break;
                }
            }
            this.handleError(msg);
        }));

        let suffixes = ['.xml'];
        this.multipartUploader.options.filters.push(<FilterFunction>{
            name: "invalidLabelProvider",
            fn: (item?: FileLikeObject, options?: FileUploaderOptions) => {
                return item.name && suffixes.some(suffix => item.name.endsWith(suffix));
            },
            suffixes: suffixes
        });
    }

    ngOnInit(): void {
        this.addLabelsPathForm = this._formBuilder.group({
            inputPathControl: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)],
            scanRecursivelyControl: [""],
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    getInputPathControl(): AbstractControl {
        return this.addLabelsPathForm.get("inputPathControl");
    }

    getScanRecursivelyControl(): AbstractControl {
        return this.addLabelsPathForm.get("scanRecursivelyControl");
    }

    show(): void {
        this.countUploadedLabels = 0;
        this.uploadedLabels = [];

        this.errorMessages = [];
        if (this.addLabelsPathForm)
            this.addLabelsPathForm.reset();

        this.modalDialog.show();
    }

    hide(): void {
        this.multipartUploader.clearQueue();
        this.modalDialog.hide();
    }

    reloadConfiguration() {
        if (this.project) {
            return this._configurationService.getByProjectId(this.project.id);
        } 
        return this._configurationService.get();
    }

    submitForm(): void {
        if (this.mode === 'PATH') {
            this.addPath();
        } else {
            this.reloadConfiguration().subscribe(configuration => {
                this.configurationSaved.emit({ configuration });
                this.hide();
            });
        }
    }

    addPath(): void {
        this.reloadConfiguration().subscribe(configuration => {
            let newConfiguration = configuration;

            let newPath = <LabelsPath>{};
            newPath.path = this.getInputPathControl().value;
            newPath.labelsPathType = "USER_PROVIDED";
            newPath.registrationType = "PATH";
            newPath.scopeType = configuration.global ? "GLOBAL" : "PROJECT";
            newPath.scanRecursively = this.getScanRecursivelyControl().value;

            newConfiguration.labelsPaths.push(newPath);

            this._configurationService.save(newConfiguration).subscribe(
                configuration => {
                    this.configuration = configuration;
                    this.configurationSaved.emit({
                        configuration: this.configuration
                    });
                    this.hide();
                },
                error => this.handleError(<any>error)
            );
        });
    }

    private uploadLabel() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select the file to upload.");
            return;
        }

        if (!this.project) {
            this._labelService.uploadGlobalLabels().subscribe(
                () => {},
                error => this.handleError(<any>error)
            );
        } else {
            this._labelService.uploadLabelsToProject(this.project).subscribe(
                () => {},
                error => this.handleError(<any>error)
            );
        }
    }

    public confirmDeleteLabel(labelsPath: LabelsPath) {
        if (this.dialogSubscription !== null) {
            this.dialogSubscription.unsubscribe();
        }

        const dialog: ConfirmationModalComponent = this._dialogService.getConfirmationDialog();

        dialog.body = `Are you sure you want to remove label provider '${labelsPath.path}'?`;
        dialog.data = labelsPath;
        dialog.show();
        this.dialogSubscription = dialog.confirmed.subscribe(labelPath => this.removeLabelsPath(labelPath));
    }

    removeLabelsPath(labelsPath: LabelsPath) {
        this._labelService.deleteLabel(labelsPath).subscribe(() => {
            this.uploadedLabels = this.uploadedLabels.filter(item => item.id !== labelsPath.id);
        });
    }

    onTabSelected(tab: TabComponent) {
        this.mode = tab.properties.mode;
    }

    isFormValid() {
        return this.mode === 'UPLOADED' && this.countUploadedLabels > 0 ||
               this.mode === 'PATH' && this.addLabelsPathForm.valid;
    }
}

export interface ConfigurationEvent extends Event {
    configuration: Configuration;
}
