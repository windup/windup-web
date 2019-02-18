import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";


import { Constants } from "../constants";
import {AbstractService} from "../shared/abtract.service";
import { map, tap, catchError } from 'rxjs/operators';

export class TagHierarchyData {
    tagName: string;
    color: string;
    title: string;
    root: boolean;
    pseudo: boolean;
    parents: TagHierarchyData[];
    containedTags: TagHierarchyData[];
}

@Injectable()
export class TagDataService extends AbstractService {
    private cachedTagData: TagHierarchyData[];
    private allTags: Map<string, TagHierarchyData> = new Map<string, TagHierarchyData>();

    constructor(private _http:HttpClient) {
        super();
    }

    getRootTags(tagName: string): TagHierarchyData[] {
        let tag = this.allTags.get(tagName);
        if (!tag)
            return null;

        // It is already the root
        if (tag.root)
            return [tag];

        let result = [];
        let crawlParents = (tag_) => {
            tag_.parents.forEach(parent => {
                if (parent.root && !parent.pseudo)
                    result.push(parent);
                else
                    crawlParents(parent);
            });
        };
        crawlParents(tag);

        return result;
    }

    private cacheTagData(tagList: TagHierarchyData[]) {
        this.setParentTags(null, tagList);

        let cache = (tags:TagHierarchyData[]) => {
            tags.forEach(tag => {
                this.allTags.set(tag.tagName, tag);
                cache(tag.containedTags);
            });
        };
        cache(tagList);

        this.cachedTagData = tagList;
    }

    /**
     * In order to avoid cycles, the json data does not contain the parent information. We reconnect contained
     * tags to their parents here.
     *
     * @param parentTag
     * @param tagList
     */
    private setParentTags(parentTag: TagHierarchyData, tagList: TagHierarchyData[]) {
        tagList.forEach(tag => {
            if (tag.parents == null)
                tag.parents = [];

            if (parentTag != null)
                tag.parents.push(parentTag);

            this.setParentTags(tag, tag.containedTags);
        });
    }

    getTagData(): Observable<TagHierarchyData[]> {
        if (this.cachedTagData)
            return of(this.cachedTagData);

        let headers = new HttpHeaders();
        let options = { headers: headers };

        return this._http.get<TagHierarchyData[]>(Constants.GRAPH_REST_BASE + "/tag-data", options);
    }
}
