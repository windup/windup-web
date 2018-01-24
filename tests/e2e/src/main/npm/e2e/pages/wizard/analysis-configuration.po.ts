import {$, browser, by, element} from "protractor";

export class AnalysisConfigurationPage {
    saveAndRun = null; //$('.btn.btn-primary:nth-child(3)');
    save = $('.btn-save'); // by.buttonText('Save')); // .css('.btn-primary'); // :nth-child(2)

    public clickSave() {
        return this.save.click();
    }

    public clickSaveAndRun() {
        return this.saveAndRun.click();
    }
}
