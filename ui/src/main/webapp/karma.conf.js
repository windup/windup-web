module.exports = function(config) {
    var appBase    = 'app/';          // transpiled app JS and map files
    var appSrcBase = 'app/';          // app source TS files
    var appAssets  = '/base/app/';    // component assets fetched by Angular's compiler

    var testBase    = 'tests/';       // transpiled test JS and map files
    var testSrcBase = 'tests/';       // test source TS files

    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        files: [
            // System.js for module loading
            'node_modules/systemjs/dist/system.src.js',

            // Polyfills
            'node_modules/core-js/client/shim.js',
            'node_modules/reflect-metadata/Reflect.js',

            // zone.js
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            // RxJs
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

            // Paths loaded via module imports:
            // Angular itself
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: false},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false},

            {pattern: 'node_modules/**/*.js', included: false, watched: false},

            {pattern: 'karma-systemjs.config.js', included: false, watched: false},
            'karma-test-shim.js',

            // transpiled application & spec code paths loaded via module imports
            {pattern: appBase + '**/*.js', included: false, watched: true},
            {pattern: testBase + '**/*.js', included: false, watched: true},


            // Asset (HTML & CSS) paths loaded via Angular's component compiler
            // (these paths need to be rewritten, see proxies section)
            {pattern: appBase + '**/*.html', included: false, watched: true},
            {pattern: appBase + '**/*.css', included: false, watched: true},

            // Paths for debugging with source maps in dev tools
            {pattern: appSrcBase + '**/*.ts', included: false, watched: false},
            {pattern: appBase + '**/*.js.map', included: false, watched: false},
            {pattern: testSrcBase + '**/*.ts', included: false, watched: false},
            {pattern: testBase + '**/*.js.map', included: false, watched: false}
        ],

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            '/app/': appAssets
        },

        port: 9876,
        logLevel: config.LOG_INFO,
        colors: true,
        autoWatch: true,
        browsers: ['PhantomJS'],

        // Karma plugins loaded
        plugins: [
            require('karma-jasmine'),
            require('karma-phantomjs-launcher'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-junit-reporter')
        ],

        // Coverage reporter generates the coverage
        reporters: ['progress', 'dots', 'junit', 'coverage'],

        // Source files that you wanna generate coverage for.
        // Do not include tests or libraries (these files will be instrumented by Istanbul)
        preprocessors: {
            'dist/**/!(*spec).js': ['coverage']
        },

        coverageReporter: {
            reporters:[
                {type: 'html', subdir: '.', file: 'coverage-final.html'}
            ]
        },

        singleRun: false
    })
};
