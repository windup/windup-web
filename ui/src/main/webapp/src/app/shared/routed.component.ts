import {Router, ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {AbstractComponent} from "./AbstractComponent";
import {RouteFlattenerService, FlattenedRouteData} from "../core/routing/route-flattener.service";


export abstract class RoutedComponent extends AbstractComponent {

    constructor(
        protected _router: Router,
        protected _activatedRoute: ActivatedRoute,
        protected _routeFlattener: RouteFlattenerService
    ) {
        super();
    }

    protected get flatRouteLoaded(): Observable<FlattenedRouteData> {
        return this._routeFlattener.OnFlatRouteLoaded;
    }
}
