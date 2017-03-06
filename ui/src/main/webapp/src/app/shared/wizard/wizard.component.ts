import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {AbstractComponent} from "../AbstractComponent";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";

@Component({
    templateUrl: './wizard.component.html',
    styleUrls: [
        './wizard-component.scss'
    ]
})
export class WizardComponent extends AbstractComponent implements OnInit {
    wizardSteps: WizardStep[];
    currentStep: WizardStep;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _routeFlattener: RouteFlattenerService
    ) {
        super();
    }

    ngOnInit(): void {
        this.addSubscription(this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatRouteData = this._routeFlattener.getFlattenedRouteData(this._activatedRoute.snapshot);

            this.wizardSteps = flatRouteData.data['steps'];

            if (flatRouteData.url.length > 0) {
                let lastRouteNavigation = <any>flatRouteData.url[flatRouteData.url.length - 1];
                let lastFragment = lastRouteNavigation[lastRouteNavigation.length -1];
                this.currentStep = this.wizardSteps.find(item => item.path === lastFragment.path);
            }
        }));
    }
}

export interface WizardStep {
    name: string;
    path: string;
}
