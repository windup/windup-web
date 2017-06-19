import {by, element} from "protractor";

export class CreateProjectPage {
    title = element(by.id('idProjectTitle'));
    description = element(by.id('idDescription'));

    cancel = element(by.css('.btn.btn-default'));
    next = element(by.css('.btn.btn-primary'));

    public setTitle(title: string) {
        return this.title.sendKeys(title);
    }

    public setDescription(description: string) {
        return this.description.sendKeys(description);
    }

    public clickNext() {
        return this.next.click();
    }
}
