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
        this.initialize();
    }

    /**
     * This should contain code using OnFlatRouteLoaded event.
     *
     * It cannot be in ngOnInit anymore, because in Angular 4.2 they changed order of router events
     * (see https://github.com/angular/angular/issues/17473 for more details)
     *
     * Now it is: constructor, NavigationEnd, ngOnInit
     * We need the code to run before NavigationEnd, so calling it from constructor should help
     */
    protected abstract initialize();

    protected get flatRouteLoaded(): Observable<FlattenedRouteData> {
        return this._routeFlattener.OnFlatRouteLoaded;
    }
}
