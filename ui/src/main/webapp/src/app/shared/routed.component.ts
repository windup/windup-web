import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {Subject} from "rxjs";

import {AbstractComponent} from "./AbstractComponent";
import {RouteFlattenerService, FlattenedRouteData} from "../core/routing/route-flattener.service";


export abstract class RoutedComponent extends AbstractComponent {
    protected flatRouteLoaded = new Subject<FlattenedRouteData>();

    constructor(
        protected _router: Router,
        protected _activatedRoute: ActivatedRoute,
        protected _routeFlattener: RouteFlattenerService
    ) {
        super();

        this.addSubscription(this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);

            this.flatRouteLoaded.next(flatRouteData);
        }));
    }
}
