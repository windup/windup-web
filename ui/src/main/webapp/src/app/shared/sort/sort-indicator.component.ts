import {Input, Component, ChangeDetectionStrategy} from "@angular/core";
import {OrderDirection} from "./sorting.service";

@Component({
    selector: 'wu-sort-indicator',
    templateUrl: './sort-indicator.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SortIndicatorComponent {
    @Input()
    isActive = false;

    @Input()
    direction = OrderDirection.ASC;

    getClass() {
        if (!this.isActive) {
            return 'fa-sort';
        }

        return this.direction === OrderDirection.ASC ? 'fa-sort-asc' : 'fa-sort-desc';
    }
}
