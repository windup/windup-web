import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {Observable} from "rxjs/Observable";

/**
 * @GraphAdjacency decorator, which handles TypeScript Frames models' property resolving.
 *
 * The underlying object contains graph vertices data or links to graph REST service.
 * This decorator turns these data into model objects, optionally fetching the data first.
 */
export function GraphAdjacency (name: string, direction: string, array: boolean = true): any {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor) {
            descriptor.get = function () {
                let verticesLabel = (direction == "IN") ? "vertices_in" : "vertices_out";

                // Data is empty, just return null (or an empty array)
                if (!this.data || !this.data[verticesLabel] || !this.data[verticesLabel][name]
                          ||  (!this.data[verticesLabel][name]["vertices"] && !this.data[verticesLabel][name]["link"]))
                    return Observable.of( array ? [] : null );

                // .graphService and .http are stored by the initial call of fromJSON().
                if (this.graphService == null)
                    console.warn("@GraphAdjacency() sees no graphService on target (should not happen?), will instantiate a default one: ", this);
                let graphService: GraphJSONToModelService<any> = this.graphService || new GraphJSONToModelService();
                if (!this.http)
                    throw new Error("Http service was not stored in the unmarshalled object:\n" + JSON.stringify(this));

                // If data is a link, return a result of a service call.
                if (this.data[verticesLabel][name]["link"] || this.data[verticesLabel][name]["_type"] == "link") {
                    // Make an HTTP call.
                    let url = this.data[verticesLabel][name]["link"];
                    console.log("Loading remote data from: " + url);
                    let resultObservable = this.observableCache.get(url);
                    if (resultObservable)
                        return resultObservable;

                    if (array) {
                        resultObservable = this.http.get(url)
                            .do(vertices => {
                                this.data[verticesLabel][name]["link"] = null;
                                this.data[verticesLabel][name]["_type"] = null;
                                this.data[verticesLabel][name]["vertices"] = vertices.json();
                            })
                            .map((vertices:any) => {
                                return vertices.json().map((vertice:any) => {
                                    return graphService.fromJSON(vertice, this.http);
                                }
                            );
                        });
                    } else {
                        resultObservable = this.http.get(url)
                            .do(vertices => {
                                this.data[verticesLabel][name]["link"] = null;
                                this.data[verticesLabel][name]["_type"] = null;
                                this.data[verticesLabel][name]["vertices"] = vertices.json();
                            })
                            .map((vertices:any) => {
                                if (!vertices)
                                    return null;

                                return graphService.fromJSON(vertices.json()[0], this.http);
                            });
                    }
                    this.observableCache.set(url, resultObservable);

                    return resultObservable;
                }

                // Data was not null and not a link, so return the stored value.
                let vertices:any[] = this.data[verticesLabel][name].vertices;

                let value = array ?
                    vertices.map(vertice => graphService.fromJSON(vertice, this.http))
                    : graphService.fromJSON(vertices[0], this.http);

                return Observable.of(value);
            };
        }
    };
}
