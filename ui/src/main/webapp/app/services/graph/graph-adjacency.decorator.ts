
import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {Observable} from "rxjs/Observable";

export function GraphAdjacency (name:string, direction:string, array:boolean = true):any {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor) {
            descriptor.get = function () {

                let verticesLabel = direction == "IN" ? "vertices_in" : "vertices_out";

                // data is empty, just return null (or an empty array)
                if (!this.data || !this.data[verticesLabel] || !this.data[verticesLabel] || !this.data[verticesLabel][name])
                    return Observable.create(function(observer) {
                        if (array)
                            observer.next([]);
                        else
                            observer.next(null);
                        observer.complete();
                    });

                // If data is a link, so return a result of a service call
                if (this.data[verticesLabel][name]["_type"] == "link") {
                    // make an HTTP Call
                    let url = this.data[verticesLabel][name]["link"];
                    if (array) {
                        return this.http.get(url).map((vertices:any) => {
                            return vertices.map((vertice:any) => {
                                return new GraphJSONToModelService().fromJSON(vertice, target.http);
                            });
                        });
                    } else {
                        console.log("Should return a single item for: " + name);
                        return this.http.get(url).map((vertices:any) => {
                            return new GraphJSONToModelService().fromJSON(vertices[0], target.http);
                        });
                    }
                }
                

                // Data is not null, so return a valid value
                var vertices = this.data[verticesLabel][name].vertices;

                return Observable.create(function(observer) {
                    let value:any;
                    if (array)
                        value = vertices.map((vertice:any) => {
                            return new GraphJSONToModelService().fromJSON(vertice, target.http);
                        });
                    else
                        value = new GraphJSONToModelService().fromJSON(vertices[0], target.http);

                    observer.next(value);
                    observer.complete();
                });
            };
        }
    };
}