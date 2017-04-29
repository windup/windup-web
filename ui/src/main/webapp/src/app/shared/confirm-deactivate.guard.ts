import {CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {IsDirty} from "./is-dirty.interface";
import {Observable} from "rxjs/Observable";
import {DialogService} from "./dialog/dialog.service";
import {Injectable} from "@angular/core";

@Injectable()
export class ConfirmDeactivateGuard implements CanDeactivate<IsDirty> {

    constructor(protected _dialogService: DialogService) {
    }

    canDeactivate(target: IsDirty, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        if (target.dirty) {
            let dialog = this._dialogService.getConfirmationDialog();
            dialog.title = 'Do you want to leave current page?';
            dialog.body = 'Leaving the form will revert any changes. Do you want to continue?';

            dialog.show();

            return dialog.closed.map(dialogResult => dialogResult.result);
        }

        return true;
    }
}
