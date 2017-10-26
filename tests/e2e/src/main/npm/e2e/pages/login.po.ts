import {$, browser} from "protractor";

/**
 * TODO: This seems to be required in onPrepare phase, I'm not sure if it can be used from this file
 * (it would be probably better)
 */
export class LoginPage {
    username = $('#username');
    password = $('#password');
    loginButton = $('#kc-login');

    public navigateTo() {
        return browser.get('/rhamt-web/');
    }

    public login(user: string, password: string) {
        this.username.sendKeys(user);
        this.password.sendKeys(password);
        this.loginButton.click();
    }
}
