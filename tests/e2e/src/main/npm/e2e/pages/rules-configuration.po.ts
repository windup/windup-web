import {browser} from "protractor";
import {PageObject} from "./page-object";

export class RulesConfigurationPage implements PageObject {
    public navigateTo() {
        return browser.get('./configuration');
    }
}
