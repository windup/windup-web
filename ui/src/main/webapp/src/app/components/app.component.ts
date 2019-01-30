import {AfterViewInit, Component, ViewChild} from "@angular/core";
import {Router, NavigationEnd, ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";
import {RouteHistoryService} from "../core/routing/route-history.service";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";
import {ConfirmationModalComponent} from "../shared/dialog/confirmation-modal.component";
import {DialogService} from "../shared/dialog/dialog.service";
import {NotificationService, Notification} from "patternfly-ng/notification";

@Component({
    selector: 'windup-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
    @ViewChild('reusableModalDialog')
    confirmationDialog: ConfirmationModalComponent;

    notifications: Notification[];

    /*
     * This is for Augury Chrome extension to display router tree
     * See https://github.com/rangle/augury/issues/715
     *
     * When extension is fixed, this can be safely removed
     */
    constructor(
        private router: Router,
        private routeHistoryService: RouteHistoryService,
        private routeFlattener: RouteFlattenerService,
        private activatedRoute: ActivatedRoute,
        private dialogService: DialogService,
        private notificationService: NotificationService
    ) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => {
                this.routeHistoryService.addNavigationEvent(event);
                this.routeFlattener.onNewRouteActivated(activatedRoute.snapshot);
            });
        this.notifications = this.notificationService.getNotifications();
    }

    ngAfterViewInit(): void {
        this.dialogService.setConfirmationDialog(this.confirmationDialog);
    }
}
