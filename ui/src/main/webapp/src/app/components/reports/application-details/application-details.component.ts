import {Component, OnInit, ChangeDetectorRef} from "@angular/core";
import {ProjectTraversalService} from "../../../services/graph/project-traversal.service";
import {Params, ActivatedRoute} from "@angular/router";
import {utils} from "../../../utils";
import {NotificationService} from "../../../services/notification.service";
import {PersistedProjectModelTraversalModel} from "../../../generated/tsModels/PersistedProjectModelTraversalModel";
import {PersistedTraversalChildFileModel} from "../../../generated/tsModels/PersistedTraversalChildFileModel";
import {ClassificationModel} from "../../../generated/tsModels/ClassificationModel";
import {InlineHintModel} from "../../../generated/tsModels/InlineHintModel";
import {TechnologyTagModel} from "../../../generated/tsModels/TechnologyTagModel";
import {ProjectModel} from "../../../generated/tsModels/ProjectModel";
import {OrganizationModel} from "../../../generated/tsModels/OrganizationModel";
import {GraphJSONToModelService} from "../../../services/graph/graph-json-to-model.service";
import {ArchiveModel} from "../../../generated/tsModels/ArchiveModel";
import {Http} from "@angular/http";
import {IdentifiedArchiveModel} from "../../../generated/tsModels/IdentifiedArchiveModel";
import {TaggableModel} from "../../../generated/tsModels/TaggableModel";
import {compareTraversals, compareTraversalChildFiles} from "../file-path-comparators";
import {ApplicationGroup} from "windup-services";
import {TagFilterService} from "../tag-filter.service";
import {TagSetModel} from "../../../generated/tsModels/TagSetModel";
import {forkJoin} from "rxjs/observable/forkJoin";
import {TypeReferenceStatisticsService} from "../type-reference-statistics.service";
import {TagDataService} from "../tag-data.service";
import {TreeData} from "../../js-tree-angular-wrapper.component";

