const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const JUnitXmlReporter = require('jasmine-reporters').JUnitXmlReporter;

exports.config = require('./protractor.conf').config;
exports.config.specs = [
    'e2e/**/*.vr.ts'
];
exports.config.addReporters = function() {
    jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
    jasmine.getEnv().addReporter(new JUnitXmlReporter({
        consolidateAll: true,
        savePath: '.',
        filePrefix: 'test-results-visual-regression.xml'
    }));
};
