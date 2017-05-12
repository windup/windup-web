const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const JUnitXmlReporter = require('jasmine-reporters').JUnitXmlReporter;

const baseUrl = 'http://localhost:8180/rhamt-web/';

function login() {
    // TODO: Load URL from some ENV variable or somewhere....
    browser.driver.get(baseUrl).then(function() {
        return browser.driver.getCurrentUrl();
    }).then(function(url) {
        // TODO: parametrize these
        const pathRegex = /auth/;
        const username = 'rhamt';
        const password = 'password';

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
        }
    });
}


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
            'args': ['show-fps-counter=true']
        }
    },

    onPrepare: function() {
        require('ts-node').register({
            project: 'config/tsconfig.e2e.json'
        });

        browser.ignoreSynchronization = false;

        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
        jasmine.getEnv().addReporter(new JUnitXmlReporter({
            consolidateAll: true,
            savePath: '.',
            filePrefix: 'test-results.xml'
        }));

        return login();
    },

//    seleniumServerJar: "node_modules/protractor/selenium/selenium-server-standalone-2.52.0.jar",

    /**
     * Angular 2 configuration
     *
     * useAllAngular2AppRoots: tells Protractor to wait for any angular2 apps on the page instead of just the one matching
     * `rootEl`
     *
     */
    useAllAngular2AppRoots: true
};