@Component({
    templateUrl: '/application-details.component.html',
    styleUrls: ['/application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    private execID:number;
    private group:ApplicationGroup;
    rootProjects:PersistedProjectModelTraversalModel[] = [];

    globalPackageUseData:ChartStatistic[] = [];

    applicationTree:TreeData[] = [];

    allProjects:PersistedProjectModelTraversalModel[] = [];
    projectsCollapsed:Map<number, boolean> = new Map<number, boolean>();

    totalPoints:number = null;

    traversalToCanonical:Map<number, ProjectModel> = new Map<number, ProjectModel>();
    traversalToOrganizations:Map<number, OrganizationModel[]> = new Map<number, OrganizationModel[]>();
    traversalToSHA1:Map<number, string> = new Map<number, string>();

    filesByProject:Map<number, PersistedTraversalChildFileModel[]> = new Map<number, PersistedTraversalChildFileModel[]>();
    packageFrequenciesByProject:Map<number, ChartStatistic[]> = new Map<number, ChartStatistic[]>();
    tagFrequencies:ChartStatistic[];
    tagFrequenciesByProject:Map<number, ChartStatistic[]>;

    classificationsByFile:Map<number, ClassificationModel[]> = new Map<number, ClassificationModel[]>();
    hintsByFile:Map<number, InlineHintModel[]> = new Map<number, InlineHintModel[]>();
    technologyTagsByFile:Map<number, TechnologyTagModel[]> = new Map<number, TechnologyTagModel[]>();
    tagsByFile:Map<number, string[]> = new Map<number, string[]>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _activatedRoute:ActivatedRoute,
        private _projectTraversalService:ProjectTraversalService,
        private _notificationService:NotificationService,
        private _tagDataService:TagDataService,
        private _http:Http
    ) {}

    ngOnInit(): void {
        this._activatedRoute.parent.parent.parent.data.subscribe((data: {applicationGroup: ApplicationGroup}) => {
            this.group = data.applicationGroup;

            this._activatedRoute.params.forEach((params: Params) => {
                this.execID = +params['executionId'];
                this._projectTraversalService.getRootTraversals(this.execID, "ALL").subscribe(
                    traversals => {
                        this.rootProjects = traversals;
                        this.allProjects = [];

                        // Make sure tag data is loaded first
                        this._tagDataService.getTagData().subscribe((tagData) => {
                            this.flattenTraversals(null, traversals);
                        });
                    },
                    error => this._notificationService.error(utils.getErrorMessage(error))
                );
            });
        });
    }

    selectedProject(treeData:TreeData) {
        console.log("Selected project: " + JSON.stringify(treeData.data));
    }

    allTagStats():ChartStatistic[] {
        return this.tagFrequencies;
    }

    tagStatsForProject(traversal:PersistedProjectModelTraversalModel):ChartStatistic[] {
        return this.tagFrequenciesByProject.get(traversal.vertexId);
    }

    private flattenTraversals(parentTreeData:TreeData, traversals:PersistedProjectModelTraversalModel[]) {
        traversals = traversals.sort(compareTraversals);
        traversals.forEach(traversal => this.allProjects.push(traversal));

        traversals.forEach(traversal => {
            let newTreeData:TreeData = {
                id: traversal.vertexId,
                name: traversal.path,
                childs: [],
                data: traversal.vertexId
            };

            if (parentTreeData) {
                parentTreeData.childs.push(newTreeData);
            } else {
                this.applicationTree = this.applicationTree.concat(newTreeData);
            }

            traversal.canonicalProject
                .subscribe(canonical => {
                    this.traversalToCanonical.set(traversal.vertexId, canonical);

                    canonical.rootFileModel.subscribe(rootFileModel => {
                        let asArchive:ArchiveModel = <ArchiveModel>new GraphJSONToModelService().translateType(rootFileModel, this._http, ArchiveModel);
                        if (asArchive.organizationModels) {
                            asArchive.organizationModels.subscribe(organizations => {
                                this.traversalToOrganizations.set(traversal.vertexId, organizations);
                            });

                            if (asArchive.discriminator.indexOf(IdentifiedArchiveModel.discriminator) != -1)
                                this.traversalToSHA1.set(traversal.vertexId, asArchive.sHA1Hash);
                        }
                    });
                });

            traversal.files.subscribe(files => {
                files = files.sort(compareTraversalChildFiles);

                files.forEach(file => {
                    file.classifications.zip(file.hints).subscribe(hintsAndClassifications => {
                        let classifications = hintsAndClassifications[0];
                        let hints = hintsAndClassifications[1];

                        let classificationTagMapObservables = classifications.map(classification => {
                            let taggableModel = <TaggableModel>new GraphJSONToModelService().translateType(classification, this._http, TaggableModel);
                            return taggableModel.tagModel.map(tagModel => {
                                return {classification: classification, tagModel: tagModel}
                            });
                        });

                        forkJoin(classificationTagMapObservables).subscribe(
                            (classificationAndTags:{classification: ClassificationModel, tagModel: TagSetModel}[]) => {
                                classificationAndTags.forEach(classificationAndTag => {
                                    let tagFilterService = new TagFilterService(this.group.reportFilter);
                                    if (classificationAndTag.tagModel && !tagFilterService.tagsMatch(classificationAndTag.tagModel.tags))
                                        classifications.splice(classifications.indexOf(classificationAndTag.classification), 1);
                                    else
                                        this.cacheTagsForFile(file, classificationAndTag.tagModel);
                                });
                            }
                        );

                        let hintTagMapObservables = hints.map(hint => {
                            let taggableModel = <TaggableModel>new GraphJSONToModelService().translateType(hint, this._http, TaggableModel);
                            return taggableModel.tagModel.map(tagModel => {
                                return {hint: hint, tagModel: tagModel};
                            });
                        });

                        forkJoin(hintTagMapObservables).subscribe(
                            (hintAndTags:{hint: InlineHintModel, tagModel: TagSetModel}[]) => {
                                hintAndTags.forEach(hintAndTag => {
                                    let tagFilterService = new TagFilterService(this.group.reportFilter);
                                    if (hintAndTag.tagModel && !tagFilterService.tagsMatch(hintAndTag.tagModel.tags))
                                        hints.splice(hints.indexOf(hintAndTag.hint), 1);
                                    else
                                        this.cacheTagsForFile(file, hintAndTag.tagModel);
                                })
                            });

                        this.classificationsByFile.set(file.vertexId, classifications);
                        this.hintsByFile.set(file.vertexId, hints);

                        this.filesByProject.set(traversal.vertexId, files);
                        this.setPackageFrequenciesByProject(traversal, files);
                        this.updateTotalPoints();
                        this.calculateTagFrequencies();
                    });

                    file.technologyTags.subscribe(technologyTags => this.technologyTagsByFile.set(file.vertexId, technologyTags));
                });
            });
            traversal.children.subscribe(
                children => {
                    this.flattenTraversals(newTreeData, children);
                },
                error => this._notificationService.error(utils.getErrorMessage(error)));
        });
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

    private calculateTagFrequenciesForProject(allFrequencyStatsMap:Map<string, number>, traversal:PersistedProjectModelTraversalModel) {
        let currentProjectMap = new Map<string, number>();

        if (!this.filesByProject.get(traversal.vertexId))
            return;

        this.filesByProject.get(traversal.vertexId).forEach(file => {
            if (!this.tagsByFile.get(file.vertexId))
                return;

            this.tagsByFile.get(file.vertexId).forEach(tag => {
                let rootTags = this._tagDataService.getRootTags(tag);

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

        this.tagFrequenciesByProject.set(traversal.vertexId, this.convertToChartStatistic(currentProjectMap));
    }

    private setPackageFrequenciesByProject(traversal:PersistedProjectModelTraversalModel, files:PersistedTraversalChildFileModel[]) {
        if (!files)
            return;

        let hints = [];
        files.forEach((file) => {
            let hintsForFile = this.hintsByFile.get(file.vertexId);

            if (!hintsForFile)
                return;

            hintsForFile.forEach(hint => hints.push(hint));
        });

        this.packageFrequenciesByProject.set(traversal.vertexId, this.calculateTreeDataForHints(hints));

        let allHints = [];
        this.hintsByFile.forEach((hints, file) => {
            hints.forEach(hint => allHints.push(hint));
        });

        this.globalPackageUseData = this.calculateTreeDataForHints(allHints);
    }

    private calculateTreeDataForHints(hints:InlineHintModel[]):ChartStatistic[] {
        let service = new TypeReferenceStatisticsService();
        let resultMap = service.getPackageUseFrequencies(hints, 2, this._http);
        let result = [];
        resultMap.forEach((value, key) => {
            result.push(new ChartStatistic(key, value));
        });
        return result.sort(chartStatisticComparator);
    }

    private cacheTagsForFile(file:PersistedTraversalChildFileModel, tagModel:TagSetModel) {
        if (tagModel == null)
            return;

        let tagsByFile = this.tagsByFile.get(file.vertexId);
        if (!tagsByFile)
            tagsByFile = [];

        tagModel.tags.forEach(tag => {
            if (tagsByFile.indexOf(tag) == -1)
                tagsByFile.push(tag);
        });

        this.tagsByFile.set(file.vertexId, tagsByFile);
    }

    updateTotalPoints() {
        let total = 0;
        this.classificationsByFile.forEach(classifications => {
            classifications.forEach(classification => {
                if (classification.effort && !isNaN(classification.effort))
                    total += classification.effort;
            });
        });

        this.hintsByFile.forEach(hints => {
            hints.forEach(hint => {
                if (hint.effort && !isNaN(hint.effort))
                    total += hint.effort;
            });
        });

        this.totalPoints = total;
    }

    storyPointsForFiles(traversal, files:PersistedProjectModelTraversalModel[]):number {
        let total = 0;
        files.forEach(file => total += this.storyPoints(file));

        if (this.projectsCollapsed.get(traversal.vertexId) == null) {
            this.projectsCollapsed.set(traversal.vertexId, total == 0);
            this._changeDetectorRef.detectChanges();
        }

        return total;
    }

    storyPoints(file:PersistedProjectModelTraversalModel):number {
        let total = 0;
        if (this.classificationsByFile.get(file.vertexId))
            this.classificationsByFile.get(file.vertexId).forEach(classification => {
                if (classification.effort && !isNaN(classification.effort))
                    total += classification.effort
            });

        if (this.hintsByFile.get(file.vertexId)) {
            this.hintsByFile.get(file.vertexId).forEach(hint => {
                if (hint.effort && !isNaN(hint.effort))
                    total += hint.effort
            });
        }
        return total;
    }

    allExpanded():boolean {
        let allExpanded = true;
        this.allProjects.forEach((traversal) => {
            if (this.projectsCollapsed.get(traversal.vertexId))
                allExpanded = false;
        });
        return allExpanded;
    }

    allCollapsed():boolean {
        let allCollapsed = true;
        this.allProjects.forEach((traversal) => {
            if (!this.projectsCollapsed.get(traversal.vertexId))
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
        this.allProjects.forEach((project) => this.projectsCollapsed.set(project.vertexId, true));
    }

    expandAll() {
        this.allProjects.forEach((project) => this.projectsCollapsed.set(project.vertexId, false));
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
    return stat1.value - stat2.value;
}