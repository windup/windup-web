import {Component, OnInit, OnDestroy} from "@angular/core";
import {ApplicationGroup, ReportFilter, Tag} from "windup-services";
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";
import {Subscription} from "rxjs";
import {ReportFilterService} from "./report-filter.service";
import {NotificationService} from "../../../services/notification.service";
import {RouteFlattenerService} from "../../../services/route-flattener.service";
import {CustomSelectConfiguration} from "../../custom-select/custom-select.component";
import {RegisteredApplication} from "windup-services";
import {Category} from "windup-services";
import {utils} from "../../../utils";
import {Location} from "@angular/common";
import {TagDataService, TagHierarchyData} from "../tag-data.service";

@Component({
    templateUrl: './report-filter.component.html'
})
export class ReportFilterComponent implements OnInit, OnDestroy {
    group: ApplicationGroup = <ApplicationGroup>{};
    filter: ReportFilter;
    tags: Tag[] = [];
    categories: Category[] = [];
    routerSubscriptions: Subscription[] = [];

    appSelectConfig: CustomSelectConfiguration;
    categoryTagSelectConfig: CustomSelectConfiguration;

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _filterService: ReportFilterService,
        private _tagService: TagDataService,
        private _notificationService: NotificationService,
        private _routeFlattenerService: RouteFlattenerService,
        private _location: Location
    ) {
        this.filter = this.getDefaultFilter(null);

        this.categoryTagSelectConfig = {
            getLabel: (tag: Tag) => tag.name,
            comparator: (a: {id: number}, b: {id: number}) => a.id === b.id
        };

        this.appSelectConfig = {
            getLabel: (app: RegisteredApplication) => app.title,
            comparator: (option: RegisteredApplication, b: RegisteredApplication|number) => {
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

            this._tagService.getTagData().subscribe(
                tags => {
                    this.tags = [];
                    this.accumulateAllTags(tags);
                },
                error => this._notificationService.error(utils.getErrorMessage(error))
            );

            this._filterService.getCategories(this.group).subscribe(
                categories => this.categories = categories,
                error => this._notificationService.error(utils.getErrorMessage(error))
            );
        }));
    }

    private accumulateAllTags(tags:TagHierarchyData[]) {
        tags.forEach(tag => {
            if (!this.tags.find(existingTag => existingTag.name == tag.tagName))
                this.tags.push({ id: null, name: tag.tagName });

            this.accumulateAllTags(tag.containedTags);
        });
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
