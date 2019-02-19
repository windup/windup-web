import {Component, OnInit, ViewChild, OnChanges, SimpleChanges, OnDestroy} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {FormComponent} from "../shared/form.component";
import {MigrationPathService} from "./migration-path.service";
import {AnalysisContextService} from "./analysis-context.service";
import {ConfigurationOption} from "../model/configuration-option.model";
import {ConfigurationOptionsService} from "../configuration/configuration-options.service";
import {IsDirty} from "../shared/is-dirty.interface";
import {Observable, forkJoin} from "rxjs";
import {PackageRegistryService} from "./package-registry.service";
import {AnalysisContext, Package, MigrationPath, MigrationProject, AdvancedOption, RegisteredApplication, RulesPath, PackageMetadata} from "../generated/windup-services";
import {RouteHistoryService} from "../core/routing/route-history.service";
import {Subscription} from "rxjs";
import {FlattenedRouteData, RouteFlattenerService} from "../core/routing/route-flattener.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {RegisteredApplicationService} from "../registered-application/registered-application.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {WINDUP_WEB} from "../app.module";
import {DialogService} from "../shared/dialog/dialog.service";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {TreeData} from "../shared/js-tree-angular-wrapper.component";
import {filter} from "rxjs/operators";
import Arrays = utils.Arrays;

