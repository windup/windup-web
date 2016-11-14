import {Routes, RouterModule} from "@angular/router";
import {LoggedInGuard} from "./core/authentication/logged-in.guard";
import {NgModule} from "@angular/core";
import {LoginComponent} from "./core/authentication/login.component";
import {DefaultLayoutComponent} from "./shared/layout/default-layout.component";

export const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    // Authenticated routes
    {
        path: '',
        canActivate: [LoggedInGuard],
        canActivateChild: [LoggedInGuard],
        children: [
            {path: '', redirectTo: '/projects', pathMatch: 'full'},
            {
                path: 'projects',
                component: DefaultLayoutComponent,
                loadChildren: './project/project.module#ProjectModule',
            },
            {
                path: 'groups',
                loadChildren: './group/group.module#GroupModule'
            }
        ]
    }
];

export const appRoutingProviders: any[] = [

];

export const routing = RouterModule.forRoot(appRoutes);

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
