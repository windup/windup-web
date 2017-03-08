import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, UrlSegment, Route, Data} from "@angular/router";
import {RouteFlattenerService, FlattenedRouteData} from "../../core/routing/route-flattener.service";

@Injectable()
export class BreadCrumbsService {
    constructor(private _routeFlattener: RouteFlattenerService) {

    }

    public getBreadCrumbLinks(route: ActivatedRouteSnapshot): BreadCrumbLink[] {
        let flattenedRouteData = this._routeFlattener.getFlattenedRouteData(route);
        let breadCrumbParts = this.getBreadCrumbParts(flattenedRouteData);

        return breadCrumbParts.map(part => {
            return {
                name: part.name,
                route: [part.route],
            };
        })
    }

    /**
     * This method get bread crumb parts from route
     *
     *
     * I have /project/10/groups/15/reports/21/migration-issues
     *
     * And I need to get
     * /projects
     * /projects/10
     * /projects/10/groups/
     * /projects/10/groups/15
     * /projects/10/groups/15/reports/21/migration-issues
     *
     */
    protected getBreadCrumbParts(route: FlattenedRouteData) {
        /*
         * Route must have component or resolve to have special meaning. If it doesn't have a component, join it with previous one
         */
        let snapshotData = route.snapshotsHierarchy.filter(snapshot => {
            return snapshot.url.length > 0 || (snapshot.routeConfig && snapshot.routeConfig.resolve);
        }).map((snapshot: ActivatedRouteSnapshot) => {
            return {
                name: '',
                route: snapshot.url.map((url: UrlSegment) => url.path).reduce((previous, current) => previous + "/" + current, ""),
                snapshot: snapshot
            };
        });

        let links = [];

        snapshotData.reduce((previous, current) => {
            let endRoute = this.getEndRoute(current.snapshot.routeConfig);

            let sum = {
                name: this.getName(current.snapshot, endRoute, route),
                route: previous.route + current.route,
                snapshot: current.snapshot
            };

            if (this.canReachToComponentRoute(current.snapshot.routeConfig) && !this.isIgnoredRoute(current.snapshot.routeConfig)) {
                links.push(sum);
            }

            return sum;
        }, {name: '', route: '', snapshot: null});

        return links;
    }

    protected getEndRoute(route: Route) {
        let children = [];

        if (route.children) {
            children = route.children.filter(child => child.path === '' || child.path === '**');
        }

        if (children.length == 0) {
            return route; // Do we care if it has component?
        } else {
            return this.getEndRoute(children[0]);
        }
    }

    protected canReachToComponentRoute(route: Route) {
        if (route.component) {
            return true;
        } else if (!route.children) {
            return false;
        } else {
            return route.children.filter(child => child.path === '' || child.path === '**')
                .map(child => this.canReachToComponentRoute(child))
                .reduce((previous, current) => previous || current, false);
        }
    }

    protected isIgnoredRoute(route: Route) {
        return route.data && route.data.hasOwnProperty('breadcrumbs') && route.data['breadcrumbs'].hasOwnProperty('ignore')
            && route.data['breadcrumbs']['ignore'];
    }

    protected getName(snapshot: ActivatedRouteSnapshot, route: Route, flattenedRouteData: FlattenedRouteData) {
        if (snapshot.data && (snapshot.data.hasOwnProperty('breadcrumbTitle') || snapshot.data.hasOwnProperty('displayName'))) {
            return this.getNameFromData(snapshot.data, flattenedRouteData);
        } else {
            return this.getNameFromData(route.data, flattenedRouteData);
        }
    }

    protected getNameFromData(data: Data, flattenedRouteData: FlattenedRouteData) {
        if (!data) {
            return '';
        }

        if (data.hasOwnProperty('breadcrumbTitle')) {
            if (typeof data['breadcrumbTitle'] === 'function') {
                return data['breadcrumbTitle'](flattenedRouteData);
            } else {
                return data['breadcrumbTitle'];
            }
        } else if (data.hasOwnProperty('displayName')) {
            return data['displayName'];
        } else {
            return '';
        }
    }
}

export interface BreadCrumbLink {
    name: string;
    route: any[];
}

/*
 * Available routes:
 *
 * /login
 *
 * ''/'' - layout
 * ''/''/'' => project-list
 * ''/''/configuration + res
 * ''/''/project-list
 * ''/''/app-group-form
 *
 * ''/projects - layout def.
 * ''/projects/'' project list comp.
 * ''/projects/create
 * ''/projects/:projectId - resolve
 * ''/projects/:projectId/'' - group list
 * ''/projects/:projectId/edit
 * ''/projects/:projectId/groups/create
 *
 * ''/groups/:groupId - layout, resolve
 * ''/groups/:groupId/'' - page
 * ''/groups/:groupId/edit
 * ''/groups/:groupId/analysis-context
 * ''/groups/:groupId/applications !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!(NOTHING!)
 * ''/groups/:groupId/applications/register
 * ''/groups/:groupId/applications/:applicationId/edit
 * ''/groups/:groupId/reports/:executionId !!!!!!!!!!!!!!!!!!!!!!!!!(NOTHING)
 * ''/groups/:groupId/reports/:executionId/tech-report
 * ''/groups/:groupId/reports/:executionId/migration-issues
 */
