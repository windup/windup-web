import {by, element, ElementFinder} from "protractor";

export class ContextMenuPage {
    menuItems = element.all(by.css('wu-context-menu .list-group-item'));

    public getMenuItems(): Promise<ContextMenuItem[]> {
        return this.menuItems.then((menuItems: ElementFinder[]): any => {
            return Promise.all(menuItems.map(item => {
                const menuLink = {
                    label: '',
                    link: item.element(by.css('a'))
                };

                return item.element(by.css('span.list-group-item-value')).getText()
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
}

export interface ContextMenuItem {
    label: string;
    link: ElementFinder;
}
