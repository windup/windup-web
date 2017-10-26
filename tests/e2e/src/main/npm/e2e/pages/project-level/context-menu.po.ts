import {$$, ElementFinder} from "protractor";

export class ContextMenuPage {
    menuItems = $$('wu-context-menu .list-group-item');

    public getMenuItems(): Promise<ContextMenuItem[]> {
        return this.menuItems.then((menuItems: ElementFinder[]): any => {
            return Promise.all(menuItems.map(item => {
                const menuLink = {
                    label: '',
                    link: item.$('a')
                };

                return item.$('span.list-group-item-value').getText()
                    .then(text => menuLink.label = text)
                    .then(() => menuLink);
            }));
        });
    }

    public openAnalysisConfig(): Promise<any> {
        return this.getMenuItems().then(items => {
            const analysisConfig = items.find(item => item.label.search(new RegExp('Analysis Configuration', 'i')) !== -1);

            if (analysisConfig !== null) {
                return analysisConfig.link.click();
            } else {
                return new Promise<any>((resolve, reject) => reject('Analysis Configuration not found'));
            }
        });
    }

    public openMenuItem(item: MenuItems|ReportLevelMenuItems): Promise<any> {
        return this.getMenuItems().then(items => {
            if (items.length >= item) {
                return items[item].link.click();
            } else {
                return new Promise<any>((resolve, reject) => reject(`Menu item ${item} not found`));
            }
        });
    }

    public openSubmenuItem(menu: MenuItems|ReportLevelMenuItems, subMenu: any): Promise<any> {
        return this.openMenuItem(menu);
    }
}

export interface ContextMenuItem {
    label: string;
    link: ElementFinder;
}

export enum MenuItems {
    ANALYSIS_RESULTS = 0,
    APPLICATIONS = 1,
    ANALYSIS_CONFIG = 2
}

export enum ReportLevelMenuItems {
    APPLICATION_LIST = 0,
    DASHBOARD = 1,
    TECHNOLOGIES_OVERALL = 2,
    MIGRATION_ISSUES = 3,
    EXECUTION_DETAILS = 4,
    STATIC_REPORT = 5
}

export enum TechReportMenuItems {
    TECHNOLOGIES_EJB = 0,
    TECHNOLOGIES_REMOTE_SERVICES = 1,
    TECHNOLOGIES_HIBERNATE = 2,
}
