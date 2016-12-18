import {GraphJSONToModelService} from "./graph-json-to-model.service";
import {Observable} from "rxjs/Observable";
import {Http, Response} from "@angular/http";
import {StaticCache} from "./cache";

/**
 * @GraphAdjacency decorator, which handles TypeScript Frames models' property resolving.
 *
 * The underlying object contains graph vertices data or links to graph REST service.
 * This decorator turns these data into model objects, optionally fetching the data first.
 *
 * The `Observable`s returned are cached
 */
let emptyArrayObs = Observable.of([]);
let nullObs = Observable.of(null);

export function GraphAdjacency (name: string, direction: "IN" | "OUT", array: boolean = true): any {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (descriptor) {
            descriptor.get = function () {
                console.log(`* get() v#${this.vertexId} ${name} ${direction}`);

                let verticesLabel = (direction === "IN") ? "vertices_in" : "vertices_out";

                // Data is empty, just return null (or an empty array)
                let relations;
                if (!this.data || !this.data[verticesLabel] || !(relations = this.data[verticesLabel][name])
                          ||  (!relations["vertices"] && !relations["link"])){
                    console.log("Using empty...");
                    return array ? emptyArrayObs : nullObs;
                }

                // .graphService and .http are stored by the initial call of fromJSON().
                if (this.graphService == null)
                    console.warn("@GraphAdjacency() sees no graphService on target (should not happen?), will instantiate a default one: ", this);
                let graphService: GraphJSONToModelService<any> = this.graphService || new GraphJSONToModelService();
                if (!this.http)
                    throw new Error("Http service was not stored in the unmarshalled object:\n" + JSON.stringify(this));

                //
                let httpService: Http = this.http;
                function fetcher(url: string): Observable<any> {
                    console.debug("    Fetching URL: " + url);
                    return httpService.get(url).map((response: Response) => {
                        if (!response)
                            return console.error("Fetching URL returned null: " + url), null;
                        if (typeof response.json() !== "array")
                            throw new Error("Graph REST should return an array of vertices.");
                        let items: any[] = graphService.fromJSONarray(response.json(), httpService);
                        return array ? items : items[0];
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
                    console.debug("Cache HIT! (prefetched data)")
                    return relations.observable;
                }
                console.debug("Cache MISS... (prefetched data)")

                var vertices:any[] = relations.vertices;
                let value = array ?
                    vertices.map(vertice => graphService.fromJSON(vertice, this.http))
                    : graphService.fromJSON(vertices[0], this.http);

                relations.observable = Observable.of(value);
                return relations.observable;
            };
        }
    };
}
