import { Component, ViewChild, OnDestroy, OnInit, forwardRef, Output, EventEmitter } from '@angular/core';
import { RulesPath, Configuration } from '../../generated/windup-services';
import { ConfigurationService } from '../../configuration/configuration.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/dialog/confirmation-modal.component';
import { NotificationService, NotificationType } from 'patternfly-ng/notification';
import { AddRulesPathModalComponent } from '../../shared/add-rules-path-modal/add-rules-path-modal.component';
import { RuleService } from '../../configuration/rule.service';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
    selector: 'wu-custom-rules',
    templateUrl: './custom-rules.component.html',
    styleUrls: ['./custom-rules.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomRulesComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CustomRulesComponent),
        multi: true,
    }]
})
export class CustomRulesComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {

    @Output('onSelectionChange') onSelectionChange: EventEmitter<RulesPath[]> = new EventEmitter();

    @ViewChild(AddRulesPathModalComponent) addRulesModalComponent: AddRulesPathModalComponent;
    @ViewChild('removeRulesConfirmationModal') removeRulesConfirmationModal: ConfirmationModalComponent;

    configuration: Configuration;

    rulesPath: RulesPath[];
    uploadedRulesPath: RulesPath[];
    serverPathRulesPath: RulesPath[];

    selectedServerPathRules: RulesPath[] = [];
    selectedUploadedRulesPath: RulesPath[] = [];

    rulesPathForUnselect: RulesPath[] = [];

    // NgForm value
    value: RulesPath[];

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    private subscriptions: Subscription[] = [];

    constructor(
        private _ruleService: RuleService,
        private _activatedRoute: ActivatedRoute,
        private _notificationService: NotificationService,
        private _configurationService: ConfigurationService
    ) { }

    ngAfterViewInit(): void {
        this.removeRulesConfirmationModal.confirmed.subscribe((rulePath: RulesPath) => {
            this.removeRulesPath(rulePath);
        });
    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe((data: { configuration: Configuration }) => {
            this.configuration = data.configuration;
            this.loadCustomRules();
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subs) => subs.unsubscribe());
    }

    loadCustomRules() {
        this._configurationService.getCustomRulesetPaths().subscribe((rulesPath: RulesPath[]) => {
            const splitRulesPath = this.splitRulesPath(rulesPath);

            this.rulesPath = rulesPath;
            this.uploadedRulesPath = splitRulesPath[0];
            this.serverPathRulesPath = splitRulesPath[1];
        });
    }

    /**
     * Splits an array into single 'file custom' rules and 'server path' custom rules
     */
    splitRulesPath(rulesPath: RulesPath[]) {
        const uploadedRulesPath: RulesPath[] = [];
        const serverPathRulesPath: RulesPath[] = [];

        rulesPath.forEach(rulePath => {
            if (this.isUploadedCustomRule(rulePath)) {
                uploadedRulesPath.push(rulePath);
            } else {
                serverPathRulesPath.push(rulePath)
            }
        });

        return [uploadedRulesPath, serverPathRulesPath];
    }

    isUploadedCustomRule(rulesPath: RulesPath): boolean {
        return rulesPath.shortPath ? true : false;
    }


    // ControlValueAccessor interface implementations


    /**
     * 
     * Called to write data from the model to the view
     */
    writeValue(obj: any): void {
        if (obj) {
            const customRules = obj.filter((rulesPath: RulesPath) => {
                return rulesPath.rulesPathType !== 'SYSTEM_PROVIDED';
            });
            const splitRulesPath = this.splitRulesPath(customRules);

            this.value = customRules;
            this.selectedUploadedRulesPath = splitRulesPath[0];
            this.selectedServerPathRules = splitRulesPath[1];
        }
    }

    /**
     * Registers reaction on changing in the UI
     */
    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    /**
     * Registers reaction on receiving a blur event (is emitted when an element has lost focus)
     */
    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    /**
     * called on Disabled status changes
     */
    setDisabledState(isDisabled: boolean): void {
        console.log("disabled not supported for this component");
    }


    // Validators

    validate(control: AbstractControl): ValidationErrors | null {
        // TODO allways valid
        return null;
    };



    /**
     * Opens a modal for add new RulesPath
     */
    displayAddRulesPathModal() {
        this.addRulesModalComponent.show();
    }

    /**
     * Opens a modal for confirm deletion of a RulePath
     */
    displayRemoveRulesConfirmationModal(rulesPath: RulesPath) {
        console.log("Checking rules path " + rulesPath.path);
        this._ruleService.checkIfUsedRulesPath(rulesPath).subscribe(
            response => {
                if (response.valueOf()) {
                    this._notificationService.message(NotificationType.WARNING, '', `The rules path '${rulesPath.path}' is used in an existing Analysis Context and cannot be removed.`, false, null, null);
                }
                else {
                    this.removeRulesConfirmationModal.body = `Are you sure you want to remove the rules from '${rulesPath.path}'?`;
                    this.removeRulesConfirmationModal.data = rulesPath;
                    this.removeRulesConfirmationModal.show();
                }
            }
        );
    }

    removeRulesPath(rulesPath: RulesPath) {
        this._ruleService.deleteRule(rulesPath).subscribe(() => {
            this._notificationService.message(NotificationType.SUCCESS, '', 'Rule was deleted', false, null, null);
            this._configurationService.get().subscribe(newConfig => {
                this.configuration = newConfig;
                this.loadCustomRules();
            });
        });
    }


    // Handle selections

    onUploadedRulesPathSelectionChange(rulesPath: RulesPath[]) {
        this.selectedUploadedRulesPath = rulesPath;
        this.updateValue();
    }

    onServerPathRulesSelectionChange(rulesPath: RulesPath[]) {
        this.selectedServerPathRules = rulesPath;
        this.updateValue();
    }

    //

    /**
    * Updates 'NgModel' value when select or unselect events occur
    */
    updateValue(): void {
        let selectedRulesPath = []
            .concat(this.selectedUploadedRulesPath)
            .concat(this.selectedServerPathRules)
            .filter((rulesPath: RulesPath) => {
                return this.rulesPath.some(r => r.id == rulesPath.id);
            });

        // Delete 'selected' property 
        this.value = selectedRulesPath.map(({ selected, expanded, ...item }) => {
            return item;
        });

        // Change Model (NgForm)        
        this._onChange(this.value);

        // // Emit event
        this.onSelectionChange.emit(this.value);
    }

    //

    /**
     * Unselect RulesPath
     */
    unselect(rulesPath: RulesPath[]) {
        this.selectedUploadedRulesPath = this.selectedUploadedRulesPath.filter(p => {
            return !rulesPath.some(r => r.id == p.id);
        });
        this.selectedServerPathRules = this.selectedServerPathRules.filter(p => {
            return !rulesPath.some(r => r.id == p.id);
        });
        this.updateValue();
    }


}
