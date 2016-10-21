var webpackConfig = require('./config/webpack.test');

module.exports = function (config) {
    var _config = {
        basePath: '',

        plugins: [
            require('karma-jasmine'),
            require('karma-phantomjs-launcher'),
            require('karma-chrome-launcher'),
            require('karma-coverage'),
            require('karma-junit-reporter'),
            require('karma-webpack'),
            require('karma-sourcemap-loader')
        ],

        frameworks: ['jasmine'],

        files: [
            {pattern: './webpack_config/karma-test-shim.js', watched: false}
        ],

        preprocessors: {
            './webpack_config/karma-test-shim.js': ['webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    };

    config.set(_config);
};
