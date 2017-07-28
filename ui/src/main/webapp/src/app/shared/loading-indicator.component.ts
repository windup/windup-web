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
        "<ng2-slim-loading-bar></ng2-slim-loading-bar>",
    styles: [`
        :host /deep/ .slim-loading-bar { z-index: 2000; position: relative; }
        :host /deep/ .slim-loading-bar-progress {
            -webkit-transition: all .5s ease-in-out;
            transition: all .5s ease-in-out;
            /* horiz vert  blur-radius spread    color */
            -webkit-box-shadow: 5px 2px 10px 0px rgba(204,204,204,1);
            -moz-box-shadow:    5px 2px 10px 0px rgba(204,204,204,1);
            box-shadow:         5px 2px 10px 0px rgba(204,204,204,1);
        }
    `],
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy { /* extends SlimLoadingBarComponent */

    subscription: Subscription;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,

        // The service subscribes to EventBusService.
        private _loadingIndicatorService: LoadingIndicatorService,
    ) {
    }


    ngOnInit(): void {
        /*
         * TODO:
         * This is supposed to reset the loading bar for a new page.
         * But it seems not to be a good idea, as NavigationEnd comes while loading is already in progress,
         * so the counter would go below 0.
         */
        this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            // this._loadingIndicatorService.reset();
        });
    }

    ngOnDestroy(): void {
    }

    public static visualizeFinished(_slimBarService: SlimLoadingBarService, hadError: boolean) {
        _slimBarService.visible = true;
        _slimBarService.height = "2px";
        _slimBarService.progress = 95;
    }

    public static visualizeInProgress(_slimBarService: SlimLoadingBarService, hadError: boolean) {
        _slimBarService.visible = true;
        _slimBarService.height = "3px";
        _slimBarService.color = hadError ? "firebrick" : "#39a5dc";
    }
}
