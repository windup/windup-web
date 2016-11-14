import {NgModule} from "@angular/core";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import "rxjs/Rx";

import {MigrationProjectService} from "./migrationproject.service";
import {ProjectResolve} from "./project.resolve";
import {MigrationProjectFormComponent} from "./migrationprojectform.component";
import {ProjectListComponent} from "./projectlist.component";
import {ProjectRoutingModule} from "./project-routing.module";
import {CommonModule} from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {GroupModule} from "../group/group.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectRoutingModule,
        SharedModule,
        GroupModule
    ],
    declarations: [
        MigrationProjectFormComponent,
        ProjectListComponent
    ],
    providers: [
        MigrationProjectService,
        ProjectResolve
    ]
})
export class ProjectModule {

}
