import {ActivatedRouteSnapshot, UrlSegment, Params, Data, Route} from "@angular/router";
import {Type, Injectable} from "@angular/core";
import {Subject} from "rxjs";

/**
 * This service is used to get ActivatedRouteSnapshot-like object with flattened data and parameters
 *
 * There are several quite annoying issues with angular router, which can be partially used by using this class.
 * To get correct parameters, inject Router and ActivatedRouteSnapshot into required component.
 * Listen to router events, when NavigationEnd event occurs, ActivatedRouteSnapshot should be updated.
 * Then use this service to get required data.
 *
 * Related angular issues:
 * https://github.com/angular/angular/issues/12767 - Router data and parameters not inherited
 * https://github.com/angular/angular/issues/12306 - Resolve data are not inherited
 * https://github.com/angular/angular/issues/13058 - My feature request to get some option to inherit router data
 * https://github.com/angular/angular/issues/11023 - Issue with different level components see different router data
 *
 */
@Injectable()
export class RouteFlattenerService {
    protected flatRouteLoaded = new Subject<FlattenedRouteData>();
    public OnFlatRouteLoaded = this.flatRouteLoaded.asObservable();

    public onNewRouteActivated(route: ActivatedRouteSnapshot) {
        let flatRoute = this.getFlattenedRouteData(route);
        this.flatRouteLoaded.next(flatRoute);
    }

    public getFlattenedRouteData(route: ActivatedRouteSnapshot): FlattenedRouteData {
        let downLevel = this.getActivatedRouteSnapshotWithChildren(route);
        downLevel.splice(0, 1);
        let upLevel = this.getActivatedRouteSnapshotWithParents(route);
        upLevel.pop();

        let result: FlattenedRouteData = this.mergeAllRoutes(
            ...upLevel,
            this.getRoute(route),
            ...downLevel
        );

        return result;
    }

    public getActivatedRouteSnapshotWithParents(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot[] {
        let result = [ route ];

        if (route.parent) {
            let parents = this.getActivatedRouteSnapshotWithParents(route.parent);
            result = parents.concat(result);
        }

        return result;
    }

    public getActivatedRouteSnapshotWithChildren(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot[] {
        let result = [ route ];

        if (route.firstChild) {
            let children = this.getActivatedRouteSnapshotWithChildren(route.firstChild);
            result = result.concat(children);
        }

        return result;
    }


    public getFlattenedRouteBottomUp(route: ActivatedRouteSnapshot, includeSelf: boolean = true): FlattenedRouteData {
        let result = { params: {}, data: {} };

        if (includeSelf) {
            result = this.getRoute(route);
        }

        if (route.parent) {
            let parent = this.getFlattenedRouteBottomUp(route.parent);
            result = this.mergeRoutes(parent, result);
        }

        return result;
    }

    public getFlattenedRouteTopDown(route: ActivatedRouteSnapshot, includeSelf: boolean = true): FlattenedRouteData {
        let result = { params: {}, data: {} };

        if (includeSelf) {
            result = this.getRoute(route);
        }

        if (route.firstChild) {
            let child = this.getFlattenedRouteTopDown(route.firstChild);
            result = this.mergeRoutes(result, child);
        }

        return result;
    }

    protected getRoute(route: ActivatedRouteSnapshot): FlattenedRouteData {
        let result: FlattenedRouteData = Object.assign({
            snapshotsHierarchy: [ route ],
            routeConfig: route.routeConfig
        }, route);


        return result;
    }

    protected getRouteConfigHierarchy(route: FlattenedRouteData): Route[] {
        let routeConfig = [];

        if (route.routeConfigHierarchy) {
            routeConfig = [].concat(route.routeConfigHierarchy);
        } else if (route.routeConfig) {
            routeConfig = [].concat([ route.routeConfig ]);
        }

        return routeConfig;
    }

    protected mergeAllRoutes(...routes: FlattenedRouteData[]): FlattenedRouteData {
        let result = {
            data: {},
            params: {},
            queryParams: {},
            url: [],
            routeConfigHierarchy: [],
            snapshotsHierarchy: [],
            fragment: ''
        };

        Object.assign(result.data, ...(routes.map(route => route.data)));
        Object.assign(result.params, ...(routes.map(route => route.params)));
        Object.assign(result.queryParams, ...(routes.map(route => route.queryParams)));

        result.routeConfigHierarchy = [].concat(
            ...routes.map(route => this.getRouteConfigHierarchy(route))
        );

        result.snapshotsHierarchy = routes;
        result.url = routes.map(route => route.url).filter(array => array.length > 0);

        return result;
    }

    protected mergeRoutes(parent: FlattenedRouteData, child: FlattenedRouteData): FlattenedRouteData {
        let result = {
            data: {},
            params: {},
            queryParams: {},
            url: [],
            routeConfigHierarchy: [],
            snapshotsHierarchy: []
        };

        Object.assign(result.data, parent.data, child.data);
        Object.assign(result.params, parent.params, child.params);
        Object.assign(result.queryParams, parent.queryParams, child.queryParams);

        result.routeConfigHierarchy = [].concat(
            this.getRouteConfigHierarchy(parent),
            this.getRouteConfigHierarchy(child)
        );

        result.snapshotsHierarchy = [].concat(parent.snapshotsHierarchy, child.snapshotsHierarchy);

        result.url = parent.url.concat(child.url);

        return result;
    }
}

export interface FlattenedRouteData {
    params: Params;
    data: Data;
    queryParams?: Params;
    url?: UrlSegment[];
    routeConfig?: Route;
    routeConfigHierarchy?: Route[];
    snapshotsHierarchy?: ActivatedRouteSnapshot[];
    fragment?: string;
}


export interface FullFlattenedRoute {
    /**
     *  The URL segments matched by this route.
     */
    url: UrlSegment[];

    /**
     * The matrix parameters scoped to this route.
     */
    params: Params;

    /**
     * The query parameters shared by all the routes.
     */
    queryParams: Params;

    /**
     * The URL fragment shared by all the routes.
     */
    fragment: string;

    /**
     * The static and resolved data of this route.
     */
    data: Data;

    /**
     * The outlet name of the route.
     */
    outlet: string;

    /**
     * The component of the route.
     */
    component: Type<any> | string;

    /**
     * The configuration used to match this route.
     */
    routeConfig: Route;

    /**
     * The root of the router state.
     */
    root: ActivatedRouteSnapshot;

    /**
     * The parent of this route in the router state tree.
     */
    parent: ActivatedRouteSnapshot;

    /**
     * The first child of this route in the router state tree.
     */
    firstChild: ActivatedRouteSnapshot;

    /**
     * The children of this route in the router state tree.
     */
    children: ActivatedRouteSnapshot[];

    /**
     * The path from the root of the router state tree to this route.
     */
    pathFromRoot: ActivatedRouteSnapshot[];
}
