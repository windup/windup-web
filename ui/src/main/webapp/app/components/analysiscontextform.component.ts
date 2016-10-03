import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from 'rxjs/Observable';

import {AnalysisContext} from "windup-services";
import {FormComponent} from "./formcomponent.component";
import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {MigrationPathService} from "../services/migrationpath.service";
import {MigrationPath} from "windup-services";
import {AnalysisContextService} from "../services/analysiscontext.service";
import {ConfigurationOption} from "../model/configuration-option.model";
import {ConfigurationOptionsService} from "../services/configuration-options.service";
import {ModalDialogComponent} from "./modal-dialog.component";

@Component({
    templateUrl: './analysiscontextform.component.html',
    providers: [ AnalysisContextService, ApplicationGroupService, MigrationPathService ]
})
export class AnalysisContextFormComponent extends FormComponent implements OnInit
{
    loading:boolean = true;
    applicationGroup:ApplicationGroup = null;

    analysisContext:AnalysisContext = <AnalysisContext>{};

    /**
     * These two variables exist because we need for the item in the array not to just be a literal.
     *
     * This works around issues with JavaScript not being able to iterate over and modify a simple array of literals within
     * a form easily.
     *
     * See also: http://stackoverflow.com/questions/33346677/angular2-ngmodel-against-ngfor-variables
     */
    packages:[{prefix:string}];
    excludePackages:[{prefix:string}];

    configurationOptions:ConfigurationOption[] = [];

    private _migrationPathsObservable:Observable<MigrationPath[]>;

    constructor(private _router:Router,
                private _activatedRoute: ActivatedRoute,
                private _applicationGroupService:ApplicationGroupService,
                private _migrationPathService:MigrationPathService,
                private _analysisContextService:AnalysisContextService,
                private _configurationOptionsService:ConfigurationOptionsService) {
        super();
        this.analysisContext.migrationPath = <MigrationPath>{};
        this.packages = [ {prefix: ""} ];
        this.excludePackages = [ {prefix: ""} ];
    }

    get migrationPaths() {
        if (this._migrationPathsObservable == null) {
            this._migrationPathsObservable = this._migrationPathService.getAll();
        }
        return this._migrationPathsObservable;
    }

    ngOnInit() {
        this._activatedRoute.params.subscribe(params => {
            let id:number = parseInt(params["groupID"]);
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
                        this.analysisContext = group.analysisContext;
                        console.log("Loaded analysis context: " + JSON.stringify(this.analysisContext));

                        if (this.analysisContext == null) {
                            this.analysisContext = <AnalysisContext>{};
                            this.analysisContext.migrationPath = <MigrationPath>{};
                            this.analysisContext.advancedOptions = [];
                            this.packages = [ {prefix: ""} ];
                            this.excludePackages = [ {prefix: ""} ];
                        } else {
                            // for migration path, store the id only
                            this.analysisContext.migrationPath = <MigrationPath>{ id: this.analysisContext.migrationPath.id };
                            if (this.analysisContext.packages == null || this.analysisContext.packages.length == 0)
                                this.packages = [ {prefix: ""} ];
                            else
                                this.packages = <[{prefix:string}]>this.analysisContext.packages.map(it => { return { prefix: it }});

                            if (this.analysisContext.excludePackages == null || this.analysisContext.excludePackages.length == 0)
                                this.excludePackages = [ {prefix: ""} ];
                            else
                                this.excludePackages = <[{prefix:string}]>this.analysisContext.excludePackages.map(it => { return { prefix: it }});
                        }

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

    addScanPackage() {
        this.packages.push({prefix: ""});
    }

    removeScanPackage(index:number) {
        this.packages.splice(index, 1);
    }

    addExcludePackage() {
        this.excludePackages.push({prefix: ""});
    }

    removeExcludePackage(index:number) {
        this.excludePackages.splice(index, 1);
    }

    save() {
        this.analysisContext.packages = this.packages.filter(it => { return it.prefix != null && it.prefix.trim() != "" }).map(it => { return it.prefix; });
        this.analysisContext.excludePackages = this.excludePackages.filter(it => { return it.prefix != null && it.prefix.trim() != "" }).map(it => { return it.prefix; });
        console.log("Should save with packages: " + JSON.stringify(this.analysisContext.packages) + " filtered from: " + JSON.stringify(this.packages));

        if (this.analysisContext.id != null) {
            console.log("Updating analysis context: " + this.analysisContext.migrationPath.id);
            this._analysisContextService.update(this.analysisContext).subscribe(
                migrationProject => this.routeToGroupList(),
                error => this.handleError(<any> error)
            );
        } else {
            console.log("Creating analysis context: " + this.analysisContext.migrationPath.id);
            this._analysisContextService.create(this.analysisContext).subscribe(
                migrationProject => this.routeToGroupList(),
                error => this.handleError(<any> error)
            );
        }
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