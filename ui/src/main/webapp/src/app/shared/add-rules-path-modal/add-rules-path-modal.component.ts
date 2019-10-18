import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from "@angular/core";
import {FormComponent} from "../form.component";
import {FormGroup, FormBuilder, Validators, AbstractControl} from "@angular/forms";
import {FileExistsValidator} from "../validators/file-exists.validator";
import {FileService} from "../../services/file.service";
import {ConfigurationService} from "../../configuration/configuration.service";
import {Configuration, RulesPath, MigrationProject} from "../../generated/windup-services";
import {ModalDialogComponent} from "../dialog/modal-dialog.component";
import {RuleService} from "../../configuration/rule.service";
import {FileLikeObject, FileUploaderOptions, FilterFunction} from "ng2-file-upload";
import {utils} from "../utils";
import {Subscription, Observable} from "rxjs";
import {FileUploaderWrapper} from "../upload/file-uploader-wrapper.service";
import formatString = utils.formatString;
import {DialogService} from "../dialog/dialog.service";
import {ConfirmationModalComponent} from "../dialog/confirmation-modal.component";
import {TabComponent} from "../tabs/tab.component";

@Component({
    selector: 'wu-add-rules-path-modal',
    templateUrl: './add-rules-path-modal.component.html',
    styleUrls: [
        '../../registered-application/register-application-form.component.scss',
        './add-rules-path-modal.component.scss'
    ]
})
export class AddRulesPathModalComponent extends FormComponent implements OnInit, OnDestroy {
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

    addRulesPathForm: FormGroup;

    @ViewChild(ModalDialogComponent)
    modalDialog: ModalDialogComponent;

    multipartUploader: FileUploaderWrapper;

    countUploadedRules = 0;
    isAllowUploadMultiple = true;

    uploadedRules: RulesPath[] = [];

    dialogSubscription: Subscription = null;

    mode: string;

    getRuleNameCallback = (rule: RulesPath): string => {
        const paths =  rule.path.split('/');
        return paths[paths.length - 1];
    };

    private subscriptions: Subscription[] = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _fileService: FileService,
        private _configurationService: ConfigurationService,
        private _ruleService: RuleService,
        private _dialogService: DialogService
    ) {
        super();
        this.multipartUploader = <FileUploaderWrapper>_ruleService.getMultipartUploader();

        this.subscriptions.push(this.multipartUploader.observables.onSuccessItem.subscribe((result) => {
            this.countUploadedRules++;
            const rulesPath = JSON.parse(result.response);
            this.uploadedRules = [ ...this.uploadedRules, rulesPath ];
        }));

        this.subscriptions.push(this.multipartUploader.observables.onErrorItem.subscribe((result) => {
            this.handleError(utils.parseServerResponse(result.response));
        }));
        this.subscriptions.push(this.multipartUploader.observables.onAfterAddingFile.subscribe(() => this.uploadRule()));
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
                    case "invalidRuleProvider":
                        msg = `'${item.name}' could not be added to the project as it is not a valid rule provider file`;
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
            name: "invalidRuleProvider",
            fn: (item?: FileLikeObject, options?: FileUploaderOptions) => {
                return item.name && suffixes.some(suffix => item.name.endsWith(suffix));
            },
            suffixes: suffixes
        });
    }

    ngOnInit(): void {
        this.addRulesPathForm = this._formBuilder.group({
            inputPathControl: ["", Validators.compose([Validators.required, Validators.minLength(4)]), FileExistsValidator.create(this._fileService)],
            scanRecursivelyControl: [""],
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    getInputPathControl(): AbstractControl {
        return this.addRulesPathForm.get("inputPathControl");
    }

    getScanRecursivelyControl(): AbstractControl {
        return this.addRulesPathForm.get("scanRecursivelyControl");
    }

    show(): void {
        this.countUploadedRules = 0;
        this.uploadedRules = [];

        this.errorMessages = [];
        if (this.addRulesPathForm)
            this.addRulesPathForm.reset();

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

            let newPath = <RulesPath>{};
            newPath.path = this.getInputPathControl().value;
            newPath.rulesPathType = "USER_PROVIDED";
            newPath.scopeType = configuration.global ? "GLOBAL" : "PROJECT";
            newPath.scanRecursively = this.getScanRecursivelyControl().value;

            newConfiguration.rulesPaths.push(newPath);

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

    private uploadRule() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select the file to upload.");
            return;
        }

        if (!this.project) {
            this._ruleService.uploadGlobalRules().subscribe(
                () => {},
                error => this.handleError(<any>error)
            );
        } else {
            this._ruleService.uploadRulesToProject(this.project).subscribe(
                () => {},
                error => this.handleError(<any>error)
            );
        }
    }

    public confirmDeleteRule(rulesPath: RulesPath) {
        if (this.dialogSubscription !== null) {
            this.dialogSubscription.unsubscribe();
        }

        const dialog: ConfirmationModalComponent = this._dialogService.getConfirmationDialog();

        dialog.body = `Are you sure you want to remove rule provider '${rulesPath.path}'?`;
        dialog.data = rulesPath;
        dialog.show();
        this.dialogSubscription = dialog.confirmed.subscribe(rulePath => this.removeRulesPath(rulePath));
    }

    removeRulesPath(rulesPath: RulesPath) {
        this._ruleService.deleteRule(rulesPath).subscribe(() => {
            this.uploadedRules = this.uploadedRules.filter(item => item.id !== rulesPath.id);
        });
    }

    onTabSelected(tab: TabComponent) {
        this.mode = tab.properties.mode;
    }

    isFormValid() {
        return this.mode === 'UPLOADED' && this.countUploadedRules > 0 ||
               this.mode === 'PATH' && this.addRulesPathForm.valid;
    }
}

export interface ConfigurationEvent extends Event {
    configuration: Configuration;
}
