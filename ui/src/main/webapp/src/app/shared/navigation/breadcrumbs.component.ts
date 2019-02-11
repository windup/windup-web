import {Component, OnInit, OnDestroy} from "@angular/core";
import {BreadCrumbsService, BreadCrumbLink} from "./breadcrumbs.service";
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import { filter } from 'rxjs/operators';

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
        private _breadCrumbsService: BreadCrumbsService
    ) {
    }

    ngOnInit(): void {
        this.subscription = this._router.events
        .pipe(
            filter(event => event instanceof NavigationEnd)
        )
        .subscribe(_ => {
            this.breadCrumbLinks = this._breadCrumbsService.getBreadCrumbLinks(this._activatedRoute.snapshot);
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
