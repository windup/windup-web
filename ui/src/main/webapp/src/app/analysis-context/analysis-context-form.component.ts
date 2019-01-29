import {Component, OnInit, ViewChild, OnChanges, SimpleChanges, OnDestroy} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {FormComponent} from "../shared/form.component";
import {MigrationPathService} from "./migration-path.service";
import {AnalysisContextService} from "./analysis-context.service";
import {ConfigurationOption} from "../model/configuration-option.model";
import {ConfigurationOptionsService} from "../configuration/configuration-options.service";
import {IsDirty} from "../shared/is-dirty.interface";
import {Observable} from "rxjs/Observable";
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
import {forkJoin} from "rxjs/observable/forkJoin";
import {WINDUP_WEB} from "../app.module";
import {DialogService} from "../shared/dialog/dialog.service";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {TreeData} from "../shared/js-tree-angular-wrapper.component";
import {Path, CardPath, DropdownPath} from "./transformation-paths.component";

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

    static JBOSS_EAP: number = 102; // Random number    

    static JBOSS_EAP_7: number = 101;
    static JBOSS_EAP_6: number = 100;
    static CONTAINERIZATION: number = 90;
    static LINUX: number = 91; // Random number
    static OPEN_JDK: number = 92; // Random number

    selectedPaths: Path[];
    cardPaths: CardPath[] = [
        {
            id: AnalysisContextFormComponent.JBOSS_EAP,
            label: 'Application server migration to EAP',
            icon: 'pficon pficon-enterprise',
            children: [
                {
                    id: AnalysisContextFormComponent.JBOSS_EAP_7,
                    label: 'JBoss EAP 7'
                },
                {
                    id: AnalysisContextFormComponent.JBOSS_EAP_6,
                    label: 'JBoss EAP 6'
                }
            ],
        },
        {
            id: AnalysisContextFormComponent.CONTAINERIZATION,
            label: 'Containerization',
            icon: 'fa fa-cube'
        },
        {
            id: AnalysisContextFormComponent.LINUX,
            label: 'Move to Linux',
            icon: 'fa fa-linux'
        },
        {
            id: AnalysisContextFormComponent.OPEN_JDK,
            label: 'OpenJDK',
            icon: 'fa fa-coffee'
        }
    ];

    // private transformationPaths: MigrationPath[] = [
    //     {
    //         "id": 101,
    //         "name": "Migration to JBoss EAP 7",
    //         "source": null,
    //         "target": {
    //             "id": 4,
    //             "version": 0,
    //             "name": "eap",
    //             "versionRange": "[7]"
    //         }
    //     },
    //     {
    //         "id": 100,
    //         "name": "Migration to JBoss EAP 6",
    //         "source": null,
    //         "target": {
    //             "id": 3,
    //             "version": 0,
    //             "name": "eap",
    //             "versionRange": "[6]"
    //         }
    //     },
    //     {
    //         "id": 90,
    //         "name": "Cloud readiness only",
    //         "source": null,
    //         "target": null
    //     }
    // ];

    packageTree: Package[] = [];

    packageTreeLoaded: boolean = false;

    configurationOptions: ConfigurationOption[] = [];

    private _migrationPathsObservable: Observable<MigrationPath[]>;

    // private _transformationPaths: MigrationPath[];

    private addCloudTargets: boolean;
    private routerSubscription: Subscription;

    isInWizard: boolean;
    action: Action;

    disableCloudReadiness = false;

    saveInProgress = false;

    static DEFAULT_MIGRATION_PATH: MigrationPath = <MigrationPath>{ id: AnalysisContextFormComponent.JBOSS_EAP_7 };
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


    }

    ngOnInit() {
        this.saveInProgress = false;

        this._configurationOptionsService.getAll().subscribe((options: ConfigurationOption[]) => {
            this.configurationOptions = options;
        });

        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
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
                        } else {
                            this._analysisContextService.get(project.defaultAnalysisContextId)
                                .subscribe(context => {
                                    this.analysisContext = context;
                                    if (this.analysisContext.migrationPath == null)
                                        this.analysisContext.migrationPath = AnalysisContextFormComponent.DEFAULT_MIGRATION_PATH;

                                    if (this.isInWizard) {
                                        this.analysisContext.applications = apps.slice();
                                    }
                                    
                                    // Load values to card paths
                                    const selectedPaths: Path[] = [];
                                    if (this.analysisContext.migrationPath.id == AnalysisContextFormComponent.JBOSS_EAP_6) {
                                        selectedPaths.push({ id: AnalysisContextFormComponent.JBOSS_EAP_6 });
                                    }
                                    if (this.analysisContext.migrationPath.id == AnalysisContextFormComponent.JBOSS_EAP_7) {
                                        selectedPaths.push({ id: AnalysisContextFormComponent.JBOSS_EAP_7 });
                                    }
                                    if (this.analysisContext.cloudTargetsIncluded) {
                                        selectedPaths.push({ id: AnalysisContextFormComponent.CONTAINERIZATION });
                                    }
                                    if (this.analysisContext.linuxTargetsIncluded) {
                                        selectedPaths.push({ id: AnalysisContextFormComponent.LINUX });
                                    }
                                    if (this.analysisContext.openJdkTargetsIncluded) {
                                        selectedPaths.push({ id: AnalysisContextFormComponent.OPEN_JDK });
                                    }
                                    this.selectedPaths = selectedPaths;

                                });
                        }
                        this.loadPackageMetadata();
                    });
                });
            }

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
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

    private loadPackageMetadata() {
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
            let mergedRoots = this._packageRegistryService.mergePackageRoots(arrayOfRoots);
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

    onSubmit() {
        if (!this.packageTreeLoaded) {
            this.confirmDialog.title = 'Package identification is not complete';
            this.confirmDialog.body = `Do you want to save the analysis without selecting packages?`;
            this.confirmDialog.show();
        } else {
            this.saveConfiguration();
        }
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
        if (this.selectedPaths && this.selectedPaths.length > 0) {
            const eap6Index = this.indexOfPathId(this.selectedPaths, AnalysisContextFormComponent.JBOSS_EAP_6);
            const eap7Index = this.indexOfPathId(this.selectedPaths, AnalysisContextFormComponent.JBOSS_EAP_7)
            const containerizationIndex = this.indexOfPathId(this.selectedPaths, AnalysisContextFormComponent.CONTAINERIZATION)
            const linuxIndex = this.indexOfPathId(this.selectedPaths, AnalysisContextFormComponent.LINUX)
            const openJdkIndex = this.indexOfPathId(this.selectedPaths, AnalysisContextFormComponent.OPEN_JDK)

            if (eap6Index != -1 || eap7Index != -1) {
                this.analysisContext.migrationPath.id = this.selectedPaths[eap6Index != -1 ? eap6Index : eap7Index].id;
            } else {
                this.analysisContext.migrationPath.id = AnalysisContextFormComponent.CLOUD_READINESS_PATH_ID;
            }

            this.analysisContext.cloudTargetsIncluded = containerizationIndex != -1;
            this.analysisContext.linuxTargetsIncluded = linuxIndex != -1;
            this.analysisContext.openJdkTargetsIncluded = openJdkIndex != -1;
        }
    }

    private indexOfPathId(paths: Path[], id: number): number {
        for (let index = 0; index < paths.length; index++) {
            const path = paths[index];
            if (path.id == id) {
                return index;
            }
        }
        return -1;
    }
}

enum Action {
    Save = 0,
    SaveAndRun = 1
}
