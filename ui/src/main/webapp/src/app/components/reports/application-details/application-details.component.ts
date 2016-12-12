import {Component, OnInit} from "@angular/core";
import {ProjectTraversalService} from "../../../services/graph/project-traversal.service";
import {Params, ActivatedRoute} from "@angular/router";
import {utils} from "../../../utils";
import {NotificationService} from "../../../services/notification.service";
import {PersistedProjectModelTraversalModel} from "../../../generated/tsModels/PersistedProjectModelTraversalModel";
import {PersistedTraversalChildFileModel} from "../../../generated/tsModels/PersistedTraversalChildFileModel";

@Component({
    templateUrl: '/application-details.component.html',
    styleUrls: ['/application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {
    tagInfo = [
        { "name": "Java EE", "value": 15 },
        { "name": "configuration", "value": 5 },
        { "name": "logging", "value": 4 },
        { "name": "Webservice", "value": 2 },
        { "name": "Messaging", "value": 2 }
    ];

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
    allProjects:PersistedProjectModelTraversalModel[] = [];
    filesByProject:Map<any, PersistedTraversalChildFileModel[]> = new Map<any, PersistedTraversalChildFileModel[]>();


    constructor(
        private route:ActivatedRoute,
        private _projectTraversalService:ProjectTraversalService,
        private notificationService: NotificationService,
    ) {}

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this._projectTraversalService.getRootTraversals(this.execID, "ALL").subscribe(
                traversals => {
                    this.allProjects = [];
                    this.flattenTraversals(traversals);
                },
                error => this.notificationService.error(utils.getErrorMessage(error))
            );
        });
    }

    private flattenTraversals(traversals:PersistedProjectModelTraversalModel[]) {
        traversals.forEach(traversal => {
            traversal.files.subscribe(files => this.filesByProject.set(traversal.vertexId, files));
            this.allProjects.push(traversal);
            traversal.children.subscribe(
                children => {
                    this.flattenTraversals(children);
                },
                error => this.notificationService.error(utils.getErrorMessage(error)));
        });
    }

    toggleCollapsed(project) {
        //project.collapsed = !project.collapsed;
    }

    collapseAll() {
        //this.allProjects.forEach((project) => project.collapsed = true);
    }

    expandAll() {
        //this.allProjects.forEach((project) => project.collapsed = false);
    }
}