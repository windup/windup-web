import {$, browser, by, element} from "protractor";

export class CreateProjectPage {
    title = element(by.id('idProjectTitle'));
    description = element(by.id('idDescription'));

    cancel = $('.btn.btn-default');
    next = $('.btn.btn-primary');

    public setTitle(title: string) {
        return this.title.sendKeys(title);
    }

    public setDescription(description: string) {
        return this.description.sendKeys(description);
    }

    public clickNext() {
        return this.next.click();
    }

    public navigateTo() {
        return browser.get('./wizard/create-project');
    }
}
