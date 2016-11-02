import { Routes, RouterModule } from '@angular/router';
import {ProjectListComponent} from "./components/projectlist.component";
import {GroupListComponent} from "./components/grouplist.component";
import {RegisterApplicationFormComponent} from "./components/registerapplicationform.component";
import {MigrationProjectFormComponent} from "./components/migrationprojectform.component";
import {ApplicationGroupForm} from "./components/applicationgroupform.component";
import {AnalysisContextFormComponent} from "./components/analysiscontextform.component";
import {ConfigurationComponent} from "./components/configuration.component";
import {EditApplicationFormComponent} from "./components/edit-application-form.component";
import {ConfirmDeactivateGuard} from "./confirm-deactivate.guard";
import {TechnologiesReport} from "./components/reports/technologies/technologies.report";
import {LoginComponent} from "./components/login.component";
import {LoggedInGuard} from "./services/logged-in.guard";

const appRoutes: Routes = [
    {path:"", redirectTo: "/project-list", pathMatch: "full", canActivate: [LoggedInGuard]},
    {path:"configuration", component: ConfigurationComponent, data: { displayName: "Windup Configuration" }, canActivate: [LoggedInGuard]},
    {path:"project-list", component: ProjectListComponent, data: { displayName: "Project List" }, canActivate: [LoggedInGuard]},
    {path:"group-list", component: GroupListComponent, data: {displayName: "Group List"}, canActivate: [LoggedInGuard]},
    {path:"register-application", component: RegisterApplicationFormComponent, data: {displayName: "Application Registration"}, canActivate: [LoggedInGuard]},
    {path:"edit-application/:id", component: EditApplicationFormComponent, data: {displayName: "Update application"}, canActivate: [LoggedInGuard]},
    {path:"migration-project-form", component: MigrationProjectFormComponent, data: {displayName: "Edit Project"}, canActivate: [LoggedInGuard]},
    {path:"application-group-form", component: ApplicationGroupForm, data: {displayName: "Edit Application Group"}, canActivate: [LoggedInGuard]},
    {path:"analysis-context-form", component: AnalysisContextFormComponent, data: {displayName: "Edit Analysis Context"}, canActivate: [LoggedInGuard], canDeactivate: [ConfirmDeactivateGuard]},

    {path: "login", component: LoginComponent},

    // Reports
    {path:"technology-report", component: TechnologiesReport, data: {displayName: "Technology Report"}, canActivate: [LoggedInGuard]}
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);
