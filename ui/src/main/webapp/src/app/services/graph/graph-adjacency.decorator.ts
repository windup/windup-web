import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {StaticCache} from "./cache";


let emptyArrayObs = Observable.of([]);
let nullObs = Observable.of(null);

/**
 * @GraphAdjacency decorator, which handles TypeScript Frames models' property resolving.
 *
 * The underlying object contains graph vertices data or links to graph REST service.
 * This decorator turns these data into model objects, optionally fetching the data first.
 *
 * The `Observable`s returned are cached.
 *
 * @param array Whether this getter represents a 1:N (if true) or a 1:1 relation.
 * @param isAdjacency Whether this getter represents an @Adjacency (if true) or @Incidence relation.
 * @param direction "IN" or "OUT".
 */
export function GraphAdjacency (
        name: string,
        direction: "IN" | "OUT",
        returnArray: boolean = true,
        kind: "ADJACENCY" | "INCIDENCE" | "IN_V" | "OUT_V" = "ADJACENCY" // See ModelRelation.RelationKind
): any
{
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor) {
            descriptor.get = function () {
                console.log(`* get() v#${this.vertexId} ${name} ${direction} ${returnArray ? "array" : "single"}`);///

                let verticesLabel = (direction === "IN") ? "vertices_in" : "vertices_out";

                // Data is empty, just return null (or an empty array)
                let relations = this.data![verticesLabel]![name];
                if (!relations || !(relations["vertices"] || relations["link"])){
                    return returnArray ? emptyArrayObs : nullObs;
                }

                // .graphService and .http are stored by the initial call of fromJSON().
                if (this.graphService == null)
                    console.warn("@GraphAdjacency() sees no graphService on target (should not happen?), will instantiate a default one: ", this);
                let graphService: GraphJSONToModelService<any> = this.graphService || new GraphJSONToModelService();
                if (!this.http)
                    throw new Error("Http service was not stored in the unmarshalled object:\n" + JSON.stringify(this));

                // A callback for StaticCache.
                let httpService: Http = this.http;
                let returnArray_ = returnArray; // Otherwise returnArray sticks with it's first value for all calls.
                function fetcher(url: string): Observable<any> {
                    //console.debug("    Fetching URL: " + url);///
                    return httpService.get(url).map((response: Response) => {
                        if (!response)
                            return console.error("Fetching URL returned null: " + url), null;
                        let responseJson: any[] = response.json();
                        if (!Array.isArray(responseJson))
                            throw new Error("Graph REST should return an array of vertices, returned: " + JSON.stringify(responseJson));
                        let items: any[] = graphService.fromJSONarray(responseJson, httpService);
                        return returnArray_ ? items : items[0];
                    });
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

                var vertices:any[] = relations.vertices;
                let value = returnArray ?
                    vertices.map(vertice => graphService.fromJSON(vertice, this.http))
                    : graphService.fromJSON(vertices[0], this.http);

                relations.observable = Observable.of(value);
                return relations.observable;
            };
        }
    };
}
