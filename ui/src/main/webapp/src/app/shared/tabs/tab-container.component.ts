import {Component, ContentChildren, QueryList, AfterContentInit} from "@angular/core";
import {TabComponent} from "./tab.component";

/**
 * Component for tab interface
 *
 * Usage:
 *  <wu-tab-container>
 *      <wu-tab [tabTitle]="'Title'">
 *          .... tab content here.....
 *      </wu-tab>
 *  </wu-tab-container>
 *
 */
@Component({
    templateUrl: './tab-container.component.html',
    selector: 'wu-tab-container',
    styleUrls: ['./tab-container.component.scss']
})
export class TabContainerComponent implements AfterContentInit {
    @ContentChildren(TabComponent)
    tabs: QueryList<TabComponent>;

    ngAfterContentInit(): void {
        let activeTabs = this.tabs.filter(tab => tab.isActive);

        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(selectedTab: TabComponent) {
        this.tabs.forEach(tab => tab.isActive = false);
        selectedTab.isActive = true;
    }
}
