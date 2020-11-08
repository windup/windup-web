/// <reference types="cypress" />

context("New Project", () => {
  const verifyActionButtonsDisabled = () => {
    cy.get("button.pf-c-button.pf-m-primary").should("be.disabled");
    cy.get("button.pf-c-button.pf-m-link").should("not.be.disabled");
  };

  const verifyActionButtonsEnabled = () => {
    cy.get("button.pf-c-button.pf-m-primary").should("not.be.disabled");
    cy.get("button.pf-c-button.pf-m-link").should("not.be.disabled");
  };

  it("Action buttons disabled when form is invalid", () => {
    cy.visit("/#/projects/~new");

    /**
     * Step 1: Project details
     */
    cy.get(".pf-c-title").contains("Project details");
    cy.get(".pf-c-form__helper-text").contains("A unique name for the project");

    verifyActionButtonsDisabled();

    cy.get("input[name=name]").type(`project${new Date().getTime()}`);
    verifyActionButtonsEnabled();

    cy.get(".pf-c-button.pf-m-primary").contains("Next").click();

    /**
     * Step 2: Applications
     */
    cy.contains("Add applications");

    const dropzoneSelector = ".upload-files-section__component__dropzone";
    const applicationName1 = "dwr.zip";
    const applicationName2 = "1111-1.0-SNAPSHOT.zip";

    verifyActionButtonsDisabled();

    cy.get(".pf-c-tabs__item").eq(0).contains("Upload");
    cy.get(".pf-c-tabs__item").eq(1).contains("Directory path");

    cy.get(".pf-c-tabs__item").eq(1).click();
    verifyActionButtonsDisabled();
    cy.get(".pf-c-tabs__item").eq(0).click();
    verifyActionButtonsDisabled();

    cy.get(dropzoneSelector).attachFile(applicationName1, {
      subjectType: "drag-n-drop",
    });
    verifyActionButtonsEnabled();

    cy.get("button.pf-c-button[aria-label=delete-application]").click();
    verifyActionButtonsDisabled();

    cy.get(dropzoneSelector).attachFile(applicationName2, {
      subjectType: "drag-n-drop",
    });
    verifyActionButtonsEnabled();

    cy.get(".pf-c-button.pf-m-primary").contains("Next").click();

    /**
     * Step 3: Transformation path
     */
    cy.contains("Select transformation path");
    verifyActionButtonsEnabled();

    cy.get(".pf-c-card.pf-m-selectable").first().click({ force: true });
    verifyActionButtonsDisabled();

    cy.get(".pf-c-card.pf-m-selectable").last().click();
    verifyActionButtonsEnabled();

    cy.contains("Next").click();

    /**
     * Step 4: Select packages
     */
    cy.get(".pf-c-empty-state[aria-label=package-loading-empty-state]", {
      timeout: 10000,
    }).contains("Discovering and fetching packages");
    verifyActionButtonsEnabled();

    cy.get(".ant-transfer.ant-transfer-customize-list", {
      timeout: 300000,
    });
    verifyActionButtonsDisabled();

    cy.get(".ant-tree-treenode", { timeout: 10000 }).contains("javax").click();
    cy.get(".ant-transfer-operation .ant-btn").first().click();
    verifyActionButtonsEnabled();

    cy.contains("Next").click();

    /**
     * Step 5: Custom rules
     */
    cy.contains("Custom rules");
    cy.contains("Upload the rules you want to include in the analysis");

    verifyActionButtonsEnabled();
    cy.contains("Next").click();

    /**
     * Step 6: Custom labels
     */
    cy.contains("Custom labels");
    cy.contains("Upload the labels you want to include in the analysis");

    verifyActionButtonsEnabled();
    cy.contains("Next").click();

    /**
     * Step 6: Advanced options
     */
    cy.get(".pf-c-form", { timeout: 10000 });
    cy.contains("Advanced options");
    cy.contains("Specify additional options here.");

    verifyActionButtonsEnabled();
    cy.contains("Next").click();

    /**
     * Step 7: Review
     */
    cy.get(".pf-c-description-list", { timeout: 10000 });
    cy.contains("Review project details");
    cy.contains(
      "Review the information below, then save your project or save your project and run the analysis."
    );

    verifyActionButtonsEnabled();
    cy.contains("Save").click();
  });
});
