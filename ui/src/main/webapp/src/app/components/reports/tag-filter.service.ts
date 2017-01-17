import { ReportFilter, Tag } from "windup-services";
import { TechnologyTagModel } from "../../generated/tsModels/TechnologyTagModel";

export enum MatchResult {
    ExplicitInclude,
    ImplicitInclude,
    ImplicitExclude,
    ExplicitExclude
}

export class TagFilterService {

    constructor(private _reportFilter: ReportFilter) {
    }

    tagsMatch(tags:TechnologyTagModel[] | string[]):boolean {

        // If there were no tags, then match as long as the include filter is empty
        if (tags == null || tags.length == 0)
            return this._reportFilter == null ||
                !this._reportFilter.enabled ||
                this._reportFilter.includeTags == null ||
                this._reportFilter.includeTags.length == 0;

        let implicitIncludeFound = false;
        let explicitIncludeFound = false;
        let implicitExcludeFound = false;
        let explicitExcludeFound = false;
        for (let tag of tags) {
            let tagMatchStatus = this.tagMatches(tag);
            if (tagMatchStatus == MatchResult.ImplicitInclude)
                implicitIncludeFound = true;
            else if (tagMatchStatus == MatchResult.ExplicitInclude)
                explicitIncludeFound = true;
            else if (tagMatchStatus == MatchResult.ImplicitExclude)
                implicitExcludeFound = true;
            else if (tagMatchStatus == MatchResult.ExplicitExclude)
                explicitExcludeFound = true;
        }
        return explicitIncludeFound ||
            !(implicitExcludeFound || explicitExcludeFound);
    }

    tagMatches(tag: TechnologyTagModel | string):MatchResult {
        // Always match if there is no filter
        if (!this._reportFilter || !this._reportFilter.enabled)
            return MatchResult.ImplicitInclude;

        // Always match null tags (I'm not sure that this would ever get hit)
        if (!tag)
            return MatchResult.ImplicitInclude;

        let tagValue = tag;
        if (tagValue instanceof TechnologyTagModel)
            tagValue = (<TechnologyTagModel>tagValue).name;

        let includeTags = this._reportFilter.includeTags ? this._reportFilter.includeTags : [];
        let excludeTags = this._reportFilter.excludeTags ? this._reportFilter.excludeTags : [];

        // If there are no include tags and no exclude tags, return true
        if (includeTags.length == 0 && excludeTags.length == 0)
            return MatchResult.ImplicitInclude;
        else if (this.tagValueInCollection(includeTags, tagValue))
            // Tag was explicitly included, return true
            return MatchResult.ExplicitInclude;
        else if (this.tagValueInCollection(excludeTags, tagValue))
            // Tag is explicitly excluded, return false
            return MatchResult.ExplicitExclude;
        else if (includeTags.length != 0)
            // List of include Tags was present, but this tag wasn't explicitly included, return false
            return MatchResult.ImplicitExclude;
        else
            return MatchResult.ImplicitInclude;
    }

    private tagValueInCollection(collection:Tag[], tagValue:string) {
        for (let tag of collection) {
            if (tag.name == tagValue)
                return true;
        }
        return false;
    }
}