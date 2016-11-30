import {Component, OnInit, OnDestroy} from "@angular/core";
import {BreadCrumbsService, BreadCrumbLink} from "./breadcrumbs.service";
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {RouteFlattenerService} from "../../services/route-flattener.service";

@Component({
    selector: 'wu-breadcrumbs',
    templateUrl: './breadcrumbs.component.html'
})
export class BreadCrumbsComponent implements OnInit, OnDestroy {

    breadCrumbLinks: BreadCrumbLink[] = [];
    subscription: Subscription;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _breadCrumbsService: BreadCrumbsService,
        private _routeFlattener: RouteFlattenerService
    ) {

    }

    ngOnInit(): void {
        this.subscription = this._router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            console.log('-------------- Navigation end event ------------------');
            console.log(event);
            console.log(this._activatedRoute.snapshot);
            console.log(this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot));
        });
        
        let hierarchy = { name: 'Project List', children: [
            { name: 'Project',  children: [
                { name: 'Group', children: [
                    { name: 'Application', children: [
                        { name: 'Add' },
                        { name: 'Edit' },
                        { name: 'Report?' }
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


        this.breadCrumbLinks = [
            {name: 'Project List', route: ['/project-list']},
            {name: 'Project: Test Project', route: ['/group-list', {projectID: 9}]},
            {name: 'Group: Default Group', route: ['/groups', 8]}
        ];
    }


    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
