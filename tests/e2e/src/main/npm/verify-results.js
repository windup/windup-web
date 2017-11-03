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

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

if (process.argv.length < 4) {
    console.error('Expecting <test-results.xml path> and <failsafe-report.xml path> arguments');
    process.exit(1);
}

console.error('Count of arguments: ', process.argv.length);

const testResultsFile = process.argv[2];
const failsafeResultsFile = process.argv[3];

if (!fs.existsSync(testResultsFile)) {
    console.error('Test results file does not exist');
    process.exit(1);
}

const testResultsXLM = fs.readFileSync(testResultsFile, 'utf8');

const document = new DOMParser().parseFromString(testResultsXLM, 'text/xml');

const countErrors = xpath.evaluate('count(//testcase/error)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;
const countFailures = xpath.evaluate('count(//testcase/failure)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;
const countSkipped = xpath.evaluate('count(//testcase/skipped)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;
const countTestCases = xpath.evaluate('count(//testcase)', document, null, xpath.XPathResult.NUMBER_TYPE, null).numberValue;

const failsafeSummary = "<failsafe-summary>\n\
    <completed>" + countTestCases + "</completed>\n\
    <errors>" + countErrors + "</errors>\n\
    <failures>" + countFailures + "</failures>\n\
    <skipped>" + countSkipped + "</skipped>\n\
</failsafe-summary>\n";

makeDirIfNotExists(failsafeResultsFile);

fs.writeFileSync(failsafeResultsFile, failsafeSummary);

