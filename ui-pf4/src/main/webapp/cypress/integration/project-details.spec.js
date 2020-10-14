/// <reference types="cypress" />

context("Project details", () => {
  // beforeEach(() => {
  //   cy.request("PUT", "/mta-web/api/migrationProjects/create", {
  //     title: "projectopenubl",
  //     description: "",
  //   })
  //     .should((response) => expect(response.status).to.eq(200))
  //     .then((projects) => {
  //       console.log("acaa", projects);
  //       console.log("nada", keycloak);
  //       // cy.request("POST", "https://jsonplaceholder.cypress.io/posts", {
  //       //   userId: projects.id,
  //       //   title: "Cypress Test Runner",
  //       //   body:
  //       //     "Fast, easy and reliable testing for anything that runs in a browser.",
  //       // });
  //     });
  // });

  it("Action buttons are disabled the first time", () => {
    cy.visit("/#/projects/~new");

    cy.contains("Project details");

    // Verify buttons
    cy.get("button.pf-c-button.pf-m-primary").should("be.disabled");
    cy.get("button.pf-c-button.pf-m-link").should("not.be.disabled");

    // Verify correct helper text
    cy.get(".pf-c-form__helper-text").contains("A unique name for the project");

    // Verify on change
    cy.get("input[name=name]").type(`project${new Date().getTime()}`);

    cy.get("button.pf-c-button.pf-m-primary").should("not.be.disabled");
    cy.get("button.pf-c-button.pf-m-link").should("not.be.disabled");
  });

  // it("Action buttons are enable when edit project", () => {
  //   // https://on.cypress.io/_
  //   cy.request("https://jsonplaceholder.cypress.io/users").then((response) => {
  //     let ids = Cypress._.chain(response.body).map("id").take(3).value();

  //     expect(ids).to.deep.eq([1, 2, 3]);
  //   });
  // });
});
