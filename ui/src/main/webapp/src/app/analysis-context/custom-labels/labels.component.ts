import { Component, Input, ElementRef, AfterViewInit } from "@angular/core";
import { LabelProviderEntity } from "../../generated/windup-services";

declare function prettyPrint();

@Component({
    selector: 'wu-labels',
    templateUrl: './labels.component.html'
})
export class LabelsComponent implements AfterViewInit {

    @Input()
    labelProvider: LabelProviderEntity;

    @Input()
    container: any = window;

    @Input()
    offset: number = 60;

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

            // let offset = element.getBoundingClientRect().top + this.container.scrollY - 60;
            let offset = element.getBoundingClientRect().top + (this.container.scrollY || this.container.scrollTop) - this.offset;

            this.container.scrollTo(0, offset);
        }
    }

}


