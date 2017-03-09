import {Component, OnInit, ViewChild, OnChanges, SimpleChanges} from "@angular/core";
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
import {AnalysisContext, Package, MigrationPath, AdvancedOption, RulesPath, PackageMetadata} from "windup-services";
import {RouteHistoryService} from "../core/routing/route-history.service";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {WindupService} from "../services/windup.service";
import {NotificationService} from "../core/notification/notification.service";
import {utils} from "../shared/utils";
import {RegisteredApplicationService} from "../registered-application/registered-application.service";
import {RegisteredApplication} from "windup-services";
import {MigrationProject} from "windup-services";
import {MigrationProjectService} from "../project/migration-project.service";

@Component({
    templateUrl: './analysis-context-form.component.html'
})
export class AnalysisContextFormComponent extends FormComponent
    implements OnInit, IsDirty
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
    packageTree: Package[] = [];

    configurationOptions: ConfigurationOption[] = [];

    private _migrationPathsObservable: Observable<MigrationPath[]>;
    private routerSubscription: Subscription;

    isInWizard: boolean;
    action: Action;

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
                private _windupService: WindupService,
                private _notificationService: NotificationService
    ) {
        super();
        this.includePackages = [];
        this.excludePackages = [];

        this.initializeAnalysisContext();
    }

    ngOnInit() {
        this._configurationOptionsService.getAll().subscribe((options:ConfigurationOption[]) => {
            this.configurationOptions = options;
        });

        ///this._appService.getApplications().subscribe( apps => this.updateAvailableApps(apps) );

        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            if (flatRouteData.data['project']) {
                let project = flatRouteData.data['project'];

                console.log("router event NavigationEnd, this.analysisContext: ", this.analysisContext, project, flatRouteData);///

                // Reload the App from the service to ensure fresh data
                this._migrationProjectService.get(project.id).subscribe(loadedProject => {
                    this.project = loadedProject;

                    this.loadProjectRelations();
                });

                // Load the apps of this project.
                this._appService.getApplicationsByProjectID(project.id).subscribe(apps => {
                    this.availableApps = apps;
                    console.log("Loaded availableApps", apps);
                });

                this.initializeAnalysisContext();
                this.loadPackageMetadata();
            }
            console.log("router event NavigationEnd, after: ", this.analysisContext, this.project);///

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
        });
    }

    private loadProjectRelations() {
        this._migrationProjectService.getDefaultAnalysisContext(this.project.id).subscribe(ctx => this.analysisContext = ctx);
    }

    appsValueCallback = (app: RegisteredApplication) => ""+app.id;
    appsLabelCallback = (app: RegisteredApplication) => app.title;
    equalsCallback = (a1: RegisteredApplication, a2: RegisteredApplication) => a1.id === a2.id;


    static getDefaultAnalysisContext() {
        let analysisContext = <AnalysisContext>{};
        analysisContext.migrationPath = <MigrationPath>{id: 0};
        analysisContext.advancedOptions = [];
        analysisContext.includePackages = [];
        analysisContext.excludePackages = [];
        analysisContext.rulesPaths = [];
        analysisContext.applications = [];

        return analysisContext;
    }

    private initializeAnalysisContext() {
        console.log("initializeAnalysisContext(), this.analysisContext: ", this.analysisContext);
        let analysisContext = this.analysisContext;

        if (analysisContext == null) {
            analysisContext = AnalysisContextFormComponent.getDefaultAnalysisContext();
        } else {
            // for migration path, store the id only
            if (analysisContext.migrationPath) {
                analysisContext.migrationPath = <MigrationPath>{id: analysisContext.migrationPath.id};
            } else {
                analysisContext.migrationPath = <MigrationPath>{id: 0};
            }

            if (analysisContext.rulesPaths == null)
                analysisContext.rulesPaths = [];
        }

        this.analysisContext = analysisContext;
    }

    private loadPackageMetadata() {
        /*
        TODO: Fix this later
        this._applicationGroupService.getPackageMetadata(null).subscribe(
            (packageMetadata: PackageMetadata) => {
                if (packageMetadata.scanStatus === "COMPLETE") {
                    packageMetadata.packageTree.forEach(node => {
                        this._packageRegistryService.putHierarchy(node);
                    });
                }

                this.packageTree = packageMetadata.packageTree;

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
            }
        );
        */
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

        return this.analysisContextForm.dirty;
    }

    advancedOptionsChanged(advancedOptions: AdvancedOption[]) {
        this._dirty = true;
    }

    onSubmit() {
        // Store the Analysis Context
        let update = this.analysisContext.id != null;
        let service = update ? this._analysisContextService.update : this._analysisContextService.create;

        console.log(`Updating/creating analysis context #${this.analysisContext.id}, migrPath: ${this.analysisContext.migrationPath.id}`);
        let contextObservable: Observable<AnalysisContext> = service.call(this._analysisContextService, this.analysisContext, this.project);

        contextObservable.subscribe(
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
        if (this.action === Action.SaveAndRun) {
            this._windupService.executeWindupWithAnalysisContext(analysisContext.id)
                .subscribe(execution => {
                    this._notificationService.success('Windup execution has started');
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
        if (!this.isInWizard) {
            this.navigateBack();
        } else {
            this._router.navigate(['/']);
        }
    }

    navigateBack() {
        let projectPageRoute = `/projects/${this.project.id}`;
        this._routeHistoryService.navigateBackOrToRoute(projectPageRoute);
    }

    rulesPathsChanged(rulesPaths:RulesPath[]) {
        this.analysisContext.rulesPaths = rulesPaths;
    }

}

enum Action {
    Save = 0,
    SaveAndRun = 1
}
