import { ReportFilter, Tag } from "windup-services";
import { TechnologyTagModel } from "../../generated/tsModels/TechnologyTagModel";

export class TagFilterService {

    constructor(private _reportFilter: ReportFilter) {
    }

    tagMatches(tag: TechnologyTagModel | string):boolean {
        // Always match if there is no filter
        if (!this._reportFilter)
            return true;

        // Always match null tags
        if (!tag)
            return true;

        let tagValue = tag;
        if (tagValue instanceof TechnologyTagModel)
            tagValue = (<TechnologyTagModel>tagValue).name;

        if (!this._reportFilter.includeTags)
            return true;

        if (!this._reportFilter.excludeTags)
            return true;

        let matches = false;
        if (this.tagValueInCollection(this._reportFilter.excludeTags, tagValue)) {
            matches = false;
        }

        if (!this._reportFilter.includeTags.length || this.tagValueInCollection(this._reportFilter.includeTags, tagValue))
            matches = true;

        console.log("Tag matches for: " + tag + " returning: " + matches);
        return matches;
    }

    private tagValueInCollection(collection:Tag[], tagValue:string) {
        for (let tag of collection) {
            if (tag.name == tagValue)
                return true;
        }
        return false;
    }
}