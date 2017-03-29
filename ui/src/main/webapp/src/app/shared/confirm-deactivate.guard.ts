import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {IsDirty} from "./is-dirty.interface";
import {Observable} from "rxjs/Observable";

export class ConfirmDeactivateGuard implements CanDeactivate<IsDirty> {

    canDeactivate(target: IsDirty, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        if(target.dirty) {
            return window.confirm('Leaving the form will revert any changes. Do you want to continue?');
        }
        return true;
    }
}
