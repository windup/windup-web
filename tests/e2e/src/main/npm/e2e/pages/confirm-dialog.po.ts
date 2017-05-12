import {browser, by, element, ElementFinder} from "protractor";

export class ConfirmDialogPage {
    confirmButton = element(by.css('.confirm-button'));
    modal = element(by.css('.modal'));
    textInput = element(by.id('resource-to-delete'));

    isPresent() {
        return this.modal.isPresent();
    }

    requiresText(): Promise<boolean> {
        return this.textInput.isPresent();
    }

    writeText(text: string) {
        this.textInput.sendKeys(text);
    }

    clickConfirm() {
        return this.confirmButton.click();
    }
}
