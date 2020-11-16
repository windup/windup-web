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
                  body: { ...analysisContext },
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

    cy.get(".pf-c-empty-state").contains(
      "There are no analysis results for this project"
    );
  });
});
