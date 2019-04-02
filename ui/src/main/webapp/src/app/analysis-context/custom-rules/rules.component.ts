import { Component, Input, ElementRef, AfterViewInit } from "@angular/core";
import { RulesPath, RuleProviderEntity } from "../../generated/windup-services";
import { SortingService } from "../../shared/sort/sorting.service";

declare function prettyPrint();

@Component({
    selector: 'wu-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements AfterViewInit {

    @Input() ruleProvider: RuleProviderEntity;
    @Input() reference: any = window;

    constructor(
        private _sortingService: SortingService<RuleProviderEntity>,
        private _element: ElementRef,
    ) { }

    ngAfterViewInit() {
        prettyPrint();
    }

    getLabelForRuleID(ruleID: string, providerID: string, i: number) {
        return (ruleID.length > 0 ? ruleID : providerID + "_" + (i + 1));
    }

    scrollToRule(id: number) {
        this.scrollToElement(this._element.nativeElement.querySelector(`h4[id="${id}"]`));
    }

    scrollToRuleSetHeader(id: number) {
        $(this._element.nativeElement).find("#select-" + id).val('');
        this.scrollToElement(this._element.nativeElement.querySelector(`div[id="group-item-${id}"]`));
    }

    private scrollToElement(element: Element) {
        if (element) {
            /*
             * For reference on how the offset is computed:
             * https://developer.mozilla.org/en/docs/Web/API/Element/getBoundingClientRect
             *
             * 60 is the height in px of the top nav bar "header-logo-wrapper"
             * */
            let offset = element.getBoundingClientRect().top + this.reference.scrollY - 60;
            
            this.reference.scrollTo(0, offset);
        }
    }

}


