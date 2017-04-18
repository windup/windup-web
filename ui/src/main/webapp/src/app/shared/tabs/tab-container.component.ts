import {Component, ContentChildren, QueryList, AfterContentInit, EventEmitter, Output} from "@angular/core";
import {TabComponent} from "./tab.component";

/**
 * Component for tab interface
 *
 * By default it activates the first tab, if none of tabs has isActive property set
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

    /**
     * Event triggered when tab is selected
     * @type {EventEmitter<TabComponent>}
     */
    @Output()
    tabSelected: EventEmitter<TabComponent> = new EventEmitter<TabComponent>();

    ngAfterContentInit(): void {
        let activeTabs = this.tabs.filter(tab => tab.isActive);

        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    /**
     * Sets selected tab as active
     * @param selectedTab {TabComponent}
     */
    selectTab(selectedTab: TabComponent) {
        this.tabs.forEach(tab => tab.isActive = false);
        selectedTab.isActive = true;
        this.tabSelected.next(selectedTab);
    }
}
