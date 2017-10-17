import {browser} from "protractor";

export function waitUntilCondition(timeout: number, condition: () => boolean|Promise<boolean>, maxTimeout?: number, currentTimeout: number = 0): Promise<any> {
    let isLoopingTimeouts = true;

    browser.waitForAngularEnabled(false);

    const innerWaitUntilCondition = (timeout: number, maxTimeout?: number, currentTimeout: number = 0): Promise<any> => {
        console.error('waitUntilCondition looping: ' + `timeout: ${timeout}, maxTimeout: ${maxTimeout}, current: ${currentTimeout}`);

        if (maxTimeout != 0 && currentTimeout >= maxTimeout) {
            console.error('Max wait time exceeded, exiting');

            return new Promise((resolve, reject) => {
                reject('Max wait time exceeded');
            });
        }

        return browser.driver.sleep(timeout).then(() => condition() as any).then(isConditionAccomplished => {
            if (isConditionAccomplished) {
                isLoopingTimeouts = false;
            } else {
                return innerWaitUntilCondition(timeout, maxTimeout, currentTimeout + timeout);
            }
        });
    };

    return innerWaitUntilCondition(timeout, maxTimeout);
}
