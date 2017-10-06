import * as fs from "fs";
import * as path from "path";
import * as looksSame from 'looks-same';
import {browser} from "protractor";
import * as rimraf from "rimraf";

const SCREENSHOT_BASE_DIR = 'screenshots';
const REFERENCE_SCREENSHOT_PATH = path.join(SCREENSHOT_BASE_DIR, 'reference');
const CURRENT_SCREENSHOT_PATH = path.join(SCREENSHOT_BASE_DIR, 'current');
const DIFF_SCREENSHOT_PATH = path.join(SCREENSHOT_BASE_DIR, 'diff');

export function waitForPageToLoad(): Promise<any> {
    return browser.waitForAngular()
        .then(() => browser.driver.sleep(1000));
}

function makeDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        const parent = path.dirname(dirPath);

        makeDirIfNotExists(parent);

        fs.mkdirSync(dirPath);
    }
}

function clearDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        const subDirs = fs.readdirSync(dirPath)
            .map(fileName => path.join(dirPath, fileName))
            .filter(filePath => fs.lstatSync(filePath).isDirectory());

        subDirs.forEach(currentPath => {
            rimraf.sync(currentPath);
        });
    }
}

export function clearDiffScreenshotsDirectory() {
    clearDirectory(DIFF_SCREENSHOT_PATH);
}

export function clearReferenceScreenshotsDirectory() {
    clearDirectory(REFERENCE_SCREENSHOT_PATH);
}

export function clearCurrentScreenshotsDirectory() {
    clearDirectory(CURRENT_SCREENSHOT_PATH);
}

export function clearScreenshots() {
    clearDiffScreenshotsDirectory();
    clearCurrentScreenshotsDirectory();

    if (browser.params.captureImages) {
        clearReferenceScreenshotsDirectory();
    }
}

export function writeScreenshot(data: any, fileName: string) {
    if (browser.params.captureImages) {
        console.error('Taking new reference screenshots');
        doWriteScreenshot(data, path.join(REFERENCE_SCREENSHOT_PATH, fileName));
    }

    doWriteScreenshot(data, path.join(CURRENT_SCREENSHOT_PATH, fileName));
}

function doWriteScreenshot(data: any, filePath: string) {
    const dirPath = path.dirname(filePath);

    makeDirIfNotExists(dirPath);

    fs.writeFileSync(filePath, new Buffer(data, 'base64'));
}


export interface Resolution {
    w: number;
    h: number;
}

export const supportedResolutions: Resolution[] = [
    { w: 1920, h: 1080 }, // FullHD
//    { w: 800, h: 600 },
//    { w: 320, h: 480 }, // iPhone portrait
    { w: 1024, h: 768 } // iPad landscape
];


export function takeScreenshotInAllResolutions(fileName: string) {
    const promises = supportedResolutions.map(resolution => {
        return browser.manage().window().setSize(resolution.w, resolution.h)
            .then(() => browser.waitForAngular())
            .then(() => browser.takeScreenshot())
            .then(screenshot => writeScreenshot(
                screenshot,
                `${resolution.w}x${resolution.h}/${fileName}.png`,
            ));
    });

    return Promise.all(promises);
}

export function validateScreenshot(fileName: string) {
    const reference = path.join(REFERENCE_SCREENSHOT_PATH, fileName);
    const actual = path.join(CURRENT_SCREENSHOT_PATH, fileName);
    const diff = path.join(DIFF_SCREENSHOT_PATH, fileName);

    return new Promise((resolve, reject) => {
        looksSame(reference, actual, (error, equal) => {
//            console.log('Screenshots: ', 'Equal: ', equal, 'Error: ', error);

            if (!equal) {
                makeDirIfNotExists(path.dirname(diff));

                looksSame.createDiff({
                    reference,
                    current: actual,
                    diff,
                    highlightColor: '#ff00ff', //color to highlight the differences
                    strict: false,
                    tolerance: 25
                }, (error) => {
                    reject(error);
                });

                fail('Screenshots are not same');

            }

            resolve(equal);
        });
    });
}

export function validateScreenshotInAllResolutions(fileName: string) {
    const promises = supportedResolutions.map(resolution =>
        validateScreenshot(`${resolution.w}x${resolution.h}/${fileName}.png`)
    );

    return Promise.all(promises).then(result => result.reduce((prev, current) => prev && current, true));
}


export function assertScreenshotIsCorrectInAllResolutions(fileName: string, done: () => any) {
    return takeScreenshotInAllResolutions(fileName).then(() => validateScreenshotInAllResolutions(fileName))
        .then(() => done());
}
