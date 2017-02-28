import {Component, OnInit, ViewChild, OnChanges, SimpleChanges} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

import {FormComponent} from "./form.component";
import {ApplicationGroupService} from "../services/application-group.service";
import {MigrationPathService} from "../services/migration-path.service";
import {AnalysisContextService} from "../services/analysis-context.service";
import {ConfigurationOption} from "../model/configuration-option.model";
import {ConfigurationOptionsService} from "../services/configuration-options.service";
import {ModalDialogComponent} from "./modal-dialog.component";
import {IsDirty} from "../is-dirty.interface";
import {Observable} from "rxjs/Observable";
import {PackageRegistryService} from "../services/package-registry.service";
import {ApplicationGroup, AnalysisContext, Package, MigrationPath, AdvancedOption, RulesPath, PackageMetadata} from "windup-services";
import {RouteHistoryService} from "../services/route-history.service";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../services/route-flattener.service";
import {WindupService} from "../services/windup.service";
import {NotificationService} from "../services/notification.service";
import {utils} from "../utils";
import {RegisteredApplicationService} from "../services/registered-application.service";
import {RegisteredApplication} from "windup-services";

@Component({
    templateUrl: './analysis-context-form.component.html'
})
export class AnalysisContextFormComponent extends FormComponent
    implements OnInit, IsDirty, OnChanges
{
    @ViewChild(NgForm)
    private analysisContextForm: NgForm;

    private _dirty: boolean = null;

    // Models
    applicationGroup: ApplicationGroup = null;
    analysisContext: AnalysisContext;


    availableApps: RegisteredApplication[];
    includedApps: RegisteredApplication[];

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

    onCheckedOptionsChange(event){
        console.warn('onCheckedOptionsChange() called', this.applicationGroup.applications, event);
    }

    constructor(private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _applicationGroupService: ApplicationGroupService,
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
    }

    ngOnInit() {
        this._configurationOptionsService.getAll().subscribe((options:ConfigurationOption[]) => {
            this.configurationOptions = options;
        });

        ///this._appService.getApplications().subscribe( apps => this.updateAvailableApps(apps) );

        this.routerSubscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            if (flatRouteData.data['applicationGroup']) {
                let applicationGroup = flatRouteData.data['applicationGroup'];

                // Reload the App from the service to ensure fresh data
                this._applicationGroupService.get(applicationGroup.id).subscribe(updatedGroup => {
                    this.applicationGroup = updatedGroup;

                    // Load the apps of this project.
                    this._appService.getApplicationsByProjectID(this.applicationGroup.migrationProject.id)
                        .subscribe( apps => {
                            this.availableApps = apps;
                            console.log("Loaded availableApps", apps);
                        } );

                    this.initializeAnalysisContext();
                    this.loadPackageMetadata();
                });
            }

            this.isInWizard = flatRouteData.data.hasOwnProperty('wizard') && flatRouteData.data['wizard'];
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Checkboxes changed
        if (changes.hasOwnProperty("includedApps")) {
            console.log("Changing included apps to: ", changes["includedApps"].currentValue);
            this.applicationGroup.applications = changes["includedApps"].currentValue;
        }
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

        return analysisContext;
    }

    private initializeAnalysisContext() {
        let analysisContext = this.applicationGroup.analysisContext;

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

        console.log("initializeAnalysisContext() done: " + JSON.stringify(this.analysisContext));
    }

    private loadPackageMetadata() {
        this._applicationGroupService.getPackageMetadata(this.applicationGroup.id).subscribe(
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

    advancedOptionsChanged(advancedOptions:AdvancedOption[]) {
        this._dirty = true;
    }


    onSubmit() {
        // Store the Analysis Context
        let update = this.analysisContext.id != null;
        let service = update ? this._analysisContextService.update : this._analysisContextService.create;

        console.log(`Updating/creating analysis context #${this.analysisContext.id}, migrPath: ${this.analysisContext.migrationPath.id}`);


        //let contextObservable = service(this.analysisContext);
        let contextObservable = service.call(this._analysisContextService, this.analysisContext);

        // Store the App Group

        // Remove this because the service can't handle circular relation and would complain:
        // Already had POJO for id (java.lang.Long) [[ObjectId: key=73, ...
        let tmpContext = this.applicationGroup.analysisContext;
        this.applicationGroup.analysisContext = void 0;

        let appGroupObservable = this._applicationGroupService.update(this.applicationGroup);

        // Wait for both
        Observable.forkJoin( contextObservable, appGroupObservable).subscribe(
            results => {
                this._dirty = false;
                this.onSuccess(<AnalysisContext>results[0], <ApplicationGroup>results[1]);
                this.applicationGroup.analysisContext = tmpContext;
            },
            error => {
                this.applicationGroup.analysisContext = tmpContext;
                this.handleError(error);
            }
        );
    }

    onSuccess(analysisContext: AnalysisContext, appGroup: ApplicationGroup) {
        if (this.action === Action.SaveAndRun) {
            this._windupService.executeWindupGroup(this.applicationGroup.id)
                .subscribe(execution => {
                    this._notificationService.success('Windup execution has started');
                    this._router.navigate([`/projects/${this.applicationGroup.migrationProject.id}`]);
                },
                error => {
                    this._notificationService.error(utils.getErrorMessage(error));
                });
        } else if (this.isInWizard) {
            this._router.navigate([`/projects/${this.applicationGroup.migrationProject.id}`]);
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
        let groupPageRoute = `/projects/${this.applicationGroup.migrationProject.id}/groups/${this.applicationGroup.id}`;
        this._routeHistoryService.navigateBackOrToRoute(groupPageRoute);
    }

    rulesPathsChanged(rulesPaths:RulesPath[]) {
        this.analysisContext.rulesPaths = rulesPaths;
    }

}

enum Action {
    Save = 0,
    SaveAndRun = 1
}
