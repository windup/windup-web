import { Component, Input, ElementRef, AfterViewInit } from "@angular/core";
import { RuleProviderEntity } from "../../generated/windup-services";

declare function prettyPrint();

@Component({
    selector: 'wu-rules',
    templateUrl: './rules.component.html'
})
export class RulesComponent implements AfterViewInit {

    @Input()
    ruleProvider: RuleProviderEntity;

    @Input()
    container: any = window;

    @Input()
    offset: number = 60;

    constructor(private _element: ElementRef) { }

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

        let element = this._element.nativeElement.querySelector(`div[id="group-item-${id}"]`);
        if (!element) {
            element = this._element.nativeElement.querySelector(`select[id="select-${id}"]`);
        }

        this.scrollToElement(element);
    }

    private scrollToElement(element: Element) {
        if (element) {
            /*
             * For reference on how the offset is computed:
             * https://developer.mozilla.org/en/docs/Web/API/Element/getBoundingClientRect
             *
             * 60 is the height in px of the top nav bar "header-logo-wrapper"
             * */

            // let offset = element.getBoundingClientRect().top + this.container.scrollY - 60;
            let offset = element.getBoundingClientRect().top + (this.container.scrollY || this.container.scrollTop) - this.offset;

            this.container.scrollTo(0, offset);
        }
    }

}


