import { Component, ViewChild, OnInit, forwardRef, Output, EventEmitter } from '@angular/core';
import { LabelsPath, Configuration, MigrationProject } from '../../generated/windup-services';
import { ConfigurationService } from '../../configuration/configuration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationModalComponent } from '../../shared/dialog/confirmation-modal.component';
import { AddLabelsPathModalComponent } from '../../shared/add-labels-path-modal/add-labels-path-modal.component';
import { LabelService } from '../../configuration/label.service';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor, Validator, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouteFlattenerService } from '../../core/routing/route-flattener.service';
import { RoutedComponent } from '../../shared/routed.component';
import { NotificationService } from '../../core/notification/notification.service';

@Component({
    selector: 'wu-custom-labels',
    templateUrl: './custom-labels.component.html',
    styleUrls: ['./custom-labels.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CustomLabelsComponent),
        multi: true
    }, {
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => CustomLabelsComponent),
        multi: true,
    }]
})
export class CustomLabelsComponent extends RoutedComponent implements ControlValueAccessor, Validator, OnInit {

    @Output('onSelectionChange') onSelectionChange: EventEmitter<LabelsPath[]> = new EventEmitter();

    @ViewChild(AddLabelsPathModalComponent) addLabelsModalComponent: AddLabelsPathModalComponent;
    @ViewChild('removeLabelsConfirmationModal') removeLabelsConfirmationModal: ConfirmationModalComponent;

    project: MigrationProject;
    configuration: Configuration;

    labelsPath: LabelsPath[];
    uploadedLabelsPath: LabelsPath[];
    serverPathLabelsPath: LabelsPath[];

    selectedServerPathLabels: LabelsPath[] = [];
    selectedUploadedLabelsPath: LabelsPath[] = [];

    labelsPathForUnselect: LabelsPath[] = [];

    loading: boolean = false;

    // NgForm value
    value: LabelsPath[];

    private _onChange = (_: any) => { };
    private _onTouched = () => { };

    constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        private _labelService: LabelService,
        private _notificationService: NotificationService,
        private _configurationService: ConfigurationService
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    ngAfterViewInit(): void {
        this.removeLabelsConfirmationModal.confirmed.subscribe((labelPath: LabelsPath) => {
            this.removeLabelsPath(labelPath);
        });
    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe((data) => {
            const flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            this.project = flatRouteData.data['project'];

            this.configuration = data.configuration;
            this.loadCustomLabels();
        });
    }

    loadCustomLabels() {
        this.loading = true;
        this._configurationService.getCustomLabelsetPathsByConfigurationId(this.configuration.id).subscribe((labelsPath: LabelsPath[]) => {
            const splitLabelsPath = this.splitLabelsPath(labelsPath);

            this.labelsPath = labelsPath;
            this.uploadedLabelsPath = splitLabelsPath[0].sort(this.sortLabelsPath);
            this.serverPathLabelsPath = splitLabelsPath[1].sort(this.sortLabelsPath);

            this.loading = false;
            this.updateValue();
        });
    }

    /**
     * Splits an array into single 'file custom' labels and 'server path' custom labels
     */
    splitLabelsPath(labelsPath: LabelsPath[]) {
        const uploadedLabelsPath: LabelsPath[] = [];
        const serverPathLabelsPath: LabelsPath[] = [];

        labelsPath.forEach(labelPath => {
            if (this.isUploadedCustomLabel(labelPath)) {
                uploadedLabelsPath.push(labelPath);
            } else {
                serverPathLabelsPath.push(labelPath)
            }
        });

        return [uploadedLabelsPath, serverPathLabelsPath];
    }

    isUploadedCustomLabel(labelsPath: LabelsPath): boolean {
        return labelsPath.shortPath ? true : false;
    }


    // ControlValueAccessor interface implementations


