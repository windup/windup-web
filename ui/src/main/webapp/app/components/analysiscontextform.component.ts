import {ControlGroup, FormBuilder, NgClass, NgControlName, Validators} from "@angular/common";
import {Component, Input, OnInit} from "@angular/core";
import {Router, RouteParams} from "@angular/router-deprecated";
import {Observable} from 'rxjs/Observable';

import {AnalysisContext} from "windup-services";
import {FormComponent} from "./formcomponent.component";
import {ApplicationGroup} from "windup-services";
import {ApplicationGroupService} from "../services/applicationgroup.service";
import {MigrationPathService} from "../services/migrationpath.service";
import {MigrationPath} from "windup-services";
import {AnalysisContextService} from "../services/analysiscontext.service";

@Component({
    templateUrl: 'app/components/analysiscontextform.component.html',
    directives: [ NgClass ],
    providers: [ AnalysisContextService, ApplicationGroupService, MigrationPathService ]
})
export class AnalysisContextFormComponent extends FormComponent
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

    private _migrationPathsObservable:Observable<MigrationPath>;

    constructor(private _router:Router,
                private _routeParams: RouteParams,
                private _applicationGroupService:ApplicationGroupService,
                private _migrationPathService:MigrationPathService,
                private _analysisContextService:AnalysisContextService,
                private _formBuilder: FormBuilder) {
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
        let id:number = parseInt(this._routeParams.get("groupID"));
        if (!isNaN(id)) {
            this.loading = true;
            this._applicationGroupService.get(id).subscribe(
                group => {
                    this.applicationGroup = group;
                    this.analysisContext = group.analysisContext;
                    console.log("Loaded analysis context: " + JSON.stringify(this.analysisContext));

                    if (this.analysisContext == null) {
                        this.analysisContext = <AnalysisContext>{};
                        this.analysisContext.migrationPath = <MigrationPath>{};
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
    }

    addScanPackage() {
        this.packages.push({prefix: ""});
    }

    addExcludePackage() {
        this.excludePackages.push({prefix: ""});
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

    cancel() {
        this.routeToGroupList();
    }

    routeToGroupList() {
        this._router.navigate(['GroupList', {projectID: this.applicationGroup.migrationProject.id}]);
    }
}