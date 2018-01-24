import {$, by, element} from "protractor";

export class ConfirmDialogPage {
    confirmButton = $('.confirm-button');
    modal = $('.modal');
    textInput = element(by.id('resource-to-delete'));

    isPresent() {
        return Promise.all([
            this.modal.isPresent(),
            this.modal.getAttribute('class')
        ]).then((result) => {
            console.log('IsPresent: ', result);
            return result[0] && result[1].search('in') !== -1;
        }, error => console.error('Error in isPresent', error));
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
