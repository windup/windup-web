import {AfterViewInit, Component} from "@angular/core";
import {Http} from "@angular/http";

@Component({
    selector: 'graph-tool-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {

    blackListedProperties = ["vertices_in", "vertices_out"];

    executions: { execution: any, project: any }[];
    selectedExecutionID: any;

    types: ModelTypeInformation[];
    selectedTypeDiscriminator: string;

    errorText: string;

    resultColumns: string[];
    resultVerticesIn: string[];
    resultVerticesOut: string[];
    resultRows: any[];

    constructor(private _http: Http) {

    }

    ngAfterViewInit(): void {
        this.getAvailableTypes();
        this.getAllExecutions();
    }

    search() {
        if (this.selectedExecutionID == null || this.selectedTypeDiscriminator == null) {
            this.errorText = "All Parameters are required!";
            return;
        }

        let selectedExecution = this.executions.find(execution => execution.execution.id == this.selectedExecutionID);
        if (selectedExecution == null) {
            this.errorText = "Invalid search specified";
            return;
        }

        let selectedType = this.types.find(type => type.discriminator == this.selectedTypeDiscriminator);
        if (selectedType == null) {
            this.errorText = "Invalid type specified: " + this.selectedTypeDiscriminator;
            return;
        }

        this.errorText = "";

        // console.log("Selected execution ID: " + this.selectedExecutionID);
        // console.log("Selected execution: " + selectedExecution);
        // console.log("Should search execution: ", selectedExecution.execution.id, selectedType);
        this.refreshGraphResults("/mta-web/api/furnace/graph/" + selectedExecution.execution.id + "/by-type/" + selectedType.discriminator);
    }

    browseResults(row: any[], verticeName: string, direction: string) {
        let edgeInfo = direction == 'IN' ? row['vertices_in'] : row['vertices_out'];
        //console.log("Should browse direction: " + direction, edgeInfo);
        let url = edgeInfo[verticeName].link;
        //console.log("Result url: " + url);
        this.refreshGraphResults(url);
    }

    private refreshGraphResults(url: string) {
        this._http.get(url)
            .map(res => res.json())
            .subscribe((results: any[]) => {
                // console.log("Search Results: ", results);
                this.resultColumns = [];
                this.resultRows = [];
                this.resultVerticesIn = [];
                this.resultVerticesOut = [];

                results.forEach(result => {
                    // Get column names
                    Object.getOwnPropertyNames(result).forEach(propertyName => {
                        if (this.blackListedProperties.includes(propertyName)) {
                            //console.log("Blacklisted property: ", result[propertyName]);
                            return;
                        }

                        if (this.resultColumns.find(columnName => propertyName == columnName) == null)
                            this.resultColumns.push(propertyName);
                    });

                    // Get vertices in
                    let verticesIn = result["vertices_in"];
                    Object.getOwnPropertyNames(verticesIn).forEach(propertyName => {
                        if (this.resultVerticesIn.find(columnName => propertyName == columnName) == null)
                            this.resultVerticesIn.push(propertyName);
                    });

                    // Get vertices out
                    let verticesOut = result["vertices_out"];
                    Object.getOwnPropertyNames(verticesOut).forEach(propertyName => {
                        if (this.resultVerticesOut.find(columnName => propertyName == columnName) == null)
                            this.resultVerticesOut.push(propertyName);
                    });

                    //console.log("Vertices in: " + this.resultVerticesIn);
                    //console.log("Vertices out: " + this.resultVerticesOut);


                    this.resultRows.push(result);
                });
            });
    }

    private getAvailableTypes() {
        this._http.get("/mta-web/api/furnace/graph/introspect/type-list")
            .map(res => res.json())
            .subscribe(result => {
                this.types = result;
            });
    }

    private getAllExecutions() {
        this._http.get("/mta-web/api/windup/executions")
            .map(res => res.json())
            .subscribe((executions: any[]) => {
                this.executions = [];
                executions.forEach((execution) => {
                    this._http.get("/mta-web/api/migrationProjects/get/" + execution.projectId)
                        .map(res => res.json())
                        .subscribe(project => {
                            this.executions.push({execution: execution, project: project});
                        });
                });
            },
            error => {
                this.errorText = error;
            });
    }
}

interface ModelTypeInformation {
    discriminator: string;
    className: string;
}
