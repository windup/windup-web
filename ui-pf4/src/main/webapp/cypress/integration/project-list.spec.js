/// <reference types="cypress" />

context("Project list", () => {
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

    // Create projects to test
    cy.get("@kcToken").then((tokens) => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access_token,
      };

      for (let i = 1; i <= 12; i++) {
        cy.request({
          method: "PUT",
          headers: headers,
          body: {
            title: `Project${i}`,
          },
          url: `${Cypress.env("MTA_API")}/migrationProjects/create`,
        }).then(({ body: project }) => {
          cy.request({
            method: "GET",
            headers: headers,
            url: `${Cypress.env("MTA_API")}/analysis-context/${
              project.defaultAnalysisContextId
            }`,
          }).then(({ body: analysisContext }) => {
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
      }
    });
  });

  it("Project list - filtering", () => {
    cy.visit("/projects");
    cy.get("tbody > tr").should("have.length", 10);

    cy.get("input[name='filterText']").type("project12");
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("a").contains("Project12");

    cy.get("input[name='filterText']").clear().type("PROJECT5");
    cy.get("tbody > tr").should("have.length", 1);
    cy.get("a").contains("Project5");
  });

  it("Project list - pagination", () => {
    cy.visit("/projects");
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("a").contains("Project1");
    cy.get("a").contains("Project10");

    cy.get("button[data-action='next']").first().click();
    cy.get("tbody > tr").should("have.length", 2);
    cy.get("a").contains("Project11");
    cy.get("a").contains("Project12");

    cy.get("button[data-action='previous']").first().click();
    cy.get("tbody > tr").should("have.length", 10);
    cy.get("a").contains("Project1");
    cy.get("a").contains("Project10");
  });

  it("Project list - edit", () => {
    cy.visit("/projects");

    // Open edit modal
    cy.get(".pf-c-table__action", { timeout: 5000 }).first().click();
    cy.get(".pf-c-dropdown__menu-item").contains("Edit").click();

    cy.get(".pf-c-modal-box").should("have.length", 1);
    cy.get(".pf-m-primary").contains("Save").should("be.disabled");
    cy.get(".pf-m-link").contains("Cancel").should("not.be.disabled");

    // Edit data and save
    cy.get("input[name='name']").type("_changed");
    cy.get("textarea[name='description']").type("my changed description");

    cy.get(".pf-m-primary").contains("Save").click();
    cy.get(".pf-c-modal-box", { timeout: 5000 }).should("have.length", 0);

    // Verify project has changed
    cy.contains("Project1_changed", { timeout: 10000 });
    cy.contains("my changed description", { timeout: 10000 });
  });
});
