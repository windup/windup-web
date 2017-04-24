import {Component} from "@angular/core";
import {TabComponent} from "./tabs/tab.component";

/**
 * Component for expand/collapse sections
 *
 * By default it is not visible, but that behaviour can be modified by setting [isActive]="true"
 *
 * Usage:
 *  <wu-expand-collapse [tabTitle]="'Title'">
 *          .... tab content here.....
 *  </wu-expand-collapse>
 *
 */
@Component({
    templateUrl: './expand-collapse.component.html',
    selector: 'wu-expand-collapse'
})
export class ExpandCollapseComponent extends TabComponent {

    /**
     * Toggles state of expand/collapse section
     */
    toggle() {
        this.isActive = !this.isActive;
    }
}