    /**
     * 
     * Called to write data from the model to the view
     */
    writeValue(obj: any): void {
        if (obj) {
            const customLabels = obj.filter((labelsPath: LabelsPath) => {
                return labelsPath.labelsPathType !== 'SYSTEM_PROVIDED';
            });
            const splitLabelsPath = this.splitLabelsPath(customLabels);

            this.value = customLabels;
            this.selectedUploadedLabelsPath = splitLabelsPath[0];
            this.selectedServerPathLabels = splitLabelsPath[1];
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
     * Opens a modal for add new LabelsPath
     */
    displayAddLabelsPathModal() {
        this.addLabelsModalComponent.show();
    }

    /**
     * Opens a modal for confirm deletion of a LabelPath
     */
    displayRemoveLabelsConfirmationModal(labelsPath: LabelsPath) {
        console.log("Checking labels path " + labelsPath.path);
        this._labelService.checkIfUsedLabelsPath(labelsPath).subscribe(
            response => {
                if (response.valueOf())
                {
                    this._notificationService.warningToast(`The labels path '${labelsPath.path}' is used in an existing Queued or Running Analysis and cannot be removed.`);
                }
                else
                {
                    this.removeLabelsConfirmationModal.body = `Are you sure you want to remove the labels from '${labelsPath.path}'?`;
                    this.removeLabelsConfirmationModal.data = labelsPath;
                    this.removeLabelsConfirmationModal.show();
                }
            }
        );
    }

    removeLabelsPath(labelsPath: LabelsPath) {
        this._labelService.deleteLabel(labelsPath).subscribe(() => {
            this._notificationService.success('Label was deleted');

            this._configurationService.getByProjectId(this.project.id).subscribe(newConfig => {
                this.configuration = newConfig;
                this.loadCustomLabels();
            });
        });
    }


    // Handle selections

    onUploadedLabelsPathSelectionChange(labelsPath: LabelsPath[]) {
        this.selectedUploadedLabelsPath = labelsPath;
        this.updateValue();
    }

    onServerPathLabelsSelectionChange(labelsPath: LabelsPath[]) {
        this.selectedServerPathLabels = labelsPath;
        this.updateValue();
    }

    //

    /**
    * Updates 'NgModel' value when select or unselect events occur
    */
    updateValue(): void {
        let selectedLabelsPath = []
            .concat(this.selectedUploadedLabelsPath)
            .concat(this.selectedServerPathLabels)
            .filter((labelsPath: LabelsPath) => {
                return this.labelsPath.some(r => r.id == labelsPath.id);
            });

        const oldValue = this.value;
        // Delete 'selected' property 
        const newValue = selectedLabelsPath.map(({ selected, expanded, ...item }) => {
            return item;
        }).sort(this.sortLabelsPath);

        const oldIDs = (oldValue || []).map(elem => elem.id);
        const newIDs = (newValue || []).map(elem => elem.id);
        const valueChanged: boolean = (oldIDs.length != newIDs.length) || oldIDs.some(elem => !newIDs.includes(elem));
        
        if (valueChanged) {
            this.value = newValue;

            // Change Model (NgForm)
            this._onChange(this.value);

            // // Emit event
            this.onSelectionChange.emit(this.value);
        }
    }

    //

    /**
     * Unselect LabelsPath
     */
    unselect(labelsPath: LabelsPath[]) {
        this.loading = true;

        // Clean selection
        this.labelsPathForUnselect = [];

        this.selectedUploadedLabelsPath = this.selectedUploadedLabelsPath.filter(p => {
            return !labelsPath.some(r => r.id == p.id);
        });
        this.selectedServerPathLabels = this.selectedServerPathLabels.filter(p => {
            return !labelsPath.some(r => r.id == p.id);
        });
        this.updateValue();

        // For removing 'active' class on table
        setTimeout(() => {
            this.loading = false;
        });
    }


    private sortLabelsPath(a: LabelsPath, b: LabelsPath): number {
        if (a.shortPath && b.shortPath) {
            return a.shortPath.localeCompare(b.shortPath);
        } else if (a.path && b.path) {
            return a.path.localeCompare(b.path);
        } else {
            return 0;
        }
    }

}
