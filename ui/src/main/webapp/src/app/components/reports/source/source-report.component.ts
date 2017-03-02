import {Component, OnInit, AfterViewChecked} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";

import * as showdown from "showdown";

import "./prism";

import {FileModelService} from "../../../services/graph/file-model.service";
import {FileModel} from "../../../generated/tsModels/FileModel";
import {ClassificationService} from "../../../services/graph/classification.service";
import {ClassificationModel} from "../../../generated/tsModels/ClassificationModel";
import {InlineHintModel} from "../../../generated/tsModels/InlineHintModel";
import {HintService} from "../../../services/graph/hint.service";
import {LinkModel} from "../../../generated/tsModels/LinkModel";
import {SourceFileModel} from "../../../generated/tsModels/SourceFileModel";
import {GraphJSONToModelService} from "../../../services/graph/graph-json-to-model.service";
import {utils} from "../../../utils";
import {Http} from "@angular/http";
import {LinkableModel} from "../../../generated/tsModels/LinkableModel";
import {Observable} from "rxjs";
import {NotificationService} from "../../../services/notification.service";

@Component({
    templateUrl: './source-report.component.html',
    styleUrls: [ './source-report.component.css' ]
})
export class SourceReportComponent implements OnInit, AfterViewChecked {
    private execID: number;
    private fileID: number;
    private fileSource: string = "Loading...";
    private fileLines: string[];

    private fileModel: FileModel;
    private sourceFileModel: SourceFileModel;
    private transformedLinks: LinkModel[];

    private classifications: ClassificationModel[];
    private classificationLinks: Map<ClassificationModel, LinkModel[]> = new Map<ClassificationModel, LinkModel[]>();
    private hints: InlineHintModel[];
    private rendered: boolean = false;

    constructor(private route: ActivatedRoute,
                private fileModelService: FileModelService,
                private classificationService: ClassificationService,
                private hintService: HintService,
                private notificationService: NotificationService,
                private http: Http,
                private _graphJsonToModelService: GraphJSONToModelService<any>
    ) { }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.execID = +params['executionId'];
            this.fileID = +params['fileId'];

            this.fileModelService.getFileModel(this.execID, this.fileID).subscribe(
                (fileModel) => {
                    this.fileModel = fileModel;

                    // Assume this is a source file model and deserialize it as one... if it is not, this will have a lot of null
                    //   properties
                    this.sourceFileModel = <SourceFileModel>this._graphJsonToModelService.fromJSON(this.fileModel.data, SourceFileModel);
                    this.sourceFileModel.linksToTransformedFiles.subscribe((links) => this.transformedLinks = links);
                },
                error => this.notificationService.error(utils.getErrorMessage(error)));

            this.classificationService.getClassificationsForFile(this.execID, this.fileID)
                .subscribe((classifications) => this.classifications = classifications,
                error => this.notificationService.error(utils.getErrorMessage(error)));

            this.hintService.getHintsForFile(this.execID, this.fileID)
                .subscribe((hints) => this.hints = hints,
                error => this.notificationService.error(utils.getErrorMessage(error)));

            this.fileModelService.getSource(this.execID, this.fileID)
                .subscribe((fileSource) => {
                    this.fileSource = fileSource;
                    this.fileLines = fileSource.split(/[\r\n]/).map((line) => line + "\n");
                },
                error => this.notificationService.error(utils.getErrorMessage(error)));
        });
    }

    private getClassificationLinks(classification:ClassificationModel):Observable<LinkModel[]> {
        let linkableModel = <LinkableModel>this._graphJsonToModelService.translateType(classification, LinkableModel);
        return linkableModel.links;
    }

    get storyPoints():number {
        let points = 0;
        if (this.hints)
            this.hints.forEach((hint) => points += hint.effort);

        if (this.classifications)
            this.classifications.forEach((classification) => points += classification.effort);

        return points;
    }

    private hintMatches(hint:InlineHintModel, lineNumber:number):boolean {
        let hintLine = hint.data["lineNumber"];

        // workaround an odd edge case
        if (hintLine <= 0)
            hintLine = 1;

        return hintLine == (lineNumber+1)
    }

    noteReferences(line:string, lineNumber:number): string {
        if (!this.hints)
            return "";

        return this.hints
            .filter((hint) => this.hintMatches(hint, lineNumber))
            .map((hint) => "note-" + hint.vertexId)
            .join(", ");
    }

    lineClass(line:string, lineNumber:number): string {
        if (!this.hints)
            return "";

        let styleClasses = this.hints
            .filter((hint) => this.hintMatches(hint, lineNumber))
            .map((hint) => "note-" + hint.vertexId)
            .join(", ");

        if (styleClasses)
            styleClasses = "note-placeholder box box-bg " + styleClasses;

        return styleClasses;
    }

    filetype():string {
        if (!this.fileModel)
            return "";

        let lastDotIndex = this.fileModel.fileName.lastIndexOf(".");
        if (lastDotIndex == -1 || lastDotIndex == this.fileModel.fileName.length)
            return "";

        return this.fileModel.fileName.substring(lastDotIndex + 1);
    }

    markdown(input:string):string {
        return new showdown.Converter().makeHtml(input);
    }

    ngAfterViewChecked(): void {
        if (this.rendered)
            return;

        if (!this.fileSource || !this.fileModel || this.hints == null || this.classifications == null)
            return;

        // Add the hint nodes to appropriate lines.
        Prism.hooks.add('after-highlight', function () {
            let nodeList = document.querySelectorAll('.has-notes .note-placeholder');
            for (let i = 0; i < nodeList.length; i++) {
                let placeholder = nodeList.item(i);
                let idList = placeholder.getAttribute('data-note').split(",");
                idList.forEach((id) => {
                    id = id.trim();
                    let note = document.getElementById(id);
                    placeholder.appendChild(note);
                });
            }
        });

        Prism.highlightAll(false);
        this.rendered = true;
    }
}
