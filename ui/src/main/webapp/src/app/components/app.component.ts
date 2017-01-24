import {Component} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {RouteHistoryService} from "../services/route-history.service";

@Component({
    selector: 'windup-app',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    /*
     * This is for Augury Chrome extension to display router tree
     * See https://github.com/rangle/augury/issues/715
     *
     * When extension is fixed, this can be safely removed
     */
    constructor(private router: Router, private routeHistoryService: RouteHistoryService) {
        router.events
            .filter(event => event instanceof NavigationEnd)
            .subscribe((event: NavigationEnd) => routeHistoryService.addNavigationEvent(event));
    }
}
