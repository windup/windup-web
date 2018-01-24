#!/usr/bin/env node

const xpath = require('xpath');
const DOMParser = require('xmldom').DOMParser;
const fs = require('fs');
const path = require("path");

function makeDirIfNotExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        const parent = path.dirname(dirPath);

        makeDirIfNotExists(parent);

        fs.mkdirSync(dirPath);
    }
}

function parseXml(testResultsFile) {
    if (!fs.existsSync(testResultsFile)) {
        throw new Error('Test results file ' + testResultsFile + ' does not exist');
    }

    const testResultsXML = fs.readFileSync(testResultsFile, 'utf8');

    const document = new DOMParser().parseFromString(testResultsXML, 'text/xml');

    const countErrors = xpath.evaluate('count(//testcase/error)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;
    const countFailures = xpath.evaluate('count(//testcase/failure)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;
    const countSkipped = xpath.evaluate('count(//testcase/skipped)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;
    const countTestCases = xpath.evaluate('count(//testcase)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;

    return {
        countErrors: countErrors,
        countFailures: countFailures,
        countSkipped: countSkipped,
        countTestCases: countTestCases
    };
}

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

if (process.argv.length < 4) {
    console.error('Expecting <test-results.xml path> and <failsafe-report.xml path> arguments');
    process.exit(1);
}

console.error('Count of arguments: ', process.argv.length);

const failsafeResultsFile = process.argv[2];
const testResultsFile = process.argv[3];

const testResultsFiles = process.argv.slice(4);

/**
 * First file is required, if it doesn't exist, throw exception
 */
const firstFileResults = parseXml(testResultsFile);

/**
 * There can be arbitrary number of files
 *
 * If there is some file missing, do not fail
 */
const testResults = testResultsFiles.map(function(testResultsFile) {
    var result = {
        countErrors: 0,
        countFailures: 0,
        countSkipped: 0,
        countTestCases: 0
    };

    try {
        result = parseXml(testResultsFile);
    } catch (exception) {
        console.error(exception.message);
    }

    return result;

}).reduce(function(prev, current) {
    return {
        countErrors: prev.countErrors + current.countErrors,
        countFailures: prev.countFailures + current.countFailures,
        countSkipped: prev.countSkipped + current.countSkipped,
        countTestCases: prev.countTestCases + current.countTestCases
    };
}, firstFileResults);

const failsafeSummary = "<failsafe-summary>\n\
    <completed>" + testResults.countTestCases + "</completed>\n\
    <errors>" + testResults.countErrors + "</errors>\n\
    <failures>" + testResults.countFailures + "</failures>\n\
    <skipped>" + testResults.countSkipped + "</skipped>\n\
</failsafe-summary>\n";

makeDirIfNotExists(path.dirname(failsafeResultsFile));

fs.writeFileSync(failsafeResultsFile, failsafeSummary);
