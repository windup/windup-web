import {Component, OnInit, OnDestroy} from "@angular/core";
import {Router, NavigationEnd, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {LoadingIndicatorService} from "../core/loading-indicator.service";
import {SlimLoadingBarComponent, SlimLoadingBarService} from "ng2-slim-loading-bar";


/**
 * This wraps the SlimLoadingBarComponent and SlimLoadingBarService
 * so the LoadingIndicatorComponent gets instantiated (we can subscribe to the EventBusService in it's constructor).
 */
@Component({
    selector: "wu-loading-indicator",
    template:
            "<h2>Test DDD wu-loading-indicator</h2>" + ///
            "<ng2-slim-loading-bar></ng2-slim-loading-bar>",
    styles: [":host /deep/ .slim-loading-bar { z-index: 2000; position: relative; }"],
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy { /* extends SlimLoadingBarComponent */

    subscription: Subscription;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,

        // The service subscribes to EventBusService.
        private _loadingIndicatorService: LoadingIndicatorService,
        //private _slimService: SlimLoadingBarService,
    ) {
        //super(_slimService);
        //super(_loadingIndicatorService.getSlimService());
    }


    ngOnInit(): void {
        /*
         * This is supposed to reset the loading bar for a new page.
         * But it seems not to be a good idea, as NavigationEnd comes while loading is already in progress,
         * so the counter would go below 0.
         */
        this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            ///this._loadingIndicatorService.reset();
        });
    }

    ngOnDestroy(): void {
    }
}
