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
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {WindupExecutionService} from "../services/windup-execution.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {RegisteredApplicationService} from "../registered-application/registered-application.service";
import {MigrationProjectService} from "../project/migration-project.service";
import {forkJoin} from "rxjs/observable/forkJoin";
import {WINDUP_WEB} from "../app.module";

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

    static DEFAULT_MIGRATION_PATH: MigrationPath = <MigrationPath>{ id: 101 };
    static CLOUD_READINESS_PATH_ID: number = 90;


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
                private _registeredApplicationService: RegisteredApplicationService
            ) {
        super();
        this.includePackages = [];
        this.excludePackages = [];

        this.initializeAnalysisContext();
    }

    ngOnInit() {
        this._configurationOptionsService.getAll().subscribe((options: ConfigurationOption[]) => {
            this.configurationOptions = options;
        });

        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
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
                                });
                        }
                        this.loadPackageMetadata();
                    });
                });
            }

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
        });

       
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
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

    onSubmit() {
        // HACK - this readds all of the apps in case the weird bug strikes that causes some not to be selected
        if (this.isInWizard && !this.analysisContext.applications || this.analysisContext.applications.length == 0) {
            this.analysisContext.applications = this.availableApps.slice();
        }

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

        if (this.action === Action.SaveAndRun) {
            this._windupExecutionService.execute(analysisContext, this.project)
                .subscribe(execution => {
                    this._router.navigate([`/projects/${this.project.id}`]);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });
        } else if (this.isInWizard) {
            this._router.navigate([`/projects/${this.project.id}`]);
        } else {
            this.navigateBack();
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
        this.navigateBack();
    }

    navigateBack() {
        let projectPageRoute = `/projects/${this.project.id}`;
        this._routeHistoryService.navigateBackOrToRoute(projectPageRoute);
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

