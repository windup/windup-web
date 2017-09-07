import {Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy} from "@angular/core";
import {FormComponent} from "../shared/form.component";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {FileExistsValidator} from "../shared/validators/file-exists.validator";
import {FileService} from "../services/file.service";
import {ConfigurationService} from "./configuration.service";
import {Configuration, RulesPath} from "../generated/windup-services";
import {ModalDialogComponent} from "../shared/dialog/modal-dialog.component";
import {RuleService} from "./rule.service";
import {FileLikeObject, FileUploaderOptions, FilterFunction} from "ng2-file-upload";
import {utils} from "../shared/utils";
import {Subscription} from "rxjs";
import {FileUploaderWrapper} from "../shared/upload/file-uploader-wrapper.service";
import formatString = utils.formatString;
import {DialogService} from "../shared/dialog/dialog.service";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {TabComponent} from "../shared/tabs/tab.component";

@Component({
    selector: 'wu-add-rules-path-modal',
    templateUrl: './add-rules-path-modal.component.html',
    styleUrls: [
        '../registered-application/register-application-form.component.scss',
        './add-rules-path-modal.component.scss'
    ]
})
export class AddRulesPathModalComponent extends FormComponent implements OnInit, OnDestroy {
    @Input()
    configuration: Configuration;

    @Output()
    configurationSaved = new EventEmitter();

    // Form models
    inputPath = "";
    scanRecursively = true;

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

    constructor(
        private _formBuilder: FormBuilder,
        private _fileService: FileService,
        private _configurationService: ConfigurationService,
        private _ruleService: RuleService,
        private _dialogService: DialogService
    ) {
        super();
        this.multipartUploader = <FileUploaderWrapper>_ruleService.getMultipartUploader();

        this.multipartUploader.observables.onSuccessItem.takeUntil(this.destroy).subscribe((result) => {
            this.countUploadedRules++;
            const rulesPath = JSON.parse(result.response);
            this.uploadedRules = [ ...this.uploadedRules, rulesPath ];
        });

        this.multipartUploader.observables.onErrorItem.takeUntil(this.destroy).subscribe((result) => {
            this.handleError(utils.parseServerResponse(result.response));
        });
        this.multipartUploader.observables.onAfterAddingFile.takeUntil(this.destroy).subscribe(() => this.uploadRule());
        this.multipartUploader.observables.onWhenAddingFileFailed.takeUntil(this.destroy).subscribe(result => {
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
        });

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

    submitForm(): void {
        if (this.mode === 'PATH') {
            this.addPath();
        } else {
            this._configurationService.get().takeUntil(this.destroy).subscribe(configuration => {
                this.configurationSaved.emit({ configuration });
                this.hide();
            });
        }
    }

    addPath(): void {
        let newConfiguration = JSON.parse(JSON.stringify(this.configuration));

        let newPath = <RulesPath>{};
        newPath.path = this.inputPath;
        newPath.rulesPathType = "USER_PROVIDED";
        (<any>newPath).scanRecursively = this.scanRecursively;

        newConfiguration.rulesPaths.push(newPath);

        this._configurationService.save(newConfiguration).takeUntil(this.destroy).subscribe(
            configuration => {
                this.configuration = configuration;
                this.configurationSaved.emit({
                    configuration: this.configuration
                });
                this.hide();
            },
            error => this.handleError(<any>error)
        );
    }

    private uploadRule() {
        if (this.multipartUploader.getNotUploadedItems().length == 0) {
            this.handleError("Please select the file to upload.");
            return;
        }

        this._ruleService.uploadRules().takeUntil(this.destroy).subscribe(
            () => {},
            error => this.handleError(<any>error)
        );
    }

    public confirmDeleteRule(rulesPath: RulesPath) {
        if (this.dialogSubscription !== null) {
            this.dialogSubscription.unsubscribe();
        }

        const dialog: ConfirmationModalComponent = this._dialogService.getConfirmationDialog();

        dialog.body = `Are you sure you want to remove rule provider '${rulesPath.path}'?`;
        dialog.data = rulesPath;
        dialog.show();
        this.dialogSubscription = dialog.confirmed.takeUntil(this.destroy).subscribe(rulePath => this.removeRulesPath(rulePath));
    }

    removeRulesPath(rulesPath: RulesPath) {
        this._ruleService.deleteRule(rulesPath).takeUntil(this.destroy).subscribe(() => {
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
