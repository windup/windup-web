import { Component, Input, ElementRef } from "@angular/core";
import { RulesPath, RuleProviderEntity } from "../../generated/windup-services";
import { SortingService } from "../../shared/sort/sorting.service";

declare function prettyPrint();

@Component({
    selector: 'wu-rules-list',
    templateUrl: './rules-list.component.html',
    styleUrls: ['./rules-list.component.scss']
})
export class RulesListComponent {

    @Input() rulePath: RulesPath;
    @Input() ruleProviders: RuleProviderEntity[];
    @Input() container: any;
    @Input() offset: number;

    constructor(
        private _sortingService: SortingService<RuleProviderEntity>,
        private _element: ElementRef,
    ) { }

    getRuleProviders() {
        return this._sortingService.sort(this.ruleProviders);
    }

    clickHeader(event: Event, provider: RuleProviderEntity) {
        if (!$(event.target).is("button, a, input, .fa-ellipsis-v")) {
            $(this._element.nativeElement).find("#span-" + provider.id).toggleClass("fa-angle-down")
                .end().parent().toggleClass("list-view-pf-expand-active")
                .find("#container-" + provider.id).toggleClass("hidden").end().parent()
                .find("#group-item-" + provider.id).toggleClass("selectedRuleHeader");
            prettyPrint();
        }
    }

    getRuleProviderMarginTop(ruleProvider: RuleProviderEntity) {
        let margin = 0;
        if (ruleProvider.sources.length > 0) {
            if (ruleProvider.targets.length > 0) {
                margin = 14;
            } else {
                margin = 7;
            }
        } else if (ruleProvider.targets.length > 0) {
            margin = 7;
        }
        return margin;
    }

}


