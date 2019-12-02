import { Component, Input, ElementRef, AfterViewInit } from "@angular/core";
import { LabelProviderEntity, LabelEntity } from "../../../generated/windup-services";

declare function prettyPrint();

@Component({
    selector: 'wu-label-content',
    templateUrl: './label-content.component.html'
})
export class LabelContentComponent implements AfterViewInit {

    @Input()
    labelProvider: LabelProviderEntity;

    @Input()
    container: any = window;

    @Input()
    offset: number;

    constructor(private _element: ElementRef) { }

    ngAfterViewInit() {
        prettyPrint();
    }

    getLabelForLabelID(labelID: string, providerID: string, i: number) {
        return (labelID.length > 0 ? labelID : providerID + "_" + (i + 1));
    }

    scrollToLabel(id: number) {
        this.scrollToElement(this._element.nativeElement.querySelector(`h4[id="${id}"]`));
    }

    scrollToLabelSetHeader(id: number) {
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

    trackByLabelEntityFn(index: number, labelEntity: LabelEntity) {
        return labelEntity.id;
    }
}