@Component({
    templateUrl: './analysis-context-form.component.html',
    styleUrls: ['analysis-context-form.component.scss']
})
export class AnalysisContextFormComponent extends FormComponent
    implements OnInit, OnDestroy, IsDirty
{
    @ViewChild(NgForm)
    private analysisContextForm: NgForm;

    private _dirty: boolean = null;

    analysisContext: AnalysisContext;
    project: MigrationProject;

    availableApps: RegisteredApplication[];

    /**
     * These two variables exist because we need for the item in the array not to just be a literal.
     * Workaround for JavaScript issues not able to iterate and modify a simple array of literals within a form easily.
     * See also: http://stackoverflow.com/questions/33346677/angular2-ngmodel-against-ngfor-variables
     */
    includePackages: Package[];
    excludePackages: Package[];
    hideUnfinishedFeatures: boolean = WINDUP_WEB.config.hideUnfinishedFeatures;

    packageSelection: any = {};

    private transformationPaths: MigrationPath[] = [
        {
            "id": 101,
            "name": "Migration to JBoss EAP 7",
            "source": null,
            "target": {
                "id": 4,
                "version": 0,
                "name": "eap",
                "versionRange": "[7]"
            }
        },
        {
            "id": 100,
            "name": "Migration to JBoss EAP 6",
            "source": null,
            "target": {
                "id": 3,
                "version": 0,
                "name": "eap",
                "versionRange": "[6]"
            }
        },
        {
            "id": 90,
            "name": "Cloud readiness only",
            "source": null,
            "target": null
        }
    ];

    packageTree: Package[] = [];

    packageTreeLoaded: boolean = false;

    configurationOptions: ConfigurationOption[] = [];

    private _migrationPathsObservable: Observable<MigrationPath[]>;

    private _transformationPaths: MigrationPath[];

    private addCloudTargets: boolean;
    private routerSubscription: Subscription;

    isInWizard: boolean;
    action: Action;

    disableCloudReadiness = false;

    saveInProgress = false;

    is3rdPartyPackagesVisible = false;
    isTreeReloadComplete = true;

    static DEFAULT_MIGRATION_PATH: MigrationPath = <MigrationPath>{ id: 101 };
    static CLOUD_READINESS_PATH_ID: number = 90;
    @ViewChild('cancelDialog')
    readonly cancelDialog: ConfirmationModalComponent;
    @ViewChild('confirmDialog')
    readonly confirmDialog: ConfirmationModalComponent;

    private flatRouteData: FlattenedRouteData;

    constructor(private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _migrationProjectService: MigrationProjectService,
                private _migrationPathService: MigrationPathService,
                private _analysisContextService: AnalysisContextService,
                private _appService: RegisteredApplicationService,
                private _configurationOptionsService: ConfigurationOptionsService,
                private _packageRegistryService: PackageRegistryService,
                private _routeHistoryService: RouteHistoryService,
                private _routeFlattener: RouteFlattenerService,
                private _windupExecutionService: WindupExecutionService,
                private _notificationService: NotificationService,
                private _registeredApplicationService: RegisteredApplicationService,
                private _dialogService: DialogService
            ) {
        super();
        this.includePackages = [];
        this.excludePackages = [];

        this.initializeAnalysisContext();


        this.routerSubscription = this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            this.flatRouteData = flatRouteData;

            if (flatRouteData.data['project']) {
                let project = flatRouteData.data['project'];

                // Load the apps of this project.
                this._appService.getApplicationsByProjectID(project.id).subscribe(apps => {
                    this.availableApps = apps;

                    // Reload the App from the service to ensure fresh data
                    this._migrationProjectService.get(project.id).subscribe(loadedProject => {
                        this.project = loadedProject;
                        if (project.defaultAnalysisContextId == null) {
                            this.initializeAnalysisContext();
                            this.analysisContext.applications = apps.slice();

                            this.loadPackageMetadata(false);
                        } else {
                            this._analysisContextService.get(project.defaultAnalysisContextId)
                                .subscribe(context => {
                                    this.analysisContext = context;
                                    if (this.analysisContext.migrationPath == null)
                                        this.analysisContext.migrationPath = AnalysisContextFormComponent.DEFAULT_MIGRATION_PATH;

                                    if (this.isInWizard) {
                                        this.analysisContext.applications = apps.slice();
                                    }

                                    this.packageSelection.includePackages = this.analysisContext.includePackages;
                                    this.packageSelection.excludePackages = this.analysisContext.excludePackages;

                                    let contains3dPartyPackagesIncludedInPreviousAnalysis = false;
                                    for (let i = 0; i < this.analysisContext.includePackages.length; i++) {
                                        if (this.analysisContext.includePackages[i].known) {
                                            contains3dPartyPackagesIncludedInPreviousAnalysis = true;
                                            break;
                                        }
                                    }
                                    this.loadPackageMetadata(contains3dPartyPackagesIncludedInPreviousAnalysis);
                                });
                        }
                    });
                });
            }

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
        });
    }

    ngOnInit() {
        this.saveInProgress = false;

        this._configurationOptionsService.getAll().subscribe((options: ConfigurationOption[]) => {
            this.configurationOptions = options;
        });

        this.cancelDialog.confirmed.subscribe(() => {
            this.cleanseAfterDialogConfirm();
        });

        this.confirmDialog.confirmed.subscribe(() => {
            this.saveConfiguration();
        });

    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
        this.cancelDialog.confirmed.unsubscribe();
        this.confirmDialog.confirmed.unsubscribe();
    }

    // Apps selection checkboxes
    static getDefaultAnalysisContext() {
        let analysisContext = <AnalysisContext>{};
        analysisContext.migrationPath = AnalysisContextFormComponent.DEFAULT_MIGRATION_PATH;
        analysisContext.advancedOptions = [];
        analysisContext.includePackages = [];
        analysisContext.excludePackages = [];
        analysisContext.rulesPaths = [];
        analysisContext.applications = [];
        analysisContext.generateStaticReports = true;

        return analysisContext;
    }

    private initializeAnalysisContext() {
        let analysisContext = this.analysisContext;

        if (analysisContext == null) {
            analysisContext = AnalysisContextFormComponent.getDefaultAnalysisContext();
        } else {
            // For the migration path, store the id only.
            if (analysisContext.migrationPath) {
                analysisContext.migrationPath = <MigrationPath>{ id: analysisContext.migrationPath.id };
            } else {
                analysisContext.migrationPath = AnalysisContextFormComponent.DEFAULT_MIGRATION_PATH;
            }

            if (analysisContext.rulesPaths == null)
                analysisContext.rulesPaths = [];
        }

        this.analysisContext = analysisContext;
    }

    private loadPackageMetadata(view3rdPartyPackages) {
        let registeredPackagesObservables = this.project.applications.map(app => {
            return this._registeredApplicationService.waitUntilPackagesAreResolved(app);
        });

        /*
         * TODO: Find out how to continuously update data with new information. (If it is worth it)
         * (only huge issue is with same packages possibly having different Ids since they come from different apps)
         *
         * Idea is following:
         *  Make a request to all applications to get PackageMetadata. Filter out finished ones and build package tree from them.
         *  Fire new event on subject.
         *  Make additional requests to all not yet finished applications (with some delay).
         *  Every time some application finishes, add data to package tree.
         *  Repeat until all packages are resolved :)
         *
         *  Basically pretty much everything is done now, only thing to do would be replacing forkJoin with forEach
         *    and subscribing to every single observable separately.
         *
         *  Another thing to solve would be how to inform user about packages being only partial data

        let countRemainingPackagesToBeResolved = registeredPackagesObservables.length;

        let packageTree = [];

        registeredPackagesObservables.forEach(observable => {
            observable.subscribe(packageMetadata => {
                countRemainingPackagesToBeResolved--;

                packageTree = this._packageRegistryService.mergePackageRoots([ ... packageTree, ... packageMetadata.packageTree ]);
            });
        });
        */

        forkJoin(registeredPackagesObservables).subscribe((packageMetadataArray: PackageMetadata[]) => {
            let arrayOfRoots = [].concat(...packageMetadataArray.map((singlePackageMetadata) => singlePackageMetadata.packageTree));
            let filteredRoots = [];
            if (!view3rdPartyPackages)
            {
                filteredRoots = arrayOfRoots.filter(packageTree => !packageTree.known);
            }
            else
            {
                filteredRoots = arrayOfRoots;
            }
            let mergedRoots = this._packageRegistryService.mergePackageRoots(filteredRoots);
            mergedRoots.forEach(singleRoot => this._packageRegistryService.putHierarchy(singleRoot));

            this.packageTree = mergedRoots;
            this.packageTreeLoaded = true;

            if (this.analysisContext != null) {
                if (this.analysisContext.includePackages == null || this.analysisContext.includePackages.length == 0) {
                    this.includePackages = [];
                } else {
                    this.includePackages = this.analysisContext.includePackages.map(node => this._packageRegistryService.get(node.id));
                }

                if (this.analysisContext.excludePackages == null || this.analysisContext.excludePackages.length == 0) {
                    this.analysisContext.excludePackages = [];
                } else {
                    this.analysisContext.excludePackages = this.analysisContext.excludePackages.map(node => this._packageRegistryService.get(node.id));
                }
            }

            this.includePackages = this.analysisContext.includePackages;
            this.excludePackages = this.analysisContext.excludePackages;

            this.packageSelection.includePackages = this.analysisContext.includePackages;
            this.packageSelection.excludePackages = this.analysisContext.excludePackages;

            this.is3rdPartyPackagesVisible = view3rdPartyPackages;
            this.isTreeReloadComplete = true;
        });


    }

    get migrationPaths() {
        if (this._migrationPathsObservable == null) {
            this._migrationPathsObservable = this._migrationPathService.getAll();
        }
        return this._migrationPathsObservable;
    }

    get dirty(): boolean {
        if (this._dirty != null) {
            return this._dirty;
        }

        // Q: Why is this here? A: Because why returning something what could be Undefined?
        if (this.analysisContextForm) {
            return this.analysisContextForm.dirty;
        }
        return false;
    }

    advancedOptionsChanged(advancedOptions: AdvancedOption[]) {
        this._dirty = true;
    }

    includedPackagesChanged(selectedNodes: Package[]) {
        this.analysisContext.includePackages = selectedNodes;
        this.includePackages = selectedNodes;
    }

    excludedPackagesChanged(selectedNodes: Package[]) {
        this.analysisContext.excludePackages = selectedNodes;
        this.excludePackages = selectedNodes;
    }

    onSelectedPackagesChanged(event) {
        this.analysisContext.includePackages = event.includePackages;
        this.analysisContext.excludePackages = event.excludePackages;
    }

    onViewThirdPackagesChange(event: boolean) {
        if (event) {
            this.view3rdPartyPackages();
        } else {
            this.hide3rdPartyPackages();
        }
    }

    onSubmit() {
        if (!this.packageTreeLoaded) {
            this.confirmDialog.title = 'Package identification is not complete';
            this.confirmDialog.body = `Do you want to save the analysis without selecting packages?`;
            this.confirmDialog.show();
        } else {
            this.saveConfiguration();
        }
    }

    view3rdPartyPackages()
    {
        this.isTreeReloadComplete = false;
        this.loadPackageMetadata(true);
        return false;
    }

    hide3rdPartyPackages()
    {
        this.isTreeReloadComplete = false;
        this.loadPackageMetadata(false);
        return false;
    }

    protected saveConfiguration() {
        // HACK - this readds all of the apps in case the weird bug strikes that causes some not to be selected
        if (this.isInWizard && !this.analysisContext.applications || this.analysisContext.applications.length == 0) {
            this.analysisContext.applications = this.availableApps.slice();
        }

        this.saveInProgress = true;

        this._analysisContextService.saveAsDefault(this.analysisContext, this.project).subscribe(
            updatedContext => {
                this._dirty = false;
                this.onSuccess(updatedContext);
            },
            error => {
                this.handleError(error);
            }
        );
    }

    onSuccess(analysisContext: AnalysisContext) {

        this.analysisContext = analysisContext; // update context

        for (let node of this.analysisContext.includePackages) {
            console.log(node.fullName);
        }

        if (this.action === Action.SaveAndRun) {
            this._windupExecutionService.execute(analysisContext, this.project)
                .subscribe(execution => {
                    this.saveInProgress = false;
                    this._router.navigate([`/projects/${this.project.id}`]);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });
        } else if (this.isInWizard) {
            this.saveInProgress = false;
            this._router.navigate([`/projects/${this.project.id}`]);
        } else {
            this.saveInProgress = false;
            /**
             * As requested, saving configuration doesn't trigger navigation anymore.
             * It also doesn't create any notification, which is IMHO inherently wrong, but also requested.
             */
        }
    }

    // Button handlers
    saveAndRun() {
        this.action = Action.SaveAndRun;
    }

    save() {
        this.action = Action.Save;
    }

    cancel() {
        if (this.isInWizard) {
            let currentStep = this.flatRouteData.data.currentStep;

            if (currentStep > 0 && currentStep < this.flatRouteData.data.steps.length) {
                currentStep -= 1;

                let url = this.flatRouteData.data.wizardRootUrl + '/' + this.flatRouteData.data.steps[currentStep].path;
                url = url.replace(':projectId', this.project.id.toString());

                this._router.navigate([url]);
            }
        } else {
            this.navigateBack();
        }
    }

    navigateBack() {
        let projectPageRoute = `/projects/${this.project.id}`;
        this._routeHistoryService.navigateBackOrToRoute(projectPageRoute);
    }

    cleanseAfterDialogConfirm()
    {
        this._dirty = false;
    }



    rulesPathsChanged(rulesPaths: RulesPath[]) {
        this.analysisContext.rulesPaths = rulesPaths;
    }

    isActiveRulesPaths():boolean {
        return this.analysisContext.rulesPaths.filter(rulesPath => rulesPath.rulesPathType == 'USER_PROVIDED').length > 0;
    }

    onMigrationPathChange() {
        if (this.analysisContext.migrationPath.id === AnalysisContextFormComponent.CLOUD_READINESS_PATH_ID) {
            this.analysisContext.cloudTargetsIncluded = true;
            this.disableCloudReadiness = true;
        } else {
            this.disableCloudReadiness = false;
        }
    }
}

enum Action {
    Save = 0,
    SaveAndRun = 1
}

