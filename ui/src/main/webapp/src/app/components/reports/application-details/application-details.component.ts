import {Component, OnInit, ChangeDetectorRef, ElementRef} from "@angular/core";
import {ApplicationDetailsService} from "./application-details.service";
import {Params, ActivatedRoute} from "@angular/router";
import {utils} from "../../../utils";
import {NotificationService} from "../../../services/notification.service";
import {Http} from "@angular/http";
import {compareTraversals, compareTraversalChildFiles} from "../file-path-comparators";
import {ApplicationGroup} from "windup-services";
import {TagFilterService} from "../tag-filter.service";
import {TypeReferenceStatisticsService} from "./type-reference-statistics.service";
import {TagDataService} from "../tag-data.service";
import {TreeData} from "../../js-tree-angular-wrapper.component";
import {ProjectTraversalDTO} from "windup-services";
import {ApplicationDetailsDTO} from "windup-services";
import {FileDTO} from "windup-services";
import {HintDTO} from "windup-services";

@Component({
    templateUrl: './application-details.component.html',
    styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    private execID:number;
    private group:ApplicationGroup;
    applicationDetails:ApplicationDetailsDTO;
    rootProjects:ProjectTraversalDTO[] = [];
    traversalsForCanonicalVertexID:Map<number, ProjectTraversalDTO[]> = new Map<number, ProjectTraversalDTO[]>();
    tagsForFile:Map<number, {name:string, level:string}[]> = new Map<number, {name:string, level:string}[]>();

    allHints:HintDTO[] = [];
    globalPackageUseData:ChartStatistic[] = [];
    applicationTree:TreeData[] = [];

    /**
     * This contains all projects. Do note, however, that if a project appears more than once, it will only contain
     * one instance. The others will appear in the duplicateProjects Map.
     */
    allProjects:ProjectTraversalDTO[] = [];
    totalPoints:number = null;

    projectsCollapsed:Map<number, boolean> = new Map<number, boolean>();
    packageFrequenciesByProject:Map<number, ChartStatistic[]> = new Map<number, ChartStatistic[]>();
    tagFrequencies:ChartStatistic[];
    tagFrequenciesByProject:Map<number, ChartStatistic[]>;

    constructor(
        private _element: ElementRef,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute:ActivatedRoute,
        private _applicationDetailsService:ApplicationDetailsService,
        private _notificationService:NotificationService,
        private _tagDataService:TagDataService,
        private _http:Http
    ) {}

    ngOnInit(): void {
        this._activatedRoute.parent.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.group = data.applicationGroup;

            this._activatedRoute.params.forEach((params: Params) => {
                this.execID = +params['executionId'];
                this._applicationDetailsService.getApplicationDetailsData(this.execID).subscribe(
                    applicationDetailsDto => {
                        // Make sure tag data is loaded first
                        this._tagDataService.getTagData().subscribe((tagData) => {
                            this.applicationDetails = applicationDetailsDto;
                            this.rootProjects = applicationDetailsDto.traversals;

                            this.allHints = [];
                            this.applicationTree = [];
                            this.allProjects = [];
                            this.tagsForFile.clear();
                            this.traversalsForCanonicalVertexID.clear();

                            this.createProjectTreeData(null, this.rootProjects);
                            this.flattenTraversals(this.rootProjects);

                            this.globalPackageUseData = this.calculateTreeDataForHints(this.allHints);
                            this.calculateTagFrequencies();
                        });
                    },
                    error => this._notificationService.error(utils.getErrorMessage(error))
                );
            });
        });
    }

    selectedProject(treeData:TreeData) {
        let canonicalVertexID = treeData.data;
        let element = this._element.nativeElement.querySelector(`div[id="${canonicalVertexID}"]`);

        if (element) {
            let newOffset = element.offsetTop - 82; // Has to be offset for the fixed header for some reason.
            window.scrollTo(0, newOffset);
        }
    }

    allTagStats():ChartStatistic[] {
        return this.tagFrequencies;
    }

    tagStatsForProject(traversal:ProjectTraversalDTO):ChartStatistic[] {
        return this.tagFrequenciesByProject.get(traversal.id);
    }

    private createProjectTreeData(parentTreeData:TreeData, traversals:ProjectTraversalDTO[]) {
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

    private flattenTraversals(traversals:ProjectTraversalDTO[]) {
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
        });
    }

    private hasDuplicateProjects(traversal:ProjectTraversalDTO):boolean {
        return this.traversalsForCanonicalVertexID.get(traversal.canonicalID).length > 1;
    }

    resolveString(id:number):string {
        if (id == 0)
            return null;
        return this.applicationDetails.stringCache.byID[id];
    }

    private storeProjectData(traversal:ProjectTraversalDTO) {
        let files = traversal.files.sort(compareTraversalChildFiles);

        files.forEach(file => {
            file.classificationIDs.forEach(classificationID => {
                let classification = this.applicationDetails.classifications[classificationID];
                let tagFilterService = new TagFilterService(this.group.reportFilter);
                let tagStrings = classification.tags.map(tag => this.resolveString(tag.name));

                // Remove it if it doesn't match the filter
                if (!tagFilterService.tagsMatch(tagStrings))
                    file.classificationIDs.splice(file.classificationIDs.indexOf(classificationID), 1);
            });
            file.hintIDs.forEach(hintID => {
                let hint = this.applicationDetails.hints[hintID];
                let tagFilterService = new TagFilterService(this.group.reportFilter);
                let tagStrings = hint.tags.map(tag => this.resolveString(tag.name));

                // Remove it if it doesn't match the filter
                if (!tagFilterService.tagsMatch(tagStrings))
                    file.hintIDs.splice(file.classificationIDs.indexOf(hintID), 1);
                else
                    this.allHints.push(hint);
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

    private calculateTagFrequenciesForProject(allFrequencyStatsMap:Map<string, number>, traversal:ProjectTraversalDTO) {
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

    storeTagsForFile(file:FileDTO):{name:string, level:string}[] {
        if(this.tagsForFile.has(file.fileModelVertexID))
            return this.tagsForFile.get(file.fileModelVertexID);

        let tags = file.tags.map(tagDTO => { return { name: this.resolveString(tagDTO.name), level: this.resolveString(tagDTO.level) }; });

        file.hintIDs.map(hintID => this.applicationDetails.hints[hintID])
            .forEach(hint => {
                hint.tags.forEach(tag => {
                    let tagName = this.resolveString(tag.name);
                    if (tags.findIndex(existingTag => existingTag.name == tagName) != -1)
                        return;

                    let level = this.resolveString(tag.level);
                    tags.push({name: tagName, level: level});
                });
            });
        file.classificationIDs.map(classificationID => this.applicationDetails.classifications[classificationID])
            .forEach(classification => {
                classification.tags.forEach(tag => {
                    let tagName = this.resolveString(tag.name);
                    if (tags.findIndex(existingTag => existingTag.name == tagName) != -1)
                        return;

                    let level = this.resolveString(tag.level);
                    tags.push({name: tagName, level: level});
                });
            });

        tags = tags.sort((tag1, tag2) => {
            return tag1.name.localeCompare(tag2.name);
        });

        this.tagsForFile.set(file.fileModelVertexID, tags);
        return tags;
    }

    private setPackageFrequenciesByProject(traversal:ProjectTraversalDTO, files:FileDTO[]) {
        if (!files)
            return;

        let hints:HintDTO[] = [];
        files.forEach((file) => {
            if (!file.hintIDs)
                return;

            file.hintIDs.forEach(hintID => hints.push(this.applicationDetails.hints[hintID]));
        });

        this.packageFrequenciesByProject.set(traversal.id, this.calculateTreeDataForHints(hints));
    }

    private calculateTreeDataForHints(hints:HintDTO[]):ChartStatistic[] {
        let service = new TypeReferenceStatisticsService();
        let resultMap = service.getPackageUseFrequencies(this.applicationDetails.stringCache, hints, 2, this._http);
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

    storyPointsForFiles(traversal:ProjectTraversalDTO, files:FileDTO[]):number {
        let total = 0;
        files.forEach(file => total += this.storyPoints(file));

        if (this.projectsCollapsed.get(traversal.id) == null) {
            this.projectsCollapsed.set(traversal.id, total == 0);
            this._changeDetectorRef.detectChanges();
        }

        return total;
    }

    storyPoints(file:FileDTO):number {
        let total = 0;

        file.classificationIDs
            .map(classificationID => this.applicationDetails.classifications[classificationID])
            .forEach(classification => {
                if (classification.effort && !isNaN(classification.effort))
                    total += classification.effort
            });

        file.hintIDs
            .map(hintID => this.applicationDetails.hints[hintID])
            .forEach(hint => {
                if (hint.effort && !isNaN(hint.effort))
                    total += hint.effort
            });

        return total;
    }

    allExpanded():boolean {
        let allExpanded = true;
        this.allProjects.forEach((traversal) => {
            if (this.projectsCollapsed.get(traversal.id))
                allExpanded = false;
        });
        return allExpanded;
    }

    allCollapsed():boolean {
        let allCollapsed = true;
        this.allProjects.forEach((traversal) => {
            if (!this.projectsCollapsed.get(traversal.id))
                allCollapsed = false;
        });
        return allCollapsed;
    }

    toggleCollapsed(traversal) {
        if (!this.projectsCollapsed.get(traversal.vertexId))
            this.projectsCollapsed.set(traversal.vertexId, true);
        else
            this.projectsCollapsed.set(traversal.vertexId, false);
    }

    setCollapsed(traversal) {
        this.projectsCollapsed.set(traversal.vertexId, true);
    }

    setExpanded(traversal) {
        this.projectsCollapsed.set(traversal.vertexId, false);
    }

    collapseAll() {
        this.allProjects.forEach((project) => this.projectsCollapsed.set(project.id, true));
    }

    expandAll() {
        this.allProjects.forEach((project) => this.projectsCollapsed.set(project.id, false));
    }

    isCollapsed(traversal) {
        return this.projectsCollapsed.get(traversal.vertexId);
    }
}

class ChartStatistic {
    name:string;
    value:number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}

function chartStatisticComparator(stat1:ChartStatistic, stat2:ChartStatistic):number {
    return stat2.value - stat1.value;
}