import {Component, OnInit, AfterViewChecked, ElementRef} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {RuleProviderExecutionsService} from "./rule-provider-executions.service";
import {ExecutionPhaseModel} from "../../generated/tsModels/ExecutionPhaseModel";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";
import {AbstractComponent} from "../../shared/AbstractComponent";
import {RoutedComponent} from "../../shared/routed.component";

@Component({
    templateUrl: './rule-provider-executions.component.html',
    styles: [
        `:host /deep/ .alert-info {
            background-color: #5bc0de;
            color: #ffffff;
            font-size: 12px;
            font-weight: 300;
            padding: 15px;
            margin-bottom: 21px;
            border: 1px solid #3db5d8;
            border-radius: 0;
        }`
    ]
})
export class RuleProviderExecutionsComponent extends RoutedComponent implements OnInit, AfterViewChecked {
    phases: ExecutionPhaseModel[];
    protected anchor: string;

    constructor(
        _router: Router,
        private _ruleProviderExecutionsService: RuleProviderExecutionsService,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService,
        private _element: ElementRef
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    initialize(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flatRouteData => this.loadData(flatRouteData)));
    }

    loadData(flatRouteData) {
        let executionId = +flatRouteData.params['executionId'];
        this._ruleProviderExecutionsService.getPhases(executionId)
            .subscribe(phases => {
                this.phases = phases;
                this._activatedRoute.queryParams.subscribe((queryParams) => {
                    console.log("rule id: " + queryParams['ruleID']);
                    if (queryParams.hasOwnProperty('ruleID')) {
                        this.anchor = queryParams['ruleID'];
                    }
                });
            });
    }

    ngOnInit(): void {

    }


    ngAfterViewChecked(): void {
        if (this.anchor) {
            let element = this._element.nativeElement.querySelector(`a[name="${this.anchor}"]`);

            if (element) {
                element.scrollIntoView(element);
                this.anchor = null;
            }
        }
    }
}
