import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {Observable, of} from 'rxjs';

import {HttpClient} from "@angular/common/http";
import {StaticCache} from "./cache";
import { map } from 'rxjs/operators';


let emptyArrayObs = of([]);
let nullObs = of(null);

/**
 * @GraphAdjacency decorator, which handles TypeScript Frames models' property resolving.
 *
 * The underlying object contains graph vertices data or links to graph REST service.
 * This decorator turns these data into model objects, optionally fetching the data first.
 *
 * The `Observable`s returned are cached.
 *
 * @param name         Adjacency name
 * @param direction    "IN" or "OUT".
 * @param returnArray  Whether this getter represents a 1:N (if true) or a 1:1 relation.
 * @param kind         Whether this getter represents an @Adjacency, @Incidence, @InVertex or @OutVertex relation.
 */
export function GraphAdjacency (
        name: string,
        direction: "IN" | "OUT",
        returnArray: boolean = true,
        kind: "ADJACENCY" | "INCIDENCE" | "IN_V" | "OUT_V" = "ADJACENCY" // See ModelRelation.RelationKind
): any
{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!descriptor)
            return;

        descriptor.get = function () {
            let verticesLabel = (direction === "IN") ? "vertices_in" : "vertices_out";

            // Data is empty, just return null (or an empty array)
            let relations;
            if (kind == "ADJACENCY" || kind == "INCIDENCE") {
                relations = this.data![verticesLabel]![name];
                if (!relations || !(relations["vertices"] || relations["link"])){
                    return returnArray ? emptyArrayObs : nullObs;
                }
            } else if (kind == "IN_V" || kind == "OUT_V") {
                relations = {};
            }

            // .graphService and .http are stored by the initial call of fromJSON().
            if (this.graphService == null)
                console.warn("@GraphAdjacency() sees no graphService on target (should not happen?), will instantiate a default one: ", this);
            let graphService: GraphJSONToModelService<any> = this.graphService; // || new GraphJSONToModelService();
            if (!this.http)
                throw new Error("Http service was not stored in the unmarshalled object:\n" + JSON.stringify(this));

            // A callback for StaticCache.
            let httpService: HttpClient = this.http;
            let returnArray_ = returnArray; // Otherwise returnArray sticks with it's first value for all calls.
            function fetcher(url: string): Observable<any> {
                return httpService.get<any>(url)
                .pipe(
                    map((responseJson: any) => {
                        if (!responseJson) {
                            console.error("Fetching URL returned null: " + url);
                            return null;
                        }
                        
                        if (!Array.isArray(responseJson)) {
                            throw new Error("Graph REST should return an array of vertices, returned: " + JSON.stringify(responseJson));
                        }
    
                        const items: any[] = graphService.fromJSONarray(responseJson);
    
                        return returnArray_ ? items : items[0];
                    })
                );
            }

            // If data is a link, return a result of a service call.
            if (relations["link"] || relations["_type"] === "link")
            {
                // Make an HTTP call.
                let url = relations["link"];
                let cachedObservable: Observable<any> = StaticCache.getOrFetch(url, fetcher);
                if (!cachedObservable)
                    throw new Error("Failed loading link: " + url);
                return cachedObservable;
            }

            // Data was not null and not a link, so return the stored value.
            // The observable, once created, is cached in `relations.observable`.
            if (relations.observable){
                return relations.observable;
            }

            var vertices: any[] = relations.vertices;

            // TODO: Some of the code above should go into case: "ADJACENCY".
            let models;
            switch(kind) {
                case "ADJACENCY":
                    models = vertices.map(vertice => graphService.fromJSON(vertice));
                    if (!returnArray)
                        models = models[0];
                    break;
                // @Incidence: We need to return the edge's model(s) with the above vertex under the original direction.
                case "INCIDENCE":
                    models = vertices.map(vertice => {
                        let model = graphService.fromJSON(vertice);
                        let edgeModel = graphService.fromJSON(vertice.edgeData);
                        // Store the in/out vertexes.
                        edgeModel[direction === "IN" ? "_out" : "_in"] = model;
                        edgeModel[direction === "IN" ? "_in"  : "_out"] = this; /// This should be the "this" of the getter, i.e. original vertex.

                        return edgeModel;
                    });
                break;
                // @InVertex/@OutVertex: getter called on edge model; it only has _in and _out reference (no need for specfic name).
                case "IN_V":
                    return of(this._in);
                case "OUT_V":
                    return of(this._out);
            }

            relations.observable = of(models);
            return relations.observable;
        };
    };
}
