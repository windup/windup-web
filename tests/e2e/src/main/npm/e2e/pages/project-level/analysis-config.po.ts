import {$, $$, browser, by, element, ElementFinder} from "protractor";

export class AnalysisConfigurationPage {
    protected transformationPaths = $$('.radio-inline.control-label input');

    targets = {
        EAP7: this.transformationPaths.first(),
        EAP6: this.transformationPaths.get(1),
        CloudReadiness: this.transformationPaths.get(2)
    };

    enableCloudReadinessInput = $('[name="cloudTargetsIncluded"]');

    selectedApplications = $$('.search-choice');

    packages = $$('wu-js-tree-wrapper');

    includedPackages = this.packages.first().$$('.jstree-node');

    excludedPackages = this.packages.get(1).$$('.jstree-node');

    saveAndRunButton = $('.btn-save-run');

    public navigateTo(projectId: number) {
        return browser.get(`projects/${projectId}/analysis-context`);
    }

    public saveAndRun() {
        return this.saveAndRunButton.click();
    }
}
