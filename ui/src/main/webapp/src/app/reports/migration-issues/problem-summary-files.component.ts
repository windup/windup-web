import {Component, Input, OnInit} from "@angular/core";
import {FileModel} from "../../generated/tsModels/FileModel";
import {ActivatedRoute, Router} from "@angular/router";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {PaginationService} from "../../shared/pagination.service";

import * as showdown from "showdown";

@Component({
    selector: 'wu-problem-summary-files',
    templateUrl: './problem-summary-files.component.html',
    styleUrls: ['./problem-summary-files.component.scss']
})
export class ProblemSummaryFilesComponent implements OnInit {
    _problemSummaryFiles: any[];

    @Input()
    issue: ProblemSummary;

    pagination = {
        itemsPerPage: 10,
        page: 1
    };

    currentPageFiles: any[];

    executedRuleUrl: any;


    private markdownCache: Map<string, string> = new Map<string, string>();

    public constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _graphJsonToModelService: GraphJSONToModelService<any>,
        private _paginationService: PaginationService
    ) {
    }

    @Input()
    public set problemSummaryFiles(files: any[]) {
        this._problemSummaryFiles = files || [];
        this.changePage();
    }

    public get problemSummaryFiles() {
        return this._problemSummaryFiles;
    }

    ngOnInit(): void {
        this.delayedPrismRender();
        this.parseExecutedRulesPath();
    }

    protected parseExecutedRulesPath() {
        let currentUrl = this._activatedRoute.snapshot.pathFromRoot.reduce<string>((accumulator, item) => {
            let currentPart = item.url.reduce((acc, itm) => {
                return acc.concat((itm.path.length > 0 ? ('/'.concat(itm.path)) : ''));
            }, '');

            return accumulator + currentPart;
        }, '');

        let lastSlash = currentUrl.lastIndexOf('/');
        let newPath = currentUrl.substring(0, lastSlash).concat('/executed-rules');
        this.executedRuleUrl = [newPath];
    }

    changePage() {
        this.currentPageFiles = this._paginationService.getPage(
            this.problemSummaryFiles,
            this.pagination.page,
            this.pagination.itemsPerPage
        );
    }

    navigateToSource(file: any) {
        let fileModel = <FileModel>this._graphJsonToModelService.fromJSON(file, FileModel);
        ///projects/32057/groups/32058/reports/32121/source/32121
        let newPath = `source/${fileModel.vertexId}`;
        this._router.navigate([newPath], { relativeTo: this._activatedRoute });

        return false;
    }

    private delayedPrismRender() {
        const timeout = 60 * 1000;
        // Colorize the included code snippets on the first displaying.
        setTimeout(() => Prism.highlightAll(false), timeout);
    }

    renderMarkdownToHtml(markdownCode: string): string {
        // The class="language-java" is already in <code>
        // <pre><code class="language-{{filetype()}}">

        let html: string;
        if (this.markdownCache.has(markdownCode))
            html = this.markdownCache.get(markdownCode);
        else {
            html = new showdown.Converter().makeHtml(markdownCode);
            this.markdownCache.set(markdownCode, html);
        }

        return html;
    }


    getFileName(incident: any): string {
        if (!incident.file.cachedPrettyPath) {
            console.error("No cachedPrettyPath data!", incident);
            return '';
        }

        return incident.file.cachedPrettyPath;
    }
}
