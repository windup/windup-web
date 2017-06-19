import {browser, by, element} from "protractor";

export class AddApplicationsPage {
    title = element(by.id('idProjectTitle'));
    description = element(by.id('idDescription'));

    serverPathButton = element(by.css('wu-tab-container ul li:nth-child(2)'));
    serverPathInput = element(by.id('appPathToRegister'));

    cancel = element(by.css('.btn.btn-default'));
    next = element(by.css('.btn.btn-primary'));

    public uploadFile() {
/*        // set file detector
        var remote = require('../../node_modules/protractor/node_modules/selenium-webdriver/remote');
        browser.setFileDetector(new remote.FileDetector());


        var fileToUpload = '../sample.txt';
        var absolutePath = path.resolve(__dirname, fileToUpload);

        var fileElem = element(by.css('input[type="file"]'));

        // Unhide file input
        browser.executeScript("arguments[0].style.visibility = 'visible'; arguments[0].style.height = '1px'; arguments[0].style.width = '1px';  arguments[0].style.opacity = 1", fileElem.getWebElement());

        fileElem.sendKeys(absolutePath);

        // take a breath
        browser.driver.sleep(100);

        // click upload button
        element(by.css('button[data-ng-click="uploadFile(file)"]')).click(); // does post request
*/
    }

    public registerFileByServerPath(path: string) {
        return this.serverPathButton.click()
            .then(() => this.serverPathInput.sendKeys(path))
            .then(() => browser.waitForAngular())
            .then(() => this.next.click())
            .then(() => browser.waitForAngular());
    }

}
