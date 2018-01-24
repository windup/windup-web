import {browser} from "protractor";
import {PageObject} from "./page-object";

export class AboutPage implements PageObject {
    public navigateTo() {
        return browser.get('./about');
    }
}
