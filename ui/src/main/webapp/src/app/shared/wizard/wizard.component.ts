import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {RoutedComponent} from "../routed.component";

@Component({
    templateUrl: './wizard.component.html',
    styleUrls: [
        './wizard-component.scss'
    ]
})
export class WizardComponent extends RoutedComponent implements OnInit {
    wizardSteps: WizardStep[];
    currentStep: WizardStep;

    constructor(
        _activatedRoute: ActivatedRoute,
        _router: Router,
        _routeFlattener: RouteFlattenerService
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    initialize(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => {
            this.wizardSteps = flatRouteData.data['steps'];

            if (flatRouteData.url.length > 0) {
                let lastRouteNavigation = <any>flatRouteData.url[flatRouteData.url.length - 1];
                let lastFragment = lastRouteNavigation[lastRouteNavigation.length -1];
                this.currentStep = this.wizardSteps.find(item => item.path === lastFragment.path);
            }
        }));
    }

    ngOnInit(): void {

    }
}

export interface WizardStep {
    name: string;
    path: string;
}
