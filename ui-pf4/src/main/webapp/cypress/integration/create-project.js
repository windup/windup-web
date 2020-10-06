import "cypress-file-upload";

describe("Create project", () => {
  // beforeEach(() => {
  //   cy.request("GET", "/api/migrationProjects/list")
  //     .should((response) => expect(response.status).to.eq(200))
  //     .then((projects) => {
  //       // cy.request("POST", "https://jsonplaceholder.cypress.io/posts", {
  //       //   userId: projects.id,
  //       //   title: "Cypress Test Runner",
  //       //   body:
  //       //     "Fast, easy and reliable testing for anything that runs in a browser.",
  //       // });
  //     });
  // });

  it("Does not do much!", () => {
    cy.visit("/");

    cy.contains(
      new RegExp(`${["New project", "Create new"].join("|")}`, "g")
    ).click();

    //
    cy.contains("Project details");
    cy.get("input[name=name]").type(`project${new Date().getTime()}`);
    cy.get("textarea[name=description]").type("This is a Cypress test");
    cy.contains("Next").click();

    //
    const dropzoneSelector = ".upload-files-section__component__dropzone";

    cy.contains("Add applications");
    cy.get(dropzoneSelector).attachFile("1111-1.0-SNAPSHOT.zip", {
      subjectType: "drag-n-drop",
    });
    cy.contains("Next").click();

    //
    cy.contains("Select transformation path");

    cy.get(".pf-c-select").contains("eap7").click();
    cy.get(".pf-c-select__menu-item").contains("eap6").click();

    cy.get(".select-card__component__wrapper").contains("Linux").click();
    cy.get(".select-card__component__wrapper").contains("Quarkus").click();

    cy.contains("Next").click();

    //
    cy.contains("Select packages");
    cy.get(".ant-tree-treenode", { timeout: 10000 }).contains("javax").click();
    cy.get(".ant-transfer-operation .ant-btn").first().click();
    cy.contains("Next").click();

    //
    cy.contains("Custom rules");
    cy.contains("Add rule").click();
  });
});
