import {Component} from "@angular/core";
import {Router, NavigationEnd, ActivatedRouteSnapshot, ActivatedRoute} from "@angular/router";
import {RouteHistoryService} from "../core/routing/route-history.service";
import {RouteFlattenerService} from "../core/routing/route-flattener.service";

@Component({
    selector: 'windup-app',
    templateUrl: './app.component.html'
})
export class AppComponent {

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
        private activatedRoute: ActivatedRoute
    ) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => {
                this.routeHistoryService.addNavigationEvent(event);
                this.routeFlattener.onNewRouteActivated(activatedRoute.snapshot);
            });
    }
}
