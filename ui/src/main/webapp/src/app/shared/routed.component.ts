import {Router, ActivatedRoute} from "@angular/router";
import {ReplaySubject} from "rxjs";
import {AbstractComponent} from "./AbstractComponent";
import {RouteFlattenerService, FlattenedRouteData} from "../core/routing/route-flattener.service";


export abstract class RoutedComponent extends AbstractComponent {
    protected flatRouteLoaded = new ReplaySubject<FlattenedRouteData>(1);

    constructor(
        protected _router: Router,
        protected _activatedRoute: ActivatedRoute,
        protected _routeFlattener: RouteFlattenerService
    ) {
        super();
        this._routeFlattener.OnFlatRouteLoaded.subscribe(flatRoute => this.flatRouteLoaded.next(flatRoute));
    }
}
