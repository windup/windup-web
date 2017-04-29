import {Component, OnInit, ElementRef} from "@angular/core";
import {
    ApplicationDetailsService, ApplicationDetailsFullDTO,
    ProjectTraversalFullDTO, HintFullDTO, FileFullDTO
} from "./application-details.service";
import {Params, ActivatedRoute, Router} from "@angular/router";
import {utils} from "../../shared/utils";
import {NotificationService} from "../../core/notification/notification.service";
import {Http} from "@angular/http";
import {compareTraversals, compareTraversalChildFiles} from "../file-path-comparators";
import {TagFilterService} from "../tag-filter.service";
import {TypeReferenceStatisticsService} from "./type-reference-statistics.service";
import {TagDataService} from "../tag-data.service";
import {TreeData} from "../../shared/js-tree-angular-wrapper.component";
import {calculateColorScheme} from "../../shared/color-schemes";
import {PersistedProjectModelTraversalModel} from "../../generated/tsModels/PersistedProjectModelTraversalModel";
import {FilterableReportComponent} from "../filterable-report.component";
import {RouteFlattenerService} from "../../core/routing/route-flattener.service";

@Component({
    templateUrl: './application-details.component.html',
    styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent extends FilterableReportComponent implements OnInit {
    applicationDetails:ApplicationDetailsFullDTO;
    rootProjects:ProjectTraversalFullDTO[] = [];
    traversalsForCanonicalVertexID:Map<number, ProjectTraversalFullDTO[]> = new Map<number, ProjectTraversalFullDTO[]>();
    tagsForFile:Map<number, {name: string, level: string}[]> = new Map<number, {name: string, level: string}[]>();

    allHints:HintFullDTO[] = [];
    globalPackageUseData:ChartStatistic[] = [];
    applicationTree:TreeData[] = [];

    /**
     * This contains all projects. Do note, however, that if a project appears more than once, it will only contain
     * one instance. The others will appear in the duplicateProjects Map.
     */
    allProjects:ProjectTraversalFullDTO[] = [];
    totalPoints: number = null;
    pointsByProject:Map<number, number> = new Map<number, number>();
    pointsByFile:Map<number, number> = new Map<number, number>();

    projectsCollapsed:Map<number, boolean> = new Map<number, boolean>();
    packageFrequenciesByProject:Map<number, ChartStatistic[]> = new Map<number, ChartStatistic[]>();
    tagFrequencies:ChartStatistic[];
    tagFrequenciesByProject:Map<number, ChartStatistic[]>;

    constructor(
        private _element: ElementRef,
        _router: Router,
        _routeFlattener: RouteFlattenerService,
        _activatedRoute: ActivatedRoute,
        private _applicationDetailsService:ApplicationDetailsService,
        private _notificationService:NotificationService,
        private _tagDataService:TagDataService,
        private _http:Http
    ) {
        super(_router, _activatedRoute, _routeFlattener);
    }

    getColorScheme(len) {
        return calculateColorScheme(len);
    }

    ngOnInit(): void {
        this.addSubscription(this.flatRouteLoaded.subscribe(flattenedRoute => {
            this.loadFilterFromRouteData(flattenedRoute);

            this._applicationDetailsService.getApplicationDetailsData(this.execution.id, this.reportFilter).subscribe(
                applicationDetailsDto => {
                    // Make sure tag data is loaded first
                    this._tagDataService.getTagData().subscribe((tagData) => {
                        this.applicationDetails = applicationDetailsDto;
                        this.rootProjects = applicationDetailsDto.traversals;

                        this.createProjectTreeData(null, this.rootProjects);
                        this.flattenTraversals(this.rootProjects);

                        this.globalPackageUseData = this.calculateTreeDataForHints(this.allHints);
                        this.calculateTagFrequencies();
                        this.storeTotalPoints();
                    });
                },
                error => this._notificationService.error(utils.getErrorMessage(error))
            );
        }));
    }

    selectedProject(treeData:TreeData) {
        let canonicalVertexID = treeData.data;
        let element = this._element.nativeElement.querySelector(`div[id="${canonicalVertexID}"]`);

        if (element) {
            let newOffset = element.offsetTop - 82; // Has to be offset for the fixed header for some reason.
            window.scrollTo(0, newOffset);
        }
    }

    private createProjectTreeData(parentTreeData:TreeData, traversals:ProjectTraversalFullDTO[]) {
        traversals.forEach(traversal => {
            // Store data for the tree
            let newTreeData:TreeData = {
                id: traversal.id,
                name: traversal.path,
                childs: [],
                opened: true,
                data: traversal.canonicalID
            };

            if (parentTreeData) {
                parentTreeData.childs.push(newTreeData);
            } else {
                this.applicationTree = this.applicationTree.concat(newTreeData);
            }

            if (!traversal.children)
                return;

            this.createProjectTreeData(newTreeData, traversal.children);
        });
    }

    private flattenTraversals(traversals:ProjectTraversalFullDTO[]) {
        traversals = traversals.sort(compareTraversals);

        traversals.forEach(traversal => {

            // Maintain a list by canonical id, so that we can display this on the canonical project
            let traversalsForCanonicalID = this.traversalsForCanonicalVertexID.get(traversal.canonicalID);
            if (!traversalsForCanonicalID)
                traversalsForCanonicalID = [];
            traversalsForCanonicalID.push(traversal);
            traversalsForCanonicalID = traversalsForCanonicalID.sort(compareTraversals);
            this.traversalsForCanonicalVertexID.set(traversal.canonicalID, traversalsForCanonicalID);

            // If these do not match, then this is not a canonical project.
            // We don't need to calculate points for this.
            if (traversal.currentID != traversal.canonicalID)
                return;

            this.allProjects.push(traversal);
            this.storeProjectData(traversal);
            this.storePointsForTraversal(traversal);
        });
    }

    private visibleMap: Map<number, boolean> = new Map<number, boolean>();
    private setIsVisibleStatus(traversal:ProjectTraversalFullDTO, visible:boolean) {
        this.visibleMap.set(traversal.id, visible);
    }
    private isVisible(traversal:ProjectTraversalFullDTO):boolean {
        return this.visibleMap.get(traversal.id) || false;
    }

    private hasDuplicateProjects(traversal:ProjectTraversalFullDTO):boolean {
        return this.traversalsForCanonicalVertexID.get(traversal.canonicalID).length > 1;
    }

    private storeProjectData(traversal:ProjectTraversalFullDTO) {
        let files = traversal.files.sort(compareTraversalChildFiles);

        files.forEach(file => {
            file.classifications.forEach(classification => {
                let tagFilterService = new TagFilterService(null);
                let tagStrings = classification.tags.map(tag => tag.nameString);

                // Remove it if it doesn't match the filter
                if (!tagFilterService.tagsMatch(tagStrings)) {
                    file.classificationIDs.splice(file.classificationIDs.indexOf(classification.id), 1);
                    file.classifications.splice(file.classifications.indexOf(classification), 1);
                }
            });
            file.hints.forEach(hint => {
                let tagFilterService = new TagFilterService(null);
                let tagStrings = hint.tags.map(tag => tag.nameString);

                // Remove it if it doesn't match the filter
                if (!tagFilterService.tagsMatch(tagStrings)) {
                    file.hintIDs.splice(file.hintIDs.indexOf(hint.id), 1);
                    file.hints.splice(file.hints.indexOf(hint), 1);
                } else {
                    this.allHints.push(hint);
                }
            });

            // this is basically just creating a cache
            this.storeTagsForFile(file);
        });
        this.setPackageFrequenciesByProject(traversal, files);

        this.flattenTraversals(traversal.children);
    }

    private convertToChartStatistic(tagStatistics:Map<string, number>) {
        if (!tagStatistics)
            return;

        let result = [];
        tagStatistics.forEach((count, tagName) => {
            result.push(new ChartStatistic(tagName, count));
        });
        result = result.sort(chartStatisticComparator);
        return result;
    }

    private calculateTagFrequencies() {
        // Update them completely
        this.tagFrequencies = [];
        this.tagFrequenciesByProject = new Map<number, ChartStatistic[]>();

        if (!this.allProjects)
            return;

        let allFrequencyStatsMap = new Map<string, number>();
        this.allProjects.forEach(traversal => {
            this.calculateTagFrequenciesForProject(allFrequencyStatsMap, traversal);
        });
        this.tagFrequencies = this.convertToChartStatistic(allFrequencyStatsMap);
    }

    private calculateTagFrequenciesForProject(allFrequencyStatsMap:Map<string, number>, traversal:ProjectTraversalFullDTO) {
        let currentProjectMap = new Map<string, number>();

        traversal.files.forEach(file => {
            this.tagsForFile.get(file.fileModelVertexID).forEach(tag => {
                let rootTags = this._tagDataService.getRootTags(tag.name);

                if (!rootTags)
                    return;

                rootTags.forEach(parent => {
                    let name = parent.title ? parent.title : parent.tagName;

                    // Update the global stats
                    if (allFrequencyStatsMap.has(name))
                        allFrequencyStatsMap.set(name, allFrequencyStatsMap.get(name) + 1);
                    else
                        allFrequencyStatsMap.set(name, 1);

                    // Update the per-project stats
                    if (currentProjectMap.has(name))
                        currentProjectMap.set(name, currentProjectMap.get(name) + 1);
                    else
                        currentProjectMap.set(name, 1);
                });
            });
        });

        // Don't bother to set it if there are fewer than two tags.
        if (currentProjectMap.size < 2)
            return;

        this.tagFrequenciesByProject.set(traversal.id, this.convertToChartStatistic(currentProjectMap));
    }

    storeTagsForFile(file:FileFullDTO):{name: string, level: string}[] {
        if(this.tagsForFile.has(file.fileModelVertexID))
            return this.tagsForFile.get(file.fileModelVertexID);

        let tags = file.tags.map(tagDTO => { return { name: tagDTO.nameString, level: tagDTO.levelString }; });

        file.hints
            .forEach(hint => {
                hint.tags.forEach(tag => {
                    if (tags.findIndex(existingTag => existingTag.name == tag.nameString) != -1)
                        return;

                    tags.push({name: tag.nameString, level: tag.levelString});
                });
            });
        file.classifications
            .forEach(classification => {
                classification.tags.forEach(tag => {
                    if (tags.findIndex(existingTag => existingTag.name == tag.nameString) != -1)
                        return;

                    tags.push({name: tag.nameString, level: tag.levelString});
                });
            });

        tags = tags.sort((tag1, tag2) => {
            return tag1.name.localeCompare(tag2.name);
        });

        this.tagsForFile.set(file.fileModelVertexID, tags);
        return tags;
    }

    private setPackageFrequenciesByProject(traversal:ProjectTraversalFullDTO, files:FileFullDTO[]) {
        if (!files)
            return;

        let hints:HintFullDTO[] = [];
        files.forEach((file) => {
            if (!file.hintIDs)
                return;

            file.hints.forEach(hint => hints.push(hint));
        });

        this.packageFrequenciesByProject.set(traversal.id, this.calculateTreeDataForHints(hints));
    }

    private calculateTreeDataForHints(hints:HintFullDTO[]):ChartStatistic[] {
        let service = new TypeReferenceStatisticsService();
        let resultMap = service.getPackageUseFrequencies(hints, 2, this._http);
        let result = [];
        resultMap.forEach((value, key) => {
            result.push(new ChartStatistic(key, value));
        });
        result = result.sort(chartStatisticComparator);

        let MAX_RESULT = 9;
        // Collect the bottom of the list for the "Other" category.
        if (MAX_RESULT < result.length)
        {
            // Add the "Other" category up.
            let other = 0;
            result.slice(MAX_RESULT).forEach(item => {
                other += item.value;
            });

            result = result.slice(0, MAX_RESULT);
            if (other > 0)
                result.push(new ChartStatistic("Other", other));
        }
        return result;
    }

    storePointsForTraversal(traversal:ProjectTraversalFullDTO) {
        let total = 0;
        traversal.files.forEach(file => {
            let pointsForFile = this.storyPoints(file);
            this.pointsByFile.set(file.fileModelVertexID, pointsForFile);
            total += pointsForFile;
        });
        this.pointsByProject.set(traversal.canonicalID, total);

        if (this.projectsCollapsed.get(traversal.id) == null) {
            this.projectsCollapsed.set(traversal.id, total == 0);
        }
    }

    storeTotalPoints() {
        this.totalPoints = 0;
        this.allProjects.forEach(traversal => {
            this.totalPoints += this.pointsByProject.get(traversal.canonicalID);
        });
    }

    storyPoints(file:FileFullDTO): number {
        let total = 0;

        file.classifications
            .forEach(classification => {
                if (classification.effort && !isNaN(classification.effort))
                    total += classification.effort
            });

        file.hints
            .forEach(hint => {
                if (hint.effort && !isNaN(hint.effort))
                    total += hint.effort
            });

        return total;
    }

    allExpanded(): boolean {
        let allExpanded = true;
        this.allProjects.forEach((traversal) => {
            if (this.projectsCollapsed.get(traversal.id))
                allExpanded = false;
        });
        return allExpanded;
    }

    allCollapsed(): boolean {
        let allCollapsed = true;
        this.allProjects.forEach((traversal) => {
            if (!this.projectsCollapsed.get(traversal.id))
                allCollapsed = false;
        });
        return allCollapsed;
    }

    toggleCollapsed(traversal:ProjectTraversalFullDTO) {
        if (!this.projectsCollapsed.get(traversal.id))
            this.projectsCollapsed.set(traversal.id, true);
        else
            this.projectsCollapsed.set(traversal.id, false);
    }

    setCollapsed(traversal:ProjectTraversalFullDTO) {
        this.projectsCollapsed.set(traversal.id, true);
    }

    setExpanded(traversal:ProjectTraversalFullDTO) {
        this.projectsCollapsed.set(traversal.id, false);
    }

    collapseAll() {
        this.allProjects.forEach((project) => this.projectsCollapsed.set(project.id, true));
    }

    expandAll() {
        this.allProjects.forEach((project) => this.projectsCollapsed.set(project.id, false));
    }

    isCollapsed(traversal:ProjectTraversalFullDTO) {
        return this.projectsCollapsed.get(traversal.id);
    }
}

class ChartStatistic {
    name: string;
    value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

function chartStatisticComparator(stat1:ChartStatistic, stat2:ChartStatistic): number {
    return stat2.value - stat1.value;
}
