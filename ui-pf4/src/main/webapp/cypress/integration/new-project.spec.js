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
    const applicationName = "1111-1.0-SNAPSHOT.zip";

    verifyActionButtonsDisabled();

    cy.get(".pf-c-tabs__item").eq(0).contains("Upload");
    cy.get(".pf-c-tabs__item").eq(1).contains("Directory path");

    cy.get(".pf-c-tabs__item").eq(1).click();
    verifyActionButtonsDisabled();
    cy.get(".pf-c-tabs__item").eq(0).click();
    verifyActionButtonsDisabled();

    cy.get(dropzoneSelector).attachFile(applicationName, {
      subjectType: "drag-n-drop",
    });
    verifyActionButtonsEnabled();

    cy.get("button.pf-c-button[aria-label=delete-application]").click();
    verifyActionButtonsDisabled();

    cy.get(dropzoneSelector).attachFile(applicationName, {
      subjectType: "drag-n-drop",
    });
    verifyActionButtonsEnabled();

    cy.get(".pf-c-button.pf-m-primary").contains("Next").click();

    /**
     * Step 3: Transformation path
     */
    //
    // cy.contains("Select transformation path");
    // verifyActionButtonsEnabled();

    // cy.get(".pf-c-card.pf-m-selectable > .pf-c-card__body > .pf-c-empty-state").first().click();
    // verifyActionButtonsDisabled();

    // cy.get(".pf-c-card.pf-m-selectable > .pf-c-card__body ").last().click();
    // verifyActionButtonsEnabled();

    // cy.contains("Next").click();
  });
});
