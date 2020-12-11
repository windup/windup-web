/// <reference types="cypress" />
import axios from "axios";

context("Analysis results", () => {
  let PROJECT_ID;

  before(() => {
    cy.kcToken().as("kcToken");

    // Delete all projects
    cy.get("@kcToken").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access_token,
      };

      cy.request({
        method: "GET",
        headers: headers,
        url: `${Cypress.env("MTA_API")}/migrationProjects/list`,
      }).then((result) => {
        result.body.forEach((e) => {
          cy.request({
            method: "DELETE",
            headers: headers,
            body: JSON.stringify(e.migrationProject),
            url: `${Cypress.env("MTA_API")}/migrationProjects/delete`,
          });
        });
      });
    });

    // Create project to test
    cy.get("@kcToken").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access_token,
      };

      cy.request({
        method: "PUT",
        headers: headers,
        body: {
          title: `myProject`,
        },
        url: `${Cypress.env("MTA_API")}/migrationProjects/create`,
      }).then(({ body: project }) => {
        PROJECT_ID = project.id;

        // Upload application to analyze
        cy.fixture("dwr.zip", "binary")
          .then((binary) => Cypress.Blob.binaryStringToBlob(binary))
          .then((blob) => {
            const formData = new FormData();
            formData.append("file", new File([blob], "dwr.zip"));

            const uploadUrl = `${Cypress.env("MTA_API")}/migrationProjects/${
              project.id
            }/registeredApplications/upload`;

            cy.wrap(
              axios(uploadUrl, {
                method: "post",
                url: uploadUrl,
                data: formData,
                headers: {
                  ...headers,
                  "Content-Type": "multipart/form-data",
                },
              })
            ).then(() => {
              // Get analysisContext
              cy.request({
                method: "GET",
                headers: headers,
                url: `${Cypress.env("MTA_API")}/analysis-context/${
                  project.defaultAnalysisContextId
                }`,
              }).then(({ body: analysisContext }) => {
                // Update analysisContext
                cy.request({
                  method: "PUT",
                  headers: headers,
                  body: {
                    ...analysisContext,
                    advancedOptions: [{ name: "target", value: "eap7" }],
                  },
                  url: `${Cypress.env(
                    "MTA_API"
                  )}/analysis-context/migrationProjects/${
                    project.id
                  }?skipChangeToProvisional=false`,
                });
              });
            });
          });
      });
    });
  });

  it("Filtering", () => {
    cy.visit(`/projects-details/${PROJECT_ID}/analysis-results/executions`);

    cy.get(".pf-c-empty-state", { timeout: 10000 }).contains(
      "There are no analysis results for this project"
    );

    // Run analysis
    cy.get(".pf-m-primary").contains("Run analysis").first().click();
    cy.get("tbody > tr").should("have.length", 1);
    ("");
    // Check 'Active analysis'
    cy.get("h1").contains("Active analysis", { timeout: 10_000 });
    cy.get("tbody > tr").contains("Pending");
    cy.get(".pf-c-progress", { timeout: 60_000 });
    cy.get("tbody > tr").contains("Running");

    cy.get("a[title='Reports']", { timeout: 90_000 });
    cy.get("tbody > tr").contains("Completed");

    // Check details
    cy.get("tbody > tr > td > a").first().click();
    cy.url().should("contains", "/overview");

    cy.get(".pf-c-description-list__text", { timeout: 5000 }).contains(
      "Target"
    );
    cy.get(".pf-c-description-list__text").contains("eap7");

    cy.get(".pf-c-description-list__text").contains("Source");
    cy.get(".pf-c-description-list__text").contains("Not defined");

    cy.get(".pf-c-tabs__item").contains("Logs").click();
    cy.get(".log-line-text", { timeout: 50_000 }).should(
      "have.length.greaterThan",
      10
    );

    // Go back to table and test actions
    cy.get(".pf-c-breadcrumb__link").contains("Executions").click();
    cy.get("td .pf-c-button.pf-m-link", { timeout: 10_000 }).eq(1).click();

    cy.get(".pf-c-modal-box").should("have.length", 1);
    cy.get(".pf-m-danger").contains("Delete").should("not.be.disabled");
    cy.get(".pf-m-link").contains("Cancel").should("not.be.disabled");
    cy.get(".pf-m-danger").contains("Delete").click();

    cy.get(".pf-c-empty-state", { timeout: 10000 }).contains(
      "There are no analysis results for this project"
    );
  });
});
