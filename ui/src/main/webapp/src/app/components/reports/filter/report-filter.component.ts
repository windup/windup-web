import {Component, OnInit, OnDestroy} from "@angular/core";
import {ApplicationGroup, ReportFilter, Tag} from "windup-services";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {Subscription} from "rxjs";
import {ReportFilterService} from "./report-filter.service";
import {NotificationService} from "../../../core/notification/notification.service";
import {RouteFlattenerService} from "../../../core/routing/route-flattener.service";
import {CustomSelectConfiguration} from "../../custom-select/custom-select.component";
import {Category} from "windup-services";
import {utils} from "../../../utils";
import {Location} from "@angular/common";
import {TagDataService} from "../tag-data.service";
import {FilterApplication} from "windup-services";
import {WindupExecution} from "windup-services";

@Component({
    templateUrl: './report-filter.component.html'
})
export class ReportFilterComponent implements OnInit, OnDestroy {
    group: ApplicationGroup = <ApplicationGroup>{};
    filter: ReportFilter;
    tags: Tag[] = [];
    categories: Category[] = [];
    routerSubscriptions: Subscription[] = [];
    filterApplications: FilterApplication[] = [];

    appSelectConfig: CustomSelectConfiguration;
    categoryTagSelectConfig: CustomSelectConfiguration;

    isFilterUpToDate: boolean = false;

    constructor(private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _filterService: ReportFilterService,
                private _tagService: TagDataService,
                private _notificationService: NotificationService,
                private _routeFlattenerService: RouteFlattenerService,
                private _location: Location) {
        this.filter = this.getDefaultFilter(null);

        this.categoryTagSelectConfig = {
            getLabel: (tag: Tag) => tag.name,
            comparator: (a: {id: number}, b: {id: number}) => a.id === b.id
        };

        this.appSelectConfig = {
            getLabel: (app: FilterApplication) => app.fileName,
            comparator: (option: FilterApplication, b: FilterApplication|number) => {
                if (typeof b === 'number') {
                    return option.id === b;
                } else {
                    return option.id === b.id;
                }
            }
        };
    }

    private getDefaultFilter(applicationGroup: ApplicationGroup): ReportFilter {
        return {
            id: null,
            // applicationGroup: applicationGroup,
            selectedApplications: [],
            includeTags: [],
            excludeTags: [],
            includeCategories: [],
            excludeCategories: [],
            enabled: false
        };
    }

    ngOnInit(): void {
        this.routerSubscriptions.push(this._router.events.filter(event => event instanceof NavigationEnd).subscribe(_ => {
            let flatData = this._routeFlattenerService.getFlattenedRouteData(this._activatedRoute.snapshot);
            this.group = flatData.data['applicationGroup'];
            this.filter = this.group.reportFilter || this.getDefaultFilter(this.group);

            this._filterService.getTags(this.group).subscribe(
                tags => {
                    this.tags = this.accumulateAllTags([], tags);
                },
                error => this._notificationService.error(utils.getErrorMessage(error))
            );

            this._filterService.getCategories(this.group).subscribe(
                categories => this.categories = categories,
                error => this._notificationService.error(utils.getErrorMessage(error))
            );

            let lastExecution = this.getLastExecution(this.group);

            if (lastExecution != null) {
                this._filterService.getFilterApplications(this.group, lastExecution)
                    .subscribe(filterApplications => {
                        this.filterApplications = filterApplications;
                        this.isFilterUpToDate = this.areApplicationsInFilterUpToDate();
                    });
            }
        }));
    }

    private areApplicationsInFilterUpToDate(): boolean {
        // compare filter applications with app group apps
        let filterApplicationsWithoutSharedLibs = this.filterApplications.filter(application => application.fileName !== 'shared-libs');

        if (filterApplicationsWithoutSharedLibs.length !== this.group.applications.length) {
            // filter apps = at most real apps + 1 (shared libraries virtual application)
            return false;
        }

        let hashMap = new Map<string, any>();

        this.group.applications.forEach(application => hashMap.set(application.inputPath, application));
        let areAllApplicationsInMap = filterApplicationsWithoutSharedLibs.reduce((accumulator, filterApplication) => {
            return accumulator && hashMap.has(filterApplication.inputPath);
        }, true);

        return areAllApplicationsInMap;
    }

    private getLastExecution(applicationGroup: ApplicationGroup): WindupExecution
    {
        let execution: WindupExecution = null;

        let allExecutions = applicationGroup.executions.slice(); // make copy of array

        allExecutions.sort((a: WindupExecution, b: WindupExecution) => {
            return <any>b.timeCompleted - <any>a.timeCompleted;
        });

        if (allExecutions.length > 0)
        {
            execution = allExecutions[0];
        }


        return execution;
    }

    private accumulateAllTags(accumulatedTags: Tag[], tags: Tag[]): Tag[] {
        tags.forEach(tag => {
            if (!accumulatedTags.find(existingTag => existingTag.name == tag.name)) {
                accumulatedTags.push(tag);
            }

            this.accumulateAllTags(accumulatedTags, tag.containedTags);
        });

        return accumulatedTags;
    }

    ngOnDestroy(): void {
        this.routerSubscriptions.forEach(_ => _.unsubscribe());
    }

    saveFilter() {
        this._filterService.updateFilter(this.group, this.filter).subscribe(() => {
                this._notificationService.success('Filter successfully updated');
            },
            error => this._notificationService.error(utils.getErrorMessage(error))
        );
    }

    cancel() {
        let route = ['projects', this.group.migrationProject.id, 'groups', this.group.id];
        this._router.navigate(route);
        return false;
    }

    resetFilter() {
        if (window.confirm('Do you really want to reset filter?')) {
            this.filter.excludeCategories = [];
            this.filter.excludeTags = [];
            this.filter.includeCategories = [];
            this.filter.includeTags = [];
            this.filter.selectedApplications = [];
            this.filter.enabled = false;
        }
    }
}
