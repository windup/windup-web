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

@Component({
    templateUrl: '/application-details.component.html',
    styleUrls: ['/application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {

    /*
     * Sample data for a package pie -- Just hardcoded for now
     */
    packageInfo = [
        { "name": "weblogic.i18n.*", "value": 27 },
        { "name": "weblogic.application.*", "value": 16 },
        { "name": "weblogic.transaction.*", "value": 9 },
        { "name": "javax.naming.*", "value": 7 },
        { "name": "weblogic.jndi.*", "value": 7 },
        { "name": "javax.management.*", "value": 5 },
        { "name": "weblogic.servlet.*", "value": 3 },
        { "name": "weblogic.ejb.*", "value": 3 },
        { "name": "Other", "value": 1 }
    ];

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    private execID: number;
    rootProjects:PersistedProjectModelTraversalModel[] = [];

    allProjects:PersistedProjectModelTraversalModel[] = [];
    projectsCollapsed:Map<number, boolean> = new Map<number, boolean>();

    totalPoints: number = null;

    traversalToCanonical:Map<number, ProjectModel> = new Map<number, ProjectModel>();
    traversalToOrganizations:Map<number, OrganizationModel[]> = new Map<number, OrganizationModel[]>();
    traversalToSHA1:Map<number, string> = new Map<number, string>();

    filesByProject:Map<number, PersistedTraversalChildFileModel[]> = new Map<number, PersistedTraversalChildFileModel[]>();
    classificationsByFile:Map<number, ClassificationModel[]> = new Map<number, ClassificationModel[]>();
    hintsByFile:Map<number, InlineHintModel[]> = new Map<number, InlineHintModel[]>();
    technologyTagsByFile:Map<number, TechnologyTagModel[]> = new Map<number, TechnologyTagModel[]>();
    tagsByFile:Map<number, string[]> = new Map<number, string[]>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _route:ActivatedRoute,
        private _projectTraversalService:ProjectTraversalService,
        private _notificationService:NotificationService,
        private _http:Http
    ) {}

    ngOnInit(): void {
        this._route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this._projectTraversalService.getRootTraversals(this.execID, "ALL").subscribe(
                traversals => {
                    this.rootProjects = traversals;
                    this.allProjects = [];
                    this.flattenTraversals(traversals);
                },
                error => this._notificationService.error(utils.getErrorMessage(error))
            );
        });
    }

    private flattenTraversals(traversals:PersistedProjectModelTraversalModel[]) {
        traversals.sort(compareTraversals);

        traversals.forEach(traversal => {
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
                files.sort(compareTraversalChildFiles);
                this.filesByProject.set(traversal.vertexId, files);
                files.forEach(file => {
                    file.classifications.subscribe(classifications => {
                        this.classificationsByFile.set(file.vertexId, classifications);
                        classifications.forEach(classification => {
                            let taggableModel = <TaggableModel>new GraphJSONToModelService().translateType(classification, this._http, TaggableModel);
                            this.cacheTagsForFile(file, taggableModel);
                        });
                        this.updateTotalPoints();
                    });
                    file.hints.subscribe(hints => {
                        this.hintsByFile.set(file.vertexId, hints);
                        hints.forEach(hint => {
                            let taggableModel = <TaggableModel>new GraphJSONToModelService().translateType(hint, this._http, TaggableModel);
                            this.cacheTagsForFile(file, taggableModel);
                        });

                        this.updateTotalPoints();
                    });
                    file.technologyTags.subscribe(technologyTags => this.technologyTagsByFile.set(file.vertexId, technologyTags));
                });
            });
            this.allProjects.push(traversal);
            traversal.children.subscribe(
                children => {
                    this.flattenTraversals(children);
                },
                error => this._notificationService.error(utils.getErrorMessage(error)));
        });
    }

    private cacheTagsForFile(file:PersistedTraversalChildFileModel, taggableModel:TaggableModel) {
        taggableModel.tagModel.subscribe((tagModel) => {
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
        });
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