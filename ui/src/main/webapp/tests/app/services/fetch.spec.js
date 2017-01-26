"use strict";
var rxjs_1 = require("rxjs");
var dependencies_report_component_1 = require("../../../src/app/components/reports/dependencies/dependencies-report.component");
describe("fetch function", function () {
    beforeEach(function () {
    });
    it('Should fetch properly.', function () {
        var HI = "Hi";
        var obs = rxjs_1.Observable.of(HI);
        var result;
        dependencies_report_component_1.fetch(obs, function (res) { result = res; });
        expect(result).toEqual(HI);
        dependencies_report_component_1.fetch(obs, function (res, obs2) { result = obs2.result; });
        expect(result).toEqual(HI);
    });
});
