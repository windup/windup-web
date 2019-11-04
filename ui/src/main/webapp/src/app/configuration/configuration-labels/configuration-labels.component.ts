import {AfterViewInit, Component, OnInit, ViewChild, ElementRef} from "@angular/core";
import {ConfigurationService} from "../configuration.service";
import {Configuration, LabelProviderEntity, LabelsPath, Technology} from "../../generated/windup-services";
import {LabelService} from "../label.service";
import {AddLabelsPathModalComponent, ConfigurationEvent} from "../../shared/add-labels-path-modal/add-labels-path-modal.component";
import {ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../core/notification/notification.service";
import {utils} from "../../shared/utils";
import {ConfirmationModalComponent} from "../../shared/dialog/confirmation-modal.component";
import {OrderDirection, SortingService} from "../../shared/sort/sorting.service";
import Arrays = utils.Arrays;
import {FilterConfiguration} from "../../shared/toolbar/toolbar.component";
import {DomSanitizer} from '@angular/platform-browser';
import { FilterOption } from "../../shared/filter/text-filter.component";

@Component({
    templateUrl: './configuration-labels.component.html',
    styleUrls: ['./configuration-labels.component.scss']
})
export class ConfigurationLabelsComponent implements OnInit, AfterViewInit {

    forceReloadAttempted: boolean = false;
    rescanInProgress: boolean = false;

    errorMessage: string;
    configuration: Configuration;

    labelProvidersByPath: Map<LabelsPath, LabelProviderEntity[]> = new Map<LabelsPath, LabelProviderEntity[]>();

    @ViewChild(AddLabelsPathModalComponent)
    addLabelsModalComponent: AddLabelsPathModalComponent;

    @ViewChild('removeLabelsConfirmationModal')
    removeLabelsConfirmationModal: ConfirmationModalComponent;

    sort = {
        sortOptions: [
            { name: 'Name', field: 'providerID' },
            { name: 'Number of labels', field: (provider: LabelProviderEntity) => provider.labels ? provider.labels.length : 0 },
        ],
        selectedOption: { name: 'Name', field: 'providerID' },
        direction: OrderDirection.ASC
    };

    filter: FilterConfiguration = {
        filterableAttributes: ['name'],
        selectedAttribute: 'name',
        // filterOptions: [],
        filterCallback: null,
        selectedFilters: [],
        countFilteredItems: 0,
        getLabel: filter => `${filter.name}: ${filter.value}`
    };

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _configurationService: ConfigurationService,
        private _labelService: LabelService,
        private _notificationService: NotificationService,
        private _sortingService: SortingService<LabelProviderEntity>,
        private _element: ElementRef,
        private _sanitizer: DomSanitizer
    ) {

    }

    ngOnInit(): void {
        this._activatedRoute.data.subscribe((data: {configuration: Configuration}) => {
            this.configuration = data.configuration;
            this.loadProviders();
        });
    }

    ngAfterViewInit(): void {
        this.removeLabelsConfirmationModal.confirmed.subscribe(labelPath => this.removeLabelsPath(labelPath));
    }

    loadProviders() {
        if (!this.configuration || this.configuration.labelsPaths == null)
            return;

        this.loadLabelProviderDetails();
    }

    forceReload() {
        this.forceReloadAttempted = true;
        this.rescanInProgress = true;
        this._configurationService.reloadConfigration(this.configuration.id).subscribe(() => {
            this.rescanInProgress = false;
            this.loadLabelProviderDetails()
        });
    }

    loadLabelProviderDetails() {
        this.configuration.labelsPaths.forEach((labelsPath) => {
            this._labelService.getByLabelsPath(labelsPath).subscribe(
                (labelProviders:LabelProviderEntity[]) => {
                    this.labelProvidersByPath.set(labelsPath, labelProviders);
                    if (!this.forceReloadAttempted && labelsPath.labelsPathType == "SYSTEM_PROVIDED" && labelProviders.length == 0) // needs to be loaded
                        this.forceReload();
                    this.updateFilters();
                },
                error => this.errorMessage = <any>error
            );
        });
    }

    get sortedPaths() {
        if (!this.configuration || this.configuration.labelsPaths == null)
            return null;

        return this.configuration.labelsPaths.sort((a, b) => {
            if (a.labelsPathType == b.labelsPathType)
                return 0;
            else if (a.labelsPathType == "SYSTEM_PROVIDED" && b.labelsPathType == "USER_PROVIDED")
                return 1;
            else if (a.labelsPathType == "USER_PROVIDED" && b.labelsPathType == "SYSTEM_PROVIDED")
                return -1;
        });
    }

    labelsShortPath(labelPath: LabelsPath): string {
        if (labelPath.labelsPathType == "SYSTEM_PROVIDED")
            return "<System Labels>";
        else if (labelPath.shortPath)
            return labelPath.shortPath;
        else
            return labelPath.path;
    }

    areLabelsLoaded(labelsPath: LabelsPath) {
        return this.labelProvidersByPath.has(labelsPath);
    }

    hasFileBasedProviders(labelsPath: LabelsPath) {
        let providers = this.labelProvidersByPath.get(labelsPath);
        if (!providers)
            return false;

        let foundLabels = false;
        providers.forEach((provider) => {
            if (this.isFileBasedProvider(provider))
                foundLabels = true;
        });
        return foundLabels;
    }

    isFileBasedProvider(provider: LabelProviderEntity) {
        switch (provider.labelProviderType) {
            case "XML":
                return true;
            default:
                return false;
        }
    }

    displayAddLabelsPathForm() {
        this.addLabelsModalComponent.show();
    }

    configurationUpdated(event: ConfigurationEvent) {
        this.configuration = event.configuration;
        this.loadProviders();
    }

    removeLabelsPath(labelsPath: LabelsPath) {
        this._labelService.deleteLabel(labelsPath).subscribe(() => {
            this._notificationService.success('Label was deleted');

            this._configurationService.get().subscribe(newConfig => {
                this.configuration = newConfig;
                this.loadProviders();
            });
        });
    }

    reloadConfiguration() {
        this._configurationService.reloadConfigration(this.configuration.id).subscribe(
            configuration => {
                this.configuration = configuration;
                this.loadProviders();

                this._notificationService.success('Configuration was reloaded');
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    confirmRemoveLabels(labelsPath: LabelsPath) {
        this.removeLabelsConfirmationModal.body = `Are you sure you want to remove the labels from '${labelsPath.path}'?`;
        this.removeLabelsConfirmationModal.data = labelsPath;
        this.removeLabelsConfirmationModal.show();
    }        

    removeFilters() {
        this.filter.selectedFilters = [];
        this.filter = Object.assign({}, this.filter);
    }

    updateFilters() {
        this.filter.countFilteredItems = this.configuration.labelsPaths.map(path => this.getFilteredLabelProvidersByPath(path))
            .reduce((sum, providers) => sum + providers.length, 0);

        if (this.filter.selectedAttribute == 'name') {
            this.filter.filterCallback = (filter: FilterOption, item: LabelProviderEntity) => {
                const regexp = new RegExp(filter.value, 'i');
                if (item.labelsPath.shortPath) {
                    return item.labelsPath.shortPath.match(regexp) !== null;
                } else {
                    return item.origin.match(filter.value) !== null;
                }
            }
        }

        this.filter = Object.assign({}, this.filter);
    }

    getLabelProvidersByPath(path: LabelsPath) {
        const labelProviders = this.labelProvidersByPath.get(path) || [];
        return this._sortingService.sort(labelProviders);
    }

    getFilteredLabelProvidersByPath(path: LabelsPath) {
        let filteredLabelProviders = this.labelProvidersByPath.get(path) || [];
        this.filter.selectedFilters.forEach(filter => {
            filteredLabelProviders = filteredLabelProviders.filter((provider) => {
                return filter.callback(provider);
            });
        });

        return this._sortingService.sort(filteredLabelProviders);
    }

    updateSort() {
        this._sortingService.orderBy(this.sort.selectedOption.field, this.sort.direction);
    }

    isFilterActive() {
        return this.filter.selectedFilters.length > 0;
    }

}
