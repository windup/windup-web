import {AfterViewInit, Component} from "@angular/core";
import {Http} from "@angular/http";

@Component({
    selector: 'graph-tool-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

    blackListedProperties = ["vertices_in", "vertices_out"];

    executions:{execution:any, project:any}[];
    selectedExecutionID:any;

    types:string[];
    selectedType:string;

    resultColumns:string[];
    resultRows:any[];

    constructor(
        private _http:Http
    ) {

    }

    ngAfterViewInit(): void {
        this.getAvailableTypes();
        this.getAllExecutions();
    }

    search() {
        if (this.selectedExecutionID == null || this.selectedType == null) {
            console.log("No search specified");
            return;
        }

        let selectedExecution = this.executions.find(execution => execution.execution.id == this.selectedExecutionID);
        if (selectedExecution == null) {
            console.log("Invalid search specified");
            return;
        }

        console.log("Selected execution ID: " + this.selectedExecutionID);
        console.log("Selected execution: " + selectedExecution);
        console.log("Should search execution: " + selectedExecution.execution.id + " for: " + this.selectedType);
        this._http.get("/rhamt-web/api/furnace/graph/" + selectedExecution.execution.id + "/by-type/" + this.selectedType)
            .map(res => res.json())
            .subscribe((results:any[]) => {
                console.log("Search Results: ", results);
                this.resultColumns = [];
                this.resultRows = [];

                results.forEach(result => {
                    Object.getOwnPropertyNames(result).forEach(propertyName => {
                        if (this.blackListedProperties.includes(propertyName))
                            return;

                         if (this.resultColumns.find(columnName => propertyName == columnName) == null)
                             this.resultColumns.push(propertyName);
                    });
                    this.resultRows.push(result);
                });
            });
    }

    private getAvailableTypes() {
        this._http.get("/rhamt-web/api/furnace/graph/introspect/type-list")
            .map(res => res.json())
            .subscribe(result => {
                console.log("All Types: ", result);
                this.types = result;
            });
    }

    private getAllExecutions() {
        this._http.get("/rhamt-web/api/windup/executions")
            .map(res => res.json())
            .subscribe((executions:any[]) => {
                console.log("All Executions: ", executions);
                this.executions = [];
                executions.forEach((execution) => {
                    this._http.get("/rhamt-web/api/migrationProjects/get/" + execution.projectId)
                        .map(res => res.json())
                        .subscribe(project => {
                            this.executions.push({execution: execution, project: project});
                        });
                });
            });
    }
}
