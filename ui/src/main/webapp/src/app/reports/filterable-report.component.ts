import {ActivatedRoute, Router} from "@angular/router";
import {ReportFilter, WindupExecution} from "windup-services";
import {FlattenedRouteData, RouteFlattenerService} from "../core/routing/route-flattener.service";
import {RoutedComponent} from "../shared/routed.component";

export abstract class FilterableReportComponent extends RoutedComponent {
    public execution: WindupExecution;
    public reportFilter: ReportFilter;

    public constructor(
        _router: Router,
        _activatedRoute: ActivatedRoute,
        _routeFlattener: RouteFlattenerService
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    protected loadFilterFromRouteData(flatRouteData: FlattenedRouteData) {
        this.execution = flatRouteData.data.execution;

        if (flatRouteData.data.level === 'application') {
            // set up application level filter
            let selectedApplications = this.execution.filterApplications
                .filter(app => app.id === +flatRouteData.params.applicationId)
                .map(app => app.inputPath);

            this.reportFilter = <any>{
                id: 0,
                selectedApplications: selectedApplications,
                includeTags: [],
                excludeTags: [],
                includeCategories: [],
                excludeCategories: [],
                enabled: true
            };
        }
    }
}
