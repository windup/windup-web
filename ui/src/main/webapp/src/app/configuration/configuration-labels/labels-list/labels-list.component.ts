import { Component, Input, ElementRef } from "@angular/core";
import { LabelsPath, LabelProviderEntity } from "../../../generated/windup-services";
import { SortingService } from "../../../shared/sort/sorting.service";

declare function prettyPrint();

@Component({
    selector: 'wu-labels-list',
    templateUrl: './labels-list.component.html',
    styleUrls: ['./labels-list.component.scss']
})
export class LabelsListComponent {

    @Input() labelPath: LabelsPath;
    @Input() labelProviders: LabelProviderEntity[];
    @Input() container: any = window;
    @Input() offset: number;

    constructor(
        private _sortingService: SortingService<LabelProviderEntity>,
        private _element: ElementRef,
    ) { }

    hasFileBasedProviders() {
        if (!this.labelProviders)
            return false;

        let foundLabels = false;
        this.labelProviders.forEach((provider) => {
            if (this.isFileBasedProvider(provider))
                foundLabels = true;
        });
        return foundLabels;
    }

    isFileBasedProvider(provider: LabelProviderEntity) {
        switch (provider.labelProviderType) {
            // case "GROOVY":
            case "XML":
                return true;
            default:
                return false;
        }
    }

    getLabelProviders() {
        return this._sortingService.sort(this.labelProviders);
    }

    clickHeader(event: Event, provider: LabelProviderEntity) {
        if (!$(event.target).is("button, a, input, .fa-ellipsis-v")) {
            $(this._element.nativeElement).find("#span-" + provider.id).toggleClass("fa-angle-down")
                .end().parent().toggleClass("list-view-pf-expand-active")
                .find("#container-" + provider.id).toggleClass("hidden").end().parent()
                .find("#group-item-" + provider.id).toggleClass("selectedLabelHeader");
            prettyPrint();
        }
    }

    getLabelProviderMarginTop(labelProvider: LabelProviderEntity) {
        let margin = 0;
        if (labelProvider.labels.length > 0) {
            margin = 7;
        }
        return margin;
    }

}


