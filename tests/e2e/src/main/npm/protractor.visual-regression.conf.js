const SpecReporter = require('jasmine-spec-reporter').SpecReporter;
const JUnitXmlReporter = require('jasmine-reporters').JUnitXmlReporter;

exports.reporters = [
    new SpecReporter({displayStacktrace: 'all'}),
    new JUnitXmlReporter({
        consolidateAll: true,
        savePath: '.',
        filePrefix: 'test-results-visual-regression.xml'
    })
];

exports.config = require('./protractor.conf').config;
exports.config.specs = [
    'e2e/**/*.vr.ts'
];

exports.config.params.visualRegression = true;
