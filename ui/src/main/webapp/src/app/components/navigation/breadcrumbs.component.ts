import {Component, OnInit, OnDestroy} from "@angular/core";
import {BreadCrumbsService, BreadCrumbLink} from "./breadcrumbs.service";
import {Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment} from "@angular/router";
import {Subscription} from "rxjs";
import {RouteFlattenerService, FlattenedRouteData} from "../../services/route-flattener.service";

@Component({
    selector: 'wu-breadcrumbs',
    templateUrl: './breadcrumbs.component.html'
})
export class BreadCrumbsComponent implements OnInit, OnDestroy {

    breadCrumbLinks: BreadCrumbLink[] = [];
    subscription: Subscription;
    routeParentMap: Map<string, FlattenedRouteData>;


    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _breadCrumbsService: BreadCrumbsService,
        private _routeFlattener: RouteFlattenerService
    ) {
        this.routeParentMap = new Map<string, FlattenedRouteData>();
       /*
        this.routeParentMap.set('groups/:groupId', {

        });
        */
    }

    ngOnInit(): void {
        this.subscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flattenedRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);
            this.getBreadCrumbParts(flattenedRouteData);
        });

        /*
            let hierarchy = { name: 'Project List', children: [
                { name: 'Project',  children: [
                    { name: 'Group', children: [
                        { name: 'Application', children: [
                            { name: 'Add' },
                            { name: 'Edit' }
                        ]},
                        { name: 'Analysis Configuration' },
                        { name: 'Executions', children: [
                            { name: 'Execution' }
                        ]},
                        { name: 'Reports (Dashboard)', children: [
                            { name: 'Technologies' },
                            { name: 'Issues' },
                            { name: 'Dependencies' }
                        ]}
                    ]}
                ]}
            ]};
        */
/*

        this.breadCrumbLinks = [
            {name: 'Project List', route: ['/project-list']},
            {name: 'Project: Test Project', route: ['/group-list', {projectID: 9}]},
            {name: 'Group: Default Group', route: ['/groups', 8]}
        ];
        */
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
            let sum = {
                name: this.getName(current.snapshot),
                route: previous.route + current.route,
                snapshot: current.snapshot
            };

            if (current.snapshot.component) {
                links.push(sum);
            }

            return sum;
        }, {name: '', route: '', snapshot: null});

        console.log(links);
    }

    protected getName(route: ActivatedRouteSnapshot) {
        if (route.data && route.data.hasOwnProperty('breadcrumbTitle')) {
            //let placeholders = route.data.breadcrumbTitle._lastCasesMatched

            return route.data['breadcrumbTitle'];
        } else if (route.data && route.data.hasOwnProperty('displayName')) {
            return route.data['displayName'];
        } else {
            return '';
        }
    }

    protected getHiddenParent(route: FlattenedRouteData) {

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
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
