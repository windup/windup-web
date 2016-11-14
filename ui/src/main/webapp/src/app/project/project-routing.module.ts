import {NgModule} from "@angular/core";

import "rxjs/Rx";

import {ProjectResolve} from "./project.resolve";
import {MigrationProjectFormComponent} from "./migrationprojectform.component";
import {ProjectListComponent} from "./projectlist.component";
import {RouterModule} from "@angular/router";
import {GroupListComponent} from "../group/grouplist.component";
import {ApplicationGroupForm} from "../group/applicationgroupform.component";

@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ProjectListComponent, data: {displayName: "Project List"}},
        {
            path: ':projectId',
            resolve: {
                project: ProjectResolve
            },
            data: {displayName: 'Group List'},
            children: [
                {path: '', component: GroupListComponent, data: {displayName: 'Group List'}},
                {path: 'edit', component: MigrationProjectFormComponent, data: {displayName: 'Edit Project'}},
                {path: 'groups/create', component: ApplicationGroupForm, data: {displayName: 'Create Application Group'}},
            ]
        },
        {path: 'create', component: MigrationProjectFormComponent, data: {displayName: 'Create Project'}}
    ])],
    exports: [RouterModule]
})
export class ProjectRoutingModule {

}
