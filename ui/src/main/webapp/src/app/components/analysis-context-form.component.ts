import {Component, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

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
import {ApplicationGroup, AnalysisContext, Package, MigrationPath, AdvancedOption, RulesPath} from "../windup-services";

@Component({
    templateUrl: 'analysis-context-form.component.html'
})
export class AnalysisContextFormComponent extends FormComponent implements OnInit, IsDirty
{
    @ViewChild(NgForm)
    private analysisContextForm:NgForm;

    private _dirty: boolean = null;

    loading:boolean = true;
    applicationGroup:ApplicationGroup = null;

    analysisContext:AnalysisContext = <AnalysisContext>{};
    packageTree: Package[] = [];

    /**
     * These two variables exist because we need for the item in the array not to just be a literal.
     *
     * This works around issues with JavaScript not being able to iterate over and modify a simple array of literals within
     * a form easily.
     *
     * See also: http://stackoverflow.com/questions/33346677/angular2-ngmodel-against-ngfor-variables
     */
    includePackages: Package[];
    excludePackages: Package[];

    configurationOptions:ConfigurationOption[] = [];

    private _migrationPathsObservable:Observable<MigrationPath[]>;

    constructor(private _router:Router,
                private _activatedRoute: ActivatedRoute,
                private _applicationGroupService:ApplicationGroupService,
                private _migrationPathService:MigrationPathService,
                private _analysisContextService:AnalysisContextService,
                private _configurationOptionsService:ConfigurationOptionsService,
                private _packageRegistryService: PackageRegistryService) {
        super();
        this.analysisContext.migrationPath = <MigrationPath>{};
        this.includePackages = [];
        this.excludePackages = [];
    }

    ngOnInit() {
        this._activatedRoute.parent.params.subscribe(params => {
            let id:number = parseInt(params["groupId"]);
            if (!isNaN(id)) {
                this.loading = true;

                this._configurationOptionsService.getAll().subscribe(
                    (options:ConfigurationOption[]) => {
                        this.configurationOptions = options;
                    }
                );

                this._applicationGroupService.get(id).subscribe(
                    group => {
                        this.applicationGroup = group;

                        if (this.applicationGroup.packageMetadata.scanStatus === "COMPLETE") {
                            this.applicationGroup.packageMetadata.packageTree.forEach(node => {
                                this._packageRegistryService.putHierarchy(node);
                            });
                        }

                        this.packageTree = group.packageMetadata.packageTree;
                        this.analysisContext = group.analysisContext;
                        console.log("Loaded analysis context: " + JSON.stringify(this.analysisContext));

                        if (this.analysisContext == null) {
                            this.analysisContext = <AnalysisContext>{};
                            this.analysisContext.migrationPath = <MigrationPath>{};
                            this.analysisContext.advancedOptions = [];
                            this.analysisContext.includePackages = [];
                            this.analysisContext.excludePackages = [];
                            this.analysisContext.rulesPaths = [];
                        } else {
                            // for migration path, store the id only
                            this.analysisContext.migrationPath = <MigrationPath>{ id: this.analysisContext.migrationPath.id };
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

                            if (this.analysisContext.rulesPaths == null)
                                this.analysisContext.rulesPaths = [];
                        }

                        this.includePackages = this.analysisContext.includePackages;
                        this.excludePackages = this.analysisContext.excludePackages;

                        // Just use the ID here
                        this.analysisContext.applicationGroup = <ApplicationGroup>{ id: group.id };

                        this.loading = false;
                    }
                );
            } else {
                this.loading = false;
                this.errorMessages.push("groupID parameter was not specified!");
            }
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
            console.log("Returning locally set dirty: " + this._dirty);
            return this._dirty;
        }

        return this.analysisContextForm.dirty;
    }

    advancedOptionsChanged(advancedOptions:AdvancedOption[]) {
        console.log("1Advanced options changed... dirty: " + this.dirty);
        this._dirty = true;
        console.log("2Advanced options changed... dirty: " + this.dirty);
    }

    onNodesChanged(event) {
        console.log(event);
    }

    save() {
        if (this.analysisContext.id != null) {
            console.log("Updating analysis context: " + this.analysisContext.migrationPath.id);
            this._analysisContextService.update(this.analysisContext).subscribe(
                migrationProject => {
                    this._dirty = false;
                    this.routeToGroupList()
                },
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating analysis context: " + this.analysisContext.migrationPath.id);
            this._analysisContextService.create(this.analysisContext).subscribe(
                migrationProject => {
                    this._dirty = false;
                    this.routeToGroupList()
                },
                error => this.handleError(<any> error)
            );
        }
    }

    rulesPathsChanged(rulesPaths:RulesPath[]) {
        this.analysisContext.rulesPaths = rulesPaths;
    }

    viewAdvancedOptions(advancedOptionsModal:ModalDialogComponent) {
        advancedOptionsModal.show();
        return false;
    }

    cancel() {
        this.routeToGroupList();
    }

    routeToGroupList() {
        this._router.navigate(['/group-list', {projectID: this.applicationGroup.migrationProject.id}]);
    }
}

