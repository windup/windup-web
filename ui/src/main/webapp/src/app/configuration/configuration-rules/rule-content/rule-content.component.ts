import { Component, Input, ElementRef, AfterViewInit } from "@angular/core";
import { RuleProviderEntity, RuleEntity } from "../../../generated/windup-services";

declare function prettyPrint();

@Component({
    selector: 'wu-rule-content',
    templateUrl: './rule-content.component.html'
})
export class RuleContentComponent implements AfterViewInit {

    @Input()
    ruleProvider: RuleProviderEntity;

    @Input()
    container: any;

    @Input()
    offset: number;

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

            const containerElement = this.container ? this.container : window;
            const defaultOffset = this.offset ? this.offset : 60;

            const scroll = containerElement.scrollY !== undefined ? containerElement.scrollY : containerElement.scrollTop;
            let offset = element.getBoundingClientRect().top + scroll - defaultOffset;

            containerElement.scrollTo(0, offset);
        }
    }

    trackByRuleEntityFn(index: number, ruleEntity: RuleEntity) {
        return ruleEntity.id;
    }
}


