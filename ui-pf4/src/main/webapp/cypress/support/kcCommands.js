Cypress.Commands.add("kcToken", () => {
  Cypress.log({ name: "Keycloak token" });

  const kcServer = Cypress.env("KEYCLOAK_URL");
  const kcUrl = `${kcServer}/realms/${Cypress.env("KEYCLOAK_REALM")}/protocol/openid-connect/token`;

  const kcHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  cy.request({
    method: "POST",
    headers: kcHeaders,
    body: {
      client_id: Cypress.env("KEYCLOAK_CLIENT_ID"),
      client_secret: Cypress.env("KEYCLOAK_CLIENT_SECRET"),
      username: Cypress.env("KEYCLOAK_USERNAME"),
      password: Cypress.env("KEYCLOAK_PASSWORD"),
      grant_type: "password",
      scope: "openid info offline_access",
    },
    url: kcUrl,
  })
    .then((response) => {
      return cy.request({
        method: "POST",
        headers: kcHeaders,
        body: {
          client_id: Cypress.env("KEYCLOAK_CLIENT_ID"),
          client_secret: Cypress.env("KEYCLOAK_CLIENT_SECRET"),
          grant_type: "refresh_token",
          refresh_token: response.body.refresh_token,
        },
        url: kcUrl,
      });
    })
    .its("body");
});
