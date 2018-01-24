const fs = require('fs');
const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const JUnitXmlReporter = require('jasmine-reporters').JUnitXmlReporter;

const baseUrl = 'http://localhost:8180/rhamt-web/';

var params = {
    login: {
        username: 'rhamt',
        password: 'password'
    },
    baseUrl: baseUrl,
        upload: {
        filePath: '/this/needs/to/be/overriden/by/cli/param'
    },
    captureImages: false,
    visualRegression: false
};

const paramsFile = './protractor-params.js';

if (fs.existsSync(paramsFile)) {
    console.error('Load params from file: "' + paramsFile + '"');
    const fileParams = require(paramsFile).params;
    params = Object.assign({}, params, fileParams);
}

function login(timeout, maxAttempts, attempts) {
    return browser.driver.get(browser.params.baseUrl).then(function() {
        return browser.driver.getCurrentUrl();
    }).then(function(url) {
        const pathRegex = /auth/;
        const username = browser.params.login.username;
        const password = browser.params.login.password;

        if (pathRegex.test(url)) {
            console.error('Need to log in');

            browser.driver.findElement(by.id('username')).sendKeys(username);
            browser.driver.findElement(by.id('password')).sendKeys(password);
            browser.driver.findElement(by.id('kc-login')).click();

            // Login takes some time, so wait until it's done.
            // For the test app's login, we know it's done when it redirects to
            // index.html.
            return browser.driver.wait(function() {
                return browser.driver.getCurrentUrl().then(function(url) {
                    return !pathRegex.test(url);
                });
            }, 10000);
        } else {
            console.error('Unexpected url: ', url);

            if (maxAttempts && attempts < maxAttempts) {
                console.error('Retry login attempt: ', attempts);
                return browser.driver.sleep(timeout).then(function() {
                    return login(timeout, maxAttempts, attempts + 1);
                });
            } else {
                console.error('Unable to log in in defined interval');
                process.exit(-1);
                return false;
            }
        }
    });
}

exports.reporters = [
    new SpecReporter({displayStacktrace: 'all'}),
    new JUnitXmlReporter({
        consolidateAll: true,
        savePath: '.',
        filePrefix: 'test-results.xml'
    })
];

exports.config = {
    /**
     *  TODO: baseUrl doesn't seem to work as expected
     *  (I'd expect browser.get('/') to match baseUrl, but it goes to http://localhost:8080 instead)
     */
    baseUrl: baseUrl,
    specs: [
        'e2e/**/*.e2e.ts'
    ],

    allScriptsTimeout: 110000,
    getPageTimeout: 100000,

    framework: 'jasmine2',
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000,
        print: function() {}
    },
    directConnect: true,

    capabilities: {
        'browserName': 'chrome',
        'chromeOptions': {
            'args': ['show-fps-counter=true', '--headless', '--disable-gpu', '--no-sandbox']
        }
    },

    onPrepare: function() {
        require('ts-node').register({
            project: 'config/tsconfig.e2e.json'
        });

        browser.ignoreSynchronization = false;

        // add jasmine spec reporter
        exports.reporters.forEach(function(reporter) {
            jasmine.getEnv().addReporter(reporter);
        });

        return login(1000, 10, 0);
    },

//    seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     *
     */
    useAllAngular2AppRoots: true,

    params: params
};
