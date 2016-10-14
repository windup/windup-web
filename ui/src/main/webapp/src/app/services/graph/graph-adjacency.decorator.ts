
import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {Observable} from "rxjs/Observable";

export function GraphAdjacency (name:string, array:boolean = true):any {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log("Property key: " + target);
        if (descriptor) {
            descriptor.get = function () {

                // data is empty, just return null (or an empty array)
                if (!this.data || !this.data[name] || !this.data[name].vertices)
                    return Observable.create(function(observer) {
                        if (array)
                            observer.next([]);
                        else
                            observer.next(null);
                        observer.complete();
                    });

                // Data is not null, so return a valid value
                var vertices = this.data[name].vertices;
                return Observable.create(function(observer) {
                    let value:any;
                    if (array)
                        value = vertices.map((vertice:any) => {
                            return new GraphJSONToModelService().fromJSON(vertice);
                        });
                    else
                        value = new GraphJSONToModelService().fromJSON(vertices[0]);

                    console.log("For property: " + name + " returning: " + value + ", json: " + JSON.stringify(value));
                    observer.next(value);
                    observer.complete();
                });
            };
        }
    };
}