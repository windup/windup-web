import {TagFilterService, MatchResult} from "../../../../src/app/components/reports/tag-filter.service";
import { ReportFilter } from "windup-services";
import {Tag} from "windup-services";

describe('Tag Filter Service', () => {

    function tag(tagName:string):Tag {
        return {id: 0, name: tagName};
    }

    it ('no includes or excludes', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [];
        reportFilter.excludeTags = [];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("foo")).toEqual(MatchResult.ImplicitInclude);
    });

    it ('include tags only - match', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [tag("foo")];
        reportFilter.excludeTags = [];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("foo")).toEqual(MatchResult.ExplicitInclude);
    });

    it ('include tags only - no match', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [tag("nothere")];
        reportFilter.excludeTags = [];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("foo")).toEqual(MatchResult.ImplicitExclude);
    });

    it ('exclude tags only - match', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [];
        reportFilter.excludeTags = [tag("randomvalue")];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("foo")).toEqual(MatchResult.ImplicitInclude);
    });

    it ('exclude tags only - no match', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [];
        reportFilter.excludeTags = [tag("foo")];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("foo")).toEqual(MatchResult.ExplicitExclude);
    });

    it ('include and exclude - match', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [tag("included")];
        reportFilter.excludeTags = [tag("excluded")];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("included")).toEqual(MatchResult.ExplicitInclude);
    });

    it ('include and exclude - excluded', () => {
        let reportFilter = <ReportFilter>{enabled: true};
        reportFilter.includeTags = [tag("included")];
        reportFilter.excludeTags = [tag("excluded")];

        let tagFilterService = new TagFilterService(reportFilter);

        expect(tagFilterService.tagMatches("excluded")).toEqual(MatchResult.ExplicitExclude);
    });

});
